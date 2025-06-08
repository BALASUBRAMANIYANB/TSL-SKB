const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Target',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a scan name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  scanType: {
    type: String,
    enum: ['full', 'quick', 'custom', 'retest'],
    default: 'full'
  },
  tools: [{
    type: String,
    enum: ['zap', 'nmap', 'nikto', 'burp'],
    required: true
  }],
  toolConfig: {
    zap: {
      type: Object,
      default: {
        level: 'medium',
        excludePaths: [],
        excludeParams: []
      }
    },
    nmap: {
      type: Object,
      default: {
        scanType: 'syn',
        ports: '1-1000',
        timing: 'normal'
      }
    },
    nikto: {
      type: Object,
      default: {
        plugins: 'all',
        format: 'json'
      }
    },
    burp: {
      type: Object,
      default: {
        scope: 'all',
        excludePaths: []
      }
    }
  },
  scheduledAt: {
    type: Date
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  duration: {
    type: Number // in seconds
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recurring: {
    type: Boolean,
    default: false
  },
  recurringConfig: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly']
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31
    },
    time: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please add a valid time (HH:MM)']
    }
  },
  lastRun: {
    type: Date
  },
  nextRun: {
    type: Date
  },
  customRules: [{
    name: String,
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    pattern: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
ScanSchema.index({ target: 1, status: 1 });
ScanSchema.index({ createdBy: 1, status: 1 });
ScanSchema.index({ scheduledAt: 1, status: 1 });

module.exports = mongoose.model('Scan', ScanSchema); 