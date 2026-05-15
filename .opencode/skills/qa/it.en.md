---
name: qa:it
description: >
  Create Integration/E2E Test plan from spec and UT results, support human E2E execution and result recording.
  Only runs AFTER /qa:ut passes. On failure, explicit bug feedback loop back to dev:debug.
  Triggers when: user says "tạo IT plan", "integration test", "E2E test cases", "integration testing",
  "end-to-end test", "IT plan for feature", or types /qa:it.
---

# /qa:it
**Role**: QA Engineer  
**Purpose**: Create Integration/E2E Test plan covering end-to-end business flows. Only runs AFTER UT passes. On failure → explicit bug feedback loop back to dev phase.

---

## Execution Guide

### Step 0 — Check UT prerequisite

Read `docs/tasks/[TASK-ID]/ut-results.md`. If missing or verdict ≠ PASS → stop and require `/qa:ut` first.

### Step 1 — Read input

Read `requirements.md`, `analysis.md`, `test-plan-ut.md`, and relevant Screen/API docs.

### Step 2 — Gate: Confirm IT scope

question({
  questions: [{
    question: "Confirm Integration Test scope?",
    header: "IT Scope",
    options: [
      { label: "Staging env", description: "Run on staging — use mock external APIs" },
      { label: "Prod-like", description: "Run on prod-like environment — real services" },
      { label: "Dev env", description: "Run on dev — may have limited data" }
    ]
  }]
})

**Wait for confirmation.**

### Step 3 — Create IT Plan

Create `docs/tasks/[TASK-ID]/test-plan-it.md` with TCs in format `TC-IT-001`:

Each TC: Flow | Preconditions | Steps (numbered) | Expected | Postconditions | Type

Cover fully: happy flow (end-to-end), cross-component integration, error recovery, data integrity.

### Step 4 — Final gate

question({
  questions: [{
    question: "Is the IT plan complete?",
    header: "Validate",
    options: [
      { label: "Complete", description: "Proceed to execution" },
      { label: "Missing flows", description: "Describe flows to add" },
      { label: "Hard preconditions", description: "Need help with data/env setup" }
    ]
  }]
})

### Step 5 — Gate: IT Execution Results

**⚠️ HUMAN ONLY — AI does not execute E2E tests.**

question({
  questions: [{
    question: "E2E execution results?",
    header: "IT Result",
    options: [
      { label: "All PASS", description: "Write it-results.md → ready for /dev:pr" },
      { label: "TCs failed", description: "Describe failing TC + step + actual → create bug-handoff.md" },
      { label: "Environment error", description: "Setup error, not counted as test failure" }
    ]
  }]
})

**If PASS** → Create `docs/tasks/[TASK-ID]/it-results.md` (verdict: PASS, ut_prerequisite: PASS) → point to `/dev:pr`.

**If FAIL** → Append to `docs/tasks/[TASK-ID]/bug-handoff.md` with failing TCs + suspected files → point to `/dev:debug`.
