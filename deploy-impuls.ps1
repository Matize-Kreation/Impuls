# ==========================================================
# Deploy Script für Impuls-local (Git + Vercel, kein Backup)
# ==========================================================

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$projectPath = "D:\Matize\Matize-Kreation\Impuls\Impuls-local"

Write-Host "Starting DEPLOY for Impuls-local..." -ForegroundColor Green

# --- GIT BEREICH -------------------------------------------------------------

Write-Host "Running Git commit & push..." -ForegroundColor Yellow

try {
    Set-Location $projectPath

    git add .

    $commitMessage = "Auto Deploy $timestamp"
    git commit -m $commitMessage

    git push origin main

    Write-Host "Git push successful." -ForegroundColor Green
}
catch {
    Write-Host "Git commit/push skipped or failed: $_" -ForegroundColor Red
}

# --- VERCEL DEPLOYMENT -------------------------------------------------------

Write-Host "Starting Vercel deployment..." -ForegroundColor Yellow

try {
    Set-Location $projectPath
    vercel --prod --confirm
    Write-Host "Vercel deployment successful." -ForegroundColor Green
}
catch {
    Write-Host "Error during Vercel deployment: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Deploy finished." -ForegroundColor Cyan
Write-Host ""
Pause
