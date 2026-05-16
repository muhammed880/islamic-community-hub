# API Endpoints Documentation - Islamic Community Hub

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.nikahnaama.org/api
```

## Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer {jwt_token}
```

---

## 1. AUTHENTICATION ENDPOINTS

### 1.1 Register User
**Endpoint:** `POST /auth/register`
**Access:** Public
**Rate Limit:** 5 requests per hour

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "phone": "+919876543210",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "male",
  "role": "general_user"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Check email for verification.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

---

### 1.2 Login
**Endpoint:** `POST /auth/login`
**Access:** Public

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "general_user",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

### 1.3 Refresh Token
**Endpoint:** `POST /auth/refresh`
**Access:** Public

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

### 1.4 Logout
**Endpoint:** `POST /auth/logout`
**Access:** Protected (Authenticated Users)

**Request:** (No body required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 2. USER PROFILE ENDPOINTS

### 2.1 Get Current User Profile
**Endpoint:** `GET /users/profile`
**Access:** Protected

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+919876543210",
    "gender": "male",
    "role": "general_user",
    "profilePicture": "https://cdn.example.com/profile/user123.jpg",
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
    "createdAt": "2026-05-12T10:30:00Z"
  }
}
```

---

### 2.2 Update User Profile
**Endpoint:** `PUT /users/profile`
**Access:** Protected

**Request:**
```json
{
  "firstName": "Jane",
  "phone": "+919876543210",
  "address": {
    "street": "456 New Lane",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560002"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {...}
}
```

---

### 2.3 Upload Profile Picture
**Endpoint:** `POST /users/profile/picture`
**Access:** Protected
**Content-Type:** multipart/form-data
**Max File Size:** 5MB
**Allowed Types:** jpg, jpeg, png, webp

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile picture updated",
  "data": {
    "profilePicture": "https://cdn.example.com/profile/user123.jpg"
  }
}
```

---

## 3. MASJID ENDPOINTS

### 3.1 Register Masjid
**Endpoint:** `POST /masjids/register`
**Access:** Protected (Masjid Authority)
**Content-Type:** multipart/form-data

**Request:**
```json
{
  "masjidName": "Al-Noor Masjid",
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
  "establishmentYear": 2015,
  "registrationCertificate": "[file]",
  "trustDeed": "[file]"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Masjid registration submitted for approval",
  "data": {
    "masjidId": "507f1f77bcf86cd799439012",
    "status": "pending",
    "registrationFeeAmount": 5000
  }
}
```

---

### 3.2 Get Masjid Details
**Endpoint:** `GET /masjids/{masjidId}`
**Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "masjidId": "507f1f77bcf86cd799439012",
    "masjidName": "Al-Noor Masjid",
    "email": "alnoor@example.com",
    "phone": "+919876543210",
    "status": "approved",
    "address": {...},
    "upiId": "alnoor@upi",
    "totalMembers": 200,
    "totalDonations": 50000,
    "averageRating": 4.5,
    "createdAt": "2026-05-12T10:30:00Z"
  }
}
```

---

### 3.3 List All Masjids
**Endpoint:** `GET /masjids`
**Access:** Public
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 50)
- `status` (approved, pending, rejected)
- `city` (filter by city)
- `state` (filter by state)
- `search` (search by name)
- `sort` (name, rating, donations)

**Example:** `GET /masjids?page=1&limit=10&status=approved&city=Bangalore&sort=name`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "masjidId": "507f1f77bcf86cd799439012",
      "masjidName": "Al-Noor Masjid",
      "city": "Bangalore",
      "address": {...},
      "totalDonations": 50000,
      "averageRating": 4.5
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 3.4 Approve Masjid (Super Admin Only)
**Endpoint:** `PUT /masjids/{masjidId}/approve`
**Access:** Protected (Super Admin)

**Request:**
```json
{
  "approvalStatus": "approved",
  "comments": "All documents verified",
  "registrationFeePaid": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Masjid approved successfully",
  "data": {...}
}
```

---

### 3.5 Reject Masjid (Super Admin Only)
**Endpoint:** `PUT /masjids/{masjidId}/reject`
**Access:** Protected (Super Admin)

**Request:**
```json
{
  "rejectionReason": "Documents not verified"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Masjid registration rejected"
}
```

---

## 4. JOBS ENDPOINTS

### 4.1 Create Job Posting
**Endpoint:** `POST /jobs`
**Access:** Protected (Masjid Authority)

**Request:**
```json
{
  "jobTitle": "Imam",
  "jobDescription": "Experienced Imam needed for 5 daily prayers",
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
  "qualifications": [
    "Islamic Knowledge",
    "Quran Recitation",
    "Tajweed"
  ],
  "experience": 5,
  "skills": [
    "Leadership",
    "Communication",
    "Teaching"
  ],
  "closingDate": "2026-06-12"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "jobId": "507f1f77bcf86cd799439013",
    "status": "active"
  }
}
```

---

### 4.2 Get Job Details
**Endpoint:** `GET /jobs/{jobId}`
**Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "jobId": "507f1f77bcf86cd799439013",
    "jobTitle": "Imam",
    "jobDescription": "...",
    "salaryRange": {...},
    "applicantCount": 12,
    "status": "active",
    "closingDate": "2026-06-12",
    "masjid": {
      "masjidId": "507f1f77bcf86cd799439012",
      "masjidName": "Al-Noor Masjid"
    }
  }
}
```

---

### 4.3 List All Jobs
**Endpoint:** `GET /jobs`
**Access:** Public
**Query Parameters:**
- `page`, `limit`
- `status` (active, closed, filled)
- `jobType` (full_time, part_time, volunteer)
- `city`, `state`
- `search`
- `minSalary`, `maxSalary`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

---

### 4.4 Apply for Job
**Endpoint:** `POST /jobs/{jobId}/apply`
**Access:** Protected
**Content-Type:** multipart/form-data

**Request:**
```json
{
  "resume": "[file]",
  "coverLetter": "I am interested in this position because..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "507f1f77bcf86cd799439014",
    "status": "pending"
  }
}
```

---

### 4.5 Get Job Applications (Masjid Authority)
**Endpoint:** `GET /jobs/{jobId}/applications`
**Access:** Protected (Masjid Authority)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "applicationId": "507f1f77bcf86cd799439014",
      "applicantName": "Ahmed Khan",
      "applicantEmail": "ahmed@example.com",
      "status": "pending",
      "appliedDate": "2026-05-15T10:30:00Z",
      "resume": "url_to_resume"
    }
  ]
}
```

---

## 5. MATRIMONY ENDPOINTS

### 5.1 Create Matrimony Profile
**Endpoint:** `POST /matrimony`
**Access:** Protected
**Content-Type:** multipart/form-data

**Request:**
```json
{
  "fullName": "Aisha Khan",
  "dateOfBirth": "1995-05-15",
  "gender": "female",
  "height": "5'4\"",
  "complexion": "fair",
  "education": "Bachelor's in Engineering",
  "occupation": "Software Engineer",
  "income": 75000,
  "incomeCurrency": "INR",
  "fatherName": "Khan Ahmed",
  "hobbies": ["Reading", "Quran Study"],
  "languages": ["English", "Urdu", "Hindi"],
  "lookingFor": "Honest and practicing Muslim",
  "profilePhoto": "[file]"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Profile created successfully. Pending verification.",
  "data": {
    "profileId": "507f1f77bcf86cd799439015",
    "status": "pending_verification"
  }
}
```

---

### 5.2 Browse Matrimony Profiles
**Endpoint:** `GET /matrimony`
**Access:** Protected
**Query Parameters:**
- `gender` (male, female)
- `ageMin`, `ageMax`
- `city`, `state`
- `education`
- `occupation`
- `page`, `limit`

**Example:** `GET /matrimony?gender=male&ageMin=25&ageMax=35&city=Bangalore`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "profileId": "507f1f77bcf86cd799439015",
      "fullName": "Aisha Khan",
      "age": 31,
      "profilePhoto": "url",
      "education": "Bachelor's in Engineering",
      "occupation": "Software Engineer",
      "city": "Bangalore"
    }
  ],
  "pagination": {...}
}
```

---

### 5.3 Get Matrimony Profile Details
**Endpoint:** `GET /matrimony/{profileId}`
**Access:** Protected

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "profileId": "507f1f77bcf86cd799439015",
    "fullName": "Aisha Khan",
    "age": 31,
    "profilePhoto": "url",
    "education": "Bachelor's in Engineering",
    "occupation": "Software Engineer",
    "income": 75000,
    "lookingFor": "Honest and practicing Muslim",
    "hobbies": [...],
    "languages": [...]
  }
}
```

---

### 5.4 Express Interest
**Endpoint:** `POST /matrimony/{profileId}/interest`
**Access:** Protected

**Request:**
```json
{
  "message": "I am interested in connecting with you"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Interest sent successfully",
  "data": {
    "interestId": "507f1f77bcf86cd799439016"
  }
}
```

---

### 5.5 Get Interests Received
**Endpoint:** `GET /matrimony/interests/received`
**Access:** Protected

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "interestId": "507f1f77bcf86cd799439016",
      "senderName": "Ahmed Khan",
      "senderProfile": "url",
      "status": "pending",
      "sentDate": "2026-05-12T10:30:00Z"
    }
  ]
}
```

---

### 5.6 Accept/Reject Interest
**Endpoint:** `PUT /matrimony/interests/{interestId}`
**Access:** Protected

**Request:**
```json
{
  "status": "accepted"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Interest accepted. Contact details will be shared."
}
```

---

## 6. NEEDY PERSON ENDPOINTS

### 6.1 Create Needy Person Profile
**Endpoint:** `POST /needy-persons`
**Access:** Protected (Masjid Authority)
**Content-Type:** multipart/form-data

**Request:**
```json
{
  "name": "Fatima Begum",
  "phone": "+919876543210",
  "gender": "female",
  "familySize": 4,
  "familyMembers": [
    {
      "name": "Ahmed",
      "age": 10,
      "relation": "son"
    }
  ],
  "address": {
    "street": "789 Need Lane",
    "city": "Bangalore",
    "state": "Karnataka",
    "zipCode": "560003"
  },
  "monthlyIncome": 5000,
  "monthlyExpense": 12000,
  "reason": "medical",
  "description": "Son needs surgery",
  "estimatedAmount": 100000,
  "documents": "[file1, file2]"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Profile created for Super Admin verification",
  "data": {
    "profileId": "507f1f77bcf86cd799439017",
    "status": "pending"
  }
}
```

---

### 6.2 List Needy Persons (Public)
**Endpoint:** `GET /needy-persons`
**Access:** Public
**Query Parameters:**
- `status` (approved)
- `reason` (medical, education, livelihood, other)
- `page`, `limit`
- `city`, `state`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "profileId": "507f1f77bcf86cd799439017",
      "name": "Fatima Begum",
      "reason": "Medical emergency",
      "estimatedAmount": 100000,
      "zakatCollected": 45000,
      "zakatRemaining": 55000,
      "city": "Bangalore"
    }
  ],
  "pagination": {...}
}
```

---

### 6.3 Get Needy Person Details
**Endpoint:** `GET /needy-persons/{profileId}`
**Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "profileId": "507f1f77bcf86cd799439017",
    "name": "Fatima Begum",
    "reason": "Medical emergency",
    "description": "Son needs surgery",
    "estimatedAmount": 100000,
    "zakatCollected": 45000,
    "zakatRemaining": 55000,
    "family": [...],
    "status": "approved"
  }
}
```

---

### 6.4 Approve Needy Person (Super Admin)
**Endpoint:** `PUT /needy-persons/{profileId}/approve`
**Access:** Protected (Super Admin)

**Request:**
```json
{
  "approvalStatus": "approved",
  "verificationNotes": "Documents verified"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile approved"
}
```

---

## 7. DONATIONS ENDPOINTS

### 7.1 Create Donation
**Endpoint:** `POST /donations`
**Access:** Protected

**Request:**
```json
{
  "amount": 1000,
  "currency": "INR",
  "donationType": "zakat",
  "masjidId": "507f1f77bcf86cd799439012",
  "needyPersonId": "507f1f77bcf86cd799439017",
  "paymentMethod": "upi"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Donation initiated. Redirecting to payment...",
  "data": {
    "donationId": "507f1f77bcf86cd799439018",
    "razorpayOrderId": "order_IluGWxBm9U8zJ7",
    "razorpayCheckoutUrl": "https://checkout.razorpay.com/v1/checkout.js"
  }
}
```

---

### 7.2 Verify Donation Payment
**Endpoint:** `POST /donations/{donationId}/verify`
**Access:** Protected

**Request:**
```json
{
  "razorpayPaymentId": "pay_IluGWxBm9U8zJ7",
  "razorpayOrderId": "order_IluGWxBm9U8zJ7",
  "razorpaySignature": "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Donation confirmed successfully",
  "data": {
    "donationId": "507f1f77bcf86cd799439018",
    "status": "completed",
    "receiptUrl": "url_to_receipt_pdf",
    "receiptNumber": "RECEIPT-2026-00001"
  }
}
```

---

### 7.3 Get Donation History
**Endpoint:** `GET /donations`
**Access:** Protected
**Query Parameters:**
- `status` (pending, completed, failed)
- `donationType` (masjid_donation, zakat)
- `page`, `limit`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "donationId": "507f1f77bcf86cd799439018",
      "amount": 1000,
      "donationType": "zakat",
      "status": "completed",
      "donationDate": "2026-05-12T10:30:00Z",
      "receiptNumber": "RECEIPT-2026-00001"
    }
  ],
  "pagination": {...}
}
```

---

## 8. QURAN CLASSES ENDPOINTS

### 8.1 Create Quran Class
**Endpoint:** `POST /quran-classes`
**Access:** Protected (Imam)

**Request:**
```json
{
  "className": "Quran Fundamentals",
  "description": "Learn basics of Quran recitation and Tajweed",
  "level": "beginner",
  "startDate": "2026-06-01",
  "endDate": "2026-08-31",
  "classTime": "19:00",
  "dayOfWeek": ["Monday", "Wednesday", "Friday"],
  "durationMinutes": 60,
  "maxParticipants": 30,
  "curriculum": [
    {
      "week": 1,
      "topic": "Introduction to Quran",
      "surahRange": "Al-Fatiha",
      "ayahRange": "1-7"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Class created successfully",
  "data": {
    "classId": "507f1f77bcf86cd799439019",
    "agoraChannelName": "quran_class_507f1f77bcf86cd799439019"
  }
}
```

---

### 8.2 List Quran Classes
**Endpoint:** `GET /quran-classes`
**Access:** Public
**Query Parameters:**
- `level` (beginner, intermediate, advanced)
- `city`, `state`
- `status` (active, completed, cancelled)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "classId": "507f1f77bcf86cd799439019",
      "className": "Quran Fundamentals",
      "level": "beginner",
      "classTime": "19:00",
      "dayOfWeek": ["Monday", "Wednesday", "Friday"],
      "currentParticipants": 18,
      "maxParticipants": 30,
      "imamName": "Sheikh Abdullah"
    }
  ]
}
```

---

### 8.3 Enroll in Class
**Endpoint:** `POST /quran-classes/{classId}/enroll`
**Access:** Protected

**Request:** (No body required)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Enrollment request sent to Imam for approval",
  "data": {
    "enrollmentId": "507f1f77bcf86cd799439020",
    "status": "pending"
  }
}
```

---

### 8.4 Get Class Session Details
**Endpoint:** `GET /quran-classes/{classId}/sessions/{sessionId}`
**Access:** Protected (Enrolled Students)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "507f1f77bcf86cd799439021",
    "className": "Quran Fundamentals",
    "sessionDate": "2026-06-07",
    "sessionTime": "19:00",
    "agoraToken": "token_xxx",
    "agoraChannelName": "quran_class_507f1f77bcf86cd799439019",
    "agoraUid": 123456,
    "recordingUrl": "url_to_recording"
  }
}
```

---

## 9. ASK IMAM SESSIONS ENDPOINTS

### 9.1 Create Ask Imam Session
**Endpoint:** `POST /ask-imam-sessions`
**Access:** Protected (Imam)

**Request:**
```json
{
  "title": "Islamic Finance Q&A",
  "description": "Ask questions about Riba and Halal business",
  "topic": "Islamic Finance",
  "scheduledDate": "2026-05-20",
  "scheduledTime": "20:00",
  "durationMinutes": 90,
  "maxParticipants": 100
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Session created successfully",
  "data": {
    "sessionId": "507f1f77bcf86cd799439022",
    "agoraChannelName": "ask_imam_507f1f77bcf86cd799439022"
  }
}
```

---

### 9.2 List Ask Imam Sessions
**Endpoint:** `GET /ask-imam-sessions`
**Access:** Public
**Query Parameters:**
- `status` (scheduled, live, completed)
- `topic`
- `page`, `limit`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "sessionId": "507f1f77bcf86cd799439022",
      "title": "Islamic Finance Q&A",
      "scheduledDate": "2026-05-20",
      "scheduledTime": "20:00",
      "registrations": 45,
      "imamName": "Sheikh Abdullah",
      "status": "scheduled"
    }
  ]
}
```

---

### 9.3 Register for Ask Imam Session
**Endpoint:** `POST /ask-imam-sessions/{sessionId}/register`
**Access:** Protected

**Request:** (No body required)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration confirmed",
  "data": {
    "registrationId": "507f1f77bcf86cd799439023"
  }
}
```

---

### 9.4 Submit Question
**Endpoint:** `POST /ask-imam-sessions/{sessionId}/questions`
**Access:** Protected

**Request:**
```json
{
  "question": "Is cryptocurrency Halal in Islam?"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Question submitted",
  "data": {
    "questionId": "507f1f77bcf86cd799439024",
    "status": "pending"
  }
}
```

---

### 9.5 Get Session Questions
**Endpoint:** `GET /ask-imam-sessions/{sessionId}/questions`
**Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "questionId": "507f1f77bcf86cd799439024",
      "question": "Is cryptocurrency Halal in Islam?",
      "askerName": "Anonymous",
      "status": "answered",
      "answer": "The answer from Imam...",
      "likes": 15
    }
  ]
}
```

---

## 10. NIKAH NAMA ENDPOINTS

### 10.1 Create Nikah Nama
**Endpoint:** `POST /nikah-nama`
**Access:** Protected (Masjid Authority)
**Content-Type:** multipart/form-data

**Request:**
```json
{
  "groomName": "Ahmed Khan",
  "groomEmail": "ahmed@example.com",
  "groomPhone": "+919876543210",
  "groomDateOfBirth": "1995-03-15",
  "groomAddress": {
    "street": "123 Groom Lane",
    "city": "Bangalore"
  },
  "brideName": "Aisha Khan",
  "brideEmail": "aisha@example.com",
  "bridePhone": "+919876543211",
  "brideeDateOfBirth": "1996-07-20",
  "brideAddress": {
    "street": "456 Bride Lane",
    "city": "Bangalore"
  },
  "marriageDate": "2026-05-15",
  "mahr": 50000,
  "maharCurrency": "INR",
  "witnesses": [
    {
      "name": "Ali Khan",
      "phone": "+919876543212",
      "email": "ali@example.com"
    }
  ],
  "imamName": "Sheikh Abdullah",
  "certificateDocument": "[file]"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Certificate created and sent for verification",
  "data": {
    "certificateNumber": "CERT-2026-00001",
    "status": "pending"
  }
}
```

---

### 10.2 Get Nikah Nama Certificate
**Endpoint:** `GET /nikah-nama/{certificateNumber}`
**Access:** Public

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "certificateNumber": "CERT-2026-00001",
    "groomName": "Ahmed Khan",
    "brideName": "Aisha Khan",
    "marriageDate": "2026-05-15",
    "mahr": 50000,
    "certificatePDF": "url_to_pdf",
    "status": "verified",
    "verifiedDate": "2026-05-12"
  }
}
```

---

### 10.3 Search Nikah Nama
**Endpoint:** `GET /nikah-nama/search`
**Access:** Public
**Query Parameters:**
- `groomName`
- `brideName`
- `certificateNumber`
- `marriageDateFrom`
- `marriageDateTo`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [...]
}
```

---

## 11. SUPER ADMIN DASHBOARD ENDPOINTS

### 11.1 Dashboard Statistics
**Endpoint:** `GET /admin/dashboard/stats`
**Access:** Protected (Super Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalMasjids": 45,
    "approvedMasjids": 42,
    "pendingMasjids": 2,
    "rejectedMasjids": 1,
    "totalUsers": 5000,
    "totalDonations": 500000,
    "totalZakatDistributed": 250000,
    "totalNeedyPersons": 120,
    "totalJobs": 85,
    "totalMatrimonyProfiles": 1200,
    "totalNikahNamas": 300
  }
}
```

---

### 11.2 Verify Registration Fees
**Endpoint:** `POST /admin/verify-payment/{masjidId}`
**Access:** Protected (Super Admin)

**Request:**
```json
{
  "razorpayPaymentId": "pay_xxx",
  "razorpayOrderId": "order_xxx",
  "razorpaySignature": "signature_xxx"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Registration fee verified",
  "data": {...}
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## HTTP Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource missing |
| 409 | Conflict - Resource exists |
| 500 | Server Error |

---

## Rate Limiting

- **Public endpoints**: 100 requests/hour per IP
- **Authenticated endpoints**: 1000 requests/hour per user
- **File uploads**: 5 requests/hour per user

---

## Pagination

All list endpoints support pagination:
```
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

**API Version**: 1.0
**Last Updated**: 2026-05-12
**Maintained By**: Islamic Community Hub Team
