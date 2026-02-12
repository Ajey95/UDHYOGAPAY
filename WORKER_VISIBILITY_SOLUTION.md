# 🔧 Worker Visibility Issue - SOLUTION GUIDE

## 🎯 THE PROBLEM

You registered a worker as an electrician, but when you logged in as a user and tried to book, **the electrician was NOT showing on the map**.

## 🔍 ROOT CAUSE

The worker was **NOT ONLINE**. Even though you logged into the worker panel, workers need to **manually toggle their online status** to be visible to users.

### Why Workers Must Be Online:
The matching algorithm in [matchingController.ts](backend/src/controllers/matchingController.ts#L36-L42) only finds workers that meet ALL these criteria:
- ✅ `isOnline: true` - Worker must be online
- ✅ `isVerified: true` - Worker must be verified
- ✅ `profession` matches the service type
- ✅ Valid location (not [0, 0])

## ✅ SOLUTION - How to Make Workers Visible

### For Workers (In Worker Dashboard):

1. **Login to Worker Panel**
   - Use your work email and password

2. **Toggle Online Status**
   - Click the "Go Online" toggle button
   - Browser will ask for location permission - **ALLOW IT**
   - Worker's location will be sent to the backend
   - Status will change from 🔴 Offline → 🟢 Online

3. **Verify Online Status**
   - You should see "🟢 You are online and visible to customers"
   - Your location is now being tracked every 30 seconds

### For Testing (Backend Script):

I've created a script to manually set workers online for testing:

```powershell
cd backend
npm run set-worker-online
```

This script:
- Finds all workers in the database
- Sets them to online status
- Adds a default location (Bangalore: 77.5946, 12.9716)
- Updates availability to "available"

## 🔄 HOW IT WORKS

### 1. Worker Goes Online ([WorkerDashboard.tsx](frontend/src/pages/Worker/WorkerDashboard.tsx#L111-L132))

```typescript
const toggleAvailability = async () => {
  // Get current location when going online
  let coordinates = undefined;
  if (!isOnline && location) {
    coordinates = [location.longitude, location.latitude];
  }

  await api.patch('/workers/toggle-online', {
    isOnline: !isOnline,
    coordinates  // ← Location is sent here
  });
};
```

### 2. Backend Updates Worker ([workerController.ts](backend/src/controllers/workerController.ts#L88-L124))

```typescript
export const toggleOnline = async (req, res) => {
  const { isOnline, coordinates } = req.body;
  
  worker.isOnline = isOnline;
  worker.availability.status = isOnline ? 'available' : 'offline';
  
  if (coordinates && coordinates.length === 2) {
    worker.currentLocation.coordinates = coordinates;  // ← Location saved
    worker.currentLocation.lastUpdated = new Date();
  }
  
  await worker.save();
};
```

### 3. Location Tracking ([useLocationTracking.ts](frontend/src/hooks/useLocationTracking.ts#L5-L45))

When online, worker's location is automatically sent every 30 seconds via WebSocket:

```typescript
setInterval(() => {
  const location = await locationService.getCurrentLocation();
  socketService.updateWorkerLocation(workerId, [lng, lat]);
}, 30000); // 30 seconds
```

### 4. User Searches for Workers ([matchingController.ts](backend/src/controllers/matchingController.ts#L36-L42))

```typescript
const workers = await Worker.find({
  profession: new RegExp(serviceType, 'i'),
  isOnline: true,           // ← Must be online
  isVerified: true,         // ← Must be verified
  'currentLocation.coordinates.0': { $ne: 0 },  // ← Must have valid location
  'currentLocation.coordinates.1': { $ne: 0 }
});
```

## 📝 VERIFICATION CHECKLIST

Before a worker can be visible to users, verify:

- [ ] Worker account is created and verified
- [ ] Worker has logged into the worker panel
- [ ] Worker has toggled online status
- [ ] Browser location permission is granted
- [ ] Worker's location is not [0, 0]

### Quick Verification Commands:

```powershell
# Check all workers and their status
cd backend
npm run check-workers

# Set a worker online (for testing)
npm run set-worker-online
```

## 🐛 COMMON ISSUES & FIXES

### Issue 1: Worker is online but still not visible
**Check:**
- Is the worker's location valid? (not [0, 0])
- Is `isVerified: true`?
- Is the user searching for the correct profession?
- Is the user's location within `maxDistance` of the worker?

### Issue 2: Location permission denied
**Fix:**
- Go to browser settings
- Find site permissions for localhost:5173
- Enable location access
- Refresh the page and try again

### Issue 3: Worker appears offline after refresh
**Why:**
- Frontend state is stored in component state (not persisted)
- On refresh, `isOnline` state is fetched from the database
- If worker didn't toggle online properly, database has `isOnline: false`

**Fix:**
- Toggle online again after refresh
- Or use the backend script to set online status

## 🎮 TESTING WORKFLOW

### Complete Test Scenario:

1. **Start Backend & Frontend**
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Setup Worker**
   ```powershell
   # Terminal 3 - Set worker online
   cd backend
   npm run set-worker-online
   npm run check-workers  # Verify online
   ```

3. **Open Two Browser Windows**
   - Window 1: http://localhost:5173 → Login as User
   - Window 2: http://localhost:5173 → Login as Worker

4. **Worker Window**
   - Go to worker dashboard
   - Verify status shows "🟢 ONLINE"
   - If offline, click toggle and allow location

5. **User Window**
   - Go to home page
   - Select "electrician" from profession dropdown
   - Wait for map to load
   - You should see the electrician marker on the map

## 🔧 FIX APPLIED

I've updated [WorkerDashboard.tsx](frontend/src/pages/Worker/WorkerDashboard.tsx#L111-L132) to automatically send location when toggling online:

**Before:**
```typescript
const response = await api.patch('/workers/toggle-online', {
  isOnline: !isOnline  // ❌ No location sent
});
```

**After:**
```typescript
// Get current location when going online
let coordinates = undefined;
if (!isOnline && location) {
  coordinates = [location.longitude, location.latitude];
}

const response = await api.patch('/workers/toggle-online', {
  isOnline: !isOnline,
  coordinates  // ✅ Location included
});
```

## 📊 USEFUL SCRIPTS

I've created helper scripts in `backend/src/scripts/`:

1. **checkWorkers.ts** - View all workers and their status
2. **setWorkerOnlineWithLocation.ts** - Set worker online for testing
3. **createAdmin.ts** - Create admin account

## 🎉 SUMMARY

**The electrician wasn't showing because:**
- Worker was logged in BUT not set to online status
- `isOnline` field was `false` in the database
- Matching algorithm requires `isOnline: true`

**Solution:**
- Worker must click "Go Online" toggle in dashboard
- OR use the backend script: `npm run set-worker-online`
- Worker must allow location permission

**Now your electrician should be visible to users! 🎊**
