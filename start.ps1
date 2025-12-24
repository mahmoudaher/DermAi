# DermAI - Start Script
# Usage: .\start.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DermAI - Starting Servers" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check and Start MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
$mongoRunning = $false
if ($mongoService -and $mongoService.Status -eq 'Running') {
    Write-Host "   [OK] MongoDB is running" -ForegroundColor Green
    $mongoRunning = $true
} else {
    Write-Host "   [WARNING] MongoDB is not running" -ForegroundColor Yellow
    Write-Host "   Attempting to start MongoDB..." -ForegroundColor Yellow
    try {
        Start-Service MongoDB -ErrorAction Stop
        Start-Sleep -Seconds 2
        Write-Host "   [OK] MongoDB started successfully!" -ForegroundColor Green
        $mongoRunning = $true
    } catch {
        Write-Host "   [WARNING] Failed to start MongoDB automatically" -ForegroundColor Yellow
        Write-Host "   Starting backend WITHOUT MongoDB (NO_DB mode)" -ForegroundColor Cyan
        Write-Host "   Backend will work, but results won't be saved to database" -ForegroundColor Gray
        $env:NO_DB = "true"
    }
}

# Get script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrEmpty($scriptPath)) {
    $scriptPath = $PWD.Path
}

# Start Backend
Write-Host ""
Write-Host "Starting Backend Server (NestJS)..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptPath "backend"
if (-not (Test-Path $backendPath)) {
    Write-Host "   [ERROR] Backend folder not found!" -ForegroundColor Red
    exit 1
}

# Set NO_DB if MongoDB is not running
if (-not $mongoRunning) {
    $env:NO_DB = "true"
    $backendCommand = "cd '$backendPath'; `$env:NO_DB='true'; Write-Host 'Backend Server (No MongoDB) - Port 3000' -ForegroundColor Cyan; Write-Host ''; npm run start:dev"
} else {
    $backendCommand = "cd '$backendPath'; Write-Host 'Backend Server - Port 3000' -ForegroundColor Cyan; Write-Host ''; npm run start:dev"
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand -WindowStyle Normal

# Wait a bit
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server (Next.js)..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptPath "frontend"
if (-not (Test-Path $frontendPath)) {
    Write-Host "   [ERROR] Frontend folder not found!" -ForegroundColor Red
    exit 1
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend Server - Port 3001' -ForegroundColor Cyan; Write-Host ''; npm run dev" -WindowStyle Normal

# Wait a bit more
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Servers are starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Wait 10-15 seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host "Then open: http://localhost:3001 in your browser" -ForegroundColor Yellow
Write-Host ""
Write-Host "To stop servers: Close the PowerShell windows" -ForegroundColor Gray
Write-Host ""

# Optionally open browser after delay
Start-Sleep -Seconds 15
Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3001"

