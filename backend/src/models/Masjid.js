const express = require('express');
const router = express.Router();
const { verifyToken, isMasjidAuthority, isSuperAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  listMasjids,
  getMasjidDetails,
  getMasjidDashboard,
  updateMasjid,
  submitRenewal
} = require('../controllers/masjidController');

/**
 * MASJID MANAGEMENT ROUTES
 * Routes for viewing and managing approved masjids
 */

// ==================== PUBLIC ROUTES ====================

/**
 * GET /api/masjids
 * List all approved masjids
 * Access: Public
 * Query: { page, limit, city, state, search, sort }
 * Response: { masjids[], pagination }
 */
router.get('/', listMasjids);

/**
 * GET /api/masjids/:masjidId
 * Get specific masjid details
 * Access: Public
 * Response: Masjid object
 */
router.get('/:masjidId', getMasjidDetails);

// ==================== MASJID AUTHORITY ROUTES ====================

/**
 * GET /api/masjids/:masjidId/dashboard
 * Get masjid dashboard data
 * Access: Protected (Masjid Authority)
 * Response: Dashboard statistics
 */
router.get('/:masjidId/dashboard', verifyToken, isMasjidAuthority, getMasjidDashboard);

/**
 * PUT /api/masjids/:masjidId
 * Update masjid information
 * Access: Protected (Masjid Authority)
 * Body: { description, openingHours, facilities, prayerTimes }
 */
router.put('/:masjidId', verifyToken, isMasjidAuthority, updateMasjid);

/**
 * POST /api/masjids/:masjidId/renewal
 * Submit renewal request
 * Access: Protected (Masjid Authority)
 */
router.post('/:masjidId/renewal', verifyToken, isMasjidAuthority, submitRenewal);

module.exports = router;
