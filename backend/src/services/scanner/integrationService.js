const ProfileService = require('./profileService');
const ScriptService = require('./scriptService');
const ScheduleService = require('./scheduleService');
const NotificationService = require('./notificationService');
const ScannerService = require('./scannerService');
const logger = require('../../utils/logger');

class IntegrationService {
  static async initializeUserSettings(userId) {
    try {
      // Initialize default profile
      const defaultProfile = {
        name: 'Default',
        description: 'Default scanning profile',
        settings: {
          scanType: 'full',
          timeout: 300,
          threads: 4,
          depth: 3,
          advanced: {
            followRedirects: true,
            verifySSL: true,
            rateLimit: 100,
            proxy: null,
            auth: null
          }
        },
        isDefault: true
      };

      await ProfileService.addProfile(userId, defaultProfile);

      // Initialize default notification settings
      const defaultNotifications = {
        email: {
          enabled: false,
          recipients: [],
          events: ['scan_completed', 'scan_error']
        },
        webhook: {
          enabled: false,
          url: '',
          events: ['scan_completed', 'scan_error']
        }
      };

      await NotificationService.updateNotificationSettings(userId, defaultNotifications);

      // Initialize scheduling
      await ScheduleService.initializeSchedules();

      return {
        success: true,
        message: 'User settings initialized successfully'
      };
    } catch (error) {
      console.error('Error initializing user settings:', error);
      throw new Error('Failed to initialize user settings');
    }
  }

  static async executeScheduledScan(userId, scheduleId) {
    try {
      const schedule = await ScheduleService.getSchedules(userId)
        .then(schedules => schedules.find(s => s.id === scheduleId));

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      // Get the profile
      const profile = await ProfileService.getProfile(userId, schedule.profile);
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Execute custom scripts if any
      const scripts = await ScriptService.getScripts(userId);
      const enabledScripts = scripts.filter(s => s.enabled);
      
      for (const script of enabledScripts) {
        await ScriptService.executeScript(userId, script.name, {
          target: schedule.target,
          profile: profile.settings
        });
      }

      // Execute the scan
      const scanner = new ScannerService();
      const scanResult = await scanner.startScan(userId, schedule.target, {
        ...profile.settings,
        scheduleId
      });

      return scanResult;
    } catch (error) {
      console.error('Error executing scheduled scan:', error);
      throw error;
    }
  }

  static async executeManualScan(userId, target, profile, options = {}) {
    try {
      logger.info(`Starting manual scan for user ${userId} on target ${target} with profile ${profile}`);
      
      // TODO: Implement actual scanning logic here
      // For now, return a mock result
      return {
        scanId: Date.now().toString(),
        status: 'completed',
        target,
        profile,
        timestamp: new Date(),
        results: {
          vulnerabilities: [],
          summary: {
            totalIssues: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
          }
        }
      };
    } catch (error) {
      logger.error(`Error executing manual scan: ${error.message}`);
      throw error;
    }
  }

  static async cleanupUserData(userId) {
    try {
      // Delete all profiles
      const profiles = await ProfileService.getProfiles(userId);
      for (const profile of profiles) {
        await ProfileService.deleteProfile(userId, profile.name);
      }

      // Delete all scripts
      const scripts = await ScriptService.getScripts(userId);
      for (const script of scripts) {
        await ScriptService.deleteScript(userId, script.name);
      }

      // Delete all schedules
      const schedules = await ScheduleService.getSchedules(userId);
      for (const schedule of schedules) {
        await ScheduleService.deleteSchedule(userId, schedule.id);
      }

      // Reset notification settings
      await NotificationService.updateNotificationSettings(userId, {
        email: { enabled: false, recipients: [], events: [] },
        webhook: { enabled: false, url: '', events: [] }
      });

      return {
        success: true,
        message: 'User data cleaned up successfully'
      };
    } catch (error) {
      console.error('Error cleaning up user data:', error);
      throw new Error('Failed to clean up user data');
    }
  }
}

module.exports = IntegrationService; 