---
name: dev:implement
description: >
  Implement code after the option has been selected from /dev:analyze. File-by-file with a gate after each file.
  Triggers when: user says "start implementing", "code the chosen plan", "write code for task",
  "start implementation", "implement feature", or types /dev:implement.
---

# /dev:implement
**Role**: Developer  
**Purpose**: Implement code after the option has been selected from /dev:analyze. File-by-file with a gate after each file.

---

## Important: Run /dev:analyze first

This skill requires `docs/tasks\[TASK-ID]\analysis.md` to already exist.
If it doesn't exist → run `/dev:analyze` first.

---

## How to Spawn Subagents

Use OpenCode's **task tool** to spawn subagents. Each subagent receives minimal required context — do not pass full conversation history.

---

## Execution Guide

### Step 1 — Read analysis doc

Read `docs/tasks\[TASK-ID]\analysis.md`:
- Selected option
- List of files to change
- Technical decisions confirmed

### Step 1b — Gate: TDD Lane (opt-in)

Before implementing, use the `question` tool:

question({
  questions: [{
    question: "Choose implementation mode?",
    header: "Mode",
    options: [
      { label: "Standard", description: "Implement code first, test later (default)" },
      { label: "TDD", description: "Write tests first, code later (recommended for complex business logic)" },
    ]
  }]
})

**If TDD is selected**:
1. For each business logic file: write tests (failing) first
2. Gate: confirm test cases cover all ACs
3. Implement code to make tests pass
4. Report: "Tests: N passing / M failing" after each file

### Step 2 — Gate: Confirm implementation plan

Use the `question` tool:

question({
  questions: [{
    question: "Start implementation in the planned file order?",
    header: "Start",
    options: [
      { label: "Start now", description: "Implement the first file" },
      { label: "Adjust", description: "Change file order" },
    ]
  }]
})

**Wait for confirmation.**

### Step 3 — Implement each file

For **each file**, in order:

1. Read the current file (if modifying)
2. Implement changes
3. Brief report

**Report template after each file**:

```
## File [N/Total]: `[path]` ✅

**Thay đổi**:
- [Mô tả thay đổi 1]
- [Mô tả thay đổi 2]

**Tests**: [Viết inline / Cần viết riêng / N/A]
```

Use the `question` tool:

question({
  questions: [{
    question: "File [N/Total] `[path]` is done. Continue?",
    header: "Continue",
    options: [
      { label: "Continue", description: "Move to the next file" },
      { label: "Stop", description: "Need to adjust this file" },
    ]
  }]
})

**Wait for confirmation before moving to the next file.**

If the code is not as expected (missing dependency, unexpected state, conflict with existing code) — use the `question` tool to ask, do not decide on your own.

### Step 4 — Gate: Post-implementation checklist

After all files are done:

```
## Implementation hoàn tất — [TASK-ID]

**Files đã thay đổi**: [N files]
**Migration cần chạy**: [yes/no — lệnh nếu yes]
**ENV cần thêm**: [list hoặc "none"]

**Dev self-check** (tự verify trước khi đưa cho user test):
- [ ] Không hardcode values (URL, credentials, magic numbers)
- [ ] Error cases được handle
- [ ] Input validated tại system boundary (API endpoint / form)
- [ ] Không log sensitive data (password, token, PII)
- [ ] DB migration reversible (nếu có)
```

question({
  questions: [{
    question: "Dev self-check completed?",
    header: "Self-check",
    options: [
      { label: "Checked", description: "All items passed" },
      { label: "Need fixes", description: "Some items did not pass" },
    ]
  }]
})

### Step 5 — Verification Gate: Diff Review + Self-Test

After the developer confirms Step 4, spawn a subagent to analyze the diff:

task(
  description: "Analyze git diff for verification",
  prompt: "Đọc `git diff main..HEAD` (hoặc diff của branch hiện tại). Trả về:\n1. **Impact summary**: những gì thay đổi, module nào bị ảnh hưởng, edge cases tiềm ẩn\n2. **Self-test steps**: 3-7 test steps cụ thể dựa trên thay đổi thực tế (không phải template chung). Mỗi step: action rõ ràng, expected result rõ ràng. Ưu tiên: happy path → edge case → error case.\nCHỈ đọc, không sửa gì.",
  subagent_type: "explorer"
)

Present the results:

```
## Verification — [TASK-ID]

### Diff Summary
**Files thay đổi**: [list]
**Impact**: [module nào bị ảnh hưởng, risk gì]
**ACs được cover bởi code**:
- ✅ AC-001: [covered tại file:line]
- ⚠️ AC-002: [cần verify thủ công]

### Self-Test Steps
| # | Action | Expected Result |
|---|--------|----------------|
| T-01 | [Specific test step] | [Expected result] |
| T-02 | [Specific test step] | [Expected result] |
| T-03 | [Edge case] | [Expected result] |
| ... | | |

Run the test steps above and report results:
- Mỗi test: PASS / FAIL / SKIP (+ ghi chú nếu FAIL)
```

**Wait for user to report test results.**

After receiving test results, create `docs/tasks/[TASK-ID]/verification.md` using template `templates/verification.en.md`.

Fill in:
- **Frontmatter**: `taskId`, `verifiedBy` (user name), `signOffStatus` (Pending → update to Pass/Fail after user reports)
- **AC results table**: from subagent output — each AC with test method and result
- **Automated Tests**: paste actual test output (command + pass/fail count + coverage %)
- **Manual Test Steps**: T-01...T-N from Self-Test table above with actual results filled in
- **Issues Found**: FAIL results → describe with severity
- **Sign-off**: tick dev self-review checkbox; date = today JST

```
## Verification hoàn tất ✓

`docs/tasks/[TASK-ID]/verification.md` đã được lưu.

**DỪNG TẠI ĐÂY.**

Next steps (in order):
1. `/sec:review` — security review trước khi tạo PR
2. `/dev:pr` — tạo PR (sẽ tự đọc verification.md)
```

**Do not automatically run sec:review or dev:pr.**

### Harness Delta Check

Before finishing, ask yourself:
- Is there any gate that is unclear → requiring guessing the behavior?
- Is there any template missing an important field?
- Is there any issue recurring from a previous task?

If yes → add an entry to `docs/improvement-backlog.md` immediately (no need to ask human):
```
| IB-XXX | dev:implement / [TASK-ID] | [mô tả friction] | [proposed fix] | open |
```

---

## Rules

- Implement one file at a time — do not jump ahead
- Do not refactor code outside the task scope
- Do not add features beyond the defined ACs
- Migration could lose data → **always ask for confirmation** before creating
- If any sensitive change is detected → stop, see `assets/ask-first-gates.md`
- If an unrelated bug is found → make a note, create a separate issue, do not fix immediately
