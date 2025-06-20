const cron = require('node-cron');
const ScanTemplate = require('../models/scanTemplate');
const Scan = require('../models/scan');
const scanService = require('./scanService');
const logger = require('../utils/logger');

class SchedulerService {
  constructor() {
    this.jobs = new Map();
  }

  async initialize() {
    logger.info('Initializing scheduler...');
    const templates = await ScanTemplate.find({ isScheduled: true, schedule: { $ne: null } });
    for (const template of templates) {
      this.scheduleScan(template);
    }
    logger.info(`Scheduler initialized with ${this.jobs.size} jobs.`);
  }

  scheduleScan(template) {
    if (!cron.validate(template.schedule)) {
      logger.error(`Invalid cron string for template ${template._id}: ${template.schedule}`);
      return;
    }

    // If a job for this template already exists, cancel it first.
    if (this.jobs.has(template._id.toString())) {
      this.cancelScan(template._id);
    }

    const job = cron.schedule(template.schedule, async () => {
      logger.info(`Triggering scheduled scan for template: ${template.name}`);
      try {
        const scan = await Scan.create({
          name: `${template.name} (Scheduled)`,
          description: template.description,
          target: template.target, // Assuming template has a target
          scanType: template.scanType,
          // Copy other relevant fields from template to scan
          ...template.toolConfig,
          createdBy: template.createdBy,
          status: 'pending' // It will be queued by the service
        });
        await scanService.queueScan(scan._id);
        logger.info(`Scan ${scan._id} created and queued from template.`);
      } catch (error) {
        logger.error(`Failed to create/queue scan from template ${template._id}:`, error);
      }
    });

    this.jobs.set(template._id.toString(), job);
    logger.info(`Scan template ${template.name} scheduled with cron: ${template.schedule}`);
  }

  cancelScan(templateId) {
    const jobId = templateId.toString();
    if (this.jobs.has(jobId)) {
      const job = this.jobs.get(jobId);
      job.stop();
      this.jobs.delete(jobId);
      logger.info(`Cancelled scheduled scan for template ${jobId}`);
    }
  }

  getScheduledJobs() {
    return Array.from(this.jobs.keys());
  }
}

// Singleton instance
const schedulerService = new SchedulerService();
module.exports = schedulerService; 