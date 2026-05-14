---
name: dev:debug
description: >
  Systematic debugging — find the root cause before fixing. Reproduce → Localize → Reduce → Fix → Guard.
  Triggers when: user says "debug lỗi", "tìm nguyên nhân bug", "tại sao bị lỗi",
  "fix bug", "investigate error", "lỗi không biết tại sao", or types /dev:debug.
---

# /dev:debug
**Role**: Developer  
**Purpose**: Systematic debugging — find the root cause before fixing. Avoid "random fixing until the bug goes away."

---

## Core Principles

**Never** touch code before having a minimal reproduction.  
Fixing the wrong root cause = creating more bugs.

## 5-Step Process

### Step 1 — Reproduce

Use the `question` tool to gather information:

question({
  questions: [{
    question: "Describe the bug: what happened vs what was expected?",
    header: "Describe",
    options: [
      { label: "Will describe", description: "Provide description + steps" },
    ]
  }, {
    question: "Is this bug new or has it always existed?",
    header: "Timing",
    options: [
      { label: "New", description: "After a recent change" },
      { label: "Always existed", description: "Bug has existed for a long time" },
      { label: "Not sure", description: "Cannot determine yet" },
    ]
  }, {
    question: "Is there an error message / stack trace?",
    header: "Error info",
    options: [
      { label: "Yes", description: "Will paste stack trace" },
      { label: "No", description: "No error message available" },
    ]
  }]
})

**Ask First Gate**: If the bug occurs on production with real users → notify the team immediately before debugging. See `E:\AI Bootcamp\ClaudeSkill\assets\ask-first-gates.md`.

### Step 2 — Localize

Spawn a subagent to read related code (read-only):

task(
  description: "Find code related to reported bug",
  prompt: "Tìm code xử lý [behavior mô tả]. Trả về file:line và flow từ entry point đến điểm có thể fail. Không sửa gì.",
  subagent_type: "explorer"
)

Present results:

```
## Tôi xác định vùng code có thể là nguồn lỗi:

1. [file:line] — [lý do suspect]
2. [file:line] — [lý do suspect]

Hypothesis:
- H1: [Giả thuyết 1 về nguyên nhân]
- H2: [Giả thuyết 2]

Tôi sẽ kiểm tra H1 trước vì [lý do].
```

Use the `question` tool:

question({
  questions: [{
    question: "Do you have any additional hypotheses based on your context?",
    header: "Hypothesis",
    options: [
      { label: "No", description: "Proceed with current hypotheses" },
      { label: "Yes", description: "Will add hypotheses" },
    ]
  }]
})

### Step 3 — Reduce

Create a minimal reproduction — the smallest code that can trigger the bug.

```
## Minimal reproduction:

[Code snippet hoặc steps tối thiểu]

Lỗi có reproduce với code này không?
(Nếu không → vấn đề nằm ở interaction với phần khác, không phải đây)
```

**Do not proceed without a minimal reproduction.**

### Step 4 — Fix

Only after confirming the root cause, use the `question` tool:

question({
  questions: [{
    question: "Root cause identified. Choose fix approach?",
    header: "Fix",
    options: [
      { label: "Targeted fix", description: "Fix exactly at the source, minimal side effects" },
      { label: "Broader fix", description: "Fix the whole pattern, more files involved" },
    ]
  }]
})

**Ask First Gate**: If the fix involves any sensitive changes (`E:\AI Bootcamp\ClaudeSkill\assets\ask-first-gates.md`) → requires senior review before applying.

### Step 5 — Guard

After applying the fix, use the `question` tool:

question({
  questions: [{
    question: "Fix applied. Are additional tests needed to prevent regression?",
    header: "Guard",
    options: [
      { label: "Not needed", description: "Fix is sufficient" },
      { label: "Add tests", description: "Add regression tests" },
    ]
  }])
}

---

## Red Flags (stop if observed)

- Trying to fix multiple things at once without understanding why
- Bug "disappeared" but don't know why
- Fixed but can no longer reproduce the original failing case
- Stack trace points to library code — usually incorrect usage, not a bug in the library
