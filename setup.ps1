# VTI SDLC Skill Framework — Setup Script
# Usage: .\setup.ps1 -TargetPath "C:\path\to\your\project"
# Usage: .\setup.ps1                        (install to current directory)

param(
    [string]$TargetPath = (Get-Location).Path
)

$SourcePath = $PSScriptRoot
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "VTI SDLC Skill Framework — Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Source : $SourcePath"
Write-Host "Target : $TargetPath"
Write-Host ""

# Validate target
if (-not (Test-Path $TargetPath)) {
    Write-Host "ERROR: Target path does not exist: $TargetPath" -ForegroundColor Red
    exit 1
}

if ($SourcePath -eq $TargetPath) {
    Write-Host "ERROR: Source and target are the same directory." -ForegroundColor Red
    exit 1
}

# Confirm
$confirm = Read-Host "Install framework into '$TargetPath'? [y/N]"
if ($confirm -notmatch '^[Yy]$') {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""

# Helper
function Copy-Dir {
    param([string]$Src, [string]$Dst, [string]$Label)
    if (Test-Path $Dst) {
        Write-Host "  [SKIP] $Label already exists — manual merge recommended" -ForegroundColor Yellow
    } else {
        Copy-Item -Path $Src -Destination $Dst -Recurse -Force
        Write-Host "  [OK]   $Label" -ForegroundColor Green
    }
}

# 1. Copy .claude/commands
Write-Host "Copying skill commands..."
$claudeTarget = Join-Path $TargetPath ".claude"
$commandsTarget = Join-Path $claudeTarget "commands"
if (-not (Test-Path $claudeTarget)) { New-Item -ItemType Directory -Path $claudeTarget | Out-Null }
Copy-Dir (Join-Path $SourcePath ".claude\commands") $commandsTarget ".claude/commands/"

# 2. Copy agents
Write-Host "Copying agent definitions..."
Copy-Dir (Join-Path $SourcePath "agents") (Join-Path $TargetPath "agents") "agents/"

# 3. Copy templates
Write-Host "Copying templates..."
Copy-Dir (Join-Path $SourcePath "templates") (Join-Path $TargetPath "templates") "templates/"

# 4. Copy docs/workflows
Write-Host "Copying workflow docs..."
$docsTarget = Join-Path $TargetPath "docs"
$workflowsTarget = Join-Path $docsTarget "workflows"
if (-not (Test-Path $docsTarget)) { New-Item -ItemType Directory -Path $docsTarget | Out-Null }
Copy-Dir (Join-Path $SourcePath "docs\workflows") $workflowsTarget "docs/workflows/"

# 5. Create empty doc dirs with .gitkeep
Write-Host "Creating doc directories..."
foreach ($dir in @("api", "screens", "tasks", "decisions")) {
    $dirPath = Join-Path $docsTarget $dir
    if (-not (Test-Path $dirPath)) {
        New-Item -ItemType Directory -Path $dirPath | Out-Null
        New-Item -ItemType File -Path (Join-Path $dirPath ".gitkeep") | Out-Null
        Write-Host "  [OK]   docs/$dir/" -ForegroundColor Green
    } else {
        Write-Host "  [SKIP] docs/$dir/ already exists" -ForegroundColor Yellow
    }
}

# 6. CLAUDE.md
Write-Host "Copying CLAUDE.md..."
$claudeMdTarget = Join-Path $TargetPath "CLAUDE.md"
if (Test-Path $claudeMdTarget) {
    Write-Host "  [SKIP] CLAUDE.md already exists — merge manually" -ForegroundColor Yellow
    Write-Host "         Reference: $SourcePath\CLAUDE.md" -ForegroundColor Gray
} else {
    Copy-Item (Join-Path $SourcePath "CLAUDE.md") $claudeMdTarget
    Write-Host "  [OK]   CLAUDE.md" -ForegroundColor Green
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open CLAUDE.md and update the VTI Context section:"
Write-Host "       - Company/project name"
Write-Host "       - Customer name"
Write-Host "       - Repo URL"
Write-Host "       - Tech stack"
Write-Host ""
Write-Host "  2. Open your project in Claude Code:"
Write-Host "       claude ."
Write-Host ""
Write-Host "  3. Type / to see available commands:"
Write-Host "       /pm:ideate   /ba:spec   /dev:analyze   /qa:testplan ..."
Write-Host ""
Write-Host "  Docs: https://github.com/hiep18101997/ADLC"
