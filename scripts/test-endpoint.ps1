# Test the inference endpoint
Write-Host ""
Write-Host "Testing /inference/upload endpoint..." -ForegroundColor Cyan
Write-Host ""

try {
    # Test with GET first (should return 404 or 405)
    Write-Host "Testing GET request..." -ForegroundColor Yellow
    $getResponse = Invoke-WebRequest -Uri "http://localhost:3000/inference/upload" -Method GET -ErrorAction SilentlyContinue
    Write-Host "GET Status: $($getResponse.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "GET Status: $statusCode" -ForegroundColor $(if ($statusCode -eq 404) { "Red" } else { "Yellow" })
    if ($statusCode -eq 404) {
        Write-Host "❌ Endpoint NOT FOUND (404)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Possible issues:" -ForegroundColor Yellow
        Write-Host "1. Backend routes not registered properly" -ForegroundColor Yellow
        Write-Host "2. Backend needs to be restarted" -ForegroundColor Yellow
        Write-Host "3. Route path mismatch" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Try restarting the backend:" -ForegroundColor Cyan
        Write-Host "  make stop" -ForegroundColor White
        Write-Host "  make start-backend" -ForegroundColor White
    } elseif ($statusCode -eq 405) {
        Write-Host "✅ Endpoint EXISTS (405 Method Not Allowed is expected for GET)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Testing available routes..." -ForegroundColor Yellow
try {
    $rootResponse = Invoke-WebRequest -Uri "http://localhost:3000/" -Method GET -ErrorAction SilentlyContinue
    Write-Host "Root (/) Status: $($rootResponse.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Root (/) Status: $statusCode" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Checking backend process..." -ForegroundColor Yellow
$backendProcess = Get-Process -Id 5852 -ErrorAction SilentlyContinue
if ($backendProcess) {
    Write-Host "✅ Backend process is running (PID: 5852)" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend process not found" -ForegroundColor Yellow
}

Write-Host ""




