# 🔧 Fix Current Issues

## Problem 1: Frontend Not Loading (ERR_CONNECTION_REFUSED)
**Solution:** Frontend server is not running

## Problem 2: Backend 404 Error / MongoDB Connection Refused
**Solution:** MongoDB is not running

---

## Quick Fix - Run These Commands:

### 1. Start MongoDB (Run as Administrator if needed)
```powershell
net start MongoDB
```

### 2. Start Frontend Server
```powershell
cd frontend
npm run dev
```

### 3. Keep Backend Running
Your backend is already running, but it needs MongoDB to work.

---

## Or Use the Updated Start Script:

The `start.ps1` script now automatically:
- ✅ Starts MongoDB if it's not running
- ✅ Starts Backend
- ✅ Starts Frontend

Just run:
```powershell
.\start.ps1
```

**Note:** If MongoDB fails to start automatically, you may need to run PowerShell as Administrator.

---

## Verify Everything is Running:

### Check MongoDB:
```powershell
Get-Service MongoDB
```
Should show: `Status: Running`

### Check Frontend:
Open: http://localhost:3001
Should show: DermAI upload page

### Check Backend:
Backend terminal should show: `🚀 Backend server running on http://localhost:3000`

---

## If MongoDB Still Won't Start:

1. **Run PowerShell as Administrator:**
   - Right-click PowerShell
   - Select "Run as Administrator"
   - Then run: `net start MongoDB`

2. **Or start MongoDB manually:**
   - Open Services (services.msc)
   - Find "MongoDB"
   - Right-click → Start

---

## After Fixing:

1. ✅ MongoDB running
2. ✅ Backend running (should connect to MongoDB now)
3. ✅ Frontend running on port 3001
4. ✅ Open http://localhost:3001
5. ✅ Upload an image
6. ✅ Should work now!

