const mongoose = require('mongoose');

const nikahRegistrationFormSchema = new mongoose.Schema(
  {
    // FORM IDENTIFIER
    formNumber: {
      type: String,
      required: true,
      unique: true
    },

    masjidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Masjid',
      required: [true, 'Masjid ID is required']
    },

    // ==================== MARRIAGE CEREMONY DETAILS ====================
    ceremonyDetails: {
      marriageDate: {
        type: Date,
        required: [true, 'Marriage date is required']
      },
      
      marriageVenue: {
        type: String,
        required: [true, 'Marriage venue is required'],
        trim: true
      },

      ceremonyTime: String,

      ceremonyAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
      }
    },

    // ==================== SOLEMNIZING IMAM/QAZI DETAILS ====================
    imam: {
      name: {
        type: String,
        required: [true, 'Imam/Qazi name is required'],
        trim: true
      },

      contact: {
        phone: {
          type: String,
          required: [true, 'Imam contact number is required'],
          match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
        },
        email: String
      },

      qualifications: String,

      registrationNumber: String,

      // Only name will be copied to certificate
      certificateName: String // Auto-filled from name
    },

    // ==================== GROOM DETAILS ====================
    groom: {
      personalDetails: {
        fullName: {
          type: String,
          required: [true, 'Groom full name is required'],
          trim: true
        },

        // AADHAR - MANDATE & DUPLICATE CHECK
        aadharNumber: {
          type: String,
          required: [true, 'Groom Aadhaar number is required'],
          unique: false, // Allow duplicates but check in code
          match: [/^\d{12}$/, 'Aadhaar must be 12 digits'],
          index: true
        },

        fatherName: {
          type: String,
          required: [true, 'Father name is required'],
          trim: true
        },

        motherName: String,

        dateOfBirth: {
          type: Date,
          required: [true, 'Date of birth is required']
        },

        age: Number, // Calculated from DOB

        gender: {
          type: String,
          default: 'Male'
        }
      },

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
        }
      },

      contactDetails: {
        mobileNumber: {
          type: String,
          required: [true, 'Mobile number is required'],
          match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
        },
        email: String,
        whatsappNumber: String
      },

      photoDetails: {
        photoUrl: {
          type: String,
          required: [true, 'Groom photo is required']
        },
        photoUploadDate: Date,
        photoFileName: String
      },

      identificationType: {
        type: String,
        enum: ['Aadhaar', 'Passport', 'Driving License', 'Voter ID'],
        default: 'Aadhaar'
      },

      identificationNumber: String,

      identificationDocument: {
        fileUrl: String,
        uploadDate: Date
      },

      // PREVIOUS MARRIAGE DETAILS (if duplicate Aadhaar found)
      previousMarriageRecord: {
        hasPreviousMarriage: Boolean,
        previousMarriageDate: Date,
        previousSpouseName: String,
        divorceDate: Date,
        divorceProof: String
      }
    },

    // ==================== BRIDE DETAILS ====================
    bride: {
      personalDetails: {
        fullName: {
          type: String,
          required: [true, 'Bride full name is required'],
          trim: true
        },

        // AADHAR - MANDATE & DUPLICATE CHECK
        aadharNumber: {
          type: String,
          required: [true, 'Bride Aadhaar number is required'],
          unique: false,
          match: [/^\d{12}$/, 'Aadhaar must be 12 digits'],
          index: true
        },

        fatherName: {
          type: String,
          required: [true, 'Father name is required'],
          trim: true
        },

        motherName: String,

        dateOfBirth: {
          type: Date,
          required: [true, 'Date of birth is required']
        },

        age: Number, // Calculated from DOB

        gender: {
          type: String,
          default: 'Female'
        }
      },

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
        }
      },

      contactDetails: {
        mobileNumber: {
          type: String,
          required: [true, 'Mobile number is required'],
          match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
        },
        email: String,
        whatsappNumber: String
      },

      photoDetails: {
        photoUrl: {
          type: String,
          required: [true, 'Bride photo is required']
        },
        photoUploadDate: Date,
        photoFileName: String
      },

      identificationType: {
        type: String,
        enum: ['Aadhaar', 'Passport', 'Driving License', 'Voter ID'],
        default: 'Aadhaar'
      },

      identificationNumber: String,

      identificationDocument: {
        fileUrl: String,
        uploadDate: Date
      },

      // PREVIOUS MARRIAGE DETAILS (if duplicate Aadhaar found)
      previousMarriageRecord: {
        hasPreviousMarriage: Boolean,
        previousMarriageDate: Date,
        previousSpouseName: String,
        divorceDate: Date,
        divorceProof: String
      }
    },

    // ==================== WITNESS 1 DETAILS ====================
    witness1: {
      name: {
        type: String,
        required: [true, 'Witness 1 name is required'],
        trim: true
      },

      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
      },

      contactNumber: {
        type: String,
        required: [true, 'Witness 1 contact is required'],
        match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
      },

      email: String,

      aadharNumber: String,

      // Only name will be copied to certificate
      certificateName: String // Auto-filled from name
    },

    // ==================== WITNESS 2 DETAILS ====================
    witness2: {
      name: {
        type: String,
        required: [true, 'Witness 2 name is required'],
        trim: true
      },

      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
      },

      contactNumber: {
        type: String,
        required: [true, 'Witness 2 contact is required'],
        match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
      },

      email: String,

      aadharNumber: String,

      // Only name will be copied to certificate
      certificateName: String // Auto-filled from name
    },

    // ==================== WAKEEL (OPTIONAL) ====================
    wakeel: {
      isApplicable: {
        type: Boolean,
        default: false
      },

      name: String,

      relationshipToParty: String, // Father, Uncle, Brother, etc.

      contactNumber: String,

      email: String,

      aadharNumber: String
    },

    // ==================== MAHR (DOWER) DETAILS ====================
    mahr: {
      amount: {
        type: Number,
        required: [true, 'Mahr amount is required'],
        min: [0, 'Mahr cannot be negative']
      },

      currency: {
        type: String,
        default: 'INR',
        enum: ['INR', 'USD', 'GBP', 'SAR']
      },

      amountInWords: {
        type: String,
        required: true
      },

      maharType: {
        type: String,
        enum: ['Cash', 'Gold/Jewelry', 'Property', 'Quran/Books', 'Service', 'Mixed'],
        required: true
      },

      description: String, // Details about the mahr

      paymentDueDate: Date,

      paymentMethod: String, // Immediate, Deferred, Mixed
    },

    // ==================== TERMS & CONDITIONS ====================
    termsAndConditions: {
      mutualConsent: {
        type: Boolean,
        required: [true, 'Mutual consent is mandatory']
      },

      groomConsent: {
        accepted: Boolean,
        acceptanceDate: Date,
        signatureUrl: String
      },

      brideConsent: {
        accepted: Boolean,
        acceptanceDate: Date,
        signatureUrl: String
      },

      parentalConsent: {
        groomParentConsent: {
          accepted: Boolean,
          parentName: String,
          signatureUrl: String
        },
        brideParentConsent: {
          accepted: Boolean,
          parentName: String,
          signatureUrl: String
        }
      },

      specialConditions: String, // Any additional terms

      conditions: [
        {
          condition: String,
          agreedBy: String // Groom/Bride/Both
        }
      ]
    },

    // ==================== NIKAH REGISTRATION FEE ====================
    registrationFee: {
      amount: {
        type: Number,
        default: 500 // Preset by Super Admin per masjid
      },

      currency: {
        type: String,
        default: 'INR'
      },

      paymentMethod: {
        type: String,
        enum: ['Cash', 'Online UPI'],
        default: 'Cash'
      },

      paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
      },

      // For Online Payment
      upiId: String, // Masjid UPI ID

      upiTransactionId: String,

      utrNumber: String,

      paymentProofScreenshot: String,

      paymentDate: Date,

      paymentRemarks: String
    },

    // ==================== CERTIFICATE & UNIQUE ID ====================
    certificate: {
      uniqueId: {
        type: String,
        unique: true,
        sparse: true
      },

      certificateNumber: {
        type: String,
        unique: true,
        sparse: true
      },

      certificateGenerated: Boolean,

      certificateGeneratedDate: Date,

      certificatePdfUrl: String,

      certificateQrCode: String,

      designStyle: {
        type: String,
        enum: ['Islamic Pattern 1', 'Islamic Pattern 2', 'Gold Border', 'Green Theme'],
        default: 'Islamic Pattern 1'
      },

      certificateStatus: {
        type: String,
        enum: ['draft', 'preview', 'generated', 'printed', 'shared'],
        default: 'draft'
      }
    },

    // ==================== SHARING & PRINT OPTIONS ====================
    sharing: {
      shareLinks: [
        {
          shareToken: String,
          sharedWith: String,
          sharedDate: Date,
          expiryDate: Date
        }
      ],

      printCount: {
        type: Number,
        default: 0
      },

      lastPrintDate: Date,

      downloadCount: {
        type: Number,
        default: 0
      },

      lastDownloadDate: Date
    },

    // ==================== FORM STATUS & TRACKING ====================
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'verified', 'certificate_issued', 'rejected'],
      default: 'draft'
    },

    formProgress: {
      step1_ceremony: Boolean,
      step2_imam: Boolean,
      step3_groom: Boolean,
      step4_bride: Boolean,
      step5_witnesses: Boolean,
      step6_mahr: Boolean,
      step7_terms: Boolean,
      step8_fee: Boolean,
      allStepsCompleted: Boolean
    },

    submittedDate: Date,

    submittedBy: mongoose.Schema.Types.ObjectId, // User who submitted

    // ==================== VERIFICATION ====================
    verification: {
      verifiedBy: mongoose.Schema.Types.ObjectId,

      verificationDate: Date,

      verificationNotes: String,

      documentVerificationStatus: {
        groomAadhaarVerified: Boolean,
        brideAadhaarVerified: Boolean,
        witness1Verified: Boolean,
        witness2Verified: Boolean,
        allDocumentsVerified: Boolean
      },

      duplicateAadhaarCheck: {
        groomDuplicateFound: Boolean,
        brideDuplicateFound: Boolean,
        duplicateDetails: String
      }
    },

    // ==================== REJECTION ====================
    rejection: {
      rejectionReason: String,
      rejectionDetails: String,
      rejectionDate: Date,
      rejectedBy: mongoose.Schema.Types.ObjectId,
      canResubmit: Boolean
    },

    // ==================== QURANIC REFERENCE ====================
    quranReference: {
      mainAyat: {
        type: String,
        default: 'Surah An-Noor (24:32-33)'
      },

      arabicText: String,

      translation: {
        type: String,
        default: 'And marry off the unmarried among you and the righteous slaves and handmaidens among you...'
      }
    },

    // ==================== INTERNAL TRACKING ====================
    internalNotes: String,

    lastModifiedBy: mongoose.Schema.Types.ObjectId,

    lastModifiedDate: Date,

    assignedTo: mongoose.Schema.Types.ObjectId // Masjid Authority assigned
  },
  {
    timestamps: true
  }
);

// ==================== PRE-SAVE HOOKS ====================

// Auto-fill certificate names
nikahRegistrationFormSchema.pre('save', function (next) {
  if (this.imam && this.imam.name) {
    this.imam.certificateName = this.imam.name;
  }
  if (this.witness1 && this.witness1.name) {
    this.witness1.certificateName = this.witness1.name;
  }
  if (this.witness2 && this.witness2.name) {
    this.witness2.certificateName = this.witness2.name;
  }

  // Calculate ages
  if (this.groom.personalDetails.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.groom.personalDetails.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.groom.personalDetails.age = age;
  }

  if (this.bride.personalDetails.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.bride.personalDetails.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.bride.personalDetails.age = age;
  }

  next();
});

// ==================== INDEXES ====================

nikahRegistrationFormSchema.index({ formNumber: 1 });
nikahRegistrationFormSchema.index({ masjidId: 1 });
nikahRegistrationFormSchema.index({ status: 1 });
nikahRegistrationFormSchema.index({ 'groom.personalDetails.aadharNumber': 1 });
nikahRegistrationFormSchema.index({ 'bride.personalDetails.aadharNumber': 1 });
nikahRegistrationFormSchema.index({ 'certificate.uniqueId': 1 });
nikahRegistrationFormSchema.index({ 'certificate.certificateNumber': 1 });
nikahRegistrationFormSchema.index({ 'ceremonyDetails.marriageDate': 1 });

module.exports = mongoose.model('NikahRegistrationForm', nikahRegistrationFormSchema);
