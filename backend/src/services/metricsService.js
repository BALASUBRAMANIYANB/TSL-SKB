const Scan = require('../models/scan');
const Vulnerability = require('../models/vulnerability');
const Target = require('../models/target');

class MetricsService {
  async getScanMetrics(timeframe = '30d') {
    const dateFilter = this.getDateFilter(timeframe);
    
    const [
      totalScans,
      completedScans,
      failedScans,
      averageDuration,
      scansByTool,
      vulnerabilitiesBySeverity,
      topTargets
    ] = await Promise.all([
      this.getTotalScans(dateFilter),
      this.getCompletedScans(dateFilter),
      this.getFailedScans(dateFilter),
      this.getAverageDuration(dateFilter),
      this.getScansByTool(dateFilter),
      this.getVulnerabilitiesBySeverity(dateFilter),
      this.getTopTargets(dateFilter)
    ]);

    return {
      totalScans,
      completedScans,
      failedScans,
      successRate: (completedScans / totalScans) * 100,
      averageDuration,
      scansByTool,
      vulnerabilitiesBySeverity,
      topTargets
    };
  }

  async getTargetMetrics(targetId, timeframe = '30d') {
    const dateFilter = this.getDateFilter(timeframe);
    
    const [
      totalScans,
      vulnerabilities,
      scanHistory,
      severityTrend
    ] = await Promise.all([
      this.getTargetScans(targetId, dateFilter),
      this.getTargetVulnerabilities(targetId, dateFilter),
      this.getTargetScanHistory(targetId, dateFilter),
      this.getTargetSeverityTrend(targetId, dateFilter)
    ]);

    return {
      totalScans,
      vulnerabilities,
      scanHistory,
      severityTrend
    };
  }

  async getTrendAnalysis(timeframe = '90d') {
    const dateFilter = this.getDateFilter(timeframe);
    
    const [
      scanTrend,
      vulnerabilityTrend,
      severityTrend
    ] = await Promise.all([
      this.getScanTrend(dateFilter),
      this.getVulnerabilityTrend(dateFilter),
      this.getSeverityTrend(dateFilter)
    ]);

    return {
      scanTrend,
      vulnerabilityTrend,
      severityTrend
    };
  }

  // Helper methods
  getDateFilter(timeframe) {
    const now = new Date();
    const filter = {};

    switch (timeframe) {
      case '7d':
        filter.$gte = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        filter.$gte = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        filter.$gte = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        filter.$gte = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        filter.$gte = new Date(now.setDate(now.getDate() - 30));
    }

    return filter;
  }

  async getTotalScans(dateFilter) {
    return Scan.countDocuments({ createdAt: dateFilter });
  }

  async getCompletedScans(dateFilter) {
    return Scan.countDocuments({
      createdAt: dateFilter,
      status: 'completed'
    });
  }

  async getFailedScans(dateFilter) {
    return Scan.countDocuments({
      createdAt: dateFilter,
      status: 'failed'
    });
  }

  async getAverageDuration(dateFilter) {
    const result = await Scan.aggregate([
      { $match: { createdAt: dateFilter, status: 'completed' } },
      { $group: { _id: null, avgDuration: { $avg: '$duration' } } }
    ]);
    return result[0]?.avgDuration || 0;
  }

  async getScansByTool(dateFilter) {
    return Scan.aggregate([
      { $match: { createdAt: dateFilter } },
      { $unwind: '$tools' },
      { $group: { _id: '$tools', count: { $sum: 1 } } }
    ]);
  }

  async getVulnerabilitiesBySeverity(dateFilter) {
    return Vulnerability.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
  }

  async getTopTargets(dateFilter) {
    return Scan.aggregate([
      { $match: { createdAt: dateFilter } },
      { $group: { _id: '$target', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'targets',
          localField: '_id',
          foreignField: '_id',
          as: 'target'
        }
      },
      { $unwind: '$target' }
    ]);
  }

  async getTargetScans(targetId, dateFilter) {
    return Scan.countDocuments({
      target: targetId,
      createdAt: dateFilter
    });
  }

  async getTargetVulnerabilities(targetId, dateFilter) {
    return Vulnerability.aggregate([
      {
        $match: {
          target: targetId,
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
  }

  async getTargetScanHistory(targetId, dateFilter) {
    return Scan.find({
      target: targetId,
      createdAt: dateFilter
    })
    .sort('createdAt')
    .select('status duration createdAt');
  }

  async getTargetSeverityTrend(targetId, dateFilter) {
    return Vulnerability.aggregate([
      {
        $match: {
          target: targetId,
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: {
            severity: '$severity',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.severity',
          data: {
            $push: {
              date: '$_id.date',
              count: '$count'
            }
          }
        }
      }
    ]);
  }

  async getScanTrend(dateFilter) {
    return Scan.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getVulnerabilityTrend(dateFilter) {
    return Vulnerability.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getSeverityTrend(dateFilter) {
    return Vulnerability.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: {
            severity: '$severity',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.severity',
          data: {
            $push: {
              date: '$_id.date',
              count: '$count'
            }
          }
        }
      }
    ]);
  }
}

module.exports = new MetricsService(); 