# D:\Matize\Matize-Kreation\Impuls\Impuls-local\start-impuls-local.ps1
# Ultra-clean Impuls-Start:
# - keine eigene Konsole offen
# - nur Next.js-Dev-Fenster + Browser

$projectPath = "D:\Matize\Matize-Kreation\Impuls\Impuls-local"
$localURL = "http://localhost:3000"

# Projektordner vorhanden?
if (-not (Test-Path $projectPath)) {
    exit
}

# Dependencies grob prüfen (node_modules + next)
$nodeModulesPath = Join-Path $projectPath "node_modules"
$nextPackagePath = Join-Path $projectPath "node_modules\next\package.json"

if (-not (Test-Path $nodeModulesPath) -or -not (Test-Path $nextPackagePath)) {
    # pnpm install im versteckten Fenster
    Start-Process "powershell" -WindowStyle Hidden -ArgumentList "
        -ExecutionPolicy Bypass -Command `
        Set-Location `"$projectPath`"; `
        pnpm install
    "
}

# Next.js Dev-Server in eigenem Fenster starten
Start-Process "powershell" -WindowStyle Normal -ArgumentList "
    -NoExit -ExecutionPolicy Bypass -Command `
    Set-Location `"$projectPath`"; `
    pnpm dev
"

# Browser öffnen
Start-Process $localURL

# dieses Script ist nur der Auslöser → direkt wieder weg
exit
