# 🔧 MongoDB Installation Guide

## Problem
MongoDB is not installed or not running. The backend needs MongoDB to save prediction results.

---

## Option 1: Install MongoDB (Recommended)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or 6.0)
   - Platform: Windows
   - Package: MSI
3. Click Download

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **IMPORTANT:** Check "Install MongoDB as a Service"
4. Check "Run service as Network Service user"
5. Check "Install MongoDB Compass" (optional GUI tool)
6. Click Install

### Step 3: Verify Installation
```powershell
# Check if MongoDB service exists
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Or use the script
.\start-mongodb.ps1
```

---

## Option 2: Quick Test Without MongoDB (Temporary)

If you just want to test the frontend/backend connection without saving to database, I can modify the code to make MongoDB optional. But for full functionality, MongoDB is required.

---

## Option 3: Use MongoDB Atlas (Cloud - Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a free cluster
4. Get connection string
5. Update `backend/src/app.module.ts`:
   ```typescript
   MongooseModule.forRoot('mongodb+srv://username:password@cluster.mongodb.net/dermAI')
   ```

---

## After Installing MongoDB

1. **Start MongoDB:**
   ```powershell
   net start MongoDB
   ```

2. **Verify it's running:**
   ```powershell
   Get-Service MongoDB
   ```
   Should show: `Status: Running`

3. **Restart your backend** - it should connect automatically!

---

## Quick Check Script

Run this to check MongoDB status:
```powershell
.\start-mongodb.ps1
```

---

## Need Help?

If MongoDB won't start:
1. Check if port 27017 is in use: `netstat -ano | findstr :27017`
2. Check Windows Event Viewer for MongoDB errors
3. Try running MongoDB manually: `mongod --dbpath C:\data\db`

