# Fix 404 Error - Backend Route Not Found

## Problem
Getting "Sunucu hatası: 404" when trying to upload an image.

## Root Cause
The backend server is running, but the routes are not properly registered. This usually happens when:
1. Backend was started before code was compiled
2. Backend needs to be restarted
3. MongoDB connection issues preventing module loading

## Solution

### Step 1: Stop All Backend Processes
```bash
make stop
```
Or manually:
```powershell
# Find and kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Step 2: Start Backend Properly
```bash
make start-backend
```

Or manually:
```powershell
cd backend
npm run start:dev
```

### Step 3: Wait for Backend to Start
Look for this message in the backend terminal:
```
🚀 Backend server running on http://localhost:3000
```

### Step 4: Verify Endpoint
Test the endpoint:
```powershell
.\test-endpoint.ps1
```

You should see:
- Status: 405 (Method Not Allowed) - This is CORRECT! It means the endpoint exists.
- If you see 404, the backend routes are still not registered.

## Quick Fix Command
```bash
make restart-backend
```

This will automatically:
1. Stop existing backend processes
2. Wait for port to be free
3. Start backend in a new window

## Alternative: Start Everything
```bash
make dev
```

This starts MongoDB, Backend, and Frontend all together.

## If Still Getting 404

1. **Check backend terminal for errors** - Look for any red error messages
2. **Verify MongoDB is running** - `make start-mongo` or `net start MongoDB`
3. **Check if InferenceModule is loaded** - Backend should show routes on startup
4. **Try setting NO_DB environment variable**:
   ```powershell
   $env:NO_DB="true"
   cd backend
   npm run start:dev
   ```

## Expected Behavior

✅ **Working**: GET request to `/inference/upload` returns **405** (Method Not Allowed)
❌ **Not Working**: GET request to `/inference/upload` returns **404** (Not Found)

The 405 error is actually GOOD - it means the route exists but doesn't accept GET requests (it only accepts POST).




