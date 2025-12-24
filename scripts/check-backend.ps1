# Quick Backend Health Check
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Backend Health Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running on port 3000
Write-Host "Checking if backend is running on port 3000..." -ForegroundColor Yellow
$portCheck = netstat -ano | Select-String ":3000" | Select-String "LISTENING"
if ($portCheck) {
    Write-Host "   [OK] Port 3000 is in use" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] Port 3000 is not in use - Backend is NOT running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Solution: Start the backend with:" -ForegroundColor Yellow
    Write-Host "   make start-backend" -ForegroundColor Cyan
    Write-Host "   OR" -ForegroundColor Yellow
    Write-Host "   cd backend && npm run start:dev" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Test the endpoint
Write-Host ""
Write-Host "Testing /inference/upload endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/inference/upload" -Method GET -ErrorAction Stop -TimeoutSec 2
    Write-Host "   [OK] Endpoint is accessible" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "   [OK] Endpoint exists (405 Method Not Allowed is expected for GET)" -ForegroundColor Green
    } elseif ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   [ERROR] Endpoint not found (404)" -ForegroundColor Red
        Write-Host "   The route might not be registered properly" -ForegroundColor Yellow
    } else {
        Write-Host "   [WARNING] Could not test endpoint: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Check MongoDB
Write-Host ""
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq 'Running') {
    Write-Host "   [OK] MongoDB service is running" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] MongoDB service is not running" -ForegroundColor Yellow
    Write-Host "   Start it with: make start-mongo" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Check Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""




