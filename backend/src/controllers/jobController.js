const Job = require('../models/Job');
const { formatSuccessResponse, formatErrorResponse, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

// LIST ALL JOBS
exports.listJobs = async (req, res) => {
  try {
    const { page, limit, city, state, jobType, search } = req.query;
    const { skip, limit: pageLimit } = paginate(page, limit);

    const query = { status: 'active' };

    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (search) query.jobTitle = { $regex: search, $options: 'i' };

    const jobs = await Job.find(query)
      .skip(skip)
      .limit(pageLimit)
      .populate('masjidId', 'masjidName address')
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json(
      formatSuccessResponse('Jobs retrieved', jobs, {
        total,
        page: parseInt(page) || 1,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit)
      })
    );
  } catch (error) {
    logger.error('Error listing jobs:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve jobs'));
  }
};

// GET JOB DETAILS
exports.getJobDetails = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate('masjidId', 'masjidName phone email address')
      .populate('createdBy', 'firstName lastName');

    if (!job) {
      return res.status(404).json(formatErrorResponse('Job not found'));
    }

    res.json(formatSuccessResponse('Job details retrieved', job));
  } catch (error) {
    logger.error('Error getting job details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve job details'));
  }
};

// CREATE JOB (Masjid Authority)
exports.createJob = async (req, res) => {
  try {
    const userId = req.userId;
    const { jobTitle, jobDescription, jobType, salaryRange, location, qualifications, experience, skills, closingDate } = req.body;

    // Validate required fields
    if (!jobTitle || !jobDescription || !jobType || !location || !closingDate) {
      return res.status(400).json(formatErrorResponse('Required fields missing'));
    }

    // Get masjid by admin ID
    const Masjid = require('../models/Masjid');
    const masjid = await Masjid.findOne({ adminId: userId });

    if (!masjid) {
      return res.status(404).json(formatErrorResponse('You must be a Masjid Authority'));
    }

    const newJob = new Job({
      jobTitle,
      jobDescription,
      masjidId: masjid._id,
      createdBy: userId,
      jobType,
      salaryRange,
      location,
      qualifications: qualifications || [],
      experience: experience || 0,
      skills: skills || [],
      closingDate: new Date(closingDate),
      status: 'active'
    });

    await newJob.save();

    logger.info(`Job created: ${jobTitle} at ${masjid.masjidName}`);

    res.status(201).json(formatSuccessResponse('Job posted successfully', newJob));
  } catch (error) {
    logger.error('Error creating job:', error);
    res.status(500).json(formatErrorResponse('Failed to create job'));
  }
};

// APPLY FOR JOB
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId;
    const { coverLetter } = req.body;

    if (!req.files || !req.files.resume) {
      return res.status(400).json(formatErrorResponse('Resume file is required'));
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json(formatErrorResponse('Job not found'));
    }

    // TODO: Save application to database
    // For now, just return success

    res.status(201).json(
      formatSuccessResponse('Application submitted successfully', {
        jobId,
        applicationStatus: 'pending'
      })
    );
  } catch (error) {
    logger.error('Error applying for job:', error);
    res.status(500).json(formatErrorResponse('Failed to submit application'));
  }
};

// GET JOB APPLICATIONS (Masjid Authority)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json(formatErrorResponse('Job not found'));
    }

    // Verify ownership
    if (job.createdBy.toString() !== userId) {
      return res.status(403).json(formatErrorResponse('You do not have permission'));
    }

    // TODO: Fetch applications from database

    res.json(formatSuccessResponse('Applications retrieved', []));
  } catch (error) {
    logger.error('Error getting applications:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve applications'));
  }
};
