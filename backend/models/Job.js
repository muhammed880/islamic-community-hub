const mongoose = require('mongoose');
const { JOB_STATUS } = require('../config/constants');

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required']
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
    jobType: {
      type: String,
      enum: ['full_time', 'part_time', 'volunteer'],
      required: [true, 'Job type is required']
    },
    salaryRange: {
      minSalary: {
        type: Number,
        required: true,
        min: 0
      },
      maxSalary: {
        type: Number,
        required: true,
        min: 0
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    location: {
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      }
    },
    qualifications: [String],
    experience: {
      type: Number,
      default: 0
    },
    skills: [String],
    closingDate: {
      type: Date,
      required: [true, 'Closing date is required']
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.ACTIVE
    },
    applicantCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
jobSchema.index({ masjidId: 1 });
jobSchema.index({ createdBy: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ closingDate: 1 });
jobSchema.index({ 'location.city': 1 });

module.exports = mongoose.model('Job', jobSchema);
