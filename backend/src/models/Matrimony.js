const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  browseProfiles,
  getProfileDetails,
  createProfile,
  expressInterest,
  getReceivedInterests,
  respondToInterest
} = require('../controllers/matrimonyController');

/**
 * MATRIMONY ROUTES
 * Matrimonial profiles and matchmaking
 */

// ==================== PUBLIC ROUTES ====================

/**
 * GET /api/matrimony
 * Browse matrimony profiles
 * Access: Public
 * Query: { page, limit, gender, ageMin, ageMax, education, city }
 * Response: { profiles[], pagination }
 */
router.get('/', browseProfiles);

/**
 * GET /api/matrimony/:profileId
 * Get matrimony profile details
 * Access: Public
 * Response: Full profile object
 */
router.get('/:profileId', getProfileDetails);

// ==================== PROTECTED ROUTES ====================

/**
 * POST /api/matrimony
 * Create matrimony profile
 * Access: Protected (Authenticated Users)
 * Files: profilePhoto (JPG/PNG max 5MB)
 * Body: { fullName, dateOfBirth, gender, height, education, occupation, income, hobbies, languages, lookingFor, bio }
 * Response: { profileId, status }
 */
router.post('/', verifyToken, upload.single('profilePhoto'), createProfile);

/**
 * POST /api/matrimony/:profileId/interest
 * Express interest in profile
 * Access: Protected (Authenticated Users)
 * Body: { message }
 * Response: { status }
 */
router.post('/:profileId/interest', verifyToken, expressInterest);

/**
 * GET /api/matrimony/interests/received
 * Get interests received
 * Access: Protected (Authenticated Users)
 * Response: { interests[] }
 */
router.get('/interests/received', verifyToken, getReceivedInterests);

/**
 * PUT /api/matrimony/interests/:interestId
 * Accept/Reject interest
 * Access: Protected (Authenticated Users)
 * Body: { status: 'accepted' | 'rejected' }
 * Response: { status }
 */
router.put('/interests/:interestId', verifyToken, respondToInterest);

module.exports = router;
