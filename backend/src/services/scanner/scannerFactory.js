const NmapScanner = require('./nmapScanner');
const NiktoScanner = require('./niktoScanner');
const ZapScanner = require('./zapScanner');
const WazuhService = require('../wazuhService');

function getScanner(scanConfig) {
  switch (scanConfig.scanType) {
    case 'nmap':
      return new NmapScanner(scanConfig);
    case 'nikto':
      return new NiktoScanner(scanConfig);
    case 'zap':
      return new ZapScanner(scanConfig);
    case 'wazuh':
      // Wazuh is handled as a service, not a scanner class
      return WazuhService;
    default:
      throw new Error(`Unknown scan type: ${scanConfig.scanType}`);
  }
}

module.exports = { getScanner }; 