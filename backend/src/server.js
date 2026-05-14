const app = require('./app');
const mongoose = require('mongoose');
const { swaggerUi, specs } = require('../swagger');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic_community_hub';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    logger.info('MongoDB connected successfully');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Swagger Documentation
if (process.env.API_DOCS_ENABLED !== 'false') {
  app.use('/api/docs', swaggerUi.serve);
  app.use('/api/docs', swaggerUi.setup(specs, {
    swaggerOptions: {
      url: '/api/docs.json',
      urls: [
        {
          url: 'http://localhost:5000/api/docs.json',
          name: 'Development'
        },
        {
          url: 'https://api.islamichub.com/api/docs.json',
          name: 'Production'
        }
      ]
    }
  }));

  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  logger.info('Swagger docs available at /api/docs');
}

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`API Documentation: http://localhost:${PORT}/api/docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = server;
