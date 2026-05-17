const mongoose = require('mongoose');

const nikahNamaSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: [true, 'Certificate number is required'],
      unique: true,
      index: true
    },
    masjidId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Masjid',
      required: [true, 'Masjid ID is required'],
      index: true
    },
    masjidDetails: {
      masjidName: {
        type: String,
        required: true
      },
      address: String,
      phone: String,
      email: String,
      uniqueId: String,
      registrationNumber: String,
      seal: String
    },
    
    // GROOM DETAILS
    groom: {
      fullName: {
        type: String,
        required: [true, 'Groom full name is required']
      },
      fatherName: {
        type: String,
        required: [true, 'Groom father name is required']
      },
      email: {
        type: String,
        required: [true, 'Groom email is required'],
        lowercase: true
      },
      phone: {
        type: String,
        required: [true, 'Groom phone is required']
      },
      dateOfBirth: {
        type: Date,
        required: [true, 'Groom DOB is required']
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
        zipCode: String,
        country: {
          type: String,
          default: 'India'
        }
      },
      signature: String,
      thumbprint: String
    },
    
    // BRIDE DETAILS
    bride: {
      fullName: {
        type: String,
        required: [true, 'Bride full name is required']
      },
      fatherName: {
        type: String,
        required: [true, 'Bride father name is required']
      },
      email: {
        type: String,
        required: [true, 'Bride email is required'],
        lowercase: true
      },
      phone: {
        type: String,
        required: [true, 'Bride phone is required']
      },
      dateOfBirth: {
        type: Date,
        required: [true, 'Bride DOB is required']
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
        zipCode: String,
        country: {
          type: String,
          default: 'India'
        }
      },
      signature: String,
      thumbprint: String
    },
    
    // MARRIAGE DETAILS
    marriage: {
      date: {
        type: Date,
        required: [true, 'Marriage date is required']
      },
      venue: {
        type: String,
        required: [true, 'Marriage venue is required']
      },
      time: String,
      mahr: {
        type: Number,
        required: [true, 'Mahr is required'],
        min: 0
      },
      maharCurrency: {
        type: String,
        default: 'INR'
      },
      maharInWords: String,
      conditions: String
    },
    
    // IMAM DETAILS
    imam: {
      name: {
        type: String,
        required: [true, 'Imam name is required']
      },
      imamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      qualifications: String,
      signature: String
    },
    
    // WITNESSES (Minimum 2)
    witnesses: [
      {
        name: {
          type: String,
          required: true
        },
        fatherName: String,
        address: {
          street: String,
          city: String,
          state: String
        },
        phone: String,
        email: String,
        signature: String,
        signatureDate: Date
      }
    ],
    
    // FAMILY MEMBERS (Present at ceremony)
    familyMembers: [
      {
        name: String,
        relation: String,
        phone: String,
        address: String
      }
    ],
    
    // QURANIC REFERENCE
    quranReference: {
      ayat: {
        type: String,
        default: 'Surah An-Noor (24:32-33)'
      },
      translation: {
        type: String,
        default: 'And marry off the unmarried among you and the righteous slaves and handmaidens among you...'
      }
    },
    
    // CERTIFICATE STATUS
    status: {
      type: String,
      enum: ['draft', 'submitted', 'pending_verification', 'verified', 'rejected', 'issued'],
      default: 'draft'
    },
    
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    verifiedDate: Date,
    
    // PDF DETAILS
    certificate: {
      pdfUrl: String,
      pdfGeneratedDate: Date,
      qrCode: String,
      digitalSignature: String
    },
    
    // REGISTRATION FORM DETAILS
    registrationForm: {
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      submittedDate: Date,
      formData: mongoose.Schema.Types.Mixed,
      attachments: [
        {
          fileName: String,
          fileUrl: String,
          fileType: String,
          uploadDate: Date
        }
      ]
    },
    
    // SHARING & ACCESS
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
    rejectionReason: String
  },
  {
    timestamps: true
  }
);

// Indexes
nikahNamaSchema.index({ certificateNumber: 1 });
nikahNamaSchema.index({ masjidId: 1 });
nikahNamaSchema.index({ 'groom.email': 1 });
nikahNamaSchema.index({ 'bride.email': 1 });
nikahNamaSchema.index({ status: 1 });
nikahNamaSchema.index({ 'marriage.date': 1 });

module.exports = mongoose.model('NikahNama', nikahNamaSchema);
