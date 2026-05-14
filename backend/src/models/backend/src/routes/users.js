const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getProfile, updateProfile, uploadProfilePicture } = require('../controllers/userController');

/**
 * USER PROFILE ROUTES
 * User profile management
 */

// ==================== PROTECTED ROUTES ====================

/**
 * GET /api/users/profile
 * Get current user profile
 * Access: Protected (Authenticated Users)
 * Response: User profile object
 */
router.get('/profile', verifyToken, getProfile);

/**
 * PUT /api/users/profile
 * Update user profile
 * Access: Protected (Authenticated Users)
 * Body: { firstName, lastName, phone, dateOfBirth, address }
 * Response: Updated user object
 */
router.put('/profile', verifyToken, updateProfile);

/**
 * POST /api/users/profile/picture
 * Upload profile picture
 * Access: Protected (Authenticated Users)
 * Files: profilePicture (JPG, PNG, WebP max 5MB)
 * Response: { profilePicture: url }
 */
router.post('/profile/picture', verifyToken, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;
