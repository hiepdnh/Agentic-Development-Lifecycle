---
name: qa:regression
description: >
  Create a regression test checklist before release, analyze blast radius, determine go/no-go.
  Trigger when: user says "regression test", "test before release", "verify no regression",
  "sprint sign-off", "QA before production deploy", or types /qa:regression.
---

# /qa:regression
**Role**: QA Engineer  
**Purpose**: Create a regression test checklist before release. Verify that existing features are not affected by new changes.

---

## When to use

- Before each release / sprint end
- After merging PRs with changes affecting shared code (auth, middleware, DB migration)
- When PM requests sign-off before production deploy

---

## Execution Guide

### Step 1 — Gather change scope

Spawn subagent to read:
- `git log [base]..HEAD --name-only` — files that have changed
- `docs/tasks/[TASK-IDs]/requirements.md` — all tasks in the release

Subagent returns: file list + blast radius analysis.

### Step 2 — Gate: Confirm regression scope

question({
  questions: [{
    question: "Confirm the regression scope for this release?",
    header: "Scope",
    options: [
      { label: "Confirm", description: "Create checklist according to the analyzed scope" },
      { label: "Adjust", description: "Modify scope — add/remove areas to test" },
    ]
  }]
})

### Step 3 — Create Regression Checklist (HTML is the primary format)

Regression checklist is a **one-shot decision artifact** (run → tick → go/no-go) — primary format is HTML, no Markdown commit needed. Generate `docs/tasks/regression-[sprint-or-version].html` from template `templates/html-artifact.html`:

- 3 collapsible `<details>` sections for 🔴 Must Test / 🟡 Should Test / 🟢 Smoke
- Each section is a `<table data-sortable>` with columns: ID | Test Case | Steps | Expected | Result | Bug?
- Result column has `<select>` (Pass/Fail/Blocked) updating `data-state`, changing row background based on state
- Header has auto-updating Go/No-Go badge: turns red if any Must Test = Fail
- Toolbar has "Export results" button — copies table as Markdown to paste into sprint report

HTML file NOT committed (in `docs/tasks/**/*.html` which is ignored). If JP client requests evidence, **export to PDF from browser** (Cmd+P → Save as PDF) then attach.

Content structure (skill injects into HTML):

```markdown
# Regression Test: [Sprint/Version]

**QA**: [Name]  
**Date**: [Date]  
**Release scope**: [TASK-IDs]  
**Environment**: Staging  
**Status**: In Progress / Pass / Fail

---

## 🔴 Must Test (High Risk)

### [Area 1 — e.g., Auth Flow]

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-001 | Login with valid email/password | 1. POST /auth/login with correct credentials | 200 + JWT token | | |
| RT-002 | Login with wrong password | 1. POST /auth/login with wrong password | 401 + error message | | |
| RT-003 | [Newly merged feature] | [...] | [...] | | |

### [Area 2 — if any]

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-XXX | | | | | |

---

## 🟡 Should Test (Medium Risk)

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-XXX | | | | | |

---

## 🟢 Smoke Test (Low Risk)

| ID | Test Case | Result |
|----|-----------|--------|
| RT-XXX | Core flow X still works | |

---

## Bugs Found

| Bug ID | Severity | Test Case | Description | Status |
|--------|----------|-----------|-------------|--------|
| | | | | |

---

## Sign-off

- [ ] All 🔴 Must Test pass
- [ ] No unresolved Critical/High bugs
- [ ] PM confirms acceptable risk for remaining Medium/Low bugs
- [ ] QA Lead sign-off: __________________  Date: __________
```

### Step 4 — Gate: Sign-off confirmation

question({
  questions: [{
    question: "Regression checklist created. Are the go/no-go conditions clear?",
    header: "Sign-off",
    options: [
      { label: "Ready", description: "Must Test pass, no Critical/High bugs" },
      { label: "Not ready", description: "Still have Must Test failures or Critical bugs" },
    ]
  }]
})

---

## Rules

- Regression scope must cover all High Risk areas — no skipping
- If new bugs are found → create an issue immediately, assign priority, do not assume "will fix later"
- Do not deploy to production with unresolved Critical or High bugs
- Regression results must be saved in `docs/tasks/` for audit trail
