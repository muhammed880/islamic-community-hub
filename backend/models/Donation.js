const mongoose = require('mongoose');
const { DONATION_TYPE, TRANSACTION_STATUS } = require('../config/constants');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [1, 'Amount must be positive']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    donationType: {
      type: String,
      enum: Object.values(DONATION_TYPE),
      required: [true, 'Donation type is required']
    },
    masjidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Masjid',
      required: [true, 'Masjid ID is required']
    },
    needyPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NeedyPerson',
      default: null
    },
    upiTransactionId: {
      type: String,
      required: [true, 'UPI Transaction ID is required'],
      unique: true
    },
    recipientUpiId: {
      type: String,
      required: [true, 'Recipient UPI ID is required']
    },
    paymentProofScreenshot: {
      type: String,
      required: [true, 'Payment proof screenshot is required']
    },
    transactionStatus: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING_VERIFICATION
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verifiedDate: {
      type: Date,
      default: null
    },
    receiptNumber: String,
    receiptUrl: String,
    donationDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
donationSchema.index({ donorId: 1 });
donationSchema.index({ masjidId: 1 });
donationSchema.index({ needyPersonId: 1 });
donationSchema.index({ transactionStatus: 1 });
donationSchema.index({ upiTransactionId: 1 });
donationSchema.index({ donationDate: 1 });

module.exports = mongoose.model('Donation', donationSchema);
