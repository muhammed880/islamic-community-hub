const Donation = require('../models/Donation');
const Masjid = require('../models/Masjid');
const { formatSuccessResponse, formatErrorResponse, generateReceiptNumber, paginate } = require('../utils/helpers');
const logger = require('../utils/logger');

// GET UPI DETAILS FOR MASJID
exports.getUpiDetails = async (req, res) => {
  try {
    const { masjidId } = req.params;

    const masjid = await Masjid.findById(masjidId).select('masjidName upiId address');

    if (!masjid) {
      return res.status(404).json(formatErrorResponse('Masjid not found'));
    }

    res.json(
      formatSuccessResponse('UPI details retrieved', {
        masjidId: masjid._id,
        masjidName: masjid.masjidName,
        upiId: masjid.upiId,
        displayName: `Donation to ${masjid.masjidName}`,
        city: masjid.address.city,
        upiPaymentLink: `upi://pay?pa=${masjid.upiId}&pn=${masjid.masjidName}&tr=${masjid._id}&tn=Donation`
      })
    );
  } catch (error) {
    logger.error('Error getting UPI details:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve UPI details'));
  }
};

// RECORD DONATION (UPI)
exports.recordDonation = async (req, res) => {
  try {
    const { amount, donationType, masjidId, upiTransactionId, recipientUpiId } = req.body;
    const userId = req.userId;

    if (!amount || !donationType || !masjidId || !upiTransactionId) {
      return res.status(400).json(formatErrorResponse('Required fields missing'));
    }

    const receiptNumber = generateReceiptNumber();

    const newDonation = new Donation({
      donorId: userId,
      amount,
      currency: 'INR',
      donationType,
      masjidId,
      upiTransactionId,
      recipientUpiId,
      transactionStatus: 'pending_verification',
      receiptNumber
    });

    await newDonation.save();

    logger.info(`Donation recorded: ₹${amount} for ${masjidId}`);

    res.status(201).json(
      formatSuccessResponse('Donation recorded successfully', {
        donationId: newDonation._id,
        status: newDonation.transactionStatus,
        receiptNumber
      })
    );
  } catch (error) {
    logger.error('Error recording donation:', error);
    res.status(500).json(formatErrorResponse('Failed to record donation'));
  }
};

// GET DONATION HISTORY
exports.getDonationHistory = async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const userId = req.userId;
    const { skip, limit: pageLimit } = paginate(page, limit);

    const query = { donorId: userId };
    if (status) query.transactionStatus = status;

    const donations = await Donation.find(query)
      .skip(skip)
      .limit(pageLimit)
      .populate('masjidId', 'masjidName')
      .sort({ createdAt: -1 });

    const total = await Donation.countDocuments(query);

    res.json(
      formatSuccessResponse('Donation history retrieved', donations, {
        total,
        page: parseInt(page) || 1,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit)
      })
    );
  } catch (error) {
    logger.error('Error getting donation history:', error);
    res.status(500).json(formatErrorResponse('Failed to retrieve donation history'));
  }
};

// VERIFY DONATION (Masjid Authority)
exports.verifyDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const userId = req.userId;

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json(formatErrorResponse('Donation not found'));
    }

    // Verify ownership (Masjid Authority)
    const Masjid = require('../models/Masjid');
    const masjid = await Masjid.findOne({ adminId: userId, _id: donation.masjidId });

    if (!masjid) {
      return res.status(403).json(formatErrorResponse('You do not have permission to verify'));
    }

    const updatedDonation = await Donation.findByIdAndUpdate(
      donationId,
      {
        transactionStatus: 'completed',
        verifiedBy: userId,
        verifiedDate: new Date()
      },
      { new: true }
    );

    logger.info(`Donation verified: ${donationId}`);

    res.json(
      formatSuccessResponse('Donation verified successfully', {
        donationId: updatedDonation._id,
        status: updatedDonation.transactionStatus,
        receiptNumber: updatedDonation.receiptNumber
      })
    );
  } catch (error) {
    logger.error('Error verifying donation:', error);
    res.status(500).json(formatErrorResponse('Failed to verify donation'));
  }
};

// REQUEST REFUND
exports.requestRefund = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { reason } = req.body;
    const userId = req.userId;

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json(formatErrorResponse('Donation not found'));
    }

    if (donation.donorId.toString() !== userId) {
      return res.status(403).json(formatErrorResponse('You cannot request refund for this donation'));
    }

    // TODO: Create refund request
    res.json(formatSuccessResponse('Refund request submitted', {
      donationId,
      status: 'pending'
    }));
  } catch (error) {
    logger.error('Error requesting refund:', error);
    res.status(500).json(formatErrorResponse('Failed to request refund'));
  }
};
