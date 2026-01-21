Write-Host "🚀 Iniciando Venezuela Dolar Tracker..." -ForegroundColor Cyan

# Start Backend
Write-Host "📦 Iniciando Backend..." -ForegroundColor Yellow
Set-Location backend
Start-Process -FilePath "npm.cmd" -ArgumentList "run", "start:dev" -NoNewWindow

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Yellow
Set-Location ../frontend
Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -NoNewWindow

Write-Host ""
Write-Host "✅ Aplicación iniciada!" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173"
Write-Host "   Backend:  http://localhost:3000"
Write-Host ""
Write-Host "Presiona Ctrl+C para detener..."
