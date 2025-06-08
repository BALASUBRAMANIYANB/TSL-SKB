const BaseScanner = require('./baseScanner');
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');

class ZapScanner extends BaseScanner {
  constructor(config) {
    super(config);
    this.zapPath = process.env.ZAP_PATH || 'zap-cli';
    this.apiKey = process.env.ZAP_API_KEY;
    this.port = process.env.ZAP_PORT || 8090;
  }

  async initialize() {
    try {
      // Start ZAP daemon if not running
      await this.startZapDaemon();
      
      // Wait for ZAP to be ready
      await this.waitForZap();
      
      // Set up the scan context
      await this.setupContext();
      
      return true;
    } catch (error) {
      throw new Error(`Failed to initialize ZAP scanner: ${error.message}`);
    }
  }

  async start() {
    try {
      this.isRunning = true;
      this.updateProgress(0, 'Starting ZAP scan');

      // Start the scan
      const scanId = await this.startScan();
      
      // Monitor scan progress
      await this.monitorProgress(scanId);
      
      // Get results
      const results = await this.getResults();
      
      // Process and format results
      const vulnerabilities = await this.processResults(results);
      
      this.isRunning = false;
      this.updateProgress(100, 'Scan completed');
      
      return vulnerabilities;
    } catch (error) {
      this.isRunning = false;
      throw new Error(`ZAP scan failed: ${error.message}`);
    }
  }

  async stop() {
    try {
      if (!this.isRunning) return;
      
      // Stop the active scan
      await axios.get(`http://localhost:${this.port}/JSON/ascan/action/stopAllScans/`, {
        params: { apikey: this.apiKey }
      });
      
      this.isRunning = false;
      this.updateProgress(0, 'Scan stopped');
    } catch (error) {
      throw new Error(`Failed to stop ZAP scan: ${error.message}`);
    }
  }

  async validateConfig() {
    const required = ['target', 'level'];
    const missing = required.filter(field => !this.config[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
    
    return true;
  }

  async processResults(results) {
    return results.alerts.map(alert => this.formatVulnerability({
      name: alert.name,
      description: alert.description,
      severity: alert.risk,
      cvssScore: alert.cvss,
      cweId: alert.cweid,
      cveId: alert.cveid,
      location: {
        url: alert.url,
        method: alert.method,
        parameter: alert.param,
        evidence: alert.evidence
      },
      request: alert.request,
      response: alert.response,
      remediation: {
        description: alert.solution,
        references: alert.reference ? [alert.reference] : []
      }
    }));
  }

  async startZapDaemon() {
    return new Promise((resolve, reject) => {
      const zap = spawn(this.zapPath, [
        'daemon',
        '-p', this.port,
        '-n',
        '-I'
      ]);

      zap.on('error', (error) => {
        reject(new Error(`Failed to start ZAP daemon: ${error.message}`));
      });

      zap.on('exit', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ZAP daemon exited with code ${code}`));
        }
      });
    });
  }

  async waitForZap() {
    const maxAttempts = 30;
    const delay = 1000;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        await axios.get(`http://localhost:${this.port}/JSON/core/view/version/`, {
          params: { apikey: this.apiKey }
        });
        return;
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('ZAP daemon failed to start');
  }

  async setupContext() {
    const { target, authConfig } = this.config;
    
    // Create a new context
    const contextId = await this.createContext();
    
    // Add target to context
    await this.addTargetToContext(contextId, target);
    
    // Configure authentication if provided
    if (authConfig) {
      await this.configureAuthentication(contextId, authConfig);
    }
    
    // Set scan level
    await this.setScanLevel(this.config.level);
  }

  async startScan() {
    const response = await axios.get(`http://localhost:${this.port}/JSON/ascan/action/scan/`, {
      params: {
        apikey: this.apiKey,
        url: this.config.target,
        recurse: true,
        inScopeOnly: true
      }
    });
    
    return response.data.scan;
  }

  async monitorProgress(scanId) {
    while (this.isRunning) {
      const status = await this.getScanStatus(scanId);
      this.updateProgress(status.progress, status.status);
      
      if (status.status === 'FINISHED') {
        break;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async getResults() {
    const response = await axios.get(`http://localhost:${this.port}/JSON/core/view/alerts/`, {
      params: { apikey: this.apiKey }
    });
    
    return response.data;
  }
}

module.exports = ZapScanner; 