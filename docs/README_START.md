# 🚀 Quick Start - DermAI

## One Command to Start Everything!

### Windows (PowerShell)
```powershell
.\start.ps1
```

### Windows (Command Prompt)
```cmd
start.bat
```

That's it! The script will:
1. ✅ Check MongoDB status
2. 🔧 Start Backend server (port 3000)
3. 🎨 Start Frontend server (port 3001)
4. 🌐 Open browser automatically after 15 seconds

---

## What Happens

1. **Two windows will open:**
   - Backend window (NestJS)
   - Frontend window (Next.js)

2. **Wait 10-15 seconds** for servers to start

3. **Browser opens automatically** to http://localhost:3001

4. **Start testing!** Upload an image and get AI predictions

---

## Manual Start (if script doesn't work)

### Terminal 1 - Backend
```powershell
cd backend
npm run start:dev
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```

Then open: http://localhost:3001

---

## Stop Servers

Just close the PowerShell/Command Prompt windows, or press `Ctrl+C` in each window.

---

## Troubleshooting

### MongoDB not running?
```powershell
net start MongoDB
```

### Port already in use?
```powershell
# Find what's using the port
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### First time setup?
```powershell
# Install dependencies
cd backend
npm install

cd ../frontend
npm install
```

