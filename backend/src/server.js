const app = require('./app');
const { connect } = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Connect to database
connect()
  .then(() => {
    logger.info('Connected to database');
    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to database:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
}); 