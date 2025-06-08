class BaseScanner {
  constructor(config) {
    this.config = config;
    this.isRunning = false;
    this.progress = 0;
    this.currentStep = '';
  }

  async initialize() {
    throw new Error('initialize() method must be implemented');
  }

  async start() {
    throw new Error('start() method must be implemented');
  }

  async stop() {
    throw new Error('stop() method must be implemented');
  }

  async getProgress() {
    return {
      progress: this.progress,
      currentStep: this.currentStep,
      isRunning: this.isRunning
    };
  }

  async validateConfig() {
    throw new Error('validateConfig() method must be implemented');
  }

  async processResults(results) {
    throw new Error('processResults() method must be implemented');
  }

  updateProgress(progress, step) {
    this.progress = progress;
    this.currentStep = step;
  }

  formatVulnerability(rawVulnerability) {
    return {
      name: rawVulnerability.name || 'Unknown Vulnerability',
      description: rawVulnerability.description || '',
      severity: this.mapSeverity(rawVulnerability.severity),
      cvssScore: rawVulnerability.cvssScore,
      cvssVector: rawVulnerability.cvssVector,
      cweId: rawVulnerability.cweId,
      cveId: rawVulnerability.cveId,
      location: {
        url: rawVulnerability.url,
        method: rawVulnerability.method,
        parameter: rawVulnerability.parameter,
        evidence: rawVulnerability.evidence
      },
      request: rawVulnerability.request,
      response: rawVulnerability.response,
      remediation: {
        description: rawVulnerability.remediation?.description,
        steps: rawVulnerability.remediation?.steps || [],
        references: rawVulnerability.remediation?.references || []
      }
    };
  }

  mapSeverity(severity) {
    const severityMap = {
      critical: 'critical',
      high: 'high',
      medium: 'medium',
      low: 'low',
      info: 'low'
    };
    return severityMap[severity?.toLowerCase()] || 'low';
  }
}

module.exports = BaseScanner; 