---
name: qa:testplan
description: >
  Create a comprehensive test plan from specs/user stories: strategy, test cases (happy/edge/negative), exit criteria.
  Trigger when: user says "create test plan", "write test cases", "compose test plan",
  "create test plan", "QA plan for feature", "test strategy", or types /qa:testplan.
---
## Summary

Create a comprehensive test plan from specs/user stories: strategy, test cases (happy/edge/negative), exit criteria. Trigger when: user says "create test plan", "write test cases", "compose test plan", "create test plan", "QA plan for feature", "test strategy", or types /qa:testplan.

## Workflow

# /qa:testplan
**Role**: QA Engineer  
**Purpose**: Create a comprehensive test plan from specs/user stories, including test cases and strategy.

---

## Execution Guide

### Step 1 — Read Input

Read `docs/tasks/[TASK-ID]/requirements.md` and related screen/API docs.

### Step 2 — Gate: Confirm test scope

question({
  questions: [{
    question: "Confirm the test scope for this feature?",
    header: "Test Scope",
    options: [
      { label: "Confirm", description: "Create test plan according to the analyzed scope" },
    ]
  }]
})

### Step 3 — Create Test Plan

Create file `docs/tasks/[TASK-ID]/test-plan.md` using template `templates/test-plan.en.md`. Fill in:
- **QA** + **Date** + **Version**
- Scope: In scope (AC-001, AC-002...) and Out of scope
- Test Strategy: level (Unit/Integration/E2E/Performance), approach, tools
- Test Cases: TC-001 Happy Path, TC-002 Edge Case, TC-003 Negative Case (each with pre-condition, steps, expected, priority)
- Test Data: table of data + how to create
- Regression Checklist: features to check for regression
- Exit Criteria: conditions for test completion

### Step 3.5 — Render HTML companion (interactive checklist)

Generate `docs/tasks/[TASK-ID]/test-plan.html` from template `templates/html-artifact.html`:

- Inject `<ul class="checklist" data-storage-key="testplan-[TASK-ID]">` for each TC
- Each `<li>` has `<input type="checkbox" data-id="TC-XXX">` + label = TC name
- Group by type: Happy / Edge / Negative using `<details><summary>` expand
- Header has `<input type="search" data-filter="...">` to filter TC by keyword
- Pill `pill-ok|warn|err` for priority High/Med/Low

QA ticks checkboxes when running tests, state saved in localStorage — no need to copy to Markdown.
HTML file NOT committed (already in `.gitignore`). `test-plan.md` remains the source of truth committed to repo.

```
✓ Generated `docs/tasks/[TASK-ID]/test-plan.html`
  Open in browser when running tests to tick the checklist (state saved in localStorage).
```

### Step 4 — Final Gate

question({
  questions: [{
    question: "Test plan is ready. Are there missing test cases or adjustments needed?",
    header: "Final Review",
    options: [
      { label: "Complete", description: "Test plan is complete, no additions needed" },
      { label: "Missing TC", description: "Need to add test cases: describe specifically" },
      { label: "Fix exit criteria", description: "Need to add exit conditions" },
    ]
  }]
})

### Step 5 — (Optional) Spawn subagent: test-gen

If the user chooses to generate code, spawn test-gen to generate test code from the approved test plan:

```
task(
  description: "Generate test code from approved test plan",
  prompt: "Write test code per agents/test-gen.md spec.\n\nNEW CODE:\n[Files that were implemented — only pass new/changed files]\n\nAC LIST:\n[AC list from test plan]\n\nTEST FRAMEWORK:\n[Jest/JUnit/pytest/...]\n\nEXISTING TEST EXAMPLES:\n[1-2 existing test files]",
  subagent_type: "oracle"
)
```
