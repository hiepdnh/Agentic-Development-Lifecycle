#!/usr/bin/env pwsh
# OpenCode Skill Triggering Test — Orchestrator
# Usage: ./opencode-run-all.ps1 [-Verbose] [-Filter <glob>] [-Language vi|en|ja]
param(
    [switch]$Verbose,
    [string]$Filter = '*',
    [ValidateSet('vi', 'en', 'ja')]
    [string]$Language = 'vi'
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$promptsDir = switch ($Language) {
    'ja' { Join-Path $scriptDir 'opencode-prompts-ja' }
    'en' { Join-Path $scriptDir 'opencode-prompts-en' }
    default { Join-Path $scriptDir 'opencode-prompts' }
}

Write-Host "Language: $Language | Prompts dir: $(Split-Path -Leaf $promptsDir)" -ForegroundColor Cyan

$pass = 0
$fail = 0
$skip = 0
$failList = @()
$skipList = @()

$promptFiles = Get-ChildItem -Path $promptsDir -Filter "$Filter.txt" | Sort-Object Name

foreach ($prompt in $promptFiles) {
    $basename = [System.IO.Path]::GetFileNameWithoutExtension($prompt.Name)

    # Run test
    try {
        $output = & "$scriptDir\opencode-run-test.ps1" -PromptFile $prompt.FullName 2>&1
        $exitCode = $LASTEXITCODE

        if ($exitCode -eq 0) {
            if ($output -match 'SKIP') {
                Write-Host "SKIP  $basename" -ForegroundColor Yellow
                $skip++
                $skipList += $basename
            } else {
                Write-Host "OK    $basename" -ForegroundColor Green
                $pass++
            }
        } else {
            Write-Host "FAIL  $basename" -ForegroundColor Red
            $fail++
            $failList += $basename
            if ($Verbose) { Write-Host $output }
        }
    } catch {
        Write-Host "FAIL  $basename" -ForegroundColor Red
        $fail++
        $failList += $basename
        if ($Verbose) { Write-Host $_ }
    }
}

Write-Host ""
Write-Host "Results: $pass passed, $fail failed, $skip skipped"

# Coverage check — match against correct skill language
$skillDir = Join-Path (Resolve-Path "$scriptDir\..\..") '.opencode\skills'
$skillPattern = if ($Language -eq 'en') { '*.en.md' } else { '*.md' }
$allSkills = Get-ChildItem -Recurse -File -Path $skillDir -Filter $skillPattern |
    Where-Object { $_.Directory.Name -ne 'install' -and $_.Name -ne 'install.en.md' } |
    ForEach-Object {
        $role = $_.Directory.Name
        $rawName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $cmd = if ($Language -eq 'en') { $rawName -replace '\.en$', '' } else { $rawName }
        "$role`:$cmd"
    } | Sort-Object

$promptSkills = $promptFiles | ForEach-Object {
    $b = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
    $b -replace '^(.*?)-(.*?)$', '$1:$2'
} | Sort-Object

$missing = Compare-Object $allSkills $promptSkills | Where-Object { $_.SideIndicator -eq '<=' }
$extra = Compare-Object $allSkills $promptSkills | Where-Object { $_.SideIndicator -eq '=>' }

if ($missing) {
    Write-Host ""
    Write-Host "Missing prompts:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

if ($extra) {
    Write-Host ""
    Write-Host "Extra prompts (no matching skill):" -ForegroundColor Yellow
    $extra | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

if ($failList.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed:" -ForegroundColor Red
    $failList | ForEach-Object { Write-Host "  - $_" }
    exit 1
}

Write-Host ""
Write-Host "All tests passed!" -ForegroundColor Green
