const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  event: {
    type: String,
    enum: ['scan_completed', 'vulnerability_found'],
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

webhookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Webhook', webhookSchema); 