const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const Setting = require('../../models/setting');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
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
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
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
// @access  Private
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    await Setting.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Settings reset to default' });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({ message: 'Error resetting settings' });
  }
});

module.exports = router; 