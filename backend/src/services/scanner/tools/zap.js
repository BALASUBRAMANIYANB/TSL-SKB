const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const axios = require('axios');

class ZAPScanner {
  constructor() {
    this.command = 'zap-cli';
    this.apiUrl = 'http://localhost:8080';
    this.apiKey = process.env.ZAP_API_KEY;
  }

  async scan(target, options = {}) {
    try {
      // Start ZAP daemon if not running
      await this.ensureZapRunning();

      // Configure scan options
      const scanOptions = this.buildScanOptions(target, options);

      // Start the scan
      const { stdout, stderr } = await exec(
        `${this.command} quick-scan --self-contained --start-options "-config api.disablekey=true" ${scanOptions} ${target.url}`
      );

      if (stderr) {
        console.error('ZAP stderr:', stderr);
      }

      // Get scan results
      const results = await this.getScanResults(target.url);

      return {
        raw: stdout,
        parsed: results,
        summary: this.generateSummary(results)
      };
    } catch (error) {
      throw new Error(`ZAP scan failed: ${error.message}`);
    }
  }

  async ensureZapRunning() {
    try {
      await axios.get(`${this.apiUrl}/JSON/core/view/version`);
    } catch (error) {
      // Start ZAP if not running
      spawn(this.command, ['start', '--headless']);
      // Wait for ZAP to start
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  buildScanOptions(target, options) {
    const args = [];

    // Add scan type
    if (options.scanType) {
      switch (options.scanType) {
        case 'quick':
          args.push('--quick');
          break;
        case 'full':
          args.push('--full');
          break;
        case 'baseline':
          args.push('--baseline');
          break;
        default:
          args.push('--quick');
      }
    }

    // Add scan level
    if (options.scanLevel) {
      args.push(`--level ${options.scanLevel}`);
    }

    // Add authentication if provided
    if (target.auth) {
      args.push(`--auth-username ${target.auth.username}`);
      args.push(`--auth-password ${target.auth.password}`);
    }

    return args.join(' ');
  }

  async getScanResults(targetUrl) {
    try {
      const alerts = await this.getAlerts(targetUrl);
      const spider = await this.getSpiderResults(targetUrl);
      const ajax = await this.getAjaxSpiderResults(targetUrl);

      return {
        alerts,
        spider,
        ajax,
        urls: [...new Set([...spider.urls, ...ajax.urls])]
      };
    } catch (error) {
      throw new Error(`Failed to get scan results: ${error.message}`);
    }
  }

  async getAlerts(targetUrl) {
    const response = await axios.get(`${this.apiUrl}/JSON/alert/view/alerts`, {
      params: {
        baseurl: targetUrl,
        start: 0,
        count: 100
      }
    });

    return response.data.alerts.map(alert => ({
      id: alert.id,
      name: alert.name,
      risk: alert.risk,
      confidence: alert.confidence,
      description: alert.description,
      solution: alert.solution,
      reference: alert.reference,
      cweid: alert.cweid,
      wascid: alert.wascid,
      messageId: alert.messageId,
      url: alert.url,
      evidence: alert.evidence,
      other: alert.other
    }));
  }

  async getSpiderResults(targetUrl) {
    const response = await axios.get(`${this.apiUrl}/JSON/spider/view/results`, {
      params: {
        scanId: 0
      }
    });

    return {
      urls: response.data.results,
      status: response.data.status
    };
  }

  async getAjaxSpiderResults(targetUrl) {
    const response = await axios.get(`${this.apiUrl}/JSON/ajaxSpider/view/results`, {
      params: {
        scanId: 0
      }
    });

    return {
      urls: response.data.results,
      status: response.data.status
    };
  }

  generateSummary(results) {
    const riskLevels = {
      High: 0,
      Medium: 0,
      Low: 0,
      Informational: 0
    };

    results.alerts.forEach(alert => {
      riskLevels[alert.risk]++;
    });

    return {
      totalAlerts: results.alerts.length,
      riskLevels,
      totalUrls: results.urls.length,
      spiderStatus: results.spider.status,
      ajaxStatus: results.ajax.status
    };
  }
}

module.exports = new ZAPScanner(); 