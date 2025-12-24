# Quick Fix: Backend 404 Error

## Problem
Backend server is stuck trying to connect to MongoDB and won't start, causing 404 errors.

## Solution

### Option 1: Run without MongoDB (Recommended)
```powershell
cd backend
$env:NO_DB="true"
npm run start:dev
```

### Option 2: Use the start script
```powershell
.\start.ps1
```
This script automatically detects if MongoDB is running and sets NO_DB=true if needed.

### Option 3: Start MongoDB
If you want to use MongoDB:
1. Start MongoDB service
2. Then run: `npm run start:dev`

## Note
The backend works perfectly fine without MongoDB. Results just won't be saved to the database, but the AI inference will work normally.

