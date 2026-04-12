Write-Host "🚀 Starting IAI_DOCS project..." -ForegroundColor Cyan

Write-Host "📡 [Backend] Starting development server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; bun run start:debug"

Write-Host "📱 [Mobile] Starting Expo..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd web; bun run dev"

Write-Host "✅ Both services are starting in separate windows." -ForegroundColor Yellow
