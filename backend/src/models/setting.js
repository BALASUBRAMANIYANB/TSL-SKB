const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  general: {
    language: {
      type: String,
      enum: ['en', 'es', 'fr', 'de', 'zh'],
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY',
    },
    timeFormat: {
      type: String,
      enum: ['12h', '24h'],
      default: '24h',
    },
    autoRefresh: {
      type: Boolean,
      default: true,
    },
    refreshInterval: {
      type: Number,
      default: 30,
      min: 5,
      max: 300,
    },
  },
  notifications: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    scanComplete: {
      type: Boolean,
      default: true,
    },
    vulnerabilityFound: {
      type: Boolean,
      default: true,
    },
    systemUpdates: {
      type: Boolean,
      default: true,
    },
    weeklyReports: {
      type: Boolean,
      default: true,
    },
    notificationSound: {
      type: Boolean,
      default: true,
    },
    desktopNotifications: {
      type: Boolean,
      default: true,
    },
  },
  security: {
    twoFactorAuth: {
      type: Boolean,
      default: false,
    },
    sessionTimeout: {
      type: Number,
      default: 30,
      min: 5,
      max: 120,
    },
    passwordExpiry: {
      type: Number,
      default: 90,
      min: 30,
      max: 365,
    },
    failedLoginAttempts: {
      type: Number,
      default: 5,
      min: 3,
      max: 10,
    },
    ipWhitelist: [{
      type: String,
    }],
    apiKeyRotation: {
      type: Number,
      default: 30,
      min: 7,
      max: 90,
    },
    encryptionLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'high',
    },
  },
  scan: {
    concurrentScans: {
      type: Number,
      default: 3,
      min: 1,
      max: 10,
    },
    scanTimeout: {
      type: Number,
      default: 3600,
      min: 300,
      max: 7200,
    },
    defaultScanType: {
      type: String,
      enum: ['quick', 'full', 'custom'],
      default: 'full',
    },
    autoRetry: {
      type: Boolean,
      default: true,
    },
    maxRetries: {
      type: Number,
      default: 3,
      min: 1,
      max: 5,
    },
    excludePaths: [{
      type: String,
    }],
    includePaths: [{
      type: String,
    }],
    customHeaders: {
      type: Map,
      of: String,
      default: {},
    },
  },
  storage: {
    maxStorage: {
      type: Number,
      default: 10000,
      min: 1000,
      max: 100000,
    },
    retentionPeriod: {
      type: Number,
      default: 90,
      min: 30,
      max: 365,
    },
    autoCleanup: {
      type: Boolean,
      default: true,
    },
    backupEnabled: {
      type: Boolean,
      default: true,
    },
    backupFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },
    backupTime: {
      type: String,
      default: '00:00',
    },
    compressionEnabled: {
      type: Boolean,
      default: true,
    },
  },
  api: {
    rateLimit: {
      type: Number,
      default: 100,
      min: 10,
      max: 1000,
    },
    timeout: {
      type: Number,
      default: 30,
      min: 5,
      max: 300,
    },
    corsEnabled: {
      type: Boolean,
      default: true,
    },
    allowedOrigins: [{
      type: String,
    }],
    apiVersion: {
      type: String,
      default: 'v1',
    },
    documentationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
settingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Setting', settingSchema); 