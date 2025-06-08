const cron = require('node-cron');
const Scan = require('../models/scan');
const Target = require('../models/target');
const scanService = require('./scanService');
const notificationService = require('./notificationService');

class TestAutomationService {
  constructor() {
    this.scheduledTests = new Map();
    this.initializeScheduledTests();
  }

  async initializeScheduledTests() {
    try {
      const scheduledTests = await Scan.find({
        'schedule.type': { $in: ['daily', 'weekly', 'monthly'] },
        status: { $ne: 'cancelled' }
      });

      for (const test of scheduledTests) {
        await this.scheduleTest(test);
      }
    } catch (error) {
      console.error('Error initializing scheduled tests:', error);
    }
  }

  async scheduleTest(test) {
    if (this.scheduledTests.has(test._id.toString())) {
      this.scheduledTests.get(test._id.toString()).stop();
    }

    const cronExpression = this.getCronExpression(test.schedule);
    if (!cronExpression) return;

    const job = cron.schedule(cronExpression, async () => {
      try {
        // Create a new test instance
        const newTest = await Scan.create({
          target: test.target,
          tools: test.tools,
          toolConfig: test.toolConfig,
          schedule: test.schedule,
          createdBy: test.createdBy,
          parentTest: test._id
        });

        // Start the test
        await scanService.startScan(newTest._id);

        // Send notification
        await notificationService.sendNotification({
          type: 'test_started',
          userId: test.createdBy,
          data: {
            testId: newTest._id,
            target: test.target,
            schedule: test.schedule
          }
        });
      } catch (error) {
        console.error('Error executing scheduled test:', error);
        await notificationService.sendNotification({
          type: 'test_failed',
          userId: test.createdBy,
          data: {
            testId: test._id,
            error: error.message
          }
        });
      }
    });

    this.scheduledTests.set(test._id.toString(), job);
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

  async updateSchedule(testId, schedule) {
    const test = await Scan.findById(testId);
    if (!test) return;

    test.schedule = schedule;
    await test.save();

    await this.scheduleTest(test);
  }

  async removeSchedule(testId) {
    const job = this.scheduledTests.get(testId.toString());
    if (job) {
      job.stop();
      this.scheduledTests.delete(testId.toString());
    }

    await Scan.findByIdAndUpdate(testId, {
      'schedule.type': 'once'
    });
  }

  async createTestSuite(suiteConfig) {
    const { name, description, targets, tools, schedule, createdBy } = suiteConfig;

    const suite = await Scan.create({
      name,
      description,
      targets,
      tools,
      schedule,
      createdBy,
      type: 'suite'
    });

    // Schedule individual tests for each target
    for (const targetId of targets) {
      const test = await Scan.create({
        target: targetId,
        tools,
        schedule,
        createdBy,
        parentSuite: suite._id
      });

      await this.scheduleTest(test);
    }

    return suite;
  }

  async runTestSuite(suiteId) {
    const suite = await Scan.findById(suiteId).populate('targets');
    if (!suite || suite.type !== 'suite') {
      throw new Error('Invalid test suite');
    }

    const results = [];
    for (const target of suite.targets) {
      const test = await Scan.create({
        target: target._id,
        tools: suite.tools,
        createdBy: suite.createdBy,
        parentSuite: suite._id
      });

      const result = await scanService.startScan(test._id);
      results.push(result);
    }

    return results;
  }

  async getTestHistory(targetId, limit = 10) {
    return Scan.find({ target: targetId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('vulnerabilities');
  }

  async compareTestResults(testId1, testId2) {
    const [test1, test2] = await Promise.all([
      Scan.findById(testId1).populate('vulnerabilities'),
      Scan.findById(testId2).populate('vulnerabilities')
    ]);

    if (!test1 || !test2) {
      throw new Error('One or both tests not found');
    }

    return {
      newVulnerabilities: this.findNewVulnerabilities(test1, test2),
      fixedVulnerabilities: this.findFixedVulnerabilities(test1, test2),
      severityChanges: this.findSeverityChanges(test1, test2),
      summary: this.generateComparisonSummary(test1, test2)
    };
  }

  findNewVulnerabilities(test1, test2) {
    return test2.vulnerabilities.filter(v2 => 
      !test1.vulnerabilities.some(v1 => v1.type === v2.type && v1.location === v2.location)
    );
  }

  findFixedVulnerabilities(test1, test2) {
    return test1.vulnerabilities.filter(v1 => 
      !test2.vulnerabilities.some(v2 => v2.type === v1.type && v2.location === v1.location)
    );
  }

  findSeverityChanges(test1, test2) {
    const changes = [];
    test1.vulnerabilities.forEach(v1 => {
      const v2 = test2.vulnerabilities.find(v => v.type === v1.type && v.location === v1.location);
      if (v2 && v1.severity !== v2.severity) {
        changes.push({
          type: v1.type,
          location: v1.location,
          oldSeverity: v1.severity,
          newSeverity: v2.severity
        });
      }
    });
    return changes;
  }

  generateComparisonSummary(test1, test2) {
    return {
      totalVulnerabilities1: test1.vulnerabilities.length,
      totalVulnerabilities2: test2.vulnerabilities.length,
      newVulnerabilities: this.findNewVulnerabilities(test1, test2).length,
      fixedVulnerabilities: this.findFixedVulnerabilities(test1, test2).length,
      severityChanges: this.findSeverityChanges(test1, test2).length
    };
  }
}

module.exports = new TestAutomationService(); 