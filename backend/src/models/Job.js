const express = require('express');
const router = express.Router();
const { verifyToken, isMasjidAuthority } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  listJobs,
  getJobDetails,
  createJob,
  applyForJob,
  getJobApplications
} = require('../controllers/jobController');

/**
 * JOBS MANAGEMENT ROUTES
 * Job postings and applications
 */

// ==================== PUBLIC ROUTES ====================

/**
 * GET /api/jobs
 * List all job postings
 * Access: Public
 * Query: { page, limit, city, state, jobType, search }
 * Response: { jobs[], pagination }
 */
router.get('/', listJobs);

/**
 * GET /api/jobs/:jobId
 * Get job details
 * Access: Public
 * Response: Job object with masjid and creator info
 */
router.get('/:jobId', getJobDetails);

// ==================== PROTECTED ROUTES ====================

/**
 * POST /api/jobs/:jobId/apply
 * Apply for job
 * Access: Protected (Authenticated Users)
 * Files: resume (PDF/DOC max 5MB)
 * Body: { coverLetter }
 * Response: { applicationId, status }
 */
router.post('/:jobId/apply', verifyToken, upload.single('resume'), applyForJob);

// ==================== MASJID AUTHORITY ROUTES ====================

/**
 * POST /api/jobs
 * Create new job posting
 * Access: Protected (Masjid Authority)
 * Body: { jobTitle, jobDescription, jobType, salaryRange, location, qualifications, experience, skills, closingDate }
 * Response: Created job object
 */
router.post('/', verifyToken, isMasjidAuthority, createJob);

/**
 * GET /api/jobs/:jobId/applications
 * Get job applications
 * Access: Protected (Masjid Authority)
 * Response: { applications[] }
 */
router.get('/:jobId/applications', verifyToken, isMasjidAuthority, getJobApplications);

module.exports = router;
