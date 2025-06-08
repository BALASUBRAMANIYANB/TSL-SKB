const { spawn } = require('child_process');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

class NmapScanner {
  constructor() {
    this.command = 'nmap';
  }

  async scan(target, options = {}) {
    try {
      // Build nmap command with options
      const args = this.buildCommandArgs(target, options);
      
      // Execute nmap
      const { stdout, stderr } = await exec(`${this.command} ${args.join(' ')}`);
      
      if (stderr) {
        console.error('Nmap stderr:', stderr);
      }

      // Parse results
      const results = this.parseResults(stdout);
      
      return {
        raw: stdout,
        parsed: results,
        summary: this.generateSummary(results)
      };
    } catch (error) {
      throw new Error(`Nmap scan failed: ${error.message}`);
    }
  }

  buildCommandArgs(target, options) {
    const args = [];

    // Add target
    args.push(target.url);

    // Add scan type
    if (options.scanType) {
      switch (options.scanType) {
        case 'quick':
          args.push('-T4 -F');
          break;
        case 'full':
          args.push('-T4 -A -v');
          break;
        case 'vuln':
          args.push('-T4 -sV --script vuln');
          break;
        default:
          args.push('-T4');
      }
    }

    // Add ports if specified
    if (options.ports) {
      args.push(`-p${options.ports}`);
    }

    // Add output format
    args.push('-oX -'); // XML output to stdout

    return args;
  }

  parseResults(output) {
    const results = {
      hosts: [],
      summary: {
        total: 0,
        up: 0,
        down: 0
      }
    };

    // Parse XML output
    const lines = output.split('\n');
    let currentHost = null;

    for (const line of lines) {
      if (line.includes('<host>')) {
        currentHost = {
          status: 'down',
          ports: []
        };
      } else if (line.includes('</host>')) {
        if (currentHost) {
          results.hosts.push(currentHost);
          results.summary.total++;
          if (currentHost.status === 'up') {
            results.summary.up++;
          } else {
            results.summary.down++;
          }
        }
        currentHost = null;
      } else if (currentHost) {
        if (line.includes('<status state="up"')) {
          currentHost.status = 'up';
        } else if (line.includes('<port ')) {
          const port = this.parsePort(line);
          if (port) {
            currentHost.ports.push(port);
          }
        }
      }
    }

    return results;
  }

  parsePort(line) {
    const portMatch = line.match(/portid="(\d+)"/);
    const stateMatch = line.match(/state="(\w+)"/);
    const serviceMatch = line.match(/name="(\w+)"/);
    const versionMatch = line.match(/product="([^"]+)"/);

    if (portMatch) {
      return {
        port: parseInt(portMatch[1]),
        state: stateMatch ? stateMatch[1] : 'unknown',
        service: serviceMatch ? serviceMatch[1] : 'unknown',
        version: versionMatch ? versionMatch[1] : 'unknown'
      };
    }

    return null;
  }

  generateSummary(results) {
    return {
      total: results.summary.total,
      up: results.summary.up,
      down: results.summary.down,
      openPorts: results.hosts.reduce((count, host) => 
        count + host.ports.filter(p => p.state === 'open').length, 0
      )
    };
  }
}

module.exports = new NmapScanner(); 