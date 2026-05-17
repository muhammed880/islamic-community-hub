const mongoose = require('mongoose');
const { MASJID_STATUS } = require('../config/constants');

const masjidRegistrationFormSchema = new mongoose.Schema(
  {
    formNumber: {
      type: String,
      required: true,
      unique: true
    },
    
    // MASJID BASIC INFORMATION
    basicInfo: {
      masjidName: {
        type: String,
        required: [true, 'Masjid name is required']
      },
      previousName: String,
      establishmentYear: {
        type: Number,
        required: [true, 'Establishment year is required']
      },
      foundedBy: String,
      typeOfMasjid: {
        type: String,
        enum: ['Main Masjid', 'Community Mosque', 'Madrassa', 'Prayer Hall', 'Other'],
        required: true
      }
    },
    
    // LOCATION DETAILS
    locationDetails: {
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
        country: {
          type: String,
          default: 'India'
        }
      },
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      landmarkDescription: String,
      pinCode: String
    },
    
    // CONTACT INFORMATION
    contact: {
      primaryPhone: {
        type: String,
        required: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
      },
      secondaryPhone: String,
      email: {
        type: String,
        required: true,
        lowercase: true
      },
      website: String,
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String
      }
    },
    
    // AUTHORITY DETAILS
    authority: {
      authorityName: {
        type: String,
        required: [true, 'Authority name is required']
      },
      position: String,
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true
      },
      address: String,
      userId: mongoose.Schema.Types.ObjectId
    },
    
    // FINANCIAL DETAILS
    financial: {
      bankName: {
        type: String,
        required: true
      },
      bankBranch: String,
      accountNumber: {
        type: String,
        required: true
      },
      accountHolderName: {
        type: String,
        required: true
      },
      ifscCode: {
        type: String,
        required: true
      },
      upiId: {
        type: String,
        required: [true, 'UPI ID is required'],
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/, 'Invalid UPI ID format']
      },
      panNumber: String,
      accountType: {
        type: String,
        enum: ['Savings', 'Current', 'Other']
      }
    },
    
    // TRUST/REGISTRATION DOCUMENTS
    documents: {
      registrationCertificate: {
        fileUrl: String,
        fileName: String,
        uploadDate: Date,
        verified: Boolean
      },
      trustDeed: {
        fileUrl: String,
        fileName: String,
        uploadDate: Date,
        verified: Boolean
      },
      byLaws: {
        fileUrl: String,
        fileName: String,
        uploadDate: Date
      },
      municipalPermit: {
        fileUrl: String,
        fileName: String,
        uploadDate: Date
      },
      taxExemptionCertificate: {
        fileUrl: String,
        fileName: String,
        uploadDate: Date
      },
      photographsOfMasjid: [
        {
          url: String,
          caption: String
        }
      ]
    },
    
    // FACILITIES
    facilities: {
      prayerHall: Boolean,
      madrassah: Boolean,
      library: Boolean,
      cafeteria: Boolean,
      parking: Boolean,
      wheelchairAccessible: Boolean,
      ablutionArea: Boolean,
      separateWomensSection: Boolean,
      firstAidKit: Boolean,
      otherFacilities: [String]
    },
    
    // STAFFING
    staffing: {
      principalImamName: String,
      principalImamQualifications: String,
      totalImams: Number,
      totalStaff: Number,
      staffList: [
        {
          name: String,
          position: String,
          qualifications: String,
          phone: String
        }
      ]
    },
    
    // PRAYER SCHEDULE
    prayerSchedule: {
      fajr: {
        time: String,
        jamaatStartsAt: String
      },
      dhuhr: {
        time: String,
        jamaatStartsAt: String
      },
      asr: {
        time: String,
        jamaatStartsAt: String
      },
      maghrib: {
        time: String,
        jamaatStartsAt: String
      },
      isha: {
        time: String,
        jamaatStartsAt: String
      },
      jummuahTime: String,
      specialPrayerTimings: String
    },
    
    // ACTIVITIES
    activities: {
      islamicClasses: Boolean,
      quranRecitationClasses: Boolean,
      womensForum: Boolean,
      youthPrograms: Boolean,
      counselingServices: Boolean,
      charityPrograms: Boolean,
      otherActivities: [String]
    },
    
    // MEMBERSHIP
    membership: {
      estimatedMembers: Number,
      membershipFee: Number,
      membershipBenefits: [String]
    },
    
    // REGISTRATION FEES
    registrationFees: {
      feeAmount: {
        type: Number,
        default: 5000
      },
      feePaid: Boolean,
      paymentProof: String,
      paymentDate: Date,
      upiTransactionId: String
    },
    
    // STATUS & VERIFICATION
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended'],
      default: 'draft'
    },
    
    submittedDate: Date,
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verificationNotes: String,
    verificationDate: Date,
    
    rejectionReason: String,
    rejectionDetails: String,
    
    // RENEWAL
    renewalDueDate: Date,
    renewalStatus: {
      type: String,
      enum: ['active', 'due_for_renewal', 'suspended', 'expired'],
      default: 'active'
    },
    
    // ATTACHMENTS
    attachments: [
      {
        name: String,
        url: String,
        type: String,
        uploadDate: Date
      }
    ],
    
    notes: String,
    internalComments: String
  },
  {
    timestamps: true
  }
);

// Indexes
masjidRegistrationFormSchema.index({ formNumber: 1 });
masjidRegistrationFormSchema.index({ 'basicInfo.masjidName': 1 });
masjidRegistrationFormSchema.index({ status: 1 });
masjidRegistrationFormSchema.index({ 'authority.userId': 1 });

module.exports = mongoose.model('MasjidRegistrationForm', masjidRegistrationFormSchema);
