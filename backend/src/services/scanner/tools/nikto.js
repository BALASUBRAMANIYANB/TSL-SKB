const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

class NiktoScanner {
  constructor() {
    this.command = 'nikto';
  }

  async scan(target, options = {}) {
    try {
      // Build nikto command with options
      const args = this.buildCommandArgs(target, options);
      
      // Execute nikto
      const { stdout, stderr } = await exec(`${this.command} ${args.join(' ')}`);
      
      if (stderr) {
        console.error('Nikto stderr:', stderr);
      }

      // Parse results
      const results = this.parseResults(stdout);
      
      return {
        raw: stdout,
        parsed: results,
        summary: this.generateSummary(results)
      };
    } catch (error) {
      throw new Error(`Nikto scan failed: ${error.message}`);
    }
  }

  buildCommandArgs(target, options) {
    const args = [];

    // Add target
    args.push(`-h ${target.url}`);

    // Add output format
    args.push('-Format json');

    // Add scan options
    if (options.scanType) {
      switch (options.scanType) {
        case 'quick':
          args.push('-Tuning 123457890');
          break;
        case 'full':
          args.push('-Tuning 123457890abcdefg');
          break;
        case 'vuln':
          args.push('-Tuning 123457890abcdefgx');
          break;
        default:
          args.push('-Tuning 123457890');
      }
    }

    // Add port if specified
    if (options.port) {
      args.push(`-p ${options.port}`);
    }

    // Add authentication if provided
    if (target.auth) {
      args.push(`-id ${target.auth.username}:${target.auth.password}`);
    }

    // Add timeout
    if (options.timeout) {
      args.push(`-timeout ${options.timeout}`);
    }

    // Add user agent
    if (options.userAgent) {
      args.push(`-useragent ${options.userAgent}`);
    }

    return args;
  }

  parseResults(output) {
    try {
      const results = JSON.parse(output);
      return {
        host: results.host,
        port: results.port,
        targetip: results.targetip,
        starttime: results.starttime,
        endtime: results.endtime,
        scanitems: results.scanitems,
        vulnerabilities: results.vulnerabilities.map(vuln => ({
          id: vuln.id,
          osvdb: vuln.osvdb,
          method: vuln.method,
          uri: vuln.uri,
          namelink: vuln.namelink,
          iplink: vuln.iplink,
          nametext: vuln.nametext,
          osvdbtext: vuln.osvdbtext,
          description: vuln.description,
          message: vuln.message,
          severity: this.determineSeverity(vuln.message)
        }))
      };
    } catch (error) {
      throw new Error(`Failed to parse Nikto results: ${error.message}`);
    }
  }

  determineSeverity(message) {
    const criticalKeywords = ['critical', 'remote code execution', 'sql injection'];
    const highKeywords = ['high', 'xss', 'cross-site scripting', 'directory traversal'];
    const mediumKeywords = ['medium', 'information disclosure', 'default credentials'];
    const lowKeywords = ['low', 'version disclosure', 'server information'];

    const lowerMessage = message.toLowerCase();
    
    if (criticalKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'Critical';
    } else if (highKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'High';
    } else if (mediumKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'Medium';
    } else if (lowKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'Low';
    }
    
    return 'Info';
  }

  generateSummary(results) {
    const severityLevels = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
      Info: 0
    };

    results.vulnerabilities.forEach(vuln => {
      severityLevels[vuln.severity]++;
    });

    return {
      totalVulnerabilities: results.vulnerabilities.length,
      severityLevels,
      scanDuration: new Date(results.endtime) - new Date(results.starttime),
      scanItems: results.scanitems,
      targetInfo: {
        host: results.host,
        port: results.port,
        ip: results.targetip
      }
    };
  }
}

module.exports = new NiktoScanner(); 