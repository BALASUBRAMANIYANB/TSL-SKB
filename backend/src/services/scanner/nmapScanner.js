const BaseScanner = require('./baseScanner');
const { spawn } = require('child_process');
const xml2js = require('xml2js');

class NmapScanner extends BaseScanner {
  constructor(config) {
    super(config);
    this.nmapPath = process.env.NMAP_PATH || 'nmap';
  }

  async initialize() {
    try {
      await this.validateConfig();
      return true;
    } catch (error) {
      throw new Error(`Failed to initialize Nmap scanner: ${error.message}`);
    }
  }

  async start() {
    try {
      this.isRunning = true;
      this.updateProgress(0, 'Starting Nmap scan');

      // Run the scan
      const results = await this.runScan();
      
      // Process and format results
      const vulnerabilities = await this.processResults(results);
      
      this.isRunning = false;
      this.updateProgress(100, 'Scan completed');
      
      return vulnerabilities;
    } catch (error) {
      this.isRunning = false;
      throw new Error(`Nmap scan failed: ${error.message}`);
    }
  }

  async stop() {
    try {
      if (!this.isRunning) return;
      
      // Nmap doesn't support stopping scans, but we can kill the process
      if (this.scanProcess) {
        this.scanProcess.kill();
      }
      
      this.isRunning = false;
      this.updateProgress(0, 'Scan stopped');
    } catch (error) {
      throw new Error(`Failed to stop Nmap scan: ${error.message}`);
    }
  }

  async validateConfig() {
    const required = ['target', 'scanType', 'ports'];
    const missing = required.filter(field => !this.config[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }
    
    return true;
  }

  async processResults(results) {
    const vulnerabilities = [];
    
    // Process open ports and services
    for (const host of results.nmaprun.host || []) {
      for (const port of host.ports[0].port || []) {
        if (port.state[0].$.state === 'open') {
          const service = port.service[0];
          const vulnerability = this.formatVulnerability({
            name: `Open Port ${port.$.portid} - ${service.$.name}`,
            description: `Port ${port.$.portid} is open and running ${service.$.name} ${service.$.product || ''} ${service.$.version || ''}`,
            severity: this.determineSeverity(port.$.portid, service.$.name),
            location: {
              url: `${host.address[0].$.addr}:${port.$.portid}`,
              method: 'TCP',
              parameter: null,
              evidence: `Service: ${service.$.name}, Version: ${service.$.version || 'unknown'}`
            },
            remediation: {
              description: 'Consider closing unnecessary ports or implementing proper access controls',
              steps: [
                'Review if this port is necessary for the service',
                'Implement firewall rules to restrict access',
                'Keep the service software up to date',
                'Configure the service securely'
              ]
            }
          });
          vulnerabilities.push(vulnerability);
        }
      }
    }
    
    return vulnerabilities;
  }

  async runScan() {
    return new Promise((resolve, reject) => {
      const args = this.buildNmapArgs();
      let output = '';
      
      this.scanProcess = spawn(this.nmapPath, args);
      
      this.scanProcess.stdout.on('data', (data) => {
        output += data.toString();
        this.updateProgressFromOutput(data.toString());
      });
      
      this.scanProcess.stderr.on('data', (data) => {
        console.error(`Nmap stderr: ${data}`);
      });
      
      this.scanProcess.on('close', async (code) => {
        if (code === 0) {
          try {
            const parser = new xml2js.Parser();
            const result = await parser.parseStringPromise(output);
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse Nmap output: ${error.message}`));
          }
        } else {
          reject(new Error(`Nmap scan failed with code ${code}`));
        }
      });
    });
  }

  buildNmapArgs() {
    const args = [
      '-oX', '-', // Output in XML format to stdout
      '-sV',      // Version detection
      '-sS',      // TCP SYN scan
      '-p', this.config.ports,
      this.config.target
    ];
    
    // Add timing template
    if (this.config.timing) {
      args.push(`-T${this.config.timing}`);
    }
    
    // Add additional options based on scan type
    switch (this.config.scanType) {
      case 'aggressive':
        args.push('-A');
        break;
      case 'vulnerability':
        args.push('--script', 'vuln');
        break;
      case 'default':
      default:
        break;
    }
    
    return args;
  }

  updateProgressFromOutput(output) {
    // Parse Nmap's progress output
    const progressMatch = output.match(/(\d+\.\d+)% done/);
    if (progressMatch) {
      const progress = parseFloat(progressMatch[1]);
      this.updateProgress(progress, 'Scanning...');
    }
  }

  determineSeverity(port, service) {
    // Common dangerous ports and services
    const dangerousPorts = {
      '21': 'high',    // FTP
      '23': 'high',    // Telnet
      '3389': 'high',  // RDP
      '445': 'high',   // SMB
      '1433': 'high',  // MSSQL
      '3306': 'medium' // MySQL
    };
    
    const dangerousServices = {
      'ftp': 'high',
      'telnet': 'high',
      'rdp': 'high',
      'smb': 'high',
      'mssql': 'high',
      'mysql': 'medium'
    };
    
    return dangerousPorts[port] || dangerousServices[service.toLowerCase()] || 'low';
  }
}

module.exports = NmapScanner; 