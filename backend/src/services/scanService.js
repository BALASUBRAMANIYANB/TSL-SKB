const ScannerFactory = require('./scanner/scannerFactory');
const Scan = require('../models/scan');
const Vulnerability = require('../models/vulnerability');
const Target = require('../models/target');

class ScanService {
  constructor() {
    this.activeScans = new Map();
  }

  async startScan(scanId) {
    try {
      // Get scan configuration
      const scan = await Scan.findById(scanId)
        .populate('target')
        .populate('createdBy');
      
      if (!scan) {
        throw new Error('Scan not found');
      }
      
      if (scan.status === 'running') {
        throw new Error('Scan is already running');
      }
      
      // Update scan status
      scan.status = 'running';
      scan.startedAt = new Date();
      await scan.save();
      
      // Create scanners
      const scanners = await ScannerFactory.createScanners(scan.tools, {
        target: scan.target.url,
        ...scan.toolConfig,
        authConfig: scan.target.authConfig
      });
      
      // Store active scanners
      this.activeScans.set(scanId, scanners);
      
      // Run scans in parallel
      const scanPromises = scanners.map(scanner => this.runScanner(scanner, scan));
      const results = await Promise.allSettled(scanPromises);
      
      // Process results
      const vulnerabilities = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);
      
      // Save vulnerabilities
      await this.saveVulnerabilities(vulnerabilities, scan);
      
      // Update scan status
      scan.status = 'completed';
      scan.completedAt = new Date();
      scan.duration = Math.floor((scan.completedAt - scan.startedAt) / 1000);
      await scan.save();
      
      // Update target's last scan
      await Target.findByIdAndUpdate(scan.target._id, {
        lastScan: scan.completedAt
      });
      
      // Clean up
      this.activeScans.delete(scanId);
      
      return scan;
    } catch (error) {
      // Update scan status on error
      await Scan.findByIdAndUpdate(scanId, {
        status: 'failed',
        completedAt: new Date()
      });
      
      // Clean up
      this.activeScans.delete(scanId);
      
      throw error;
    }
  }

  async stopScan(scanId) {
    const scanners = this.activeScans.get(scanId);
    
    if (!scanners) {
      throw new Error('No active scan found');
    }
    
    // Stop all scanners
    await Promise.all(scanners.map(scanner => scanner.stop()));
    
    // Update scan status
    await Scan.findByIdAndUpdate(scanId, {
      status: 'cancelled',
      completedAt: new Date()
    });
    
    // Clean up
    this.activeScans.delete(scanId);
  }

  async getScanProgress(scanId) {
    const scanners = this.activeScans.get(scanId);
    
    if (!scanners) {
      const scan = await Scan.findById(scanId);
      return {
        status: scan.status,
        progress: scan.status === 'completed' ? 100 : 0,
        currentStep: scan.status
      };
    }
    
    // Get progress from all scanners
    const progressResults = await Promise.all(
      scanners.map(scanner => scanner.getProgress())
    );
    
    // Calculate average progress
    const totalProgress = progressResults.reduce(
      (sum, result) => sum + result.progress,
      0
    );
    const averageProgress = totalProgress / scanners.length;
    
    // Get current step from the slowest scanner
    const currentStep = progressResults
      .sort((a, b) => a.progress - b.progress)[0]
      .currentStep;
    
    return {
      status: 'running',
      progress: averageProgress,
      currentStep
    };
  }

  async runScanner(scanner, scan) {
    try {
      return await scanner.start();
    } catch (error) {
      console.error(`Scanner ${scanner.constructor.name} failed:`, error);
      return [];
    }
  }

  async saveVulnerabilities(vulnerabilities, scan) {
    const vulnerabilityDocs = vulnerabilities.map(vuln => ({
      ...vuln,
      scan: scan._id,
      target: scan.target._id,
      createdBy: scan.createdBy._id
    }));
    
    await Vulnerability.insertMany(vulnerabilityDocs);
  }
}

module.exports = new ScanService(); 