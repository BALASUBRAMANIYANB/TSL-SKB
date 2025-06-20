const logger = require('../../utils/logger');

class QueueService {
  constructor(processor, concurrency = 1) {
    if (!processor || typeof processor !== 'function') {
      throw new Error('A processor function must be provided.');
    }
    this.queue = [];
    this.activeJobs = 0;
    this.concurrency = concurrency;
    this.processor = processor;
  }

  add(jobData) {
    return new Promise((resolve, reject) => {
      this.queue.push({ jobData, resolve, reject });
      logger.info(`Job added to the queue.`);
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.queue.length === 0 || this.activeJobs >= this.concurrency) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.activeJobs++;
    const { jobData, resolve, reject } = job;

    logger.info(`Starting job from the queue...`);

    try {
      const result = await this.processor(jobData);
      logger.info(`Job completed successfully.`);
      resolve(result);
    } catch (error) {
      logger.error(`Job failed: ${error.message}`);
      reject(error);
    } finally {
      this.activeJobs--;
      this.processQueue();
    }
  }
}

module.exports = QueueService; 