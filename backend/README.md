# Udhyoga Pay Backend

Production-ready Node.js + Express + TypeScript backend for the Udhyoga Pay worker booking platform.

## Features

- ✅ JWT Authentication with httpOnly cookies
- ✅ Role-based access control (User, Worker, Admin)
- ✅ Geospatial worker search with MongoDB 2dsphere indexes
- ✅ Real-time notifications using Socket.io
- ✅ OpenStreetMap integration for geocoding and routing
- ✅ KYC document upload to Cloudinary
- ✅ OTP verification system
- ✅ Multi-factor worker ranking algorithm
- ✅ Comprehensive analytics dashboard

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your credentials
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/udhyogapay
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

# Cloudinary (Sign up at https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin
ADMIN_EMAIL=rajuchaswik@gmail.com

# CORS
FRONTEND_URL=http://localhost:5173
```

## Running the Server

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user/worker
- `POST /login` - Login
- `POST /logout` - Logout
- `GET /verify-token` - Verify JWT token
- `POST /admin/reset-password` - Admin password reset

### Workers (`/api/workers`)
- `POST /kyc` - Upload KYC documents
- `PATCH /toggle-online` - Toggle online status
- `PATCH /location` - Update GPS location
- `GET /profile` - Get worker dashboard

### Users (`/api/users`)
- `POST /workers/nearby` - Find nearby workers
- `POST /geocode` - Address to coordinates
- `POST /reverse-geocode` - Coordinates to address
- `POST /calculate-distance` - Calculate route distance

### Bookings (`/api/bookings`)
- `POST /create` - Create booking
- `PATCH /:id/accept` - Accept booking (Worker)
- `PATCH /:id/reject` - Reject booking (Worker)
- `POST /:id/verify-otp` - Verify OTP and start job
- `PATCH /:id/complete` - Complete booking
- `PATCH /:id/rate` - Rate worker
- `GET /history` - User booking history
- `GET /worker/history` - Worker booking history

### Admin (`/api/admin`)
- `GET /workers/pending` - Pending verifications
- `PATCH /workers/:id/verify` - Verify worker
- `GET /workers/active` - Live worker map data
- `GET /analytics` - Platform analytics

## Database Setup

```bash
# Start MongoDB
mongod

# MongoDB will automatically create the database and collections
# Indexes are created automatically on server start
```

## Testing with Postman

Import the provided Postman collection or use these sample requests:

### Register User
```json
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "user"
}
```

### Login
```json
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

## Socket.io Events

### Worker Events
- `worker:online` - Worker joins their room
- `worker:location:update` - Update location every 30s
- `booking:request` - Receive booking request
- `booking:accept` - Accept booking
- `booking:reject` - Reject booking

### User Events
- `user:online` - User joins their room
- `booking:accepted` - Worker accepted booking
- `booking:rejected` - Worker rejected booking
- `booking:started` - Job started
- `booking:completed` - Job completed

## Production Deployment

### Railway / Render
1. Push code to GitHub
2. Connect repository
3. Add environment variables
4. Deploy

### MongoDB Atlas
1. Create free cluster at mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGODB_URI

### Cloudinary
1. Sign up at cloudinary.com
2. Get API credentials
3. Update .env variables

## License

ISC
