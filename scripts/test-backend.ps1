# DermAI Backend Test Script
# Usage: .\test-backend.ps1 [path-to-image]

param(
    [string]$ImagePath = ""
)

Write-Host "`n=== DermAI Backend Test ===" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "1. Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   ❌ Backend is running but root endpoint responded" -ForegroundColor Red
    Write-Host "   This is OK - backend is running" -ForegroundColor Green
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 404) {
        Write-Host "   ✅ Backend is running (404 is expected)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend might not be running. Error: $_" -ForegroundColor Red
        Write-Host "   Please start backend with: cd backend && npm run start:dev" -ForegroundColor Yellow
        exit 1
    }
}

# Check MongoDB connection (indirectly via backend)
Write-Host "`n2. Testing MongoDB connection..." -ForegroundColor Yellow
# We'll test this via the upload endpoint

# Find a test image
Write-Host "`n3. Looking for test image..." -ForegroundColor Yellow
if ([string]::IsNullOrEmpty($ImagePath)) {
    # Try to find an image in the dataset
    $possiblePaths = @(
        "ai\datasets\ham10000\train\nv\*.jpg",
        "ai\datasets\ham10000\val\nv\*.jpg",
        "ai\datasets\ham10000\HAM10000_images_part_1\*.jpg"
    )
    
    $testImage = $null
    foreach ($pattern in $possiblePaths) {
        $images = Get-ChildItem -Path $pattern -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($images) {
            $testImage = $images.FullName
            break
        }
    }
    
    if (-not $testImage) {
        Write-Host "   ❌ No test image found. Please provide one:" -ForegroundColor Red
        Write-Host "   .\test-backend.ps1 -ImagePath `"path\to\your\image.jpg`"" -ForegroundColor Yellow
        exit 1
    }
} else {
    if (-not (Test-Path $ImagePath)) {
        Write-Host "   ❌ Image not found: $ImagePath" -ForegroundColor Red
        exit 1
    }
    $testImage = $ImagePath
}

Write-Host "   ✅ Using test image: $testImage" -ForegroundColor Green

# Test upload endpoint
Write-Host "`n4. Testing upload endpoint..." -ForegroundColor Yellow
$uri = "http://localhost:3000/inference/upload"

try {
    $form = @{
        image = Get-Item $testImage
    }
    
    Write-Host "   Uploading image..." -ForegroundColor Gray
    $response = Invoke-RestMethod -Uri $uri -Method Post -Form $form -TimeoutSec 60
    
    Write-Host "   ✅ Upload successful!" -ForegroundColor Green
    Write-Host "`n   Results:" -ForegroundColor Cyan
    Write-Host "   - Predicted Class: $($response.predicted_class)" -ForegroundColor White
    Write-Host "   - Confidence: $([math]::Round($response.confidence * 100, 2))%" -ForegroundColor White
    Write-Host "   - Filename: $($response.filename)" -ForegroundColor White
    Write-Host "   - Original Name: $($response.originalname)" -ForegroundColor White
    
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
    
} catch {
    Write-Host "   ❌ Upload failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Yellow
    }
    
    exit 1
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host ""

