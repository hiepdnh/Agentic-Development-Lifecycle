---
name: qa:bug
description: >
  Create a standardized bug report with severity, steps to reproduce, and sufficient evidence for devs to fix.
  Trigger when: user says "found a bug", "write bug report", "report an error",
  "create bug ticket", "there is a defect", "bug needs reporting", or types /qa:bug.
---
## Summary

Create a standardized bug report with severity, steps to reproduce, and sufficient evidence for devs to fix. Trigger when: user says "found a bug", "write bug report", "report an error", "create bug ticket", "there is a defect", "bug needs reporting", or types /qa:bug.

## Workflow

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

Create bug report using template `templates/bug-report.en.md`. Fill in:
- **Title**: short description of the bug
- **Severity** (Critical/High/Medium/Low) + **Priority** (P1/P2/P3)
- **Reporter** + **Report date** + **Assigned to**
- **Environment**: environment, Browser/App version, OS, User role, Test data
- **Description**: 1-2 sentences clearly describing the bug
- **Steps to Reproduce**: each step with specific URL/menu/action
- **Expected Behavior** vs **Actual Behavior**
- **Evidence**: screenshot, video, error log
- **Frequency**: 100% or intermittent
- **Impact**: users affected, features blocked
- **Workaround** if any
- **Related**: issue number, ADR/Design link

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
