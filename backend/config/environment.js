require('dotenv').config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.warn(`⚠️  Warning: ${envVar} is not defined in .env file`);
  }
});

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic_community_hub',
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  MAX_FILE_SIZE: 5242880,
  ALLOWED_FILE_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
};
