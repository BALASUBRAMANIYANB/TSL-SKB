const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/vulnerability-scanner',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  WAZUH_HOST: process.env.WAZUH_HOST || 'localhost',
  WAZUH_PORT: process.env.WAZUH_PORT || '55000',
  WAZUH_USER: process.env.WAZUH_USER || 'wazuh',
  WAZUH_PASSWORD: process.env.WAZUH_PASSWORD || 'wazuh',
}; 