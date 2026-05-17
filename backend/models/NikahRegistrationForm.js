const mongoose = require('mongoose');

const nikahRegistrationFormSchema = new mongoose.Schema(
  {
    formNumber: {
      type: String,
      required: true,
      unique: true
    },
    
    masjidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Masjid',
      required: true
    },
    
    // GROOM REGISTRATION
    groomRegistration: {
      personalDetails: {
        fullName: {
          type: String,
          required: [true, 'Groom full name is required']
        },
        fatherName: {
          type: String,
          required: [true, 'Groom father name is required']
        },
        motherName: String,
        dateOfBirth: {
          type: Date,
          required: [true, 'Groom DOB is required']
        },
        age: Number,
        gender: {
          type: String,
          default: 'Male'
        }
      },
      
      contactDetails: {
        email: {
          type: String,
          required: true,
          lowercase: true
        },
        phone: {
          type: String,
          required: true
        },
        address: {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: {
            type: String,
            default: 'India'
          }
        }
      },
      
      identificationDocuments: {
        aadhaarNumber: String,
        panNumber: String,
        passportNumber: String,
        drivingLicenseNumber: String,
        documents: [
          {
            documentType: String,
            fileUrl: String,
            uploadDate: Date
          }
        ]
      },
      
      educationDetails: {
        education: String,
        occupation: String,
        monthlyIncome: Number,
        businessDetails: String
      },
      
      familyDetails: {
        fatherOccupation: String,
        motherOccupation: String,
        numberOfSiblings: Number,
        familyBackground: String
      },
      
      religiousBackground: {
        islamicKnowledge: String,
        quranMemorization: {
          isHafiz: Boolean,
          ayahMemorized: Number
        },
        prayerRegularity: String,
        otherReligiousActivities: String
      },
      
      marriageHistory: {
        isFirstMarriage: Boolean,
        numberOfPreviousMarriages: Number,
        divorceDetails: String
      },
      
      healthDeclaration: {
        healthStatus: String,
        anyMedicalConditions: String,
        confirmHealthyForMarriage: Boolean
      }
    },
    
    // BRIDE REGISTRATION
    brideRegistration: {
      personalDetails: {
        fullName: {
          type: String,
          required: [true, 'Bride full name is required']
        },
        fatherName: {
          type: String,
          required: [true, 'Bride father name is required']
        },
        motherName: String,
        dateOfBirth: {
          type: Date,
          required: [true, 'Bride DOB is required']
        },
        age: Number,
        gender: {
          type: String,
          default: 'Female'
        }
      },
      
      contactDetails: {
        email: {
          type: String,
          required: true,
          lowercase: true
        },
        phone: {
          type: String,
          required: true
        },
        address: {
          street: String,
          city: String,
          state: String,
          zipCode: String,
          country: {
            type: String,
            default: 'India'
          }
        }
      },
      
      identificationDocuments: {
        aadhaarNumber: String,
        panNumber: String,
        passportNumber: String,
        drivingLicenseNumber: String,
        documents: [
          {
            documentType: String,
            fileUrl: String,
            uploadDate: Date
          }
        ]
      },
      
      educationDetails: {
        education: String,
        occupation: String,
        monthlyIncome: Number,
        businessDetails: String
      },
      
      familyDetails: {
        fatherOccupation: String,
        motherOccupation: String,
        numberOfSiblings: Number,
        familyBackground: String
      },
      
      religiousBackground: {
        islamicKnowledge: String,
        quranMemorization: {
          isHafiza: Boolean,
          ayahMemorized: Number
        },
        prayerRegularity: String,
        otherReligiousActivities: String
      },
      
      marriageHistory: {
        isFirstMarriage: Boolean,
        numberOfPreviousMarriages: Number,
        divorceDetails: String
      },
      
      healthDeclaration: {
        healthStatus: String,
        anyMedicalConditions: String,
        confirmHealthyForMarriage: Boolean
      }
    },
    
    // MARRIAGE DETAILS
    marriageDetails: {
      date: {
        type: Date,
        required: [true, 'Marriage date is required']
      },
      time: String,
      venue: {
        type: String,
        required: [true, 'Marriage venue is required']
      },
      
      mahr: {
        amount: {
          type: Number,
          required: [true, 'Mahr amount is required']
        },
        currency: {
          type: String,
          default: 'INR'
        },
        amountInWords: String,
        paymentMethod: {
          type: String,
          enum: ['Cash', 'Cheque', 'Bank Transfer', 'Gold/Jewelry', 'Property', 'Other']
        },
        maharConditions: String
      },
      
      marriageTerms: {
        mutualConsent: {
          type: Boolean,
          required: true
        },
        parentalConsent: {
          groomParentConsent: Boolean,
          brideParentConsent: Boolean
        },
        specialConditions: String,
        maintenanceArrangements: String
      }
    },
    
    // IMAM & WITNESSES
    ceremonyDetails: {
      imamName: {
        type: String,
        required: [true, 'Imam name is required']
      },
      imamQualifications: String,
      imamPhone: String,
      
      witnesses: [
        {
          name: {
            type: String,
            required: true
          },
          fatherName: String,
          age: Number,
          address: {
            street: String,
            city: String,
            state: String
          },
          phone: String,
          email: String,
          aadhaarNumber: String,
          witnessType: {
            type: String,
            enum: ['Groom Side', 'Bride Side', 'Neutral']
          }
        }
      ],
      
      familyAndGuests: [
        {
          name: String,
          relation: String,
          phone: String
        }
      ]
    },
    
    // QURANIC REFERENCE
    quranReference: {
      mainAyat: {
        type: String,
        default: 'Surah An-Noor (24:32-33)'
      },
      translation: {
        type: String,
        default: 'And marry off the unmarried among you and the righteous slaves and handmaidens among you. If they should be poor, Allah will enrich them from His bounty, and Allah is All-Encompassing and All-Knowing.'
      },
      additionalAyat: String
    },
    
    // SIGNATURES & DIGITAL MARKS
    signatures: {
      groomSignature: {
        digitalSignature: String,
        signatureDate: Date,
        signatureImage: String
      },
      brideSignature: {
        digitalSignature: String,
        signatureDate: Date,
        signatureImage: String
      },
      imamSignature: {
        digitalSignature: String,
        signatureDate: Date,
        signatureImage: String
      },
      witness1Signature: {
        digitalSignature: String,
        signatureDate: Date,
        signatureImage: String
      },
      witness2Signature: {
        digitalSignature: String,
        signatureDate: Date,
        signatureImage: String
      },
      authoritySignature: {
        digitalSignature: String,
        signatureDate: Date,
        signatureImage: String
      }
    },
    
    // DOCUMENT UPLOADS
    documents: [
      {
        documentType: {
          type: String,
          enum: ['Groom ID', 'Bride ID', 'Marriage Invitation', 'Ceremony Photos', 'Video Recording', 'Other']
        },
        fileUrl: String,
        fileName: String,
        uploadDate: Date
      }
    ],
    
    // STATUS & PROCESSING
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'verified', 'certificate_issued', 'rejected'],
      default: 'draft'
    },
    
    submittedDate: Date,
    submittedBy: mongoose.Schema.Types.ObjectId,
    
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verificationDate: Date,
    verificationNotes: String,
    
    certificateIssued: Boolean,
    certificateIssuedDate: Date,
    certificateNumber: String,
    certificatePdfUrl: String,
    
    rejectionReason: String,
    rejectionDetails: String,
    
    // PDF CERTIFICATE INFO
    certificate: {
      pdfUrl: String,
      pdfGeneratedDate: Date,
      qrCode: String,
      certificateDesign: {
        borderStyle: {
          type: String,
          enum: ['Islamic Pattern', 'Simple Border', 'Gold Border', 'Custom'],
          default: 'Islamic Pattern'
        },
        backgroundColor: String,
        textColor: String
      }
    },
    
    // SHARING & RECORDS
    isPublic: {
      type: Boolean,
      default: false
    },
    
    views: {
      type: Number,
      default: 0
    },
    
    shares: [
      {
        sharedWith: String,
        sharedDate: Date,
        sharedBy: mongoose.Schema.Types.ObjectId
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
nikahRegistrationFormSchema.index({ formNumber: 1 });
nikahRegistrationFormSchema.index({ masjidId: 1 });
nikahRegistrationFormSchema.index({ status: 1 });
nikahRegistrationFormSchema.index({ 'groomRegistration.contactDetails.email': 1 });
nikahRegistrationFormSchema.index({ 'brideRegistration.contactDetails.email': 1 });
nikahRegistrationFormSchema.index({ certificateNumber: 1 });

module.exports = mongoose.model('NikahRegistrationForm', nikahRegistrationFormSchema);
