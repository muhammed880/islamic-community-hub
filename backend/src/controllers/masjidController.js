const Masjid = require('../models/Masjid');
const { formatSuccessResponse, formatErrorResponse, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

// LIST ALL APPROVED MASJIDS
exports.listMasjids = async (req, res) => {
  try {
    const { page, limit, city, state, search, sort } = req.query;
    const { skip, limit: pageLimit } = paginate(page, limit);

    // Build query
    const query = { status: 'approved' };

    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (state) query['address.state'] = { $regex: state, $options: 'i' };
    if (search) {
      query.$or = [
        { masjidName: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query
    const masjids = await Masjid.find(query)
      .skip(skip)
      .limit(pageLimit)
      .sort(sort === 'rating' ? { averageRating: -1 } : { createdAt: -1 });

    const total = await Masjid.countDocuments(query);

    res.json(
      formatSuccessResponse('Masjids retrieved', masjids, {
        total,
        page: parseInt(page) || 1,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit)
      })
    );
  } catch (error) {
    logger.error('Error listing masjids:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve masjids'));
  }
};

// GET MASJID DETAILS
exports.getMasjidDetails = async (req, res) => {
  try {
    const { masjidId } = req.params;

    const masjid = await Masjid.findById(masjidId).populate('adminId', 'firstName lastName phone email');

    if (!masjid || masjid.status !== 'approved') {
      return res.status(404).json(formatErrorResponse('Masjid not found'));
    }

    res.json(formatSuccessResponse('Masjid details retrieved', masjid));
  } catch (error) {
    logger.error('Error getting masjid details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve masjid details'));
  }
};

// GET MASJID DASHBOARD (Masjid Authority)
exports.getMasjidDashboard = async (req, res) => {
  try {
    const { masjidId } = req.params;
    const userId = req.userId;

    // Verify ownership
    const masjid = await Masjid.findById(masjidId);

    if (!masjid) {
      return res.status(404).json(formatErrorResponse('Masjid not found'));
    }

    if (masjid.adminId.toString() !== userId) {
      return res.status(403).json(formatErrorResponse('You do not have access to this masjid'));
    }

    // Get dashboard data
    const dashboardData = {
      masjidName: masjid.masjidName,
      totalDonations: masjid.totalDonations,
      totalMembers: masjid.totalMembers,
      upiId: masjid.upiId,
      status: masjid.status,
      renewalDueDate: masjid.renewalDueDate,
      // Additional metrics can be added
      pendingVerifications: 0,
      recentDonations: []
    };

    res.json(formatSuccessResponse('Dashboard data retrieved', dashboardData));
  } catch (error) {
    logger.error('Error getting masjid dashboard:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve dashboard'));
  }
};

// UPDATE MASJID INFORMATION (Masjid Authority)
exports.updateMasjid = async (req, res) => {
  try {
    const { masjidId } = req.params;
    const userId = req.userId;
    const { description, openingHours, facilities, prayerTimes } = req.body;

    // Verify ownership
    const masjid = await Masjid.findById(masjidId);

    if (masjid.adminId.toString() !== userId) {
      return res.status(403).json(formatErrorResponse('You do not have permission to update this masjid'));
    }

    // Update fields
    const updateData = {};
    if (description) updateData.description = description;
    if (openingHours) updateData.openingHours = openingHours;
    if (facilities) updateData.facilities = facilities;
    if (prayerTimes) updateData.prayerTimes = prayerTimes;

    const updatedMasjid = await Masjid.findByIdAndUpdate(masjidId, updateData, { new: true });

    logger.info(`Masjid updated: ${masjidId}`);

    res.json(formatSuccessResponse('Masjid updated successfully', updatedMasjid));
  } catch (error) {
    logger.error('Error updating masjid:', error);
    res.status(500).json(formatErrorResponse('Failed to update masjid'));
  }
};

// SUBMIT RENEWAL REQUEST
exports.submitRenewal = async (req, res) => {
  try {
    const { masjidId } = req.params;
    const userId = req.userId;

    const masjid = await Masjid.findById(masjidId);

    if (masjid.adminId.toString() !== userId) {
      return res.status(403).json(formatErrorResponse('You do not have permission'));
    }

    // Check if renewal is due
    const renewalDue = new Date(masjid.renewalDueDate) <= new Date();

    if (!renewalDue) {
      return res.status(400).json(formatErrorResponse('Renewal is not yet due'));
    }

    res.json(
      formatSuccessResponse('Renewal request submitted', {
        renewalFeeAmount: 2000,
        currency: 'INR',
        payTo: 'superadmin@upi'
      })
    );
  } catch (error) {
    logger.error('Error submitting renewal:', error);
    res.status(500).json(formatErrorResponse('Failed to submit renewal'));
  }
};
