const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

// Import routes
const scanRoutes = require('./api/routes/scans');
const targetRoutes = require('./api/routes/targets');
const userRoutes = require('./api/routes/users');
const reportRoutes = require('./api/routes/reports');
const authRoutes = require('./api/routes/auth');
const scanRoutes = require('./api/routes/scan');
const settingsRoutes = require('./api/routes/settings');

// Create Express app
const app = express();

// Swagger documentation options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vulnerability Scanner API',
      version: '1.0.0',
      description: 'API for scanning web applications and networks for security vulnerabilities',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/scans', scanRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/settings', settingsRoutes);

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app; 