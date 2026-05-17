const express = require('express');
const router = express.Router();
const { verifyToken, isSuperAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getPendingRegistrations,
  getPendingPayments,
  getDonationsHistory,
  updateRegistrationFee
} = require('../controllers/adminController');

/**
 * SUPER ADMIN ROUTES
 * Administrative functions and dashboard
 */

// ==================== SUPER ADMIN ONLY ROUTES ====================

/**
 * GET /api/admin/dashboard/stats
 * Get dashboard statistics
 * Access: Protected (Super Admin Only)
 * Response: { masjids, users, donations, needyPersons stats }
 */
router.get('/dashboard/stats', verifyToken, isSuperAdmin, getDashboardStats);

/**
 * GET /api/admin/registrations/pending
 * Get pending registrations
 * Access: Protected (Super Admin Only)
 * Response: { forms[] }
 */
router.get('/registrations/pending', verifyToken, isSuperAdmin, getPendingRegistrations);

/**
 * GET /api/admin/payments/pending
 * Get pending payment verifications
 * Access: Protected (Super Admin Only)
 * Response: { payments[] }
 */
router.get('/payments/pending', verifyToken, isSuperAdmin, getPendingPayments);

/**
 * GET /api/admin/donations/history
 * Get all donations history
 * Access: Protected (Super Admin Only)
 * Query: { page, limit }
 * Response: { donations[], pagination }
 */
router.get('/donations/history', verifyToken, isSuperAdmin, getDonationsHistory);

/**
 * POST /api/admin/settings/registration-fee
 * Update registration fee amount
 * Access: Protected (Super Admin Only)
 * Body: { amount, currency }
 * Response: { amount, currency }
 */
router.post('/settings/registration-fee', verifyToken, isSuperAdmin, updateRegistrationFee);

module.exports = router;
