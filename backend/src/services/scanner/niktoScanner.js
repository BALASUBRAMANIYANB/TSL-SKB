const BaseScanner = require('./baseScanner');
const { spawn } = require('child_process');

class NiktoScanner extends BaseScanner {
  constructor(config) {
    super(config);
    this.niktoPath = process.env.NIKTO_PATH || 'nikto';
  }

  async initialize() {
    try {
      await this.validateConfig();
      return true;
    } catch (error) {
      throw new Error(`Failed to initialize Nikto scanner: ${error.message}`);
    }
  }

  async start() {
    try {
      this.isRunning = true;
      this.updateProgress(0, 'Starting Nikto scan');

      // Run the scan
      const results = await this.runScan();
      
      // Process and format results
      const vulnerabilities = await this.processResults(results);
      
      this.isRunning = false;
      this.updateProgress(100, 'Scan completed');
      
      return vulnerabilities;
    } catch (error) {
      this.isRunning = false;
      throw new Error(`Nikto scan failed: ${error.message}`);
    }
  }

  async stop() {
    try {
      if (!this.isRunning) return;
      
      // Nikto doesn't support stopping scans, but we can kill the process
      if (this.scanProcess) {
        this.scanProcess.kill();
      }
      
      this.isRunning = false;
      this.updateProgress(0, 'Scan stopped');
    } catch (error) {
      throw new Error(`Failed to stop Nikto scan: ${error.message}`);
    }
  }

  async validateConfig() {
    const required = ['target'];
    const missing = required.filter(field => !this.config[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
    
    return true;
  }

  async processResults(results) {
    const vulnerabilities = [];
    
    // Process Nikto findings
    for (const finding of results) {
      const vulnerability = this.formatVulnerability({
        name: finding.osvdb || 'Web Server Vulnerability',
        description: finding.message,
        severity: this.determineSeverity(finding.message),
        location: {
          url: finding.uri,
          method: 'GET',
          parameter: null,
          evidence: finding.message
        },
        remediation: {
          description: 'Review and address the identified web server vulnerabilities',
          steps: [
            'Update web server software to the latest version',
            'Review and apply security patches',
            'Configure web server securely',
            'Remove or secure unnecessary features'
          ]
        }
      });
      vulnerabilities.push(vulnerability);
    }
    
    return vulnerabilities;
  }

  async runScan() {
    return new Promise((resolve, reject) => {
      const args = this.buildNiktoArgs();
      let output = '';
      
      this.scanProcess = spawn(this.niktoPath, args);
      
      this.scanProcess.stdout.on('data', (data) => {
        output += data.toString();
        this.updateProgressFromOutput(data.toString());
      });
      
      this.scanProcess.stderr.on('data', (data) => {
        console.error(`Nikto stderr: ${data}`);
      });
      
      this.scanProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const results = this.parseNiktoOutput(output);
            resolve(results);
          } catch (error) {
            reject(new Error(`Failed to parse Nikto output: ${error.message}`));
          }
        } else {
          reject(new Error(`Nikto scan failed with code ${code}`));
        }
      });
    });
  }

  buildNiktoArgs() {
    const args = [
      '-h', this.config.target,
      '-Format', 'json',
      '-output', '-'
    ];
    
    // Add plugin options
    if (this.config.plugins) {
      args.push('-Plugins', this.config.plugins);
    }
    
    // Add additional options
    if (this.config.ssl) {
      args.push('-ssl');
    }
    
    if (this.config.timeout) {
      args.push('-timeout', this.config.timeout);
    }
    
    return args;
  }

  updateProgressFromOutput(output) {
    // Parse Nikto's progress output
    const progressMatch = output.match(/(\d+) items tested/);
    if (progressMatch) {
      const items = parseInt(progressMatch[1]);
      const progress = Math.min((items / 1000) * 100, 99); // Assuming max 1000 items
      this.updateProgress(progress, 'Scanning...');
    }
  }

  parseNiktoOutput(output) {
    try {
      // Split output into lines and filter out non-JSON lines
      const lines = output.split('\n')
        .filter(line => line.trim().startsWith('{'))
        .map(line => JSON.parse(line));
      
      return lines;
    } catch (error) {
      throw new Error(`Failed to parse Nikto output: ${error.message}`);
    }
  }

  determineSeverity(message) {
    const highSeverityKeywords = [
      'vulnerable', 'exploit', 'remote code execution', 'sql injection',
      'xss', 'cross-site scripting', 'directory traversal'
    ];
    
    const mediumSeverityKeywords = [
      'information disclosure', 'version disclosure', 'default page',
      'directory listing', 'server information'
    ];
    
    const messageLower = message.toLowerCase();
    
    if (highSeverityKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'high';
    } else if (mediumSeverityKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }
}

module.exports = NiktoScanner; 