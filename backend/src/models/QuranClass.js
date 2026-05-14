const mongoose = require('mongoose');
const { CLASS_LEVEL, SESSION_STATUS } = require('../config/constants');

const quranClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    masjidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Masjid',
      required: [true, 'Masjid ID is required']
    },
    imamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Imam ID is required']
    },
    level: {
      type: String,
      enum: Object.values(CLASS_LEVEL),
      required: [true, 'Level is required']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    classTime: {
      type: String,
      required: [true, 'Class time is required']
    },
    dayOfWeek: [
      {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    ],
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 15
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Max participants is required'],
      min: 1
    },
    currentParticipants: {
      type: Number,
      default: 0
    },
    agoraChannelName: {
      type: String,
      required: true,
      unique: true
    },
    curriculum: [
      {
        week: Number,
        topic: String,
        surahRange: String,
        ayahRange: String
      }
    ],
    status: {
      type: String,
      enum: Object.values(SESSION_STATUS),
      default: SESSION_STATUS.SCHEDULED
    }
  },
  {
    timestamps: true
  }
);

// Indexes
quranClassSchema.index({ masjidId: 1 });
quranClassSchema.index({ imamId: 1 });
quranClassSchema.index({ status: 1 });
quranClassSchema.index({ level: 1 });

module.exports = mongoose.model('QuranClass', quranClassSchema);
