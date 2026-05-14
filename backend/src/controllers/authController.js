const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config/environment');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');
const { isValidEmail } = require('../utils/validators');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

// REGISTER USER
exports.register = async (req, res) => {
  try {
    const { email, password, phone, firstName, lastName, gender, role } = req.body;

    // Validate required fields
    if (!email || !password || !phone || !firstName || !lastName || !gender) {
      return res.status(400).json(formatErrorResponse('All fields are required', [
        { field: 'email', message: email ? '' : 'Email is required' },
        { field: 'password', message: password ? '' : 'Password is required' },
        { field: 'phone', message: phone ? '' : 'Phone is required' },
        { field: 'firstName', message: firstName ? '' : 'First name is required' },
        { field: 'lastName', message: lastName ? '' : 'Last name is required' },
        { field: 'gender', message: gender ? '' : 'Gender is required' }
      ].filter(e => e.message)));
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json(formatErrorResponse('Invalid email format'));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json(formatErrorResponse('Email or phone already registered'));
    }

    // Create new user
    const newUser = new User({
      email: email.toLowerCase(),
      password,
      phone,
      firstName,
      lastName,
      gender,
      role: role || 'general_user'
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.role);
    const refreshToken = jwt.sign(
      { userId: newUser._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    logger.info(`User registered: ${email}`);

    res.status(201).json(
      formatSuccessResponse('Registration successful', {
        userId: newUser._id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        role: newUser.role,
        token,
        refreshToken,
        expiresIn: JWT_EXPIRY
      })
    );
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json(formatErrorResponse('Registration failed', [{ message: error.message }]));
  }
};

// LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json(formatErrorResponse('Email and password are required'));
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json(formatErrorResponse('Invalid email or password'));
    }

    // Check password
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json(formatErrorResponse('Invalid email or password'));
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json(formatErrorResponse('Your account has been deactivated'));
    }

    // Generate tokens
    const token = generateToken(user._id, user.role);
    const refreshToken = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    logger.info(`User logged in: ${email}`);

    res.json(
      formatSuccessResponse('Login successful', {
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        token,
        refreshToken,
        expiresIn: JWT_EXPIRY
      })
    );
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json(formatErrorResponse('Login failed', [{ message: error.message }]));
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(formatErrorResponse('Refresh token is required'));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Generate new token
    const newToken = generateToken(decoded.userId, decoded.role);

    res.json(
      formatSuccessResponse('Token refreshed', {
        token: newToken,
        expiresIn: JWT_EXPIRY
      })
    );
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json(formatErrorResponse('Invalid or expired refresh token'));
  }
};

// LOGOUT USER
exports.logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist tokens
    // For now, we just send success response

    res.json(formatSuccessResponse('Logged out successfully'));
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json(formatErrorResponse('Logout failed'));
  }
};
