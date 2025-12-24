# Restart Backend Script
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Restarting Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find and stop backend processes
Write-Host "Stopping existing backend processes..." -ForegroundColor Yellow
$backendProcesses = Get-Process | Where-Object { 
    $_.ProcessName -eq "node" -and 
    ($_.CommandLine -like "*nest*" -or $_.Path -like "*backend*" -or 
     (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -eq $_.Id }))
}

# Try to find process using port 3000
$portProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($portProcess) {
    Write-Host "Found process on port 3000 (PID: $($portProcess.OwningProcess))" -ForegroundColor Yellow
    try {
        Stop-Process -Id $portProcess.OwningProcess -Force -ErrorAction Stop
        Write-Host "   [OK] Process stopped" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "   [WARNING] Could not stop process: $_" -ForegroundColor Yellow
    }
}

# Kill any node processes that might be backend
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
foreach ($proc in $nodeProcesses) {
    try {
        $procPath = $proc.Path
        if ($procPath -and $procPath -like "*backend*") {
            Write-Host "Stopping backend node process (PID: $($proc.Id))" -ForegroundColor Yellow
            Stop-Process -Id $proc.Id -Force -ErrorAction Stop
        }
    } catch {
        # Ignore errors
    }
}

Start-Sleep -Seconds 2

# Wait for port to be free
Write-Host ""
Write-Host "Waiting for port 3000 to be free..." -ForegroundColor Yellow
$maxWait = 10
$waited = 0
while ($waited -lt $maxWait) {
    $portCheck = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if (-not $portCheck) {
        Write-Host "   [OK] Port 3000 is free" -ForegroundColor Green
        break
    }
    Start-Sleep -Seconds 1
    $waited++
}

if ($waited -ge $maxWait) {
    Write-Host "   [WARNING] Port 3000 might still be in use" -ForegroundColor Yellow
}

# Start backend
Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendPath)) {
    $backendPath = Join-Path (Get-Location) "backend"
}

if (-not (Test-Path $backendPath)) {
    Write-Host "   [ERROR] Backend folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host "   Backend path: $backendPath" -ForegroundColor Gray
Write-Host "   Starting in new window..." -ForegroundColor Gray

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend Server - Port 3000' -ForegroundColor Cyan; Write-Host 'Restarting...' -ForegroundColor Yellow; Write-Host ''; npm run start:dev" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Backend Restart Initiated" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 10-15 seconds for the backend to start..." -ForegroundColor Yellow
Write-Host "Then test the endpoint again." -ForegroundColor Yellow
Write-Host ""




