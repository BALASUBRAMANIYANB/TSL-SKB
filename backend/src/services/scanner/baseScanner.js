class BaseScanner {
  constructor(config) {
    this.config = config;
    this.isRunning = false;
    this.progress = 0;
    this.currentStep = '';
    this.phases = ['initializing', 'scanning', 'processing', 'completed'];
    this.currentPhase = this.phases[0];
    this.partialResults = [];
    this.partialResultCallback = null;
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
      currentPhase: this.currentPhase,
      isRunning: this.isRunning
    };
  }

  async validateConfig() {
    throw new Error('validateConfig() method must be implemented');
  }

  async processResults(results) {
    throw new Error('processResults() method must be implemented');
  }

  updateProgress(progress, step, phase) {
    this.progress = progress;
    this.currentStep = step;
    if (phase) this.currentPhase = phase;
  }

  emitPartialResult(result) {
    this.partialResults.push(result);
    if (typeof this.partialResultCallback === 'function') {
      this.partialResultCallback(result);
    }
  }

  onPartialResult(callback) {
    this.partialResultCallback = callback;
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