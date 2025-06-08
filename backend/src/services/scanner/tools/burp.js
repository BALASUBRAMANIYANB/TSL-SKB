const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const axios = require('axios');

class BurpScanner {
  constructor() {
    this.command = 'burp-rest-api';
    this.apiUrl = 'http://localhost:1337';
    this.apiKey = process.env.BURP_API_KEY;
  }

  async scan(target, options = {}) {
    try {
      // Start Burp REST API if not running
      await this.ensureBurpRunning();

      // Configure scan options
      const scanOptions = this.buildScanOptions(target, options);

      // Start the scan
      const { stdout, stderr } = await exec(
        `${this.command} --config-file=/path/to/burp-config.json ${scanOptions} ${target.url}`
      );

      if (stderr) {
        console.error('Burp stderr:', stderr);
      }

      // Get scan results
      const results = await this.getScanResults(target.url);

      return {
        raw: stdout,
        parsed: results,
        summary: this.generateSummary(results)
      };
    } catch (error) {
      throw new Error(`Burp scan failed: ${error.message}`);
    }
  }

  async ensureBurpRunning() {
    try {
      await axios.get(`${this.apiUrl}/v0.1/scan`);
    } catch (error) {
      // Start Burp REST API if not running
      spawn(this.command, ['--headless']);
      // Wait for Burp to start
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  buildScanOptions(target, options) {
    const args = [];

    // Add scan type
    if (options.scanType) {
      switch (options.scanType) {
        case 'quick':
          args.push('--scan-type=quick');
          break;
        case 'full':
          args.push('--scan-type=full');
          break;
        case 'crawl':
          args.push('--scan-type=crawl');
          break;
        default:
          args.push('--scan-type=quick');
      }
    }

    // Add scan configuration
    if (options.config) {
      args.push(`--config=${options.config}`);
    }

    // Add authentication if provided
    if (target.auth) {
      args.push(`--auth-username=${target.auth.username}`);
      args.push(`--auth-password=${target.auth.password}`);
    }

    return args.join(' ');
  }

  async getScanResults(targetUrl) {
    try {
      const issues = await this.getIssues(targetUrl);
      const crawl = await this.getCrawlResults(targetUrl);
      const scanStatus = await this.getScanStatus(targetUrl);

      return {
        issues,
        crawl,
        status: scanStatus
      };
    } catch (error) {
      throw new Error(`Failed to get scan results: ${error.message}`);
    }
  }

  async getIssues(targetUrl) {
    const response = await axios.get(`${this.apiUrl}/v0.1/scan/issues`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      params: {
        url: targetUrl
      }
    });

    return response.data.issues.map(issue => ({
      id: issue.id,
      name: issue.name,
      severity: issue.severity,
      confidence: issue.confidence,
      description: issue.description,
      remediation: issue.remediation,
      references: issue.references,
      cwe: issue.cwe,
      wasc: issue.wasc,
      location: issue.location,
      evidence: issue.evidence,
      request: issue.request,
      response: issue.response
    }));
  }

  async getCrawlResults(targetUrl) {
    const response = await axios.get(`${this.apiUrl}/v0.1/scan/crawl`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      params: {
        url: targetUrl
      }
    });

    return {
      urls: response.data.urls,
      status: response.data.status,
      progress: response.data.progress
    };
  }

  async getScanStatus(targetUrl) {
    const response = await axios.get(`${this.apiUrl}/v0.1/scan/status`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      params: {
        url: targetUrl
      }
    });

    return {
      status: response.data.status,
      progress: response.data.progress,
      startTime: response.data.startTime,
      endTime: response.data.endTime
    };
  }

  generateSummary(results) {
    const severityLevels = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      Info: 0
    };

    results.issues.forEach(issue => {
      severityLevels[issue.severity]++;
    });

    return {
      totalIssues: results.issues.length,
      severityLevels,
      totalUrls: results.crawl.urls.length,
      crawlStatus: results.crawl.status,
      scanStatus: results.status.status,
      scanProgress: results.status.progress
    };
  }
}

module.exports = new BurpScanner(); 