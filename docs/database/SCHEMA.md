# MongoDB Database Schema Design

## 1. Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum['super_admin', 'masjid_authority', 'general_user'],
  
  // Profile Info
  firstName: String,
  lastName: String,
  profilePicture: String (URL),
  gender: Enum['male', 'female'],
  dateOfBirth: Date,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    latitude: Number,
    longitude: Number
  },
  
  // Status & Verification
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  isApproved: Boolean,
  approvedBy: ObjectId (ref: users),
  approvalDate: Date,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  
  // Account Status
  isActive: Boolean,
  isBlocked: Boolean,
  blockedReason: String
}
