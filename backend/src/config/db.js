const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://test:test123@cluster0.mongodb.net/security-scanner?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

module.exports = { connect };