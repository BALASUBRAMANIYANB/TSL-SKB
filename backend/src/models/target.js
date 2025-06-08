const mongoose = require('mongoose');

const TargetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  url: {
    type: String,
    required: [true, 'Please add a URL'],
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please add a valid URL'
    ]
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  authMethod: {
    type: String,
    enum: ['none', 'basic', 'bearer', 'session'],
    default: 'none'
  },
  authConfig: {
    username: String,
    password: String,
    token: String,
    sessionCookie: String
  },
  excludedPaths: [{
    type: String,
    match: [/^\/.*$/, 'Please add a valid path pattern']
  }],
  excludedParams: [{
    type: String
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  lastScan: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
TargetSchema.index({ url: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model('Target', TargetSchema); 