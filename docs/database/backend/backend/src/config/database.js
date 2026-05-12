const mongoose = require('mongoose');
const { MONGODB_URI } = require('./environment');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', error.message);
    setTimeout(connectDB, 5000);
  }
};

module.exports = {
  connectDB,
  mongoose
};
