const Setting = require('../../models/setting');
const nodemailer = require('nodemailer');
const axios = require('axios');

class NotificationService {
  static async getNotificationSettings(userId) {
    const settings = await Setting.findOne({ userId });
    return settings?.scan?.notifications || {
      email: { enabled: false, recipients: [] },
      webhook: { enabled: false, url: '', events: [] }
    };
  }

  static async updateNotificationSettings(userId, updates) {
    const settings = await Setting.findOne({ userId });
    if (!settings) {
      throw new Error('Settings not found');
    }

    settings.scan.notifications = {
      ...settings.scan.notifications,
      ...updates
    };

    await settings.save();
    return settings.scan.notifications;
  }

  static async sendEmailNotification(userId, subject, content) {
    const settings = await Setting.findOne({ userId });
    if (!settings?.scan?.notifications?.email?.enabled) {
      return;
    }

    const { email: emailSettings } = settings.scan.notifications;
    if (!emailSettings.recipients?.length) {
      return;
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: emailSettings.recipients.join(', '),
        subject,
        html: content
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw new Error('Failed to send email notification');
    }
  }

  static async sendWebhookNotification(userId, event, data) {
    const settings = await Setting.findOne({ userId });
    if (!settings?.scan?.notifications?.webhook?.enabled) {
      return;
    }

    const { webhook: webhookSettings } = settings.scan.notifications;
    if (!webhookSettings.url || !webhookSettings.events.includes(event)) {
      return;
    }

    try {
      await axios.post(webhookSettings.url, {
        event,
        timestamp: new Date().toISOString(),
        data
      });
    } catch (error) {
      console.error('Error sending webhook notification:', error);
      throw new Error('Failed to send webhook notification');
    }
  }

  static async notifyScanStarted(userId, scanData) {
    const settings = await Setting.findOne({ userId });
    if (!settings?.scan?.notifications) {
      return;
    }

    const { email, webhook } = settings.scan.notifications;

    if (email.enabled && email.events.includes('scan_started')) {
      await this.sendEmailNotification(
        userId,
        'Scan Started',
        `
        <h2>Security Scan Started</h2>
        <p>A new security scan has been initiated with the following details:</p>
        <ul>
          <li>Target: ${scanData.target}</li>
          <li>Scan Type: ${scanData.type}</li>
          <li>Started At: ${new Date().toLocaleString()}</li>
        </ul>
        `
      );
    }

    if (webhook.enabled && webhook.events.includes('scan_started')) {
      await this.sendWebhookNotification(userId, 'scan_started', scanData);
    }
  }

  static async notifyScanCompleted(userId, scanData, results) {
    const settings = await Setting.findOne({ userId });
    if (!settings?.scan?.notifications) {
      return;
    }

    const { email, webhook } = settings.scan.notifications;

    if (email.enabled && email.events.includes('scan_completed')) {
      const vulnerabilities = results.vulnerabilities || [];
      const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
      const highCount = vulnerabilities.filter(v => v.severity === 'high').length;

      await this.sendEmailNotification(
        userId,
        'Scan Completed',
        `
        <h2>Security Scan Completed</h2>
        <p>The security scan has completed with the following results:</p>
        <ul>
          <li>Target: ${scanData.target}</li>
          <li>Scan Type: ${scanData.type}</li>
          <li>Completed At: ${new Date().toLocaleString()}</li>
          <li>Critical Vulnerabilities: ${criticalCount}</li>
          <li>High Vulnerabilities: ${highCount}</li>
          <li>Total Vulnerabilities: ${vulnerabilities.length}</li>
        </ul>
        <p>Please review the scan results in the dashboard for more details.</p>
        `
      );
    }

    if (webhook.enabled && webhook.events.includes('scan_completed')) {
      await this.sendWebhookNotification(userId, 'scan_completed', {
        ...scanData,
        results
      });
    }
  }

  static async notifyScanError(userId, scanData, error) {
    const settings = await Setting.findOne({ userId });
    if (!settings?.scan?.notifications) {
      return;
    }

    const { email, webhook } = settings.scan.notifications;

    if (email.enabled && email.events.includes('scan_error')) {
      await this.sendEmailNotification(
        userId,
        'Scan Error',
        `
        <h2>Security Scan Error</h2>
        <p>An error occurred during the security scan:</p>
        <ul>
          <li>Target: ${scanData.target}</li>
          <li>Scan Type: ${scanData.type}</li>
          <li>Error Time: ${new Date().toLocaleString()}</li>
          <li>Error Message: ${error.message}</li>
        </ul>
        `
      );
    }

    if (webhook.enabled && webhook.events.includes('scan_error')) {
      await this.sendWebhookNotification(userId, 'scan_error', {
        ...scanData,
        error: error.message
      });
    }
  }
}

module.exports = NotificationService; 