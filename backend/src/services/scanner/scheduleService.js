const Setting = require('../../models/setting');
const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');

class ScheduleService {
  static schedules = new Map();

  static async getSchedules(userId) {
    const settings = await Setting.findOne({ userId });
    return settings?.scan?.scheduling?.schedules || [];
  }

  static async addSchedule(userId, schedule) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    // Generate a unique ID for the schedule
    schedule.id = uuidv4();
    schedule.enabled = true;

    // Add to settings
    if (!settings.scan.scheduling.schedules) {
      settings.scan.scheduling.schedules = [];
    }
    settings.scan.scheduling.schedules.push(schedule);
    await settings.save();

    // Start the schedule if enabled
    if (schedule.enabled) {
      this.startSchedule(userId, schedule);
    }

    return schedule;
  }

  static async updateSchedule(userId, scheduleId, updates) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const scheduleIndex = settings.scan.scheduling.schedules.findIndex(s => s.id === scheduleId);
    if (scheduleIndex === -1) {
      throw new Error('Schedule not found');
    }

    // Stop existing schedule if it's running
    this.stopSchedule(userId, scheduleId);

    // Update schedule
    settings.scan.scheduling.schedules[scheduleIndex] = {
      ...settings.scan.scheduling.schedules[scheduleIndex],
      ...updates,
    };

    await settings.save();

    // Start the schedule if enabled
    if (settings.scan.scheduling.schedules[scheduleIndex].enabled) {
      this.startSchedule(userId, settings.scan.scheduling.schedules[scheduleIndex]);
    }

    return settings.scan.scheduling.schedules[scheduleIndex];
  }

  static async deleteSchedule(userId, scheduleId) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    const scheduleIndex = settings.scan.scheduling.schedules.findIndex(s => s.id === scheduleId);
    if (scheduleIndex === -1) {
      throw new Error('Schedule not found');
    }

    // Stop the schedule if it's running
    this.stopSchedule(userId, scheduleId);

    // Remove from settings
    settings.scan.scheduling.schedules.splice(scheduleIndex, 1);
    await settings.save();
  }

  static startSchedule(userId, schedule) {
    const scheduleKey = `${userId}-${schedule.id}`;
    
    // Stop existing schedule if it exists
    this.stopSchedule(userId, schedule.id);

    // Create cron expression based on frequency
    let cronExpression;
    switch (schedule.frequency) {
      case 'once':
        // For one-time schedules, we'll use a specific date/time
        const date = new Date(schedule.startDate);
        cronExpression = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} *`;
        break;
      case 'daily':
        const [hours, minutes] = schedule.time.split(':');
        cronExpression = `${minutes} ${hours} * * *`;
        break;
      case 'weekly':
        const [weekHours, weekMinutes] = schedule.time.split(':');
        const days = schedule.days.join(',');
        cronExpression = `${weekMinutes} ${weekHours} * * ${days}`;
        break;
      case 'monthly':
        const [monthHours, monthMinutes] = schedule.time.split(':');
        cronExpression = `${monthMinutes} ${monthHours} ${schedule.dayOfMonth} * *`;
        break;
      default:
        throw new Error('Invalid frequency');
    }

    // Schedule the task
    const task = cron.schedule(cronExpression, async () => {
      try {
        // Check if schedule is still enabled
        const settings = await Setting.findOne({ userId });
        const currentSchedule = settings?.scan?.scheduling?.schedules?.find(s => s.id === schedule.id);
        
        if (!currentSchedule || !currentSchedule.enabled) {
          this.stopSchedule(userId, schedule.id);
          return;
        }

        // Check if we're within the start/end date range
        const now = new Date();
        if (currentSchedule.startDate && new Date(currentSchedule.startDate) > now) {
          return;
        }
        if (currentSchedule.endDate && new Date(currentSchedule.endDate) < now) {
          this.stopSchedule(userId, schedule.id);
          return;
        }

        // Execute the scan
        // TODO: Implement scan execution
        console.log(`Executing scheduled scan for user ${userId}, schedule ${schedule.id}`);
      } catch (error) {
        console.error('Error executing scheduled scan:', error);
      }
    });

    // Store the task
    this.schedules.set(scheduleKey, task);
  }

  static stopSchedule(userId, scheduleId) {
    const scheduleKey = `${userId}-${scheduleId}`;
    const task = this.schedules.get(scheduleKey);
    
    if (task) {
      task.stop();
      this.schedules.delete(scheduleKey);
    }
  }

  static async initializeSchedules() {
    try {
      const settings = await Setting.find({ 'scan.scheduling.schedules': { $exists: true } });
      
      for (const setting of settings) {
        const schedules = setting.scan.scheduling.schedules;
        for (const schedule of schedules) {
          if (schedule.enabled) {
            this.startSchedule(setting.userId, schedule);
          }
        }
      }
    } catch (error) {
      console.error('Error initializing schedules:', error);
    }
  }
}

module.exports = ScheduleService; 