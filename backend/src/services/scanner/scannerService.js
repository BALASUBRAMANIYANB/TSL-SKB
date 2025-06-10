const NotificationService = require('./notificationService');

class ScannerService {
  async startScan(userId, target, options = {}) {
    try {
      // Notify scan started
      await NotificationService.notifyScanStarted(userId, {
        target,
        type: options.type || 'full',
        options
      });

      // Start the scan
      const scanResult = await this.executeScan(target, options);

      // Notify scan completed
      await NotificationService.notifyScanCompleted(userId, {
        target,
        type: options.type || 'full',
        options
      }, scanResult);

      return scanResult;
    } catch (error) {
      // Notify scan error
      await NotificationService.notifyScanError(userId, {
        target,
        type: options.type || 'full',
        options
      }, error);

      throw error;
    }
  }
} 