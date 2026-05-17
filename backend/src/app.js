const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Routes (we'll create these next)
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const masjidRoutes = require('./routes/masjids');
const jobRoutes = require('./routes/jobs');
const donationRoutes = require('./routes/donations');
const matrimonyRoutes = require('./routes/matrimony');
const adminRoutes = require('./routes/admin');

// Middleware
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// File Upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 50 * 1024 * 1024 },
}));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/masjids', masjidRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/matrimony', matrimonyRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
