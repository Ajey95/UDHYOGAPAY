# Udhyoga Pay - Quick Start Guide

This guide will help you get the Udhyoga Pay platform running on your local machine in under 10 minutes.

## Prerequisites Check

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed
mongod --version
```

## Step 1: Clone & Setup

```bash
# Navigate to your project (already exists)
cd c:\udhyogapay

# Or if cloning fresh:
# git clone <repository-url>
# cd udhyogapay
```

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# The .env file is already created. Update these values:
# 1. MONGODB_URI - MongoDB connection string
# 2. JWT_SECRET - Any random secret string
# 3. CLOUDINARY credentials - Sign up at cloudinary.com (free)

# Start MongoDB (in a separate terminal)
mongod

# Run backend server
npm run dev

# Backend should now be running on http://localhost:5000
```

## Step 3: Frontend Setup

```bash
# Open a new terminal
cd c:\udhyogapay\frontend

# Install dependencies
npm install

# The .env file is already created with correct values

# Run frontend
npm run dev

# Frontend should now be running on http://localhost:5173
```

## Step 4: Testing the Application

### 1. Create Admin Account
```bash
# Open your browser and go to:
http://localhost:5173/register

# Fill in:
- Name: Admin User
- Email: rajuchaswik@gmail.com (IMPORTANT: Use this exact email for admin access)
- Phone: 9999999999
- Password: admin123
- Role: User (will have admin access due to email)
```

### 2. Create Worker Account
```bash
# Register as worker:
http://localhost:5173/register

- Name: Worker One
- Email: worker@example.com
- Phone: 8888888888
- Password: worker123
- Role: Worker
```

### 3. Create User Account
```bash
# Register as user:
http://localhost:5173/register

- Name: User One
- Email: user@example.com
- Phone: 7777777777
- Password: user123
- Role: User
```

## Step 5: Complete Worker Onboarding

1. Login as worker (worker@example.com)
2. You'll see the KYC upload form
3. Upload sample documents (any PDF/image)
4. Submit and wait for admin approval

## Step 6: Verify Worker (Admin)

1. Logout and login as admin (rajuchaswik@gmail.com)
2. Go to "Admin Panel"
3. Click on "Pending Verifications" tab
4. You'll see the worker
5. Click "✅ Verify" button

## Step 7: Test Booking Flow

### As Worker:
1. Login as worker
2. Click the big "ONLINE" button (allow location access)
3. Keep this window open

### As User:
1. Open a new browser window (or incognito)
2. Login as user
3. Allow location access
4. Select a profession (e.g., Plumber)
5. Click "Search"
6. You should see the worker on the map!
7. Click on the worker marker
8. Click "Book Now"
9. Note the OTP shown

### Back to Worker:
1. You should see a booking request with 30-second countdown
2. Click "Accept"
3. Enter the OTP from the user
4. Click "Start"
5. After completing work, click "Complete"

### Back to User:
1. You'll see the booking is completed
2. Rate the worker!

## Troubleshooting

### Backend won't start
```bash
# Make sure MongoDB is running
mongod

# Check if port 5000 is free
# Windows:
netstat -ano | findstr :5000

# If occupied, change PORT in backend/.env
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# If port 5173 is occupied, Vite will auto-assign new port
```

### Map not showing
```bash
# Make sure Leaflet CSS is loaded
# Check browser console for errors
# Ensure you allowed location access
```

### Worker not appearing on map
```bash
# Make sure:
1. Worker is verified by admin
2. Worker clicked "ONLINE" button
3. Worker allowed location access
4. User and worker are searching for same profession
5. Check console for errors
```

### Socket.io not connecting
```bash
# Make sure backend is running on port 5000
# Check browser console for connection errors
# Verify VITE_SOCKET_URL in frontend/.env
```

## Production Deployment

### MongoDB Atlas (Free Database)
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in production

### Cloudinary (Free File Storage)
1. Sign up at https://cloudinary.com
2. Get credentials from dashboard
3. Update CLOUDINARY_* variables

### Deploy Backend (Railway - Free)
1. Push code to GitHub
2. Connect Railway to your repo
3. Add environment variables
4. Deploy

### Deploy Frontend (Vercel - Free)
```bash
cd frontend
npm run build
vercel deploy --prod
```

## Default Credentials Summary

| Role | Email | Password | Phone |
|------|-------|----------|-------|
| Admin | rajuchaswik@gmail.com | admin123 | 9999999999 |
| Worker | worker@example.com | worker123 | 8888888888 |
| User | user@example.com | user123 | 7777777777 |

## Features Checklist

- [ ] User can register and login
- [ ] Worker can register and upload KYC
- [ ] Admin can verify workers
- [ ] Worker can toggle online/offline
- [ ] User can see workers on map
- [ ] User can book a worker
- [ ] Worker receives real-time booking notification
- [ ] Worker can accept/reject bookings
- [ ] OTP verification works
- [ ] Job can be completed
- [ ] User can rate worker
- [ ] Admin can see analytics
- [ ] Admin can see live worker map

## Next Steps

1. Customize the UI colors and branding
2. Add more professions in constants.ts
3. Implement payment integration
4. Add email notifications
5. Add more analytics charts
6. Implement worker earnings page
7. Add chat between user and worker
8. Mobile app development

## Getting Help

- Check console logs in browser (F12)
- Check backend terminal for errors
- Review the API documentation in README files
- Check MongoDB connection in MongoDB Compass
- Use Postman to test API endpoints directly

## Important Notes

⚠️ **Location Permission**: The app requires location access to work. Make sure to allow when prompted.

⚠️ **HTTPS in Production**: Browser Geolocation API requires HTTPS in production (except localhost).

⚠️ **OpenStreetMap Rate Limits**: Nominatim has a 1 request/second limit. For production, consider self-hosting or using a commercial provider.

⚠️ **Admin Email**: Only rajuchaswik@gmail.com has admin access. Change ADMIN_EMAIL in .env to use a different email.

---

🎉 **Congratulations!** You now have a fully functional worker booking platform with real-time tracking and geospatial search!
