const Scan = require('../models/scan');
const Vulnerability = require('../models/vulnerability');
const Target = require('../models/target');
const { getScanner } = require('./scanner/scannerFactory');
const QueueService = require('./scheduler/queueService');
const IntegrationsService = require('./integrationsService');
const { triggerWebhooks } = require('./webhookService');

class ScanService {
  constructor() {
    this.scanQueue = new QueueService(this._executeScan.bind(this), 1); // Concurrency of 1
  }

  async queueScan(scanId) {
    // Set scan status to 'queued'
    await Scan.findByIdAndUpdate(scanId, { status: 'queued' });
    // Add to the queue
    return this.scanQueue.add(scanId);
  }
  
  async _executeScan(scanId, maxRetries = 2) {
    let attempt = 0;
    let lastError = null;
    while (attempt <= maxRetries) {
      try {
        // Get scan configuration
        const scan = await Scan.findById(scanId)
          .populate('target')
          .populate('createdBy');
        if (!scan) throw new Error('Scan not found');
        if (scan.status === 'running') throw new Error('Scan is already running');

        // Update scan status
        scan.status = 'running';
        scan.startedAt = new Date();
        await scan.save();

        // Prepare scan config for the scanner
        const scanConfig = {
          scanType: scan.scanType,
          target: scan.target?.address || scan.target, // adjust as needed
          ports: scan.ports,
          plugins: scan.plugins,
          ssl: scan.ssl,
          timeout: scan.timeout,
          wazuhModule: scan.wazuhModule,
          wazuhParams: scan.wazuhParams
        };

        let result = null;
        let vulnerabilities = [];
        if (scan.scanType === 'wazuh') {
          // Wazuh scan
          result = await getScanner(scanConfig).runScan({
            target: scan.target,
            scanType: scan.scanType,
            wazuhModule: scan.wazuhModule,
            wazuhParams: scan.wazuhParams,
          });
          vulnerabilities = result?.vulnerabilities || [];
        } else {
          // Nmap, Nikto, etc. with retry
          const scanner = getScanner(scanConfig);
          await scanner.initialize();
          try {
            vulnerabilities = await scanner.start();
          } catch (err) {
            await this.cleanupScan(scanId, scan, err);
            throw err;
          }
        }

        // Save vulnerabilities (if any)
        if (vulnerabilities && vulnerabilities.length > 0) {
          await this.saveVulnerabilities(vulnerabilities, scan);
        }

        // Update scan status
        scan.status = 'completed';
        scan.completedAt = new Date();
        scan.duration = Math.floor((scan.completedAt - scan.startedAt) / 1000);
        await scan.save();

        // Trigger scan_completed webhooks
        try {
          await triggerWebhooks('scan_completed', { scanId: scan._id, userId: scan.createdBy?._id });
        } catch (err) {
          console.error('Failed to trigger scan_completed webhooks:', err.message);
        }

        // Update target's last scan
        await Target.findByIdAndUpdate(scan.target._id, {
          lastScan: scan.completedAt
        });

        return scan;
      } catch (error) {
        lastError = error;
        attempt++;
        if (attempt > maxRetries) {
          await this.cleanupScan(scanId);
          // Update scan status on error
          await Scan.findByIdAndUpdate(scanId, {
            status: 'failed',
            completedAt: new Date()
          });
          throw error;
        }
      }
    }
    throw lastError;
  }

  async cleanupScan(scanId, scan = null, error = null) {
    // Cleanup logic for interrupted/failed scans
    // Optionally log error, remove partial results, etc.
    if (!scan) {
      scan = await Scan.findById(scanId);
    }
    if (scan) {
      scan.status = 'failed';
      scan.completedAt = new Date();
      await scan.save();
    }
    // Optionally: remove partial vulnerabilities, log error, etc.
    // (Implement as needed)
  }

  // Wazuh jobs are atomic, so stopScan and getScanProgress can be simplified or removed
  async stopScan(scanId) {
    // Not supported in Wazuh API (no-op or custom logic)
    throw new Error('Stop scan is not supported for Wazuh-only scans');
  }

  async getScanProgress(scanId) {
    // Wazuh jobs are atomic; just return status
    const scan = await Scan.findById(scanId);
    return {
      status: scan.status,
      progress: scan.status === 'completed' ? 100 : 0,
      currentStep: scan.status
    };
  }

  async saveVulnerabilities(vulnerabilities, scan) {
    const vulnerabilityDocs = vulnerabilities.map(vuln => ({
      ...vuln,
      scan: scan._id,
      target: scan.target._id,
      createdBy: scan.createdBy._id
    }));
    const savedVulns = await Vulnerability.insertMany(vulnerabilityDocs);

    // Trigger integrations for critical/high findings
    for (const vuln of savedVulns) {
      if (['critical', 'high'].includes(vuln.severity)) {
        // Jira
        try {
          await IntegrationsService.createJiraIssue({
            summary: `[${vuln.severity.toUpperCase()}] ${vuln.name}`,
            description: vuln.description,
            severity: vuln.severity
          });
        } catch (err) {
          console.error('Failed to create Jira issue:', err.message);
        }
        // Slack
        try {
          await IntegrationsService.sendSlackNotification(
            `New ${vuln.severity.toUpperCase()} vulnerability found: ${vuln.name}\n${vuln.description}`
          );
        } catch (err) {
          console.error('Failed to send Slack notification:', err.message);
        }
      }
      // Trigger vulnerability_found webhooks for all new vulns
      try {
        await triggerWebhooks('vulnerability_found', { vulnerabilityId: vuln._id, scanId: scan._id, userId: scan.createdBy?._id });
      } catch (err) {
        console.error('Failed to trigger vulnerability_found webhooks:', err.message);
      }
    }
  }
}

module.exports = new ScanService(); 