const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

/**
 * AUTHENTICATION ROUTES
 * User registration, login, token management
 */

// ==================== PUBLIC ROUTES ====================

/**
 * POST /api/auth/register
 * Register new user
 * Access: Public
 * Body: { email, password, phone, firstName, lastName, gender, role }
 * Response: { userId, email, token, refreshToken }
 */
router.post('/register', validateUserRegistration, register);

/**
 * POST /api/auth/login
 * Login user
 * Access: Public
 * Body: { email, password }
 * Response: { userId, email, role, token, refreshToken }
 */
router.post('/login', validateUserLogin, login);

/**
 * POST /api/auth/refresh
 * Refresh access token
 * Access: Public
 * Body: { refreshToken }
 * Response: { token, expiresIn }
 */
router.post('/refresh', refreshToken);

// ==================== PROTECTED ROUTES ====================

/**
 * POST /api/auth/logout
 * Logout user
 * Access: Protected (Authenticated Users)
 */
router.post('/logout', verifyToken, logout);

module.exports = router;
