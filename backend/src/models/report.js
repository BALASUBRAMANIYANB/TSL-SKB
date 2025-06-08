const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  scan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scan',
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Target',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a report name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['executive', 'technical', 'detailed', 'custom'],
    default: 'technical'
  },
  format: {
    type: String,
    enum: ['pdf', 'html', 'json', 'xml'],
    default: 'pdf'
  },
  content: {
    summary: {
      totalVulnerabilities: Number,
      criticalCount: Number,
      highCount: Number,
      mediumCount: Number,
      lowCount: Number,
      scanDuration: Number,
      scanDate: Date
    },
    vulnerabilities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vulnerability'
    }],
    recommendations: [{
      severity: String,
      description: String,
      steps: [String]
    }],
    customSections: [{
      title: String,
      content: String
    }]
  },
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  filePath: {
    type: String
  },
  downloadUrl: {
    type: String
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
ReportSchema.index({ scan: 1 });
ReportSchema.index({ target: 1 });
ReportSchema.index({ generatedBy: 1 });
ReportSchema.index({ createdAt: -1 });

// Update the updatedAt timestamp before saving
ReportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Report', ReportSchema); 