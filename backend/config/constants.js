const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  MASJID_AUTHORITY: 'masjid_authority',
  GENERAL_USER: 'general_user'
};

const MASJID_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
};

const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  FILLED: 'filled',
  CANCELLED: 'cancelled'
};

const APPLICATION_STATUS = {
  PENDING: 'pending',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  SELECTED: 'selected'
};

const DONATION_TYPE = {
  MASJID_DONATION: 'masjid_donation',
  ZAKAT: 'zakat'
};

const TRANSACTION_STATUS = {
  PENDING_VERIFICATION: 'pending_verification',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  FAILED: 'failed'
};

const MATRIMONY_STATUS = {
  PENDING_VERIFICATION: 'pending_verification',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

const INTEREST_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
};

const NEEDY_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

const NEEDY_REASON = {
  MEDICAL: 'medical',
  EDUCATION: 'education',
  LIVELIHOOD: 'livelihood',
  EMERGENCY: 'emergency',
  OTHER: 'other'
};

const CLASS_LEVEL = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

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
