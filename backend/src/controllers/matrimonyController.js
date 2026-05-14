const Matrimony = require('../models/Matrimony');
const { formatSuccessResponse, formatErrorResponse, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

// BROWSE MATRIMONY PROFILES
exports.browseProfiles = async (req, res) => {
  try {
    const { page, limit, gender, ageMin, ageMax, education, city } = req.query;
    const { skip, limit: pageLimit } = paginate(page, limit);

    const query = { status: 'verified', isPublic: true };

    if (gender) query.gender = gender;
    if (education) query.education = { $regex: education, $options: 'i' };
    if (city) query['address.city'] = { $regex: city, $options: 'i' };

    // Age filtering is complex, handle separately if needed
    // TODO: Implement age range query

    const profiles = await Matrimony.find(query)
      .skip(skip)
      .limit(pageLimit)
      .select('-bio') // Don't show bio in list
      .sort({ createdAt: -1 });

    const total = await Matrimony.countDocuments(query);

    res.json(
      formatSuccessResponse('Profiles retrieved', profiles, {
        total,
        page: parseInt(page) || 1,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit)
      })
    );
  } catch (error) {
    logger.error('Error browsing profiles:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve profiles'));
  }
};

// GET PROFILE DETAILS
exports.getProfileDetails = async (req, res) => {
  try {
    const { profileId } = req.params;

    const profile = await Matrimony.findById(profileId);

    if (!profile || !profile.isPublic) {
      return res.status(404).json(formatErrorResponse('Profile not found'));
    }

    // Increment views
    await Matrimony.findByIdAndUpdate(profileId, { $inc: { views: 1 } });

    res.json(formatSuccessResponse('Profile details retrieved', profile));
  } catch (error) {
    logger.error('Error getting profile details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve profile'));
  }
};

// CREATE MATRIMONY PROFILE
exports.createProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, dateOfBirth, gender, height, education, occupation, income, hobbies, languages, lookingFor, bio } = req.body;

    if (!fullName || !dateOfBirth || !gender || !education || !occupation || !lookingFor) {
      return res.status(400).json(formatErrorResponse('Required fields missing'));
    }

    // Check if profile already exists
    const existingProfile = await Matrimony.findOne({ userId });

    if (existingProfile) {
      return res.status(409).json(formatErrorResponse('Profile already exists for this user'));
    }

    const newProfile = new Matrimony({
      userId,
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      height,
      education,
      occupation,
      income,
      hobbies: hobbies || [],
      languages: languages || [],
      lookingFor,
      bio,
      status: 'pending_verification',
      isPublic: false
    });

    await newProfile.save();

    logger.info(`Matrimony profile created for user: ${userId}`);

    res.status(201).json(
      formatSuccessResponse('Profile created. Pending verification.', {
        profileId: newProfile._id,
        status: newProfile.status
      })
    );
  } catch (error) {
    logger.error('Error creating profile:', error);
    res.status(500).json(formatErrorResponse('Failed to create profile'));
  }
};

// EXPRESS INTEREST
exports.expressInterest = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.userId;
    const { message } = req.body;

    const profile = await Matrimony.findById(profileId);

    if (!profile) {
      return res.status(404).json(formatErrorResponse('Profile not found'));
    }

    // TODO: Create interest record in database

    logger.info(`Interest expressed by ${userId} for profile ${profileId}`);

    res.status(201).json(
      formatSuccessResponse('Interest sent successfully', {
        status: 'pending'
      })
    );
  } catch (error) {
    logger.error('Error expressing interest:', error);
    res.status(500).json(formatErrorResponse('Failed to express interest'));
  }
};

// GET RECEIVED INTERESTS
exports.getReceivedInterests = async (req, res) => {
  try {
    const userId = req.userId;

    // TODO: Fetch interests from database

    res.json(formatSuccessResponse('Interests retrieved', []));
  } catch (error) {
    logger.error('Error getting interests:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve interests'));
  }
};

// ACCEPT/REJECT INTEREST
exports.respondToInterest = async (req, res) => {
  try {
    const { interestId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json(formatErrorResponse('Invalid status'));
    }

    // TODO: Update interest status

    res.json(formatSuccessResponse('Interest response recorded', { status }));
  } catch (error) {
    logger.error('Error responding to interest:', error);
    res.status(500).json(formatErrorResponse('Failed to respond to interest'));
  }
};
