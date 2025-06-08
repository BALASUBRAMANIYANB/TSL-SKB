const mongoose = require('mongoose');

const scanTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  tools: [{
    type: String,
    enum: ['zap', 'nmap', 'nikto'],
    required: true
  }],
  toolConfig: {
    zap: {
      level: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      excludePaths: [String],
      excludeParams: [String]
    },
    nmap: {
      scanType: {
        type: String,
        enum: ['default', 'quick', 'comprehensive'],
        default: 'default'
      },
      ports: String,
      timing: {
        type: String,
        enum: ['slow', 'normal', 'fast'],
        default: 'normal'
      }
    },
    nikto: {
      plugins: {
        type: String,
        enum: ['all', 'default', 'none'],
        default: 'default'
      },
      ssl: {
        type: Boolean,
        default: false
      },
      timeout: {
        type: Number,
        default: 30
      }
    }
  },
  schedule: {
    type: {
      type: String,
      enum: ['once', 'daily', 'weekly', 'monthly'],
      default: 'once'
    },
    time: String,
    days: [Number], // For weekly/monthly schedules
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ScanTemplate', scanTemplateSchema); 