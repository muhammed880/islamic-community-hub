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
  "role": "general_user", // or "super_admin", "masjid_authority"
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
