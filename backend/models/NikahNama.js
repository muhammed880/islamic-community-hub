const mongoose = require('mongoose');

const nikahNamaSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: [true, 'Certificate number is required'],
      unique: true
    },
    groomName: {
      type: String,
      required: [true, 'Groom name is required'],
      trim: true
    },
    groomEmail: {
      type: String,
      required: [true, 'Groom email is required'],
      lowercase: true
    },
    groomPhone: {
      type: String,
      required: [true, 'Groom phone is required']
    },
    groomDateOfBirth: {
      type: Date,
      required: [true, 'Groom DOB is required']
    },
    groomAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    brideName: {
      type: String,
      required: [true, 'Bride name is required'],
      trim: true
    },
    brideEmail: {
      type: String,
      required: [true, 'Bride email is required'],
      lowercase: true
    },
    bridePhone: {
      type: String,
      required: [true, 'Bride phone is required']
    },
    brideeDateOfBirth: {
      type: Date,
      required: [true, 'Bride DOB is required']
    },
    brideAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    marriageDate: {
      type: Date,
      required: [true, 'Marriage date is required']
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by ID is required']
    },
    mahr: {
      type: Number,
      required: [true, 'Mahr is required'],
      min: 0
    },
    maharCurrency: {
      type: String,
      default: 'INR'
    },
    witnesses: [
      {
        name: {
          type: String,
          required: true
        },
        phone: String,
        email: String
      }
    ],
    certificatePDF: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
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
    notes: String
  },
  {
    timestamps: true
  }
);

// Indexes
nikahNamaSchema.index({ certificateNumber: 1 });
nikahNamaSchema.index({ masjidId: 1 });
nikahNamaSchema.index({ imamId: 1 });
nikahNamaSchema.index({ groomEmail: 1 });
nikahNamaSchema.index({ brideEmail: 1 });
nikahNamaSchema.index({ status: 1 });
nikahNamaSchema.index({ marriageDate: 1 });

module.exports = mongoose.model('NikahNama', nikahNamaSchema);
