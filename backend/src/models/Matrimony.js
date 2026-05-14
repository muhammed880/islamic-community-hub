const mongoose = require('mongoose');
const { MATRIMONY_STATUS } = require('../config/constants');

const matrimonySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    age: {
      type: Number,
      computed: true
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required']
    },
    height: String,
    complexion: String,
    education: {
      type: String,
      required: [true, 'Education is required']
    },
    occupation: {
      type: String,
      required: [true, 'Occupation is required']
    },
    income: Number,
    incomeCurrency: {
      type: String,
      default: 'INR'
    },
    fatherName: String,
    motherName: String,
    familyStatus: String,
    hobbies: [String],
    languages: [String],
    lookingFor: {
      type: String,
      required: [true, 'Looking for is required']
    },
    profilePhoto: {
      type: String,
      required: [true, 'Profile photo is required']
    },
    status: {
      type: String,
      enum: Object.values(MATRIMONY_STATUS),
      default: MATRIMONY_STATUS.PENDING_VERIFICATION
    },
    isPublic: {
      type: Boolean,
      default: false
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
    bio: String,
    views: {
      type: Number,
      default: 0
    },
    interests: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate age before save
matrimonySchema.pre('save', function (next) {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  this.age = age;
  next();
});

// Indexes
matrimonySchema.index({ userId: 1 });
matrimonySchema.index({ gender: 1 });
matrimonySchema.index({ status: 1 });
matrimonySchema.index({ isPublic: 1 });
matrimonySchema.index({ age: 1 });

module.exports = mongoose.model('Matrimony', matrimonySchema);
