---
name: opencode-test-harness
description: >
  Test harness for OpenCode VTI SDLC skills. Validates that skills auto-trigger correctly
  for naive Vietnamese prompts.
---

# OpenCode Skill Triggering Test Harness

## Overview

Tests whether VTI SDLC skills auto-trigger correctly in OpenCode when given naive Vietnamese prompts (no explicit `/role:command` syntax).

## How It Works

OpenCode loads skills from `.opencode/skills/` based on `description:` field matching.
When a user types a prompt matching a skill's description triggers, OpenCode auto-loads that skill.

This test harness validates:
1. Each of the 31 skills has a test prompt
2. Prompt filenames map correctly to expected skills
3. Manual testing instructions

## Test Prompt Mapping

Same as Claude Code version: filename `ba-spec.txt` → expected skill `ba:spec` (first hyphen → colon).

## Running Tests

### Automated (when OpenCode CLI is available)

```powershell
# From repo root
pwsh tests/skill-triggering/opencode-run-all.ps1

# With verbose output
pwsh tests/skill-triggering/opencode-run-all.ps1 -Verbose

# Filter specific skills
pwsh tests/skill-triggering/opencode-run-all.ps1 -Filter "dev-*"
```

### Manual Testing

For each prompt file, open OpenCode and paste the content. Verify the correct skill is auto-triggered.

```powershell
# Display a specific prompt for manual testing
Get-Content tests/skill-triggering/opencode-prompts/ba-spec.txt
```

## Test Results

Results are stored in `tests/skill-triggering/opencode-results/<timestamp>/`.
Each test creates a log file with the skill trigger result.

## Coverage

| Skill | Prompt File | Status |
|-------|-------------|--------|
| /arch:adr | arch-adr.txt | ✅ |
| /arch:review | arch-review.txt | ✅ |
| /ba:reverse | ba-reverse.txt | ✅ |
| /ba:spec | ba-spec.txt | ✅ |
| /ba:user-story | ba-user-story.txt | ✅ |
| /be:bridge | be-bridge.txt | ✅ |
| /be:changerequest | be-changerequest.txt | ✅ |
| /be:glossary | be-glossary.txt | ✅ |
| /dev:analyze | dev-analyze.txt | ✅ |
| /dev:debug | dev-debug.txt | ✅ |
| /dev:implement | dev-implement.txt | ✅ |
| /dev:pr | dev-pr.txt | ✅ |
| /dev:review | dev-review.txt | ✅ |
| /docs:project | docs-project.txt | ✅ |
| /docs:update | docs-update.txt | ✅ |
| /install | install.txt | ✅ |
| /ops:deploy | ops-deploy.txt | ✅ |
| /ops:incident | ops-incident.txt | ✅ |
| /pm:breakdown | pm-breakdown.txt | ✅ |
| /pm:dashboard | pm-dashboard.txt | ✅ |
| /pm:handover | pm-handover.txt | ✅ |
| /pm:ideate | pm-ideate.txt | ✅ |
| /pm:kickoff | pm-kickoff.txt | ✅ |
| /pm:maintain | pm-maintain.txt | ✅ |
| /pm:release | pm-release.txt | ✅ |
| /pm:status | pm-status.txt | ✅ |
| /qa:bug | qa-bug.txt | ✅ |
| /qa:regression | qa-regression.txt | ✅ |
| /qa:testplan | qa-testplan.txt | ✅ |
| /sec:review | sec-review.txt | ✅ |
| /sm:retro | sm-retro.txt | ✅ |
| /sm:standup | sm-standup.txt | ✅ |

**Total: 32/31 skills covered** (install is a meta-skill, not a project skill)
