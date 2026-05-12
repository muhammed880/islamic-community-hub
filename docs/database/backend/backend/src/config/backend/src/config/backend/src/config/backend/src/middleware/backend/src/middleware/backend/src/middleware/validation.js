const { body, validationResult, param } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const validateUserRegistration = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  validate
];

const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const validateMasjidRegistration = [
  body('masjidName').trim().notEmpty().withMessage('Masjid name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/).withMessage('Invalid phone number'),
  body('upiId').trim().notEmpty().withMessage('UPI ID is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  validate
];

const validateJobCreation = [
  body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
  body('jobDescription').trim().notEmpty().withMessage('Job description is required'),
  body('jobType').isIn(['full_time', 'part_time', 'volunteer']).withMessage('Invalid job type'),
  body('salaryRange.minSalary').isInt({ min: 0 }).withMessage('Min salary must be positive'),
  body('salaryRange.maxSalary').isInt({ min: 0 }).withMessage('Max salary must be positive'),
  validate
];

const validateDonationRecord = [
  body('amount').isInt({ min: 1 }).withMessage('Amount must be positive'),
  body('currency').trim().notEmpty().withMessage('Currency is required'),
  body('donationType').isIn(['masjid_donation', 'zakat']).withMessage('Invalid donation type'),
  body('upiTransactionId').trim().notEmpty().withMessage('UPI Transaction ID is required'),
  validate
];

module.exports = {
  validate,
  validateUserRegistration,
  validateUserLogin,
  validateMasjidRegistration,
  validateJobCreation,
  validateDonationRecord
};
