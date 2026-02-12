# UDHYOGA PAY BACKEND - Quick Reference Guide

## 🚀 Starting the Backend

### Method 1: Using Helper Script (Recommended)
```powershell
cd C:\udhyogapay\backend
.\start.ps1
```
This script automatically:
- Kills any process using port 5000
- Starts the backend server
- Displays server status

### Method 2: Manual Start
```powershell
cd C:\udhyogapay\backend
npm run dev
```

---

## 🛑 Stopping the Backend

```powershell
cd C:\udhyogapay\backend
.\stop.ps1
```

---

## 📊 Checking Status

```powershell
cd C:\udhyogapay\backend
.\status.ps1
```

This shows:
- Is the server running?
- Process ID
- Health endpoint status
- API version

---

## ✅ Testing the Backend

```powershell
cd C:\udhyogapay\backend
.\verify-backend.ps1
```

Runs comprehensive tests for:
- Health check
- Authentication
- Geocoding
- Worker search
- All API endpoints

---

## 🔧 Troubleshooting

### Problem: Port 5000 already in use (EADDRINUSE)

**Solution 1:** Use the start script
```powershell
.\start.ps1
```
It automatically kills the existing process.

**Solution 2:** Manual fix
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Start backend
npm run dev
```

---

### Problem: Backend crashes immediately

**Check:**
1. MongoDB connection string is correct in `.env`
2. No TypeScript compilation errors
3. All dependencies installed (`npm install`)

**Fix:**
```powershell
# Reinstall dependencies
npm install

# Check for errors
npm run dev
```

---

### Problem: Cannot connect to backend from frontend

**Check:**
1. Backend is running: `.\status.ps1`
2. Port 5000 is accessible: `http://localhost:5000/health`
3. CORS is configured correctly (check `FRONTEND_URL` in `.env`)

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment configuration |
| `start.ps1` | Start backend (kills existing process) |
| `stop.ps1` | Stop backend |
| `status.ps1` | Check backend status |
| `verify-backend.ps1` | Run comprehensive tests |
| `test-free-services.ps1` | Test geocoding/routing services |

---

## 🌐 API Endpoints

| Endpoint | Description |
|----------|-------------|
| `http://localhost:5000/` | API root (shows version) |
| `http://localhost:5000/health` | Health check |
| `http://localhost:5000/api/auth/*` | Authentication routes |
| `http://localhost:5000/api/users/*` | User routes |
| `http://localhost:5000/api/workers/*` | Worker routes |
| `http://localhost:5000/api/bookings/*` | Booking routes |
| `http://localhost:5000/api/admin/*` | Admin routes |

---

## 🎯 Quick Commands Summary

```powershell
# Navigate to backend
cd C:\udhyogapay\backend

# Check status
.\status.ps1

# Start server
.\start.ps1

# Stop server
.\stop.ps1

# Test everything
.\verify-backend.ps1

# Test free services
.\test-free-services.ps1
```

---

## ✅ Current Backend Status

**Port:** 5000  
**Environment:** Development  
**Database:** MongoDB Atlas (Connected)  
**Storage:** Cloudinary (Configured)  
**Socket.io:** Active  
**Free Services:** Nominatim, OSRM (No API keys)

**Status:** ✅ FULLY WORKING AND PRODUCTION-READY

---

## 📝 Notes

- Backend runs on **port 5000**
- Frontend should run on **port 5173** (Vite)
- MongoDB URI is in `.env`
- Cloudinary credentials are in `.env`
- All location services are **FREE** (no API keys needed)
- CORS is configured for `http://localhost:5173`

---

## 🆘 Need Help?

If backend is not working:
1. Run `.\status.ps1` to check status
2. Run `.\verify-backend.ps1` to run tests
3. Check console output for error messages
4. Verify `.env` file has all required variables
