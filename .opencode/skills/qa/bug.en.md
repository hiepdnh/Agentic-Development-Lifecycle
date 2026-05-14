---
name: qa:bug
description: >
  Create a standardized bug report with severity, steps to reproduce, and sufficient evidence for devs to fix.
  Trigger when: user says "found a bug", "write bug report", "report an error",
  "create bug ticket", "there is a defect", "bug needs reporting", or types /qa:bug.
---

# /qa:bug
**Role**: QA Engineer  
**Purpose**: Create a standardized bug report with enough information for devs to reproduce and fix.

---

## Execution Guide

### Step 1 — Gate: Gather information

question({
  questions: [{
    question: "Provide information about the bug:",
    header: "Bug Info",
    options: [
      { label: "Have screenshot", description: "I will attach screenshots/logs" },
      { label: "No evidence", description: "Text description only, no screenshots" },
    ]
  }]
})

### Step 2 — Classify severity

Evaluate based on impact:

- **Critical**: Crash, data loss, security breach, payment failure
- **High**: Core feature broken, no workaround
- **Medium**: Feature degraded, workaround exists
- **Low**: UI issue, minor inconvenience

Ask if unclear: *"Does this bug have a workaround? Can the user continue their work?"*

### Step 3 — Create Bug Report

```markdown
# [BUG-XXX] [Short title describing the bug]

**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low  
**Priority**: P1 / P2 / P3  
**Reporter**: [Name]  
**Report date**: [Date]  
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

[1-2 sentences clearly describing what the bug is]

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

[How many users affected? Which features blocked?]

## Workaround

[Is there a workaround? If yes, describe it]

## Related

- Issue: #[number if any]
- ADR / Design: [link if relevant]
```

### Step 4 — Final Gate

question({
  questions: [{
    question: "Bug report is ready. Confirm before submitting?",
    header: "Final Review",
    options: [
      { label: "OK", description: "Steps to reproduce are correct, severity is accurate" },
      { label: "Fix steps", description: "Steps to reproduce need adjustment" },
      { label: "Fix severity", description: "Severity is wrong, needs adjustment" },
    ]
  }]
})
