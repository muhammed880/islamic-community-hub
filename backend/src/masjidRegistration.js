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

// PUBLIC ROUTES
router.post('/start', startRegistration);

// AUTHENTICATED MASJID AUTHORITY ROUTES
router.put('/:formId/basic-info', verifyToken, updateBasicInfo);
router.put('/:formId/members', verifyToken, updateMembers);
router.post('/:formId/upload-document', verifyToken, upload.single('document'), uploadDocuments);
router.get('/:formId/fee-details', verifyToken, getRegistrationFeeDetails);
router.put('/:formId/record-payment', verifyToken, recordPayment);
router.post('/:formId/submit', verifyToken, submitForm);

// SUPER ADMIN ONLY ROUTES
router.put('/:formId/approve', verifyToken, isSuperAdmin, verifyAndApprove);
router.put('/:formId/reject', verifyToken, isSuperAdmin, rejectRegistration);
router.get('/list', verifyToken, isSuperAdmin, listForms);

// GENERAL ROUTES
router.get('/:formId', verifyToken, getFormDetails);

module.exports = router;
