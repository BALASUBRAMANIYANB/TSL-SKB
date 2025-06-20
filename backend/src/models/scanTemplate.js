const mongoose = require('mongoose');
const cron = require('node-cron');

const scanTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required.'],
    trim: true,
    maxlength: [100, 'Template name cannot be more than 100 characters.']
  },
  description: {
    type: String,
    trim: true
  },
  scanType: {
    type: String,
    required: [true, 'Scan type is required.'],
    enum: ['nmap', 'nikto', 'wazuh']
  },
  wazuhModule: {
    type: String,
    required: function() { return this.scanType === 'wazuh'; }
  },
  wazuhParams: {
    type: Object,
    default: {}
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
    type: String,
    trim: true,
    default: null,
    validate: {
      validator: function(v) {
        return v === null || cron.validate(v);
      },
      message: props => `${props.value} is not a valid cron expression.`
    }
  },
  isScheduled: {
    type: Boolean,
    default: false
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
  },
  // --- Authenticated scan support ---
  auth: {
    type: {
      type: String,
      enum: ['none', 'basic', 'cookie', 'bearer', 'custom'],
      default: 'none'
    },
    username: String,
    password: String,
    cookie: String,
    token: String,
    customHeaders: {
      type: Object,
      default: {}
    }
  }
});

// Ensures that isScheduled is true only if a schedule is set
scanTemplateSchema.pre('save', function(next) {
  if (this.schedule) {
    this.isScheduled = true;
  } else {
    this.isScheduled = false;
  }
  next();
});

module.exports = mongoose.model('ScanTemplate', scanTemplateSchema);
