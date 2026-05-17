const express = require('express');
const router = express.Router();
const { verifyToken, isMasjidAuthority } = require('../middleware/auth');
const {
  getUpiDetails,
  recordDonation,
  getDonationHistory,
  verifyDonation,
  requestRefund
} = require('../controllers/donationController');

/**
 * DONATIONS ROUTES (UPI ONLY)
 * All donation-related endpoints
 */

// ==================== PUBLIC ROUTES ====================

/**
 * GET /api/donations/upi/:masjidId
 * Get UPI details for masjid donations
 * Access: Public
 * Response: { upiId, displayName, upiPaymentLink, qrCode }
 */
router.get('/upi/:masjidId', getUpiDetails);

// ==================== PROTECTED ROUTES ====================

/**
 * POST /api/donations/record
 * Record donation with UPI payment proof
 * Access: Protected (Authenticated Users)
 * Body: { amount, donationType, masjidId, upiTransactionId, recipientUpiId, paymentProofScreenshot }
 * Response: { donationId, status, receiptNumber }
 */
router.post('/record', verifyToken, recordDonation);

/**
 * GET /api/donations
 * Get donation history
 * Access: Protected (Authenticated Users)
 * Query: { page, limit, status, donationType }
 * Response: { donations[], pagination }
 */
router.get('/', verifyToken, getDonationHistory);

/**
 * POST /api/donations/:donationId/refund-request
 * Request donation refund
 * Access: Protected (Donor)
 * Body: { reason, description }
 */
router.post('/:donationId/refund-request', verifyToken, requestRefund);

// ==================== MASJID AUTHORITY ROUTES ====================

/**
 * PUT /api/donations/:donationId/verify
 * Verify donation payment
 * Access: Protected (Masjid Authority)
 * Body: { verificationNotes }
 * Response: { donationId, status, receiptNumber }
 */
router.put('/:donationId/verify', verifyToken, isMasjidAuthority, verifyDonation);

module.exports = router;
