---
name: dev:analyze
description: >
  Analyze task/issue and propose 2-3 implementation options with trade-offs. Uses multi-agent to keep context clean.
  Triggers when: user says "analyze task", "phân tích issue", "xem có cách nào làm",
  "propose options", "implementation options", or types /dev:analyze.
---

# /dev:analyze
**Role**: Developer  
**Purpose**: Analyze task/issue and propose implementation options. Uses multi-agent to keep context clean.

---

## Brain Dump Pattern (input contract)

Before running this skill, the developer should provide the following context block to reduce hallucination:

```
Tech stack: [language, framework, DB, infra]
Relevant files: [known related file paths]
Constraints: [performance, security, backward compat, deadline]
Known gotchas: [known issues in the codebase]
Issue/Task: [link or paste content]
```

If sufficient context is missing → the skill will ask before proceeding.

---

## Multi-Agent Architecture

This skill orchestrates subagents to keep context clean:

```
dev-analyze (orchestrator)
├── [Subagent 1] task-reader    → parse issue → structured understanding
├── [Subagent 2] code-scout     → tìm code liên quan (read-only)
└── [Subagent 3] planner        → synthesize → propose options
```

Each subagent receives **only necessary context**, returns compressed results.

## How to Spawn Subagents

Use OpenCode's **task tool** to spawn each subagent. The prompt must be self-contained — do not pass the full conversation history.

Example spawning task-reader:
```
task(
  description: "Parse GitHub issue into structured JSON",
  prompt: "Read this issue and return structured JSON per agents/task-reader.md spec.\n\nISSUE CONTENT:\n[paste issue content here]",
  subagent_type: "explorer"
)
```

Example spawning code-scout:
```
task(
  description: "Find relevant files for auth task",
  prompt: "Find files relevant to this task. Return JSON per agents/code-scout.md spec.\n\nTASK SUMMARY: [summary]\nTECH STACK: [stack]\nAFFECTED AREAS: [areas]",
  subagent_type: "explorer"
)
```

Example spawning planner:
```
task(
  description: "Synthesize task + code map into implementation options",
  prompt: "Create 2-3 implementation options per agents/planner.md spec.\n\nTASK: [task-reader JSON]\nCODE MAP: [code-scout JSON]\nCONSTRAINTS: [from Gate 1]",
  subagent_type: "oracle"
)
```

---

## Execution Guide

### Step 0 — Risk Classification

Before spawning any subagent, classify risk according to `docs/risk-classifier.md`:

```
## Risk Classification — [TASK-ID]

**Input type**: [new-spec | spec-slice | change-request | maintenance | new-initiative | framework-improvement]
**Risk checklist**: [list ONLY items marked YES — e.g. R-06 ✅ (shared config)]
**Lane**: tiny | normal | high-risk
**Lý do**: [1 câu]
```

- **Tiny lane** → skip this entire skill, patch directly
- **High-risk lane** → stop immediately, show `⚠️ Ask First Gate`, wait for senior confirmation before proceeding
- **Normal lane** → continue with Step 1 below

### Step 1 — Spawn Subagent: task-reader

Spawn subagent with the following task:
> "Read the following issue/task and return structured JSON:
> - task_id, title, type (feature/bug/refactor)
> - business_goal (why this is needed)
> - acceptance_criteria (list)
> - technical_hints (if present in the issue)
> - unknowns (things that are unclear)
> 
> Issue content: [paste issue content]"

Subagent ONLY receives issue content, not codebase context.

### Step 2 — Gate 1: Confirm task understanding

Use the `question` tool to confirm:

question({
  questions: [{
    question: "Do I understand the task goal correctly?",
    header: "Understand",
    options: [
      { label: "Correct", description: "Proceed to scan codebase" },
      { label: "Not correct", description: "Need to revise the goal" },
      { label: "Missing constraint", description: "There are constraints not yet mentioned" },
    ]
  }, {
    question: "Are there any screen/API docs I should read first?",
    header: "Docs",
    options: [
      { label: "Not needed", description: "Proceed directly" },
      { label: "Have docs", description: "Will provide link/path" },
    ]
  }]
})

**Wait for confirmation.**

### Step 3 — Spawn Subagent: code-scout

After receiving confirmation, spawn subagent with the following task:
> "Find files/modules in the codebase related to: [task summary].
> Return:
> - file_path:line_number for each relevant point
> - Brief description of why the file is relevant
> - Current patterns/conventions to follow
> 
> READ-ONLY, do not modify anything."

Subagent receives task summary + file patterns for searching, not the full conversation history.

### Step 4 — Gate 2: Confirm code map

Use the `question` tool:

question({
  questions: [{
    question: "Are there any important files I missed?",
    header: "Files",
    options: [
      { label: "None missing", description: "Code map is complete" },
      { label: "Some missing", description: "Will add files" },
    ]
  }, {
    question: "Are there any modules to AVOID touching in this task?",
    header: "Avoid",
    options: [
      { label: "None", description: "All files are OK to modify" },
      { label: "Restricted modules", description: "Will list them" },
    ]
  }]
})

**Wait for confirmation.**

### Step 5 — Spawn Subagent: planner

Spawn subagent with:
> "Based on:
> - Task: [summary]
> - AC: [list]
> - Relevant files: [file map]
> - Constraints: [from Gate 1]
> 
> Propose 2-3 implementation options with trade-offs.
> Each option includes: name, description, files to change, estimate, pros/cons."

### Step 6 — Gate 3: Present options (MOST IMPORTANT)

```
## I have [N] implementation options:

### Option A: [Name] — [Distinguishing keyword]
**Mô tả**: [...]
**Files cần thay đổi**:
  - `[file]` — [lý do]
**Estimate**: [X giờ]
**Ưu**: [...]
**Nhược**: [...]
**Risk**: [...]

### Option B: [Name]
[tương tự]

### Option C: [Name] (if applicable)
[tương tự]

---
**My recommendation**: Option [X] because [specific reason].
```

Use the `question` tool to decide:

question({
  questions: [{
    question: "Priority: speed vs maintainability?",
    header: "Priority",
    options: [
      { label: "Speed", description: "Prioritize delivery speed" },
      { label: "Maintainability", description: "Prioritize clean, maintainable code" },
      { label: "Balanced", description: "Balance both" },
    ]
  }, {
    question: "Which option would you like to choose?",
    header: "Pick",
    options: [
      { label: "Option A", description: "[Option A name]" },
      { label: "Option B", description: "[Option B name]" },
      { label: "Option C", description: "[Option C name] (if any)" },
    ]
  }]
})

**Wait for human to select an option.**

### Step 6.5 — Render HTML companion (option comparison)

Before the human selects in Step 6, generate `docs/tasks\[TASK-ID]\analysis-compare.html` from template `templates/html-artifact.html`:

- Inject `<table id="options" data-sortable>` with columns: Option | Effort (h) | Risk | Files Touched | Pros | Cons
- Each option gets 1 row, Effort column uses `data-type="number"` for sorting
- Risk is rendered using `<span class="pill pill-ok|warn|err">` (Low/Med/High)
- Each option has a `<details>` expandable section for long descriptions

The HTML file is a one-shot review artifact — DO NOT commit (`.gitignore` already covers `docs/tasks/**/*.html`).

```
✓ Đã sinh `docs/tasks/[TASK-ID]/analysis-compare.html`
  Mở bằng browser để sort/filter trước khi quyết định.
```

### Step 7 — Create Task Doc

After the human selects, create `docs/tasks/[TASK-ID]/analysis.md`:

```markdown
# Analysis: [TASK-ID]

## Chosen Option: [Name]
**Lý do**: [từ discussion]

## Files sẽ thay đổi
| File | Loại thay đổi | Ghi chú |
|------|--------------|---------|
| | | |

## Options Considered (and why rejected)
- Option A: [reason not chosen]
- Option B: [reason not chosen]

## Câu hỏi mở còn lại
- [ ] [Question nếu có]
```

```
## Phân tích hoàn tất ✓

`docs/tasks/[TASK-ID]/analysis.md` đã được lưu.

**DỪNG TẠI ĐÂY.** Không tự động implement.

Review `analysis.md`, then run `/dev:implement` to start coding.
```

**Wait for human to trigger `/dev:implement`.**  
Do not start implementing on your own, even if the user seems agreeable.

---

## Notes for the orchestrator

- Each subagent receives minimal required context
- Do not pass full conversation history into subagents
- Results from subagents are summarized before being used by the next subagent
- If a subagent returns too many files (>20), request further filtering
