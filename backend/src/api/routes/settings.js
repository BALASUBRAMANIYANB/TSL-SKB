const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const Setting = require('../../models/setting');
const { getWazuhInstance } = require('../../services/wazuhService');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Admin
router.get('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const settings = await Setting.findOne({ user: req.user._id });
    if (!settings) {
      // Return default settings if none exist
      return res.json({
        general: {
          language: 'en',
          theme: 'light',
          timezone: 'UTC',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: '24h',
          autoRefresh: true,
          refreshInterval: 30,
        },
        notifications: {
          emailNotifications: true,
          emailAddress: req.user.email,
          scanComplete: true,
          vulnerabilityFound: true,
          systemUpdates: true,
          weeklyReports: true,
          notificationSound: true,
          desktopNotifications: true,
        },
        security: {
          twoFactorAuth: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
          failedLoginAttempts: 5,
          ipWhitelist: [],
          apiKeyRotation: 30,
          encryptionLevel: 'high',
        },
        scan: {
          concurrentScans: 3,
          scanTimeout: 3600,
          defaultScanType: 'full',
          autoRetry: true,
          maxRetries: 3,
          excludePaths: [],
          includePaths: [],
          customHeaders: {},
        },
        storage: {
          maxStorage: 10000,
          retentionPeriod: 90,
          autoCleanup: true,
          backupEnabled: true,
          backupFrequency: 'daily',
          backupTime: '00:00',
          compressionEnabled: true,
        },
        api: {
          rateLimit: 100,
          timeout: 30,
          corsEnabled: true,
          allowedOrigins: [],
          apiVersion: 'v1',
          documentationEnabled: true,
        },
      });
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// @desc    Update settings
// @route   POST /api/settings
// @access  Admin
router.post('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const {
      general,
      notifications,
      security,
      scan,
      storage,
      api,
    } = req.body;

    // Validate settings
    if (!general || !notifications || !security || !scan || !storage || !api) {
      return res.status(400).json({ message: 'Invalid settings format' });
    }

    // Update or create settings
    const settings = await Setting.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        general,
        notifications,
        security,
        scan,
        storage,
        api,
        updatedAt: Date.now(),
      },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

// @desc    Reset settings to default
// @route   POST /api/settings/reset
// @access  Admin
router.post('/reset', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    await Setting.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Settings reset to default' });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Error resetting settings' });
  }
});

// Get Wazuh settings
router.get('/wazuh', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const wazuhApiUrl = await Setting.findOne({ key: 'wazuhApiUrl' });
    const wazuhApiKey = await Setting.findOne({ key: 'wazuhApiKey' });
    res.json({
      wazuhApiUrl: wazuhApiUrl ? wazuhApiUrl.value : '',
      wazuhApiKey: wazuhApiKey ? wazuhApiKey.value : '',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Wazuh settings.' });
  }
});

// Save Wazuh settings
router.post('/wazuh', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { wazuhApiUrl, wazuhApiKey } = req.body;
    await Setting.findOneAndUpdate({ key: 'wazuhApiUrl' }, { value: wazuhApiUrl }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'wazuhApiKey' }, { value: wazuhApiKey }, { upsert: true });
    res.status(200).json({ message: 'Wazuh settings saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving Wazuh settings.' });
  }
});

// Test Wazuh connection
router.post('/wazuh/test', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const wazuh = await getWazuhInstance();
    const info = await wazuh.get('/manager/info');
    if (info.data && !info.data.error) {
      res.status(200).json({ success: true, message: `Successfully connected to Wazuh v${info.data.data.wazuh_version}` });
    } else {
      throw new Error('Connection test failed.');
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to connect to Wazuh API.' });
  }
});

// --- Jira Integration Settings ---
// Get Jira settings
router.get('/jira', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const url = await Setting.findOne({ key: 'jiraUrl' });
    const email = await Setting.findOne({ key: 'jiraEmail' });
    const apiToken = await Setting.findOne({ key: 'jiraApiToken' });
    const projectKey = await Setting.findOne({ key: 'jiraProjectKey' });
    res.json({
      jiraUrl: url ? url.value : '',
      jiraEmail: email ? email.value : '',
      jiraApiToken: apiToken ? apiToken.value : '',
      jiraProjectKey: projectKey ? projectKey.value : '',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Jira settings.' });
  }
});
// Save Jira settings
router.post('/jira', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { jiraUrl, jiraEmail, jiraApiToken, jiraProjectKey } = req.body;
    await Setting.findOneAndUpdate({ key: 'jiraUrl' }, { value: jiraUrl }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'jiraEmail' }, { value: jiraEmail }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'jiraApiToken' }, { value: jiraApiToken }, { upsert: true });
    await Setting.findOneAndUpdate({ key: 'jiraProjectKey' }, { value: jiraProjectKey }, { upsert: true });
    res.status(200).json({ message: 'Jira settings saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving Jira settings.' });
  }
});
// Test Jira integration
router.post('/jira/test', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { jiraUrl, jiraEmail, jiraApiToken, jiraProjectKey } = req.body;
    // Try to fetch Jira project info as a test
    const response = await fetch(`${jiraUrl}/rest/api/3/project/${jiraProjectKey}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64'),
        'Accept': 'application/json',
      },
    });
    if (response.ok) {
      res.status(200).json({ success: true, message: 'Successfully connected to Jira.' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to connect to Jira.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error testing Jira integration.' });
  }
});

// --- Slack Integration Settings ---
// Get Slack settings
router.get('/slack', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const webhook = await Setting.findOne({ key: 'slackWebhookUrl' });
    res.json({ slackWebhookUrl: webhook ? webhook.value : '' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Slack settings.' });
  }
});
// Save Slack settings
router.post('/slack', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { slackWebhookUrl } = req.body;
    await Setting.findOneAndUpdate({ key: 'slackWebhookUrl' }, { value: slackWebhookUrl }, { upsert: true });
    res.status(200).json({ message: 'Slack settings saved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving Slack settings.' });
  }
});
// Test Slack integration
router.post('/slack/test', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const { slackWebhookUrl } = req.body;
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Test message from Security Scanner integration.' })
    });
    if (response.ok) {
      res.status(200).json({ success: true, message: 'Successfully sent test message to Slack.' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to send test message to Slack.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error testing Slack integration.' });
  }
});

module.exports = router; 