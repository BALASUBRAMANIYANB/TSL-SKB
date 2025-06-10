const mongoose = require('mongoose');
const logger = require('../../utils/logger');

const scanHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target: {
    type: String,
    required: true
  },
  profile: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  results: {
    type: mongoose.Schema.Types.Mixed
  },
  error: {
    type: String
  },
  scheduleId: {
    type: String
  }
}, {
  timestamps: true
});

const ScanHistory = mongoose.model('ScanHistory', scanHistorySchema);

class HistoryService {
  static async createScanRecord(userId, target, profile) {
    try {
      logger.info(`Creating scan record for user ${userId}`);
      const scanRecord = new ScanHistory({
        userId,
        target,
        profile,
        status: 'pending',
        startTime: new Date()
      });

      await scanRecord.save();
      return scanRecord;
    } catch (error) {
      logger.error(`Error creating scan record: ${error.message}`);
      throw error;
    }
  }

  static async updateScanStatus(scanId, status, results = null, error = null) {
    try {
      logger.info(`Updating scan ${scanId} status to ${status}`);
      const update = {
        status,
        ...(results && { results }),
        ...(error && { error }),
        ...(status === 'completed' || status === 'failed' || status === 'cancelled' ? { endTime: new Date() } : {})
      };

      const scanRecord = await ScanHistory.findByIdAndUpdate(
        scanId,
        update,
        { new: true }
      );

      if (!scanRecord) {
        throw new Error('Scan record not found');
      }

      return scanRecord;
    } catch (error) {
      logger.error(`Error updating scan status: ${error.message}`);
      throw error;
    }
  }

  static async getScanHistory(userId, page = 1, limit = 10) {
    try {
      logger.info(`Getting scan history for user ${userId}`);
      const skip = (page - 1) * limit;

      const [scans, total] = await Promise.all([
        ScanHistory.find({ userId })
          .sort({ startTime: -1 })
          .skip(skip)
          .limit(limit),
        ScanHistory.countDocuments({ userId })
      ]);

      return {
        scans,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error(`Error getting scan history: ${error.message}`);
      throw error;
    }
  }

  static async getScanReport(scanId) {
    try {
      logger.info(`Getting scan report for ${scanId}`);
      const scan = await ScanHistory.findById(scanId);
      if (!scan) {
        throw new Error('Scan not found');
      }

      // Generate report based on scan results
      const report = {
        scanId: scan._id,
        target: scan.target,
        profile: scan.profile,
        status: scan.status,
        startTime: scan.startTime,
        endTime: scan.endTime,
        duration: scan.endTime ? (scan.endTime - scan.startTime) / 1000 : null,
        results: scan.results,
        error: scan.error
      };

      return report;
    } catch (error) {
      logger.error(`Error getting scan report: ${error.message}`);
      throw error;
    }
  }

  static async deleteScanHistory(userId, scanId) {
    try {
      logger.info(`Deleting scan ${scanId} for user ${userId}`);
      const result = await ScanHistory.findOneAndDelete({
        _id: scanId,
        userId
      });

      if (!result) {
        throw new Error('Scan not found');
      }

      return { success: true };
    } catch (error) {
      logger.error(`Error deleting scan history: ${error.message}`);
      throw error;
    }
  }

  static async cleanupOldScans(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await ScanHistory.deleteMany({
        startTime: { $lt: cutoffDate }
      });

      return {
        success: true,
        deletedCount: result.deletedCount
      };
    } catch (error) {
      console.error('Error cleaning up old scans:', error);
      throw new Error('Failed to clean up old scans');
    }
  }
}

module.exports = HistoryService; 