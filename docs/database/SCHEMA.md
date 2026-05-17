# MongoDB Database Schema - Islamic Community Hub

## Collections Overview

### 1. Users Collection
Stores all user accounts (Super Admin, Masjid Authorities, General Users)

```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "password": "hashed_password",
  "phone": "+919876543210",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "role": "general_user",
  "profilePicture": "url_to_image",
  "dateOfBirth": "1990-05-15",
  "address": {
    "street": "123 Main St",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560001",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "isEmailVerified": true,
  "isPhoneVerified": true,
  "isActive": true,
  "createdAt": ISODate("2026-05-12"),
  "updatedAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `email` (unique)
- `phone` (unique)
- `role`
- `city`

---

### 2. Masjids Collection
Stores all masjid registrations and details

```json
{
  "_id": ObjectId,
  "masjidName": "Al-Noor Masjid",
  "adminId": ObjectId,
  "phone": "+919876543210",
  "email": "alnoor@example.com",
  "address": {
    "street": "456 Mosque Lane",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560002",
    "latitude": 12.9716,
    "longitude": 77.5946
  },
  "upiId": "alnoor@upi",
  "bankAccountNumber": "1234567890",
  "bankIFSC": "SBIN0001234",
  "bankName": "State Bank of India",
  "registrationCertificate": "url_to_file",
  "trustDeed": "url_to_file",
  "status": "approved",
  "registrationFeeAmount": 5000,
  "registrationFeeStatus": "paid",
  "registrationFeeDate": ISODate("2026-05-12"),
  "renewalDueDate": ISODate("2027-05-12"),
  "renewalFeeAmount": 2000,
  "establishmentYear": 2015,
  "totalMembers": 200,
  "totalDonations": 50000,
  "createdAt": ISODate("2026-05-12"),
  "updatedAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `adminId`
- `status`
- `city`
- `email` (unique)

---

### 3. Jobs Collection
Job postings created by Masjid Authorities

```json
{
  "_id": ObjectId,
  "jobTitle": "Imam",
  "jobDescription": "Experienced Imam needed for daily prayers",
  "masjidId": ObjectId,
  "createdBy": ObjectId,
  "jobType": "full_time",
  "salaryRange": {
    "minSalary": 30000,
    "maxSalary": 50000,
    "currency": "INR"
  },
  "location": {
    "city": "Bangalore",
    "state": "Karnataka"
  },
  "qualifications": ["Islamic Knowledge", "Quran Recitation"],
  "experience": 5,
  "skills": ["Leadership", "Communication"],
  "closingDate": ISODate("2026-06-12"),
  "status": "active",
  "applicantCount": 12,
  "createdAt": ISODate("2026-05-12"),
  "updatedAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `masjidId`
- `createdBy`
- `status`
- `closingDate`

---

### 4. Job Applications Collection
Track job applications

```json
{
  "_id": ObjectId,
  "jobId": ObjectId,
  "applicantId": ObjectId,
  "resume": "url_to_resume_pdf",
  "coverLetter": "Detailed cover letter text...",
  "applicationStatus": "pending",
  "appliedDate": ISODate("2026-05-12"),
  "statusUpdatedDate": ISODate("2026-05-12"),
  "rating": 0,
  "feedback": ""
}
```

**Indexes**:
- `jobId`
- `applicantId`
- `applicationStatus`

---

### 5. Matrimony Profiles Collection
Matrimonial profiles created by users

```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "fullName": "Aisha Khan",
  "dateOfBirth": "1995-05-15",
  "age": 31,
  "gender": "female",
  "height": "5'4\"",
  "complexion": "fair",
  "education": "Bachelor's in Engineering",
  "occupation": "Software Engineer",
  "income": 75000,
  "incomeCurrency": "INR",
  "fatherName": "Khan Ahmed",
  "motherName": "Zainab Khan",
  "familyStatus": "middle_class",
  "hobbies": ["Reading", "Quran Study"],
  "languages": ["English", "Urdu", "Hindi"],
  "lookingFor": "Honest and practicing Muslim",
  "profilePhoto": "url_to_photo",
  "status": "verified",
  "isPublic": true,
  "createdAt": ISODate("2026-05-12"),
  "updatedAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `userId`
- `gender`
- `status`
- `isPublic`
- `age`

---

### 6. Matrimony Interests Collection
Track expressed interests between users

```json
{
  "_id": ObjectId,
  "senderUserId": ObjectId,
  "receiverUserId": ObjectId,
  "senderProfileId": ObjectId,
  "receiverProfileId": ObjectId,
  "status": "pending",
  "sentDate": ISODate("2026-05-12"),
  "respondedDate": null,
  "message": "I am interested in connecting with you"
}
```

**Indexes**:
- `senderUserId`
- `receiverUserId`
- `status`

---

### 7. Needy Persons Collection
Profiles of needy people/families for Zakat distribution

```json
{
  "_id": ObjectId,
  "name": "Fatima Begum",
  "phone": "+919876543210",
  "gender": "female",
  "familySize": 4,
  "familyMembers": [
    {
      "name": "Ahmed",
      "age": 10,
      "relation": "son",
      "gender": "male"
    }
  ],
  "address": {
    "street": "789 Need Lane",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560003"
  },
  "masjidId": ObjectId,
  "createdBy": ObjectId,
  "monthlyIncome": 5000,
  "monthlyExpense": 12000,
  "reason": "medical",
  "description": "Son needs surgery",
  "estimatedAmount": 100000,
  "documents": ["url_to_doc1", "url_to_doc2"],
  "status": "approved",
  "zakatCollected": 45000,
  "zakatRemaining": 55000,
  "createdAt": ISODate("2026-05-12"),
  "updatedAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `masjidId`
- `createdBy`
- `status`
- `city`

---

### 8. Donations Collection
Tracks all donations to Masjids and Zakat to needy (UPI ONLY)

```json
{
  "_id": ObjectId,
  "donorId": ObjectId,
  "amount": 1000,
  "currency": "INR",
  "donationType": "masjid_donation",
  "masjidId": ObjectId,
  "needyPersonId": ObjectId,
  "upiTransactionId": "UPI12345678901234567890",
  "recipientUpiId": "alnoor@upi",
  "paymentProofScreenshot": "url_to_screenshot",
  "transactionStatus": "completed",
  "verifiedBy": ObjectId,
  "verifiedDate": ISODate("2026-05-12"),
  "receiptNumber": "RECEIPT-2026-00001",
  "receiptUrl": "url_to_receipt_pdf",
  "donationDate": ISODate("2026-05-12"),
  "createdAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `donorId`
- `masjidId`
- `needyPersonId`
- `transactionStatus`
- `upiTransactionId`
- `donationDate`

---

### 9. Quran Classes Collection
Quran learning classes conducted by Imam

```json
{
  "_id": ObjectId,
  "className": "Quran Fundamentals",
  "description": "Learn basics of Quran recitation",
  "masjidId": ObjectId,
  "imamId": ObjectId,
  "level": "beginner",
  "startDate": ISODate("2026-06-01"),
  "endDate": ISODate("2026-08-31"),
  "classTime": "19:00",
  "dayOfWeek": ["Monday", "Wednesday", "Friday"],
  "durationMinutes": 60,
  "maxParticipants": 30,
  "currentParticipants": 18,
  "agoraChannelName": "quran_class_xxx",
  "curriculum": [
    {
      "week": 1,
      "topic": "Introduction",
      "surahRange": "Al-Fatiha",
      "ayahRange": "1-7"
    }
  ],
  "status": "active",
  "createdAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `masjidId`
- `imamId`
- `status`

---

### 10. Class Enrollments Collection
Track student enrollments in Quran classes

```json
{
  "_id": ObjectId,
  "classId": ObjectId,
  "studentId": ObjectId,
  "enrollmentStatus": "approved",
  "enrolledDate": ISODate("2026-05-12"),
  "approvedDate": ISODate("2026-05-12"),
  "attendanceCount": 8,
  "totalClasses": 12,
  "attendancePercentage": 66.7
}
```

**Indexes**:
- `classId`
- `studentId`
- `enrollmentStatus`

---

### 11. Ask Imam Sessions Collection
Online Q&A sessions with Imam

```json
{
  "_id": ObjectId,
  "title": "Islamic Finance Q&A",
  "description": "Ask questions about Riba and Halal business",
  "masjidId": ObjectId,
  "imamId": ObjectId,
  "topic": "Islamic Finance",
  "scheduledDate": ISODate("2026-05-20"),
  "scheduledTime": "20:00",
  "durationMinutes": 90,
  "maxParticipants": 100,
  "currentRegistrations": 45,
  "agoraChannelName": "ask_imam_xxx",
  "status": "scheduled",
  "recordingUrl": "url_to_recording",
  "createdAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `masjidId`
- `imamId`
- `status`
- `scheduledDate`

---

### 12. Ask Imam Registrations Collection
Track registrations for Ask Imam sessions

```json
{
  "_id": ObjectId,
  "sessionId": ObjectId,
  "userId": ObjectId,
  "registrationDate": ISODate("2026-05-15"),
  "attendanceStatus": "attended",
  "questionsAsked": 2
}
```

**Indexes**:
- `sessionId`
- `userId`

---

### 13. Ask Imam Questions Collection
Questions submitted during or before Ask Imam sessions

```json
{
  "_id": ObjectId,
  "sessionId": ObjectId,
  "userId": ObjectId,
  "question": "Is cryptocurrency Halal in Islam?",
  "questionStatus": "answered",
  "answer": "The answer from Imam...",
  "answeredDate": ISODate("2026-05-20"),
  "questionLikes": 15,
  "submittedDate": ISODate("2026-05-15")
}
```

**Indexes**:
- `sessionId`
- `userId`
- `questionStatus`

---

### 14. Nikah Nama Collection
Marriage certificates issued by Masjids

```json
{
  "_id": ObjectId,
  "certificateNumber": "CERT-2026-00001",
  "groomName": "Ahmed Khan",
  "groomEmail": "ahmed@example.com",
  "groomPhone": "+919876543210",
  "groomDateOfBirth": "1995-03-15",
  "groomAddress": {...},
  "brideName": "Aisha Khan",
  "brideEmail": "aisha@example.com",
  "bridePhone": "+919876543211",
  "brideeDateOfBirth": "1996-07-20",
  "brideAddress": {...},
  "marriageDate": ISODate("2026-05-15"),
  "masjidId": ObjectId,
  "imamId": ObjectId,
  "createdBy": ObjectId,
  "mahr": 50000,
  "maharCurrency": "INR",
  "witnesses": [
    {
      "name": "Ali Khan",
      "phone": "+919876543210",
      "email": "ali@example.com"
    }
  ],
  "certificatePDF": "url_to_pdf",
  "status": "verified",
  "verifiedBy": ObjectId,
  "verifiedDate": ISODate("2026-05-12"),
  "createdAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `certificateNumber` (unique)
- `masjidId`
- `imamId`
- `groomEmail`
- `brideEmail`
- `status`

---

### 15. Transactions Collection
Records all financial transactions (UPI ONLY - No Payment Gateway)

```json
{
  "_id": ObjectId,
  "transactionType": "registration_fee",
  "amount": 5000,
  "currency": "INR",
  "fromUserId": ObjectId,
  "toUserId": ObjectId,
  "masjidId": ObjectId,
  "upiTransactionId": "UPI12345678901234567890",
  "recipientUpiId": "superadmin@upi",
  "paymentProofScreenshot": "url_to_screenshot",
  "transactionStatus": "completed",
  "description": "Registration fee for Al-Noor Masjid",
  "receiptNumber": "RECEIPT-2026-00001",
  "receiptUrl": "url_to_receipt",
  "transactionDate": ISODate("2026-05-12"),
  "createdAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `fromUserId`
- `toUserId`
- `masjidId`
- `transactionStatus`
- `upiTransactionId`
- `transactionDate`

---

### 16. Audit Logs Collection
Track all admin actions and important changes

```json
{
  "_id": ObjectId,
  "adminId": ObjectId,
  "action": "approved_masjid",
  "resourceType": "Masjid",
  "resourceId": ObjectId,
  "changes": {
    "status": ["pending", "approved"]
  },
  "reason": "All documents verified",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "createdAt": ISODate("2026-05-12")
}
```

**Indexes**:
- `adminId`
- `action`
- `createdAt`

---

## Database Relationships

```
Users (1) ──→ (Many) Masjids (adminId)
Users (1) ──→ (Many) Jobs (createdBy)
Users (1) ──→ (Many) Matrimony Profiles (userId)
Users (1) ──→ (Many) Job Applications (applicantId)
Users (1) ──→ (Many) Needy Persons (createdBy)
Users (1) ──→ (Many) Donations (donorId)
Users (1) ──→ (Many) Quran Classes (imamId)
Users (1) ──→ (Many) Ask Imam Sessions (imamId)
Users (1) ──→ (Many) Nikah Nama (imamId)
Masjids (1) ──→ (Many) Jobs (masjidId)
Masjids (1) ──→ (Many) Quran Classes (masjidId)
Masjids (1) ──→ (Many) Ask Imam Sessions (masjidId)
Masjids (1) ──→ (Many) Nikah Nama (masjidId)
Needy Persons (1) ──→ (Many) Donations (needyPersonId)
Quran Classes (1) ──→ (Many) Class Enrollments (classId)
Ask Imam Sessions (1) ──→ (Many) Registrations (sessionId)
Ask Imam Sessions (1) ──→ (Many) Questions (sessionId)
```

---

## Database Setup Commands

### Create Database
```javascript
use islamic_community_hub
```

### Create Collections with Validation
```javascript
// Example for Users collection
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "role"],
      properties: {
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { enum: ["super_admin", "masjid_authority", "general_user"] }
      }
    }
  }
})
```

### Create Indexes
```javascript
// Users
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ phone: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Masjids
db.masjids.createIndex({ adminId: 1 })
db.masjids.createIndex({ email: 1 }, { unique: true })
db.masjids.createIndex({ status: 1 })

// Jobs
db.jobs.createIndex({ masjidId: 1 })
db.jobs.createIndex({ status: 1 })

// Donations (UPI)
db.donations.createIndex({ donorId: 1 })
db.donations.createIndex({ masjidId: 1 })
db.donations.createIndex({ transactionStatus: 1 })
db.donations.createIndex({ upiTransactionId: 1 })

// Transactions (UPI)
db.transactions.createIndex({ fromUserId: 1 })
db.transactions.createIndex({ toUserId: 1 })
db.transactions.createIndex({ transactionStatus: 1 })
db.transactions.createIndex({ upiTransactionId: 1 })

// And so on for other collections...
```

---

## Key Changes for UPI-Only System

**Removed:**
- All Razorpay fields (razorpayOrderId, razorpayPaymentId, razorpaySignature)
- Payment gateway integration fields

**Added:**
- `upiTransactionId`: Direct UPI transaction identifier
- `recipientUpiId`: UPI ID of recipient (for donations/fees)
- `paymentProofScreenshot`: URL to payment screenshot uploaded by user
- `transactionStatus`: pending_verification → completed/rejected

**Transaction Flow:**
1. User makes UPI payment
2. Uploads screenshot as proof
3. Status: "pending_verification"
4. Masjid/Admin verifies in their UPI app
5. Clicks "Verify" in system
6. Status: "completed"
7. Receipt generated

---

**Database Version**: 1.0 (UPI Only - No Payment Gateway)
**Last Updated**: 2026-05-12
**Database**: MongoDB
**Environment**: Development & Production
**Payment System**: Direct UPI (No Razorpay)
