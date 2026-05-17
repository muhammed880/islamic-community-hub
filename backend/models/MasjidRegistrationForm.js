const mongoose = require('mongoose');

const masjidRegistrationFormSchema = new mongoose.Schema(
  {
    // UNIQUE IDENTIFIER
    uniqueId: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },
    
    formNumber: {
      type: String,
      required: true,
      unique: true
    },
    
    // BASIC MASJID INFORMATION
    masjidName: {
      type: String,
      required: [true, 'Masjid name is required'],
      trim: true
    },
    
    // ADDRESS WITH GEO-TAGGING
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required']
      },
      country: {
        type: String,
        default: 'India'
      },
      // GEO-TAGGING
      latitude: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required']
      },
      landmark: String,
      googleMapsLink: String
    },
    
    // CONTACT INFORMATION
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Invalid mobile number format']
    },
    
    // UPI ID FOR DONATIONS
    upiId: {
      type: String,
      required: [true, 'UPI ID is required'],
      match: [/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/, 'Invalid UPI ID format'],
      lowercase: true,
      unique: true
    },
    
    // REGISTRATION FEE DETAILS (PRESET BY SUPER ADMIN)
    registrationFee: {
      amount: {
        type: Number,
        default: 5000
      },
      currency: {
        type: String,
        default: 'INR'
      },
      superAdminUpiId: {
        type: String,
        default: 'superadmin@upi'
      },
      description: {
        type: String,
        default: 'Masjid Registration Fee'
      }
    },
    
    // PAYMENT DETAILS
    payment: {
      status: {
        type: String,
        enum: ['pending', 'initiated', 'completed', 'failed'],
        default: 'pending'
      },
      utrNumber: {
        type: String,
        default: null
      },
      upiTransactionId: {
        type: String,
        default: null
      },
      paymentDate: {
        type: Date,
        default: null
      },
      paymentMethod: {
        type: String,
        enum: ['UPI', 'Bank Transfer', 'Cheque'],
        default: 'UPI'
      },
      paymentProofScreenshot: String,
      remarks: String
    },
    
    // ORGANIZATION MEMBERS
    president: {
      name: {
        type: String,
        required: [true, 'President name is required']
      },
      mobileNumber: {
        type: String,
        required: [true, 'President mobile number is required'],
        match: [/^\+?[1-9]\d{1,14}$/, 'Invalid mobile number']
      },
      email: String,
      address: String,
      aadhaarNumber: String
    },
    
    secretary: {
      name: {
        type: String,
        required: [true, 'Secretary name is required']
      },
      mobileNumber: String,
      email: String
    },
    
    treasurer: {
      name: {
        type: String,
        required: [true, 'Treasurer name is required']
      },
      mobileNumber: String,
      email: String
    },
    
    // ADDITIONAL 3 MEMBERS
    additionalMembers: [
      {
        name: {
          type: String,
          required: true
        },
        position: String,
        mobileNumber: String
      }
    ],
    
    // DOCUMENTS UPLOAD
    documents: {
      registrationCertificate: {
        fileName: String,
        fileUrl: String,
        uploadDate: Date,
        fileSize: Number,
        verified: Boolean
      },
      trustDeed: {
        fileName: String,
        fileUrl: String,
        uploadDate: Date,
        fileSize: Number,
        verified: Boolean
      },
      presidentId: {
        fileName: String,
        fileUrl: String,
        uploadDate: Date,
        fileSize: Number,
        verified: Boolean
      },
      addressProof: {
        fileName: String,
        fileUrl: String,
        uploadDate: Date,
        fileSize: Number,
        verified: Boolean
      },
      otherDocuments: [
        {
          name: String,
          fileName: String,
          fileUrl: String,
          uploadDate: Date,
          fileSize: Number
        }
      ]
    },
    
    // FORM STATUS
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended'],
      default: 'draft'
    },
    
    submittedDate: {
      type: Date,
      default: null
    },
    
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    
    // VERIFICATION & APPROVAL
    verification: {
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
      },
      verificationDate: Date,
      verificationNotes: String,
      documentVerificationStatus: {
        registrationCertificateVerified: Boolean,
        trustDeedVerified: Boolean,
        presidentIdVerified: Boolean,
        addressProofVerified: Boolean,
        allDocumentsVerified: Boolean
      }
    },
    
    // REJECTION DETAILS
    rejection: {
      rejectionReason: String,
      rejectionDetails: String,
      rejectionDate: Date,
      rejectedBy: mongoose.Schema.Types.ObjectId
    },
    
    // APPROVAL & CREDENTIALS
    approval: {
      approvalDate: {
        type: Date,
        default: null
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      uniqueId: String,
      loginUsername: String,
      loginPassword: String, // Encrypted password
      credentialsSentDate: Date,
      credentialsSentTo: String,
      credentialsAcknowledged: Boolean,
      acknowledgementDate: Date
    },
    
    // RENEWAL
    renewal: {
      renewalDueDate: Date,
      renewalStatus: {
        type: String,
        enum: ['active', 'due_for_renewal', 'suspended', 'expired'],
        default: 'active'
      },
      renewalFeeAmount: {
        type: Number,
        default: 2000
      },
      lastRenewalDate: Date,
      nextRenewalDate: Date
    },
    
    // ADDITIONAL INFORMATION
    additionalInfo: {
      establishmentYear: Number,
      totalMembers: Number,
      prayerHallSize: String,
      facilities: [String],
      notes: String
    },
    
    // INTERNAL TRACKING
    internalNotes: String,
    assignedTo: mongoose.Schema.Types.ObjectId,
    lastModifiedBy: mongoose.Schema.Types.ObjectId,
    lastModifiedDate: Date
  },
  {
    timestamps: true
  }
);

// Indexes for faster queries
masjidRegistrationFormSchema.index({ uniqueId: 1 });
masjidRegistrationFormSchema.index({ formNumber: 1 });
masjidRegistrationFormSchema.index({ masjidName: 1 });
masjidRegistrationFormSchema.index({ status: 1 });
masjidRegistrationFormSchema.index({ 'address.city': 1 });
masjidRegistrationFormSchema.index({ upiId: 1 });
masjidRegistrationFormSchema.index({ submittedBy: 1 });
masjidRegistrationFormSchema.index({ 'approval.uniqueId': 1 });

module.exports = mongoose.model('MasjidRegistrationForm', masjidRegistrationFormSchema);
