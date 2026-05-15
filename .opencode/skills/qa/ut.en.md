---
name: qa:ut
description: >
  Create Unit Test plan (testcase-functional) from spec/requirements, support human execution and result recording.
  Completely separate from IT (integration/E2E). On failure, explicit bug feedback loop back to dev:debug.
  Triggers when: user says "tạo unit test", "UT plan", "functional test cases", "create unit tests",
  "test each function", "unit test for feature", or types /qa:ut.
---

# /qa:ut
**Role**: QA Engineer  
**Purpose**: Create Unit Test plan per function/component, support execution and result recording. On failure → explicit bug feedback loop back to dev phase.

---

## Execution Guide

### Step 1 — Read input

Read `docs/tasks/[TASK-ID]/requirements.md`, `docs/tasks/[TASK-ID]/analysis.md`, and relevant screen/API docs.

### Step 2 — Gate: Confirm UT scope

question({
  questions: [{
    question: "Confirm Unit Test scope?",
    header: "UT Scope",
    options: [
      { label: "Mock all deps", description: "Pure unit test — mock all dependencies" },
      { label: "Lean integration", description: "Mock only external services, keep real DB" },
      { label: "Other", description: "Describe specific scope" }
    ]
  }]
})

**Wait for confirmation.**

### Step 3 — Create UT Plan

Create `docs/tasks/[TASK-ID]/test-plan-ut.md` with TCs in format `TC-UT-001`:

Each TC: Unit | Input | Expected | Assertion | Type (Happy/Edge/Negative/Error)

Cover fully: happy path, edge cases (boundary/null/zero), negative (invalid input), error (exception).

### Step 4 — Final gate

question({
  questions: [{
    question: "Is the UT plan complete?",
    header: "Validate",
    options: [
      { label: "Complete", description: "Continue — no additions needed" },
      { label: "Missing TCs", description: "Describe TCs to add" },
      { label: "Generate code", description: "AI generates test code from plan" }
    ]
  }]
})

### Step 5 — (Optional) Spawn test-gen

If user selects "Generate code":

task({
  description: "Generate UT code from approved test plan",
  subagent_type: "oracle",
  prompt: "Write unit test code per agents/test-gen.md spec.\n\nIMPLEMENTED FILES:\n[files from analysis.md]\n\nTC LIST:\n[TC-UT-xxx list]\n\nTEST FRAMEWORK:\n[framework]\n\nEXISTING TEST EXAMPLES:\n[1-2 existing test files]"
})

### Step 6 — Gate: UT Execution Results

**⚠️ HUMAN ONLY — AI does not execute tests.**

question({
  questions: [{
    question: "UT suite execution results?",
    header: "UT Result",
    options: [
      { label: "All PASS", description: "Write ut-results.md and proceed to /qa:it" },
      { label: "TCs failed", description: "Describe failing TCs + error → create bug-handoff.md" },
      { label: "Environment error", description: "Setup error, not counted as test failure" }
    ]
  }]
})

**If PASS** → Create `docs/tasks/[TASK-ID]/ut-results.md` (verdict: PASS) → point to `/qa:it`.

**If FAIL** → Create `docs/tasks/[TASK-ID]/bug-handoff.md` with failing TC IDs + suspected files → point to `/dev:debug`.
