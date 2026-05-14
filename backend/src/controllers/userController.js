const User = require('../models/User');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');
const path = require('path');

// GET USER PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json(formatErrorResponse('User not found'));
    }

    res.json(
      formatSuccessResponse('Profile retrieved', {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profilePicture,
        role: user.role,
        address: user.address,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt
      })
    );
  } catch (error) {
    logger.error('Error getting profile:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve profile'));
  }
};

// UPDATE USER PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone, dateOfBirth, address } = req.body;

    // Prepare update data
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (address) updateData.address = address;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    logger.info(`User profile updated: ${userId}`);

    res.json(
      formatSuccessResponse('Profile updated successfully', {
        user: updatedUser
      })
    );
  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json(formatErrorResponse('Failed to update profile', [{ message: error.message }]));
  }
};

// UPLOAD PROFILE PICTURE
exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.userId;

    if (!req.files || !req.files.profilePicture) {
      return res.status(400).json(formatErrorResponse('No file uploaded'));
    }

    const file = req.files.profilePicture;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json(formatErrorResponse('Invalid file type. Only JPG, PNG, WebP allowed'));
    }

    // Generate file name
    const fileName = `${userId}-${Date.now()}${path.extname(file.name)}`;
    const uploadPath = `uploads/profile-pictures/${fileName}`;

    // Move file
    await file.mv(uploadPath);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadPath },
      { new: true }
    ).select('-password');

    logger.info(`Profile picture uploaded: ${userId}`);

    res.json(
      formatSuccessResponse('Profile picture updated', {
        profilePicture: updatedUser.profilePicture
      })
    );
  } catch (error) {
    logger.error('Error uploading profile picture:', error);
    res.status(500).json(formatErrorResponse('Failed to upload profile picture'));
  }
};
