---
name: qa:testplan
description: >
  Create a comprehensive test plan from specs/user stories: strategy, test cases (happy/edge/negative), exit criteria.
  Trigger when: user says "create test plan", "write test cases", "compose test plan",
  "create test plan", "QA plan for feature", "test strategy", or types /qa:testplan.
---

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

Create file `docs/tasks/[TASK-ID]/test-plan.md`:

```markdown
# Test Plan: [TASK-ID] — [Feature name]

**QA**: [Name]  
**Date**: [Date]  
**Version**: 1.0

## 1. Scope

### In scope
- [AC-001]: [...]
- [AC-002]: [...]

### Out of scope
- [Not tested this sprint]

## 2. Test Strategy

| Level | Approach | Tools |
|-------|----------|-------|
| Unit | [Dev self-test] | [JUnit/Jest/...] |
| Integration | [API testing] | [Postman/RestAssured] |
| E2E | [Manual/Selenium] | [...] |
| Performance | [Load test if needed] | [...] |

## 3. Test Cases

### TC-001: [Happy Path — Name]
**Pre-condition**: [State before test]  
**Steps**:
1. [Step 1]
2. [Step 2]  
**Expected**: [Expected result]  
**Priority**: High/Medium/Low

### TC-002: [Edge Case — Name]
...

### TC-003: [Negative Case — Name]
...

## 4. Test Data

| Data | Description | How to create |
|------|-------------|---------------|
| | | |

## 5. Regression Checklist

- [ ] [Feature A] still works normally
- [ ] [Feature B] is not affected

## 6. Exit Criteria

- [ ] All High priority test cases pass
- [ ] No unresolved Critical/High bugs
- [ ] Regression has no new regressions
```

### Step 3.5 — Render HTML companion (interactive checklist)

Generate `docs/tasks/[TASK-ID]/test-plan.html` from template `E:\AI Bootcamp\ClaudeSkill\templates\html-artifact.html`:

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
