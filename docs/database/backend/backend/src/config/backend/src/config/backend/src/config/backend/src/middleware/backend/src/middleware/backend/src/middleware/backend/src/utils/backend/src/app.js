const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const masjidRoutes = require('./routes/masjids');
const masjidRegistrationRoutes = require('./routes/masjidRegistration');
const nikahRegistrationRoutes = require('./routes/nikahRegistration');
const jobRoutes = require('./routes/jobs');
const donationRoutes = require('./routes/donations');
const matrimonyRoutes = require('./routes/matrimony');
const adminRoutes = require('./routes/admin');

// Middleware
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// File Upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 },
  abortOnLimit: true,
  responseOnLimit: 'File size exceeds the maximum allowed size (50MB)'
}));

// Request logging middleware
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Version Endpoint
app.get('/api/version', (req, res) => {
  res.json({
    success: true,
    version: '1.0.0',
    platform: 'Islamic Community Hub',
    paymentSystem: 'UPI Direct (No Payment Gateway)',
    lastUpdated: '2026-05-14'
  });
});

// ==================== MAIN API ROUTES ====================

// Authentication Routes
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Masjid Routes
app.use('/api/masjids', masjidRoutes);

// Masjid Registration Form Routes
app.use('/api/masjid-registration', masjidRegistrationRoutes);

// Nikah Registration Form Routes
app.use('/api/nikah-registration', nikahRegistrationRoutes);

// Job Routes
app.use('/api/jobs', jobRoutes);

// Donation Routes (UPI)
app.use('/api/donations', donationRoutes);

// Matrimony Routes
app.use('/api/matrimony', matrimonyRoutes);

// Admin Routes (Super Admin)
app.use('/api/admin', adminRoutes);

// ==================== ERROR HANDLING ====================

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// ==================== GRACEFUL SHUTDOWN ====================

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
