---
name: dev:analyze
description: >
  Analyze a task/issue and propose 2-3 implementation options with trade-offs.
  Trigger when: user says "analyze task", "implementation options", "how should I approach",
  "what's the best way to implement", "phân tích task", "đề xuất phương án", or types /dev:analyze.
---

# Skill: /dev:analyze
**Role**: Developer  
**Purpose**: Analyze a task/issue and propose implementation options before writing code.

---

## Brain Dump (provide before running)

```
Tech stack: [language, framework, DB, infra]
Relevant files: [known file paths]
Constraints: [performance, security, backward compat, deadline]
Known gotchas: [codebase quirks]
Task/Issue: [link or paste content]
```

If context is insufficient → skill asks before proceeding.

---

## Steps

### Step 1 — Parse the task

Read the task/issue and extract:
- **Goal**: what business problem does this solve?
- **Acceptance Criteria**: what does "done" look like?
- **Unknowns**: what's unclear?

### Step 2 — Gate: Confirm understanding

```
## I read [TASK] and understand it as:

**Goal**: [...]
**Type**: Feature / Bug / Refactor
**Acceptance Criteria**:
  - AC-001: [...]
  - AC-002: [...]

**Unclear points**:
  - [?] [Point 1]
  - [?] [Point 2]

Before I scan the codebase — anything to correct or add?
```

**Wait for confirm.**

### Step 3 — Find relevant code

Search the codebase for files/modules related to the task:
- Entry points, handlers, models, services touched by this task
- Existing patterns/conventions to follow
- Areas to avoid

### Step 4 — Gate: Confirm code map

```
## Relevant files found:

| File | Why relevant |
|------|-------------|
| [path:line] | [...] |

**Conventions to follow**:
- [Pattern 1]
- [Pattern 2]

Any files I missed? Any areas to avoid?
```

**Wait for confirm.**

### Step 5 — Propose options

Generate 2–3 implementation options:

```
## Implementation Options for [TASK]

### Option A: [Name] — [keyword]
**Description**: [...]
**Files to change**:
  - `[file]` — [why]
**Estimate**: [X hours]
**Pros**: [...]
**Cons**: [...]
**Risk**: Low / Medium / High

### Option B: [Name]
[same structure]

### Option C: [Name] (if applicable)
[same structure]

---
**My recommendation**: Option [X] because [specific reason].

Which option do you choose?
```

**Wait for human to choose. Never auto-choose.**

### Step 6 — Write analysis doc

After human chooses, create `docs/tasks/[TASK-ID]/analysis.md`:

```markdown
# Analysis: [TASK-ID]

## Chosen Option: [Name]
**Reason**: [from discussion]

## Files to Change
| File | Change type | Notes |
|------|------------|-------|
| | | |

## Options Considered (and why rejected)
- Option A: [reason not chosen]
- Option B: [reason not chosen]

## Open Questions
- [ ] [Any remaining question]
```

```
## Analysis complete ✓

Saved: docs/tasks/[TASK-ID]/analysis.md

**STOP HERE.** Do not auto-implement.

Review analysis.md, then run /dev:implement.
```

**Wait for human to trigger `/dev:implement`.**
