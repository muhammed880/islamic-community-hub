const express = require('express');
const router = express.Router();
const { verifyToken, isMasjidAuthority, isSuperAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  startNikahForm,
  updateCeremonyDetails,
  updateImamDetails,
  checkDuplicateAadhaar,
  updateGroomDetails,
  updateBrideDetails,
  updateWitnessesDetails,
  updateWakeelDetails,
  updateMaharDetails,
  updateTermsAndConditions,
  updateRegistrationFee,
  submitNikahForm,
  generateCertificate,
  previewCertificate,
  downloadCertificate,
  shareCertificate,
  getNikahFormDetails
} = require('../controllers/nikahRegistrationController');

/**
 * NIKAH REGISTRATION FORM ROUTES
 * Comprehensive nikah registration workflow with certificate generation
 */

// ==================== FORM CREATION ====================

/**
 * POST /api/nikah-registration/start
 * Start new nikah registration form
 * Access: Protected
 */
router.post('/start', verifyToken, startNikahForm);

// ==================== FORM STEPS ====================

/**
 * PUT /api/nikah-registration/:formId/ceremony
 * Update ceremony details (Date, Venue, Time)
 * Step 1/8
 */
router.put('/:formId/ceremony', verifyToken, updateCeremonyDetails);

/**
 * PUT /api/nikah-registration/:formId/imam
 * Update Imam/Qazi details
 * Step 2/8
 */
router.put('/:formId/imam', verifyToken, updateImamDetails);

/**
 * POST /api/nikah-registration/check-aadhaar
 * Check for duplicate Aadhaar (previous marriages)
 */
router.post('/check-aadhaar', verifyToken, checkDuplicateAadhaar);

/**
 * PUT /api/nikah-registration/:formId/groom
 * Update Groom details (with photo upload)
 * Step 3/8
 */
router.put('/:formId/groom', verifyToken, updateGroomDetails);

/**
 * PUT /api/nikah-registration/:formId/bride
 * Update Bride details (with photo upload)
 * Step 4/8
 */
router.put('/:formId/bride', verifyToken, updateBrideDetails);

/**
 * PUT /api/nikah-registration/:formId/witnesses
 * Update Witnesses details
 * Step 5/8
 */
router.put('/:formId/witnesses', verifyToken, updateWitnessesDetails);

/**
 * PUT /api/nikah-registration/:formId/wakeel
 * Update Wakeel details (Optional)
 */
router.put('/:formId/wakeel', verifyToken, updateWakeelDetails);

/**
 * PUT /api/nikah-registration/:formId/mahr
 * Update Mahr details
 * Step 6/8
 */
router.put('/:formId/mahr', verifyToken, updateMaharDetails);

/**
 * PUT /api/nikah-registration/:formId/terms
 * Update Terms & Conditions
 * Step 7/8
 */
router.put('/:formId/terms', verifyToken, updateTermsAndConditions);

/**
 * PUT /api/nikah-registration/:formId/fee
 * Update Registration Fee
 * Step 8/8
 */
router.put('/:formId/fee', verifyToken, updateRegistrationFee);

// ==================== FORM SUBMISSION ====================

/**
 * POST /api/nikah-registration/:formId/submit
 * Submit completed form for verification
 */
router.post('/:formId/submit', verifyToken, submitNikahForm);

// ==================== CERTIFICATE GENERATION ====================

/**
 * POST /api/nikah-registration/:formId/generate-certificate
 * Generate certificate with unique ID
 * Only after verification by Super Admin
 */
router.post('/:formId/generate-certificate', verifyToken, isSuperAdmin, generateCertificate);

/**
 * GET /api/nikah-registration/:formId/preview
 * Preview certificate (PDF)
 */
router.get('/:formId/preview', verifyToken, previewCertificate);

/**
 * GET /api/nikah-registration/:formId/download
 * Download certificate (PDF)
 */
router.get('/:formId/download', verifyToken, downloadCertificate);

/**
 * POST /api/nikah-registration/:formId/share
 * Share certificate via link
 */
router.post('/:formId/share', verifyToken, shareCertificate);

// ==================== GENERAL ====================

/**
 * GET /api/nikah-registration/:formId
 * Get form details
 */
router.get('/:formId', verifyToken, getNikahFormDetails);

module.exports = router;
