# Start MongoDB Script
# Run this if MongoDB service won't start

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting MongoDB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Method 1: Try to start MongoDB service
Write-Host "Method 1: Starting MongoDB Service..." -ForegroundColor Yellow
try {
    $service = Get-Service MongoDB -ErrorAction Stop
    if ($service.Status -eq 'Running') {
        Write-Host "   [OK] MongoDB is already running!" -ForegroundColor Green
    } else {
        Start-Service MongoDB -ErrorAction Stop
        Start-Sleep -Seconds 3
        Write-Host "   [OK] MongoDB service started!" -ForegroundColor Green
    }
} catch {
    Write-Host "   [FAILED] Could not start MongoDB service" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host ""
    
    # Method 2: Try to find and run mongod directly
    Write-Host "Method 2: Looking for MongoDB executable..." -ForegroundColor Yellow
    $possiblePaths = @(
        "C:\Program Files\MongoDB\Server\*\bin\mongod.exe",
        "C:\mongodb\bin\mongod.exe",
        "$env:ProgramFiles\MongoDB\Server\*\bin\mongod.exe"
    )
    
    $mongodPath = $null
    foreach ($path in $possiblePaths) {
        $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $mongodPath = $found.FullName
            break
        }
    }
    
    if ($mongodPath) {
        Write-Host "   [FOUND] MongoDB at: $mongodPath" -ForegroundColor Green
        Write-Host "   Starting MongoDB manually..." -ForegroundColor Yellow
        
        # Try to start mongod
        $dataDir = "C:\data\db"
        if (-not (Test-Path $dataDir)) {
            Write-Host "   Creating data directory: $dataDir" -ForegroundColor Yellow
            New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
        }
        
        Start-Process -FilePath $mongodPath -ArgumentList "--dbpath", $dataDir -WindowStyle Normal
        Write-Host "   [OK] MongoDB started in new window!" -ForegroundColor Green
        Write-Host "   Keep that window open!" -ForegroundColor Yellow
    } else {
        Write-Host "   [NOT FOUND] MongoDB executable not found" -ForegroundColor Red
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "   MongoDB Installation Required" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install MongoDB:" -ForegroundColor Yellow
        Write-Host "1. Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Cyan
        Write-Host "2. Install MongoDB Community Server" -ForegroundColor Cyan
        Write-Host "3. Run this script again" -ForegroundColor Cyan
        Write-Host ""
    }
}

Write-Host ""
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
$check = netstat -ano | Select-String ":27017"
if ($check) {
    Write-Host "   [OK] MongoDB is listening on port 27017!" -ForegroundColor Green
} else {
    Write-Host "   [WARNING] MongoDB might not be running yet" -ForegroundColor Yellow
    Write-Host "   Wait a few seconds and check again" -ForegroundColor Gray
}

Write-Host ""

