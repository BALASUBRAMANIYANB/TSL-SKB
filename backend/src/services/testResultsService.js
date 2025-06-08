const Scan = require('../models/scan');
const Vulnerability = require('../models/vulnerability');
const Target = require('../models/target');

class TestResultsService {
  async aggregateTestResults(scanId) {
    try {
      const scan = await Scan.findById(scanId)
        .populate('target')
        .populate('vulnerabilities');

      if (!scan) {
        throw new Error('Scan not found');
      }

      const results = {
        scanId: scan._id,
        target: scan.target,
        startTime: scan.startTime,
        endTime: scan.endTime,
        duration: scan.duration,
        status: scan.status,
        tools: scan.tools,
        summary: await this.generateSummary(scan),
        vulnerabilities: await this.analyzeVulnerabilities(scan.vulnerabilities),
        recommendations: await this.generateRecommendations(scan),
        riskScore: await this.calculateRiskScore(scan)
      };

      return results;
    } catch (error) {
      console.error('Error aggregating test results:', error);
      throw error;
    }
  }

  async generateSummary(scan) {
    const vulnerabilities = scan.vulnerabilities || [];
    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0
    };

    vulnerabilities.forEach(vuln => {
      severityCounts[vuln.severity.toLowerCase()]++;
    });

    return {
      totalVulnerabilities: vulnerabilities.length,
      severityBreakdown: severityCounts,
      scanCoverage: await this.calculateScanCoverage(scan),
      scanEffectiveness: await this.calculateScanEffectiveness(scan)
    };
  }

  async analyzeVulnerabilities(vulnerabilities) {
    const analysis = {
      byType: {},
      byLocation: {},
      bySeverity: {},
      trends: await this.analyzeVulnerabilityTrends(vulnerabilities)
    };

    vulnerabilities.forEach(vuln => {
      // Group by type
      analysis.byType[vuln.type] = (analysis.byType[vuln.type] || 0) + 1;
      
      // Group by location
      analysis.byLocation[vuln.location] = (analysis.byLocation[vuln.location] || 0) + 1;
      
      // Group by severity
      analysis.bySeverity[vuln.severity] = (analysis.bySeverity[vuln.severity] || 0) + 1;
    });

    return analysis;
  }

  async generateRecommendations(scan) {
    const recommendations = [];
    const vulnerabilities = scan.vulnerabilities || [];

    // Group vulnerabilities by type
    const vulnGroups = {};
    vulnerabilities.forEach(vuln => {
      if (!vulnGroups[vuln.type]) {
        vulnGroups[vuln.type] = [];
      }
      vulnGroups[vuln.type].push(vuln);
    });

    // Generate recommendations for each group
    for (const [type, vulns] of Object.entries(vulnGroups)) {
      const recommendation = {
        type,
        severity: this.getHighestSeverity(vulns),
        description: this.getRecommendationDescription(type, vulns),
        affectedComponents: this.getAffectedComponents(vulns),
        remediationSteps: this.getRemediationSteps(type, vulns)
      };
      recommendations.push(recommendation);
    }

    return recommendations;
  }

  async calculateRiskScore(scan) {
    const vulnerabilities = scan.vulnerabilities || [];
    const severityWeights = {
      critical: 10,
      high: 7,
      medium: 4,
      low: 2,
      info: 0.5
    };

    let totalScore = 0;
    let maxPossibleScore = 0;

    vulnerabilities.forEach(vuln => {
      const weight = severityWeights[vuln.severity.toLowerCase()] || 0;
      totalScore += weight;
      maxPossibleScore += 10; // Maximum weight for each vulnerability
    });

    return {
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage: (totalScore / maxPossibleScore) * 100,
      riskLevel: this.getRiskLevel(totalScore / maxPossibleScore)
    };
  }

  async calculateScanCoverage(scan) {
    // Implement scan coverage calculation based on your requirements
    return {
      endpoints: '85%',
      parameters: '90%',
      authentication: '100%',
      overall: '88%'
    };
  }

  async calculateScanEffectiveness(scan) {
    // Implement scan effectiveness calculation based on your requirements
    return {
      vulnerabilityDetection: '92%',
      falsePositiveRate: '5%',
      scanEfficiency: '95%'
    };
  }

  async analyzeVulnerabilityTrends(vulnerabilities) {
    // Implement vulnerability trend analysis
    return {
      newVulnerabilities: vulnerabilities.filter(v => v.isNew).length,
      recurringVulnerabilities: vulnerabilities.filter(v => v.isRecurring).length,
      fixedVulnerabilities: vulnerabilities.filter(v => v.isFixed).length
    };
  }

  getHighestSeverity(vulnerabilities) {
    const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
    return vulnerabilities.reduce((highest, vuln) => {
      const currentIndex = severityOrder.indexOf(vuln.severity.toLowerCase());
      const highestIndex = severityOrder.indexOf(highest.toLowerCase());
      return currentIndex < highestIndex ? vuln.severity : highest;
    }, 'info');
  }

  getRecommendationDescription(type, vulnerabilities) {
    // Implement recommendation description generation
    return `Address ${vulnerabilities.length} ${type} vulnerabilities found in the scan`;
  }

  getAffectedComponents(vulnerabilities) {
    return [...new Set(vulnerabilities.map(v => v.location))];
  }

  getRemediationSteps(type, vulnerabilities) {
    // Implement remediation steps generation
    return [
      'Identify affected components',
      'Review vulnerability details',
      'Implement security fixes',
      'Verify remediation',
      'Update security documentation'
    ];
  }

  getRiskLevel(score) {
    if (score >= 0.8) return 'Critical';
    if (score >= 0.6) return 'High';
    if (score >= 0.4) return 'Medium';
    if (score >= 0.2) return 'Low';
    return 'Info';
  }
}

module.exports = new TestResultsService(); 