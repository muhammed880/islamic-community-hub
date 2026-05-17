const mongoose = require('mongoose');
const { MASJID_STATUS } = require('../config/constants');

const masjidSchema = new mongoose.Schema(
  {
    masjidName: {
      type: String,
      required: [true, 'Masjid name is required'],
      trim: true,
      unique: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin ID is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    },
    address: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zipCode: {
        type: String,
        required: true
      },
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    upiId: {
      type: String,
      required: [true, 'UPI ID is required'],
      match: [/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/, 'Invalid UPI ID format']
    },
    bankAccountNumber: String,
    bankIFSC: String,
    bankName: String,
    registrationCertificate: {
      type: String,
      required: [true, 'Registration certificate is required']
    },
    trustDeed: {
      type: String,
      required: [true, 'Trust deed is required']
    },
    status: {
      type: String,
      enum: Object.values(MASJID_STATUS),
      default: MASJID_STATUS.PENDING
    },
    registrationFeeAmount: {
      type: Number,
      default: 5000
    },
    registrationFeeStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    registrationFeeDate: Date,
    renewalDueDate: Date,
    renewalFeeAmount: {
      type: Number,
      default: 2000
    },
    establishmentYear: Number,
    totalMembers: {
      type: Number,
      default: 0
    },
    totalDonations: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    description: String,
    openingHours: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
      sunday: String
    },
    facilities: [String],
    prayerTimes: {
      fajr: String,
      dhuhr: String,
      asr: String,
      maghrib: String,
      isha: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
masjidSchema.index({ adminId: 1 });
masjidSchema.index({ status: 1 });
masjidSchema.index({ 'address.city': 1 });
masjidSchema.index({ email: 1 });
masjidSchema.index({ upiId: 1 });

module.exports = mongoose.model('Masjid', masjidSchema);
