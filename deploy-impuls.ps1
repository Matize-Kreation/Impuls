# =====================================================================
# deploy.ps1 — Impuls-local Dauer-Deploy (GitHub main + Vercel prod)
# Robust gegen: "nothing to commit", fehlende Tools, Env-Drift,
# Projekt-Link-Fehler, Remote-/Branch-Probleme, unerwartete Exit-Codes.
# =====================================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --------------------------- KONFIG ----------------------------------

# Pfad zu deinem lokalen Impuls-local Projekt
$projectPath = "D:\Matize\Matize-Kreation\Impuls\Impuls-local"

# Git Remote & Branch
$remoteName = "origin"
$branchName = "main"

# Commit-Text (wenn Changes existieren)
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$commitMessage = "Auto Deploy $timestamp"

# Vercel Optionen
$doVercelPullBeforeDeploy = $true     # zieht Env/Settings, verhindert Drift
$requireVercelLink = $true     # bricht ab, wenn nicht gelinkt
$vercelScope = $null     # optional: "dein-team-slug" falls nötig

# UX
$pauseAtEnd = $false                 # true = wartet auf Taste am Ende

# ------------------------- HELFER ------------------------------------

function Fail {
    param([string]$msg)
    Write-Host "✖ $msg" -ForegroundColor Red
    exit 1
}

function Info {
    param([string]$msg)
    Write-Host "• $msg" -ForegroundColor Cyan
}

function Step {
    param([string]$msg)
    Write-Host "`n=== $msg ===" -ForegroundColor Yellow
}

function Test-CommandAvailable {
    param([Parameter(Mandatory)][string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        Fail "Command '$Name' not found. Bitte installiere/konfiguriere es."
    }
}

function Invoke-Checked {
    param(
        [Parameter(Mandatory)][scriptblock]$ScriptBlock,
        [Parameter(Mandatory)][string]$FailMsg
    )
    & $ScriptBlock
    if ($LASTEXITCODE -ne 0) { Fail "$FailMsg (ExitCode $LASTEXITCODE)" }
}

# ------------------------- PRE-FLIGHT --------------------------------

Step "Pre-flight checks"

if (-not (Test-Path $projectPath)) {
    Fail "Project path not found: $projectPath"
}

Set-Location $projectPath
Info "Working directory: $(Get-Location)"

Test-CommandAvailable git
Test-CommandAvailable vercel

# Prüfen ob Git-Repo
if (-not (Test-Path (Join-Path $projectPath ".git"))) {
    Fail "Kein Git-Repository gefunden in $projectPath"
}

# Remote vorhanden?
$remotes = git remote
if ($remotes -notcontains $remoteName) {
    Fail "Git remote '$remoteName' nicht gefunden. Vorhanden: $remotes"
}

# Branch check (nur Warnung, kein Hard-Fail)
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne $branchName) {
    Write-Host "⚠ Du bist auf Branch '$currentBranch', Ziel ist '$branchName'." -ForegroundColor DarkYellow
    Write-Host "  Ich deploye trotzdem, aber prüfe ob das so gewollt ist." -ForegroundColor DarkYellow
}

# --------------------------- GIT -------------------------------------

Step "Git: stage / commit / push"

Info "git status:"
git status

Info "Staging changes..."
Invoke-Checked { git add . } "git add failed"

# Prüfen auf staged changes
$staged = (git diff --cached --name-only)
$hasChanges = -not [string]::IsNullOrWhiteSpace($staged)

if ($hasChanges) {
    Info "Changes detected. Committing..."
    Invoke-Checked { git commit -m $commitMessage } "git commit failed"
    Info "Commit created: $commitMessage"
}
else {
    Info "No changes to commit. Skipping commit."
}

Info "Pushing to $remoteName/$branchName ..."
Invoke-Checked { git push $remoteName $branchName } "git push failed"
Info "Git push successful."

# -------------------------- VERCEL -----------------------------------

Step "Vercel: link check"

$vercelDir = Join-Path $projectPath ".vercel"
$vercelProjectFile = Join-Path $vercelDir "project.json"

if (-not (Test-Path $vercelProjectFile)) {
    if ($requireVercelLink) {
        Write-Host "⚠ .vercel/project.json fehlt -> Projekt ist nicht gelinkt." -ForegroundColor DarkYellow
        Write-Host "  Versuche 'vercel link --yes'..." -ForegroundColor DarkYellow

        if ($null -ne $vercelScope) {
            Invoke-Checked { vercel link --yes --scope $vercelScope } "vercel link failed"
        }
        else {
            Invoke-Checked { vercel link --yes } "vercel link failed"
        }

        if (-not (Test-Path $vercelProjectFile)) {
            Fail "Vercel link scheint nicht erfolgreich. Bitte einmal manuell: 'vercel link'"
        }

        Info "Vercel project linked."
    }
    else {
        Write-Host "⚠ Projekt nicht gelinkt; fahre fort (kann zum Prompt führen)." -ForegroundColor DarkYellow
    }
}
else {
    Info "Vercel link OK (.vercel/project.json vorhanden)."
}

if ($doVercelPullBeforeDeploy) {
    Step "Vercel: pull env/settings"
    if ($null -ne $vercelScope) {
        Invoke-Checked { vercel pull --yes --scope $vercelScope } "vercel pull failed"
    }
    else {
        Invoke-Checked { vercel pull --yes } "vercel pull failed"
    }
    Info "Vercel pull successful."
}

Step "Vercel: production deploy"

if ($null -ne $vercelScope) {
    Invoke-Checked { vercel deploy --prod --yes --scope $vercelScope } "vercel deploy failed"
}
else {
    Invoke-Checked { vercel deploy --prod --yes } "vercel deploy failed"
}

Info "Vercel deployment successful."


# --------------------------- DONE ------------------------------------

Step 'Done'
Write-Host '✔ Deploy finished successfully.' -ForegroundColor Green

# Pause optional – komplett safe (nur Single Quotes)
if ($pauseAtEnd) {
    Write-Host ''
    Write-Host 'Press any key to close...' -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
}
