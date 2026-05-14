---
name: qa:bug
description: >
  Create a standardized bug report with severity, steps to reproduce, and sufficient evidence for devs to fix.
  Triggers when: user says "found a bug", "write bug report", "report an issue",
  "create bug ticket", "there's a defect", or types /qa:bug.
---

# Skill: /qa:bug
**Role**: QA Engineer  
**Purpose**: Create a standardized bug report with enough information for devs to reproduce and fix.

---

## Execution Guide

### Step 1 — Gate: Gather information

```
## I will help you write a bug report.

Tell me:

| # | Question | Options |
|---|---------|---------|
| 1 | Brief description of the issue | _(type here)_ |
| 2 | Environment where found | A: Dev / B: Staging / C: Production / D: Other: ___ |
| 3 | Browser / OS / device | _(type here)_ |
| 4 | Steps to reproduce | _(type here — rough is fine)_ |
| 5 | Expected vs Actual behavior | _(type here)_ |
| 6 | Do you have screenshots/logs? | A: Yes (attached) / B: No / C: Other: ___ |
| 7 | Frequency of the bug | A: 100% on every reproduction / B: Intermittent (~___%) / C: Other: ___ |
```

### Step 2 — Classify severity

Evaluate based on impact:

- **Critical**: Crash, data loss, security breach, payment failure
- **High**: Core feature broken, no workaround
- **Medium**: Feature degraded, workaround exists
- **Low**: UI issue, minor inconvenience

Ask if unclear: *"Is there a workaround for this issue? Can the user continue working?"*

### Step 3 — Create Bug Report

```markdown
# [BUG-XXX] [Short title describing the bug]

**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low  
**Priority**: P1 / P2 / P3  
**Reporter**: [Name]  
**Date reported**: [Date]  
**Status**: New  
**Assigned to**: [Dev name if known]

---

## Environment

| Key | Value |
|-----|-------|
| Environment | Dev / Staging / Production |
| Browser / App version | [...] |
| OS | [...] |
| User role | [...] |
| Test data used | [...] |

## Description

[1-2 sentences clearly describing the bug]

## Steps to Reproduce

1. [Step 1 — specific URL/menu/action]
2. [Step 2]
3. [Step N — trigger the bug]

## Expected Behavior

[What SHOULD happen]

## Actual Behavior

[What ACTUALLY happens]

## Evidence

- Screenshot: [attach]
- Video: [attach if available]
- Log/Error message:
```
[paste error log]
```

## Frequency

[ ] Occurs 100% when reproducing  
[ ] Intermittent (~[X]% of attempts)

## Impact

[How many users affected? Which features are blocked?]

## Workaround

[Is there a workaround? If yes, describe it]

## Related

- Issue: #[number if any]
- ADR / Design: [link if relevant]
```

### Step 4 — Final gate

```
Bug report has been written.

Before submitting:

| # | Question | Options |
|---|---------|---------|
| 1 | Steps to reproduce — confirmed reproducible? | A: Yes / B: No — fix steps: ___ / C: Other: ___ |
| 2 | Is severity [X] correct? | A: Correct / B: Higher — raise to: ___ / C: Lower — lower to: ___ / D: Other: ___ |
| 3 | Should anyone else be tagged? | A: No / B: Yes — username: ___ / C: Other: ___ |
```
