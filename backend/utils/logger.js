const { NODE_ENV } = require('../config/environment');

const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  
  error: (message, data = {}) => {
    console.error(`[ERROR] ${message}`, data);
  },
  
  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },
  
  debug: (message, data = {}) => {
    if (NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  }
};

module.exports = logger;
