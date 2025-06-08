const cron = require('node-cron');
const Scan = require('../models/scan');
const scanService = require('./scanService');
const { sendNotification } = require('./notificationService');

class SchedulerService {
  constructor() {
    this.jobs = new Map();
    this.initializeScheduledScans();
  }

  async initializeScheduledScans() {
    try {
      const scheduledScans = await Scan.find({
        'schedule.type': { $in: ['daily', 'weekly', 'monthly'] },
        status: { $ne: 'cancelled' }
      });

      scheduledScans.forEach(scan => {
        this.scheduleScan(scan);
      });
    } catch (error) {
      console.error('Error initializing scheduled scans:', error);
    }
  }

  scheduleScan(scan) {
    if (this.jobs.has(scan._id.toString())) {
      this.jobs.get(scan._id.toString()).stop();
    }

    const cronExpression = this.getCronExpression(scan.schedule);
    if (!cronExpression) return;

    const job = cron.schedule(cronExpression, async () => {
      try {
        // Create a new scan instance
        const newScan = await Scan.create({
          target: scan.target,
          tools: scan.tools,
          toolConfig: scan.toolConfig,
          schedule: scan.schedule,
          createdBy: scan.createdBy,
          parentScan: scan._id
        });

        // Start the scan
        await scanService.startScan(newScan._id);

        // Send notification
        await sendNotification({
          type: 'scan_started',
          userId: scan.createdBy,
          data: {
            scanId: newScan._id,
            target: scan.target,
            schedule: scan.schedule
          }
        });
      } catch (error) {
        console.error('Error executing scheduled scan:', error);
        await sendNotification({
          type: 'scan_failed',
          userId: scan.createdBy,
          data: {
            scanId: scan._id,
            error: error.message
          }
        });
      }
    });

    this.jobs.set(scan._id.toString(), job);
  }

  getCronExpression(schedule) {
    const [hours, minutes] = schedule.time.split(':').map(Number);

    switch (schedule.type) {
      case 'daily':
        return `${minutes} ${hours} * * *`;
      
      case 'weekly':
        if (!schedule.days || schedule.days.length === 0) return null;
        return `${minutes} ${hours} * * ${schedule.days.join(',')}`;
      
      case 'monthly':
        if (!schedule.days || schedule.days.length === 0) return null;
        return `${minutes} ${hours} ${schedule.days.join(',')} * *`;
      
      default:
        return null;
    }
  }

  async updateSchedule(scanId, schedule) {
    const scan = await Scan.findById(scanId);
    if (!scan) return;

    scan.schedule = schedule;
    await scan.save();

    this.scheduleScan(scan);
  }

  async removeSchedule(scanId) {
    const job = this.jobs.get(scanId.toString());
    if (job) {
      job.stop();
      this.jobs.delete(scanId.toString());
    }

    await Scan.findByIdAndUpdate(scanId, {
      'schedule.type': 'once'
    });
  }
}

module.exports = new SchedulerService(); 