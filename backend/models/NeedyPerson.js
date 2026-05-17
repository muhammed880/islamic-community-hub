const mongoose = require('mongoose');
const { NEEDY_STATUS, NEEDY_REASON } = require('../config/constants');

const needyPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    familySize: {
      type: Number,
      required: [true, 'Family size is required'],
      min: 1
    },
    familyMembers: [
      {
        name: {
          type: String,
          required: true
        },
        age: {
          type: Number,
          required: true
        },
        relation: String,
        gender: String
      }
    ],
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
      }
    },
    masjidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Masjid',
      required: [true, 'Masjid ID is required']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required']
    },
    monthlyIncome: {
      type: Number,
      required: true,
      min: 0
    },
    monthlyExpense: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      enum: Object.values(NEEDY_REASON),
      required: [true, 'Reason is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    estimatedAmount: {
      type: Number,
      required: [true, 'Estimated amount is required'],
      min: 1
    },
    documents: [String],
    status: {
      type: String,
      enum: Object.values(NEEDY_STATUS),
      default: NEEDY_STATUS.PENDING
    },
    zakatCollected: {
      type: Number,
      default: 0,
      min: 0
    },
    zakatRemaining: {
      type: Number,
      default: 0,
      min: 0
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verifiedDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Calculate remaining zakat before save
needyPersonSchema.pre('save', function (next) {
  this.zakatRemaining = this.estimatedAmount - this.zakatCollected;
  if (this.zakatRemaining <= 0) {
    this.zakatRemaining = 0;
    this.status = NEEDY_STATUS.COMPLETED;
  }
  next();
});

// Indexes
needyPersonSchema.index({ masjidId: 1 });
needyPersonSchema.index({ createdBy: 1 });
needyPersonSchema.index({ status: 1 });
needyPersonSchema.index({ 'address.city': 1 });
needyPersonSchema.index({ reason: 1 });

module.exports = mongoose.model('NeedyPerson', needyPersonSchema);
