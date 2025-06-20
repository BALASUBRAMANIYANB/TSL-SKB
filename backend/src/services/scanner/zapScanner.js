const axios = require('axios');
const baseScanner = require('./baseScanner');

class ZapScanner extends baseScanner {
  constructor(config) {
    super(config);
    this.zapApi = config.zapApi || 'http://localhost:8080'; // ZAP API endpoint
    this.target = config.target;
    this.auth = config.auth || { type: 'none' };
  }

  async initialize() {
    // Optionally: check ZAP is running, clean up previous sessions, etc.
    return true;
  }

  async start() {
    // 1. Set up authentication if needed
    if (this.auth.type && this.auth.type !== 'none') {
      await this.configureAuth();
    }
    // 2. Spider the target
    await this.spiderTarget();
    // 3. Active scan
    const scanId = await this.activeScan();
    // 4. Poll for completion
    await this.waitForScan(scanId);
    // 5. Fetch results
    return await this.getResults();
  }

  async configureAuth() {
    // This is a simplified example. In production, you may want to use ZAP contexts and session mgmt.
    switch (this.auth.type) {
      case 'basic':
        // Set HTTP Basic Auth header for all requests
        await axios.post(`${this.zapApi}/JSON/httpSessions/action/addDefaultSessionToken/`, {
          sessionToken: 'Authorization',
          tokenValue: 'Basic ' + Buffer.from(`${this.auth.username}:${this.auth.password}`).toString('base64'),
        });
        break;
      case 'cookie':
        // Set cookie header
        await axios.post(`${this.zapApi}/JSON/httpSessions/action/addDefaultSessionToken/`, {
          sessionToken: 'Cookie',
          tokenValue: this.auth.cookie,
        });
        break;
      case 'bearer':
        // Set Bearer token header
        await axios.post(`${this.zapApi}/JSON/httpSessions/action/addDefaultSessionToken/`, {
          sessionToken: 'Authorization',
          tokenValue: 'Bearer ' + this.auth.token,
        });
        break;
      case 'custom':
        // Set custom headers
        for (const [header, value] of Object.entries(this.auth.customHeaders || {})) {
          await axios.post(`${this.zapApi}/JSON/httpSessions/action/addDefaultSessionToken/`, {
            sessionToken: header,
            tokenValue: value,
          });
        }
        break;
      default:
        break;
    }
  }

  async spiderTarget() {
    await axios.get(`${this.zapApi}/JSON/spider/action/scan/`, {
      params: { url: this.target, maxChildren: 0 }
    });
  }

  async activeScan() {
    const resp = await axios.get(`${this.zapApi}/JSON/ascan/action/scan/`, {
      params: { url: this.target }
    });
    return resp.data.scan; // scan ID
  }

  async waitForScan(scanId) {
    let progress = 0;
    while (progress < 100) {
      const resp = await axios.get(`${this.zapApi}/JSON/ascan/view/status/`, {
        params: { scanId }
      });
      progress = parseInt(resp.data.status, 10);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  async getResults() {
    // Fetch alerts (vulnerabilities)
    const resp = await axios.get(`${this.zapApi}/JSON/core/view/alerts/`, {
      params: { baseurl: this.target, start: 0, count: 1000 }
    });
    // Map ZAP alerts to our vulnerability format
    return (resp.data.alerts || []).map(alert => ({
      name: alert.name,
      description: alert.description,
      severity: alert.risk,
      cweId: alert.cweid,
      url: alert.url,
      evidence: alert.evidence,
      remediation: { description: alert.solution },
      tool: 'zap',
      toolSpecificData: alert
    }));
  }
}

module.exports = ZapScanner; 