# ===================================================================
# Backup & Deployment Script für Impuls-local (V2)
# Nur noch ein Hauptordner: Impuls-local
# ===================================================================

# Fehlerbehandlung aktivieren
$ErrorActionPreference = "Stop"

# Zeitstempel für Backup-Namen
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# --- PFAD-KONFIGURATION ------------------------------------------------------

# Projektpfad (fest, dein Hauptordner)
$projectPath = "D:\Matize\Matize-Kreation\Impuls\Impuls-local"

# Backup-Root (hier landen alle ZIP-Backups)
$backupRoot = "D:\Matize\Matize-Kreation\Backups\Impuls-local"

# Name der ZIP-Datei
$zipFile = Join-Path $backupRoot ("Impuls-local-" + $timestamp + ".zip")

# Anzahl Backups, die behalten werden sollen
$keepBackups = 5

Write-Host "⚡ Starte Backup + Deployment Skript für Impuls-local..." -ForegroundColor Green

# --- BACKUP-BEREICH ----------------------------------------------------------

# Sicherstellen, dass Backup-Root existiert
if (!(Test-Path $backupRoot)) {
    Write-Host "📂 Erstelle Backup-Root $backupRoot ..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $backupRoot | Out-Null
}

# ZIP-Archiv direkt aus dem Projektverzeichnis erzeugen
Write-Host "📦 Erstelle ZIP-Archiv $zipFile ..." -ForegroundColor Yellow

if (Test-Path $zipFile) {
    # Falls aus irgendeinem Grund der Name schon existiert
    Remove-Item $zipFile -Force
}

Compress-Archive -Path "$projectPath\*" -DestinationPath $zipFile -Force

# Alte Backups löschen (Rotation)
Write-Host "🗑️ Prüfe alte Backups (max. $keepBackups behalten)..." -ForegroundColor Yellow

$existingBackups = Get-ChildItem $backupRoot -Filter "Impuls-local-*.zip" | Sort-Object LastWriteTime -Descending
if ($existingBackups.Count -gt $keepBackups) {
    $toDelete = $existingBackups[$keepBackups..($existingBackups.Count - 1)]
    foreach ($f in $toDelete) {
        Remove-Item $f.FullName -Force
        Write-Host "🗑️ Gelöscht: $($f.Name)" -ForegroundColor Red
    }
}

# --- GIT BEREICH -------------------------------------------------------------

Write-Host "🌿 Git Commit & Push..." -ForegroundColor Yellow

try {
    Set-Location $projectPath

    git add .

    $commitMessage = "Auto Backup + Deployment $timestamp"
    git commit -m $commitMessage

    # Branch 'main' wird vorausgesetzt – siehe Anleitung unten
    git push origin main

    Write-Host "✅ Git Push erfolgreich." -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Git Commit/Push übersprungen oder fehlgeschlagen: $_" -ForegroundColor Red
}

# --- VERCEL DEPLOYMENT -------------------------------------------------------

Write-Host "🚀 Starte Deployment auf Vercel..." -ForegroundColor Yellow

try {
    Set-Location $projectPath
    vercel --prod --confirm
    Write-Host "✅ Vercel Deployment erfolgreich." -ForegroundColor Green
}
catch {
    Write-Host "❌ Fehler beim Vercel Deployment: $_" -ForegroundColor Red
}

# --- ABSCHLUSS ----------------------------------------------------------------

Write-Host ""
Write-Host "🎉 Backup + Deployment abgeschlossen!" -ForegroundColor Cyan
Write-Host ""
Pause
