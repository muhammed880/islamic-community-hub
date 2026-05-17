const { NODE_ENV } = require('../config/environment');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[${new Date().toISOString()}] ${message}`, {
    status,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack
  });

  res.status(status).json({
    success: false,
    message: NODE_ENV === 'development' ? message : 'Something went wrong',
    ...(NODE_ENV === 'development' && { error: err })
  });
};

module.exports = {
  errorHandler
};
