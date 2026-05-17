// User Roles
const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  MASJID_AUTHORITY: 'masjid_authority',
  GENERAL_USER: 'general_user'
};

// Masjid Status
const MASJID_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

// Job Status
const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  FILLED: 'filled',
  CANCELLED: 'cancelled'
};

// Application Status
const APPLICATION_STATUS = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  SELECTED: 'selected'
};

// Donation Type
const DONATION_TYPE = {
  MASJID_DONATION: 'masjid_donation',
  ZAKAT: 'zakat'
};

// Transaction Status
const TRANSACTION_STATUS = {
  PENDING_VERIFICATION: 'pending_verification',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  FAILED: 'failed'
};

// Matrimony Status
const MATRIMONY_STATUS = {
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// Interest Status
const INTEREST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

// Needy Person Status
const NEEDY_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

// Needy Person Reason
const NEEDY_REASON = {
  MEDICAL: 'medical',
  EDUCATION: 'education',
  LIVELIHOOD: 'livelihood',
  EMERGENCY: 'emergency',
  OTHER: 'other'
};

// Class Level
const CLASS_LEVEL = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Enrollment Status
const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

// Session Status
const SESSION_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

module.exports = {
  USER_ROLES,
  MASJID_STATUS,
  JOB_STATUS,
  APPLICATION_STATUS,
  DONATION_TYPE,
  TRANSACTION_STATUS,
  MATRIMONY_STATUS,
  INTEREST_STATUS,
  NEEDY_STATUS,
  NEEDY_REASON,
  CLASS_LEVEL,
  ENROLLMENT_STATUS,
  SESSION_STATUS
};
