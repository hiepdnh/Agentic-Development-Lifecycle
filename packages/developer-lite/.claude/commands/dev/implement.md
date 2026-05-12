---
name: dev:implement
description: >
  Implement code after an option is chosen from /dev:analyze. File-by-file with a gate after each file.
  Trigger when: user says "start implementing", "code the plan", "write code for task",
  "implement feature", "bắt đầu implement", "viết code", or types /dev:implement.
---

# Skill: /dev:implement
**Role**: Developer  
**Purpose**: Implement code file-by-file after the approach is decided. Never skip files, never auto-proceed.

---

## Prerequisite

Requires `docs/tasks/[TASK-ID]/analysis.md` to exist.  
If not → run `/dev:analyze` first.

---

## Steps

### Step 1 — Read analysis doc

Read `docs/tasks/[TASK-ID]/analysis.md`:
- Chosen option
- Files to change
- Technical decisions already confirmed

### Step 1b — Gate: TDD Lane (opt-in)

```
## Implementation mode

| | Choice |
|---|--------|
| A | Standard — write code first, tests after (default) |
| B | TDD — write failing tests first, then implement to make them pass |
```

**If TDD (B)**:
1. For each business logic file: write failing test first
2. Gate: confirm tests cover ACs
3. Implement code to make tests pass
4. Report: "Tests: N passing / M failing" per file

**Wait for confirm.**

### Step 2 — Gate: Confirm plan

```
## Implementing [TASK-ID] — Option [X]

**Files (in order)**:
1. `[file 1]` — create/modify — [reason]
2. `[file 2]` — create/modify — [reason]

**Order rationale**: [dependencies]

**Setup needed**:
- Migration: yes / no
- New env vars: [list or "none"]

| | Choice |
|---|--------|
| A | Start with `[file 1]` |
| B | Adjust order — new order: ___ |
| C | Other: ___ |
```

**Wait for confirm.**

### Step 3 — Implement each file

For **each file**, in order:

1. Read current file (if modifying)
2. Implement changes
3. Report:

```
## File [N/Total]: `[path]` ✅

**Changes**:
- [Change 1]
- [Change 2]

**Tests**: written inline / needs separate file / N/A

| | Choice |
|---|--------|
| A | Continue to `[next file]` |
| B | Stop — need to adjust: ___ |
| C | Other: ___ |
```

**Wait for confirm before next file.**

If blocked (missing dep, unexpected state, conflict):

```
## ⚠️ Blocked at `[path]`

**Problem**: [specific description]

| | Choice |
|---|--------|
| A | [Resolution A] |
| B | [Resolution B] |
| C | Other: ___ |
```

**Never self-decide when blocked.**

### Step 4 — Gate: Post-implementation checklist

```
## Implementation complete — [TASK-ID]

**Files changed**: [N]
**Migration needed**: yes / no
**New env vars**: [list or "none"]

**Self-check** (verify before handing off):
- [ ] No hardcoded values (URLs, credentials, magic numbers)
- [ ] Error cases handled
- [ ] Input validated at system boundary (API / form)
- [ ] No sensitive data logged (password, token, PII)
- [ ] DB migration is reversible (if applicable)
```

**Wait for self-check confirm.**

### Step 5 — Verification

After Step 4, read `git diff` and generate self-test steps:

```
## Verification — [TASK-ID]

### What changed
**Files**: [list]
**Impact**: [affected modules, potential risks]
**AC coverage**:
- ✅ AC-001: covered at [file:line]
- ⚠️ AC-002: needs manual verification

### Self-Test Steps
| # | Action | Expected Result |
|---|--------|----------------|
| T-01 | [specific action] | [expected outcome] |
| T-02 | [specific action] | [expected outcome] |
| T-03 | [edge case] | [expected outcome] |

Run the steps above and report: PASS / FAIL / SKIP per test.
```

**Wait for test results.**

After receiving results, save `docs/tasks/[TASK-ID]/verification.md`:

```markdown
# Verification: [TASK-ID]

## AC Coverage
- ✅/❌ AC-001: [...]

## Self-Test Results
| # | Action | Expected | Result | Notes |
|---|--------|---------|--------|-------|
| T-01 | [...] | [...] | PASS/FAIL | [...] |

## Sign-off
- Date: [date]
- Status: PASS / FAIL / CONDITIONAL
```

```
## Done ✓

Saved: docs/tasks/[TASK-ID]/verification.md

Next steps:
1. /dev:review — review before PR
2. /dev:pr — create PR
```

**Do NOT auto-run review or PR.**

---

## Rules

- One file at a time — no jumping ahead
- No refactoring outside task scope
- No features beyond defined ACs
- Migrations that could lose data → always ask confirm first
- Unrelated bug found → note it, create separate issue, do not fix now
