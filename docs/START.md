# 🚀 How to Start DermAI

## One Simple Command

### In PowerShell:
```powershell
.\start.ps1
```

### In Command Prompt:
```cmd
.\start.bat
```

**Note:** In PowerShell, you MUST use `.\` before the script name!

---

## What Happens

1. ✅ Checks MongoDB status
2. 🔧 Opens Backend window (port 3000)
3. 🎨 Opens Frontend window (port 3001)
4. ⏳ Waits 15 seconds
5. 🌐 Opens browser to http://localhost:3001

---

## Quick Test

1. Run `.\start.ps1`
2. Wait for browser to open
3. Upload a skin image
4. Get AI prediction!

---

## Stop Servers

Just close the two PowerShell/Command Prompt windows that opened.

---

## Troubleshooting

### "Script not found" error?
Make sure you're in the project folder:
```powershell
cd C:\Users\moudd\Desktop\dermAi
.\start.ps1
```

### MongoDB not running?
```powershell
net start MongoDB
```

### Port already in use?
Close the existing server windows first, or:
```powershell
# Find process using port 3000 or 3001
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
```

