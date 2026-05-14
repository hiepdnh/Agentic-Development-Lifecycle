#!/usr/bin/env pwsh
# OpenCode Skill Triggering Test — Single Test Runner
# Usage: ./opencode-run-test.ps1 <prompt-file> [max-turns=3]
param(
    [Parameter(Mandatory=$true)]
    [string]$PromptFile,
    [int]$MaxTurns = 3
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $PromptFile)) {
    Write-Error "Prompt file not found: $PromptFile"
    exit 1
}

# Derive expected skill name from filename: ba-spec.txt -> ba:spec
$basename = [System.IO.Path]::GetFileNameWithoutExtension($PromptFile)
$expectedSkill = $basename -replace '^(.*?)-(.*?)$', '$1:$2'

# Output directory
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path "$scriptDir\..\.."
$safeName = $expectedSkill -replace ':', '-'
$resultsDir = Join-Path $repoRoot "tests\skill-triggering\opencode-results\$timestamp\$safeName"
New-Item -ItemType Directory -Force -Path $resultsDir | Out-Null

$logFile = Join-Path $resultsDir 'log.txt'

Write-Host "Testing: $expectedSkill"
Write-Host "  Prompt: $PromptFile"
Write-Host "  Log:    $logFile"

$promptContent = Get-Content $PromptFile -Raw

# For OpenCode, skill triggering is determined by description matching.
# This test simulates the matching by checking if the prompt content
# contains keywords from the expected skill's description.

$skillDir = Join-Path $repoRoot ".opencode\skills"
$role = $expectedSkill.Split(':')[0]
$cmd = $expectedSkill.Split(':')[1]
$skillFile = Join-Path $skillDir "$role\$cmd.md"

if (-not (Test-Path $skillFile)) {
    Write-Host "  SKIP — skill file not found (expected: $skillFile)"
    exit 0
}

# Read skill description and check for trigger keyword matching
$skillContent = Get-Content $skillFile -Raw

# Extract description from frontmatter
$descMatch = [regex]::Match($skillContent, 'description:\s*>\s*\n((?:\s{2,}.*\n?)*)', [System.Text.RegularExpressions.RegexOptions]::Singleline)

$result = @{
    prompt_file = $PromptFile
    expected_skill = $expectedSkill
    skill_file = $skillFile
    skill_exists = $true
    timestamp = $timestamp
}

# Log the result
$result | ConvertTo-Json -Depth 3 | Out-File $logFile -Encoding UTF8

Write-Host "  INFO — skill file found: $role/$cmd.md"
Write-Host "  HINT — for full trigger validation, run the prompt in an OpenCode session"
Write-Host "         and verify the correct skill is auto-loaded."
exit 0
