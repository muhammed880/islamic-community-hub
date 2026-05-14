const express = require('express');
const router = express.Router();
const { verifyToken, isSuperAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  startRegistration,
  updateBasicInfo,
  updateMembers,
  uploadDocuments,
  getRegistrationFeeDetails,
  recordPayment,
  submitForm,
  verifyAndApprove,
  rejectRegistration,
  getFormDetails,
  listForms
} = require('../controllers/masjidRegistrationController');

/**
 * MASJID REGISTRATION FORM ROUTES
 * All routes for masjid registration workflow
 */

// ==================== PUBLIC ROUTES ====================

/**
 * POST /api/masjid-registration/start
 * Start a new registration form
 * Access: Public
 * Response: { formId, formNumber, status }
 */
router.post('/start', startRegistration);

// ==================== AUTHENTICATED MASJID AUTHORITY ROUTES ====================

/**
 * PUT /api/masjid-registration/:formId/basic-info
 * Update basic masjid information
 * Access: Protected (Masjid Authority)
 * Body: { masjidName, address, mobileNumber, upiId }
 */
router.put('/:formId/basic-info', verifyToken, updateBasicInfo);

/**
 * PUT /api/masjid-registration/:formId/members
 * Update organization members
 * Access: Protected (Masjid Authority)
 * Body: { president, secretary, treasurer, additionalMembers }
 */
router.put('/:formId/members', verifyToken, updateMembers);

/**
 * POST /api/masjid-registration/:formId/upload-document
 * Upload supporting documents
 * Access: Protected (Masjid Authority)
 * Files: document (PDF/Image)
 * Query: documentType (registrationCertificate, trustDeed, etc.)
 */
router.post('/:formId/upload-document', verifyToken, upload.single('document'), uploadDocuments);

/**
 * GET /api/masjid-registration/:formId/fee-details
 * Get registration fee details and payment instructions
 * Access: Protected (Masjid Authority)
 * Response: { registrationFee, currency, payTo, upiPaymentLink }
 */
router.get('/:formId/fee-details', verifyToken, getRegistrationFeeDetails);

/**
 * PUT /api/masjid-registration/:formId/record-payment
 * Record payment and UTR number
 * Access: Protected (Masjid Authority)
 * Body: { utrNumber, upiTransactionId, paymentProofScreenshot }
 */
router.put('/:formId/record-payment', verifyToken, recordPayment);

/**
 * POST /api/masjid-registration/:formId/submit
 * Submit complete form to Super Admin for verification
 * Access: Protected (Masjid Authority)
 * Response: { formId, formNumber, status, message }
 */
router.post('/:formId/submit', verifyToken, submitForm);

// ==================== SUPER ADMIN ONLY ROUTES ====================

/**
 * PUT /api/masjid-registration/:formId/approve
 * Approve registration and generate credentials
 * Access: Protected (Super Admin Only)
 * Body: { verificationNotes }
 * Response: { uniqueId, loginUsername, tempPassword, credentialsToShare }
 */
router.put('/:formId/approve', verifyToken, isSuperAdmin, verifyAndApprove);

/**
 * PUT /api/masjid-registration/:formId/reject
 * Reject registration application
 * Access: Protected (Super Admin Only)
 * Body: { rejectionReason, rejectionDetails }
 */
router.put('/:formId/reject', verifyToken, isSuperAdmin, rejectRegistration);

/**
 * GET /api/masjid-registration/list
 * List all registration forms with filters
 * Access: Protected (Super Admin Only)
 * Query: { page, limit, status }
 * Response: { forms[], pagination }
 */
router.get('/list', verifyToken, isSuperAdmin, listForms);

// ==================== GENERAL ROUTES ====================

/**
 * GET /api/masjid-registration/:formId
 * Get registration form details
 * Access: Protected (Authenticated Users)
 * Response: Form details
 */
router.get('/:formId', verifyToken, getFormDetails);

module.exports = router;
