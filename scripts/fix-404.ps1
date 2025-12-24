# Quick Fix for 404 Error - PowerShell Script
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fix 404 Error - Backend Not Starting" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "The backend is blocked by MongoDB connection errors." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB first (recommended)" -ForegroundColor White
Write-Host "2. Start backend WITHOUT MongoDB (quick fix)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1 or 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "Starting MongoDB..." -ForegroundColor Yellow
    
    # Check if MongoDB service exists
    $mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
    if ($mongoService) {
        if ($mongoService.Status -eq 'Running') {
            Write-Host "   [OK] MongoDB is already running" -ForegroundColor Green
        } else {
            try {
                Start-Service MongoDB -ErrorAction Stop
                Start-Sleep -Seconds 3
                Write-Host "   [OK] MongoDB started!" -ForegroundColor Green
            } catch {
                Write-Host "   [ERROR] Failed to start MongoDB: $_" -ForegroundColor Red
                Write-Host "   Try running as Administrator or start MongoDB manually" -ForegroundColor Yellow
                exit 1
            }
        }
    } else {
        Write-Host "   [WARNING] MongoDB service not found" -ForegroundColor Yellow
        Write-Host "   Please install MongoDB or use option 2" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host ""
    Write-Host "Now restart your backend server:" -ForegroundColor Cyan
    Write-Host "   Stop the current backend (Ctrl+C)" -ForegroundColor White
    Write-Host "   Then run: cd backend; npm run start:dev" -ForegroundColor White
    
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "Starting backend WITHOUT MongoDB..." -ForegroundColor Yellow
    Write-Host ""
    
    # Stop any existing backend on port 3000
    Write-Host "Stopping existing backend..." -ForegroundColor Yellow
    $portProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($portProcess) {
        try {
            Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction Stop
            Write-Host "   [OK] Stopped existing backend" -ForegroundColor Green
            Start-Sleep -Seconds 2
        } catch {
            Write-Host "   [WARNING] Could not stop process" -ForegroundColor Yellow
        }
    }
    
    # Set NO_DB environment variable and start backend
    Write-Host "Starting backend with NO_DB=true..." -ForegroundColor Yellow
    $env:NO_DB = "true"
    
    $backendPath = Join-Path $PSScriptRoot "backend"
    if (-not (Test-Path $backendPath)) {
        $backendPath = Join-Path (Get-Location) "backend"
    }
    
    Write-Host ""
    Write-Host "Starting backend in new window..." -ForegroundColor Cyan
    Write-Host "   Backend will run on http://localhost:3000" -ForegroundColor Gray
    Write-Host ""
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; `$env:NO_DB='true'; Write-Host 'Backend Server (No MongoDB) - Port 3000' -ForegroundColor Cyan; Write-Host ''; npm run start:dev" -WindowStyle Normal
    
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Backend Starting!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Wait 10-15 seconds for backend to start..." -ForegroundColor Yellow
    Write-Host "Then try uploading an image again!" -ForegroundColor Yellow
    Write-Host ""
    
} else {
    Write-Host "Invalid choice. Exiting." -ForegroundColor Red
    exit 1
}




