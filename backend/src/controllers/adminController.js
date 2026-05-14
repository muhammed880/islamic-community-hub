const User = require('../models/User');
const Masjid = require('../models/Masjid');
const Donation = require('../models/Donation');
const NeedyPerson = require('../models/NeedyPerson');
const MasjidRegistrationForm = require('../models/MasjidRegistrationForm');
const { formatSuccessResponse, formatErrorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

// GET DASHBOARD STATISTICS
exports.getDashboardStats = async (req, res) => {
  try {
    const totalMasjids = await Masjid.countDocuments();
    const approvedMasjids = await Masjid.countDocuments({ status: 'approved' });
    const pendingMasjids = await Masjid.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();
    const totalDonations = await Donation.countDocuments({ transactionStatus: 'completed' });
    const totalNeedyPersons = await NeedyPerson.countDocuments({ status: 'approved' });

    // Calculate totals
    const donationStats = await Donation.aggregate([
      { $match: { transactionStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalDonationAmount = donationStats.length > 0 ? donationStats[0].total : 0;

    res.json(
      formatSuccessResponse('Dashboard statistics retrieved', {
        masjids: {
          total: totalMasjids,
          approved: approvedMasjids,
          pending: pendingMasjids
        },
        users: {
          total: totalUsers
        },
        donations: {
          total: totalDonations,
          totalAmount: totalDonationAmount
        },
        needyPersons: {
          total: totalNeedyPersons
        }
      })
    );
  } catch (error) {
    logger.error('Error getting dashboard stats:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve statistics'));
  }
};

// GET PENDING REGISTRATIONS
exports.getPendingRegistrations = async (req, res) => {
  try {
    const pendingForms = await MasjidRegistrationForm.find({
      status: { $in: ['submitted', 'under_review'] }
    }).select('formNumber masjidName submittedDate payment.status');

    res.json(
      formatSuccessResponse('Pending registrations retrieved', pendingForms)
    );
  } catch (error) {
    logger.error('Error getting pending registrations:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve registrations'));
  }
};

// GET PENDING PAYMENT VERIFICATIONS
exports.getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await MasjidRegistrationForm.find({
      'payment.status': 'initiated'
    }).select('formNumber masjidName payment.utrNumber payment.paymentDate');

    res.json(
      formatSuccessResponse('Pending payments retrieved', pendingPayments)
    );
  } catch (error) {
    logger.error('Error getting pending payments:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve pending payments'));
  }
};

// GET DONATIONS HISTORY
exports.getDonationsHistory = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const donations = await Donation.find()
      .skip(skip)
      .limit(parseInt(limit))
      .populate('donorId', 'firstName lastName email')
      .populate('masjidId', 'masjidName')
      .sort({ createdAt: -1 });

    const total = await Donation.countDocuments();

    res.json(
      formatSuccessResponse('Donations history retrieved', donations, {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      })
    );
  } catch (error) {
    logger.error('Error getting donations history:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve donations'));
  }
};

// UPDATE REGISTRATION FEE SETTINGS
exports.updateRegistrationFee = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json(formatErrorResponse('Amount is required'));
    }

    // TODO: Store in settings/configuration
    logger.info(`Registration fee updated to ${amount} ${currency}`);

    res.json(
      formatSuccessResponse('Registration fee updated', {
        amount,
        currency
      })
    );
  } catch (error) {
    logger.error('Error updating registration fee:', error);
    res.status(500).json(formatErrorResponse('Failed to update registration fee'));
  }
};
