const ZapScanner = require('./zapScanner');
const NmapScanner = require('./nmapScanner');
const NiktoScanner = require('./niktoScanner');

class ScannerFactory {
  static createScanner(tool, config) {
    switch (tool.toLowerCase()) {
      case 'zap':
        return new ZapScanner(config);
      case 'nmap':
        return new NmapScanner(config);
      case 'nikto':
        return new NiktoScanner(config);
      default:
        throw new Error(`Unsupported scanner tool: ${tool}`);
    }
  }

  static async createScanners(tools, config) {
    const scanners = [];
    
    for (const tool of tools) {
      try {
        const scanner = this.createScanner(tool, config);
        await scanner.initialize();
        scanners.push(scanner);
      } catch (error) {
        console.error(`Failed to initialize ${tool} scanner:`, error);
        // Continue with other scanners even if one fails
      }
    }
    
    return scanners;
  }

  static getDefaultConfig(tool) {
    switch (tool.toLowerCase()) {
      case 'zap':
        return {
          level: 'medium',
          excludePaths: [],
          excludeParams: []
        };
      case 'nmap':
        return {
          scanType: 'default',
          ports: '1-1000',
          timing: 'normal'
        };
      case 'nikto':
        return {
          plugins: 'all',
          ssl: false,
          timeout: 30
        };
      default:
        throw new Error(`Unsupported scanner tool: ${tool}`);
    }
  }

  static mergeConfigs(baseConfig, toolConfig) {
    return {
      ...baseConfig,
      ...toolConfig,
      toolConfig: {
        ...baseConfig.toolConfig,
        ...toolConfig.toolConfig
      }
    };
  }

  static validateToolConfig(tool, config) {
    const defaultConfig = this.getDefaultConfig(tool);
    const mergedConfig = this.mergeConfigs(defaultConfig, config);
    
    const scanner = this.createScanner(tool, mergedConfig);
    return scanner.validateConfig();
  }
}

module.exports = ScannerFactory; 