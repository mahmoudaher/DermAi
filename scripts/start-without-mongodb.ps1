# Start Backend without MongoDB
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Backend (No MongoDB)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Setting NO_DB=true to skip MongoDB connection" -ForegroundColor Yellow
Write-Host ""

$env:NO_DB = "true"
cd backend
npm run start:dev




