# Islamic Community Hub - Backend API

Node.js/Express backend for the Islamic Community Hub platform.

## Features

- 🔐 JWT Authentication
- 👥 Multi-role authorization (Super Admin, Masjid Authority, General User)
- 💾 MongoDB database integration
- 📧 Email notifications
- 📁 File upload handling
- 📱 RESTful API endpoints
- ✅ Input validation
- 🛡️ Error handling

## Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- MongoDB >= 4.4
- Git

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/muhammed8803/islamic-community-hub.git
cd islamic-community-hub/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
cp .env .env
```

### 4. Update .env with your configuration
```
MONGODB_URI=mongodb://localhost:27017/islamic_community_hub
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
```

### 5. Start MongoDB
```bash
mongod
```

### 6. Start the server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will be running at: `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── controllers/         # Controllers
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utilities
│   └── app.js               # App setup
├── uploads/                 # File uploads
├── .env                     # Environment variables
├── .gitignore               # Git ignore
├── package.json             # Dependencies
├── server.js                # Entry point
└── README.md                # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile/picture` - Upload picture

### Masjids
- `POST /api/masjids/register` - Register masjid
- `GET /api/masjids` - Get all masjids
- `GET /api/masjids/:id` - Get masjid
- `PUT /api/masjids/:id/approve` - Approve (Super Admin)
- `PUT /api/masjids/:id/reject` - Reject (Super Admin)

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - Get jobs
- `GET /api/jobs/:id` - Get job
- `POST /api/jobs/:id/apply` - Apply
- `GET /api/jobs/:id/applications` - Get applications

### Donations (UPI Only)
- `GET /api/donations/upi/:masjidId` - Get UPI details
- `POST /api/donations/record` - Record donation
- `PUT /api/donations/:id/verify` - Verify donation
- `GET /api/donations` - Get history
- `POST /api/donations/:id/refund-request` - Request refund

### Matrimony
- `POST /api/matrimony` - Create profile
- `GET /api/matrimony` - Browse profiles
- `GET /api/matrimony/:id` - Get profile
- `POST /api/matrimony/:id/interest` - Express interest
- `GET /api/matrimony/interests/received` - Get interests
- `PUT /api/matrimony/interests/:id` - Accept/reject

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard stats
- `PUT /api/admin/verify-payment/:masjidId` - Verify payment

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/islamic_community_hub
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password
MAX_FILE_SIZE=5242880
```

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Testing

```bash
npm test
npm run test:watch
```

## Linting

```bash
npm run lint
npm run lint:fix
```

## Deployment

### Shoutcoder
1. Push to GitHub
2. Connect repository
3. Configure env vars
4. Deploy

### Heroku
```bash
heroku login
heroku create islamic-community-hub-api
heroku config:set MONGODB_URI=your_url
git push heroku main
```

## License

ISC

## Support

For issues, open an issue on GitHub.
