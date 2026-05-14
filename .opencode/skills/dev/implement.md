---
name: dev:implement
description: >
  Implement code sau khi phương án đã chọn từ /dev:analyze. File-by-file với gate sau mỗi file.
  Trigger khi: user nói "bắt đầu implement", "code theo plan đã chọn", "viết code cho task",
  "start implementation", "implement feature", hoặc gõ /dev:implement.
---

# /dev:implement
**Role**: Developer  
**Mục đích**: Implement code sau khi phương án đã chọn từ /dev:analyze. File-by-file với gate sau mỗi file.

---

## Quan trọng: Chạy /dev:analyze trước

Skill này yêu cầu `E:\AI Bootcamp\ClaudeSkill\docs\tasks\[TASK-ID]\analysis.md` đã tồn tại.
Nếu chưa có → chạy `/dev:analyze` trước.

---

## Cách spawn subagent

Dùng **task tool** của OpenCode để spawn subagent. Mỗi subagent nhận context tối thiểu cần thiết — không pass full conversation history.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc analysis doc

Đọc `E:\AI Bootcamp\ClaudeSkill\docs\tasks\[TASK-ID]\analysis.md`:
- Phương án đã chọn
- Danh sách files cần thay đổi
- Quyết định kỹ thuật đã confirm

### Bước 1b — Gate: TDD Lane (opt-in)

Trước khi implement, dùng `question` tool:

question({
  questions: [{
    question: "Chọn mode implement?",
    header: "Mode",
    options: [
      { label: "Standard", description: "Implement code trước, test sau (mặc định)" },
      { label: "TDD", description: "Viết test trước, code sau (recommend cho business logic phức tạp)" },
    ]
  }]
})

**Nếu chọn TDD**:
1. Với mỗi file business logic: viết test (failing) trước
2. Gate: confirm test cases cover đủ ACs
3. Implement code cho test pass
4. Báo cáo: "Tests: N passing / M failing" sau mỗi file

### Bước 2 — Gate: Xác nhận implementation plan

Dùng `question` tool:

question({
  questions: [{
    question: "Bắt đầu implement theo thứ tự files đã định?",
    header: "Bắt đầu",
    options: [
      { label: "Bắt đầu ngay", description: "Implement file đầu tiên" },
      { label: "Điều chỉnh", description: "Thay đổi thứ tự files" },
    ]
  }]
})

**Chờ confirm.**

### Bước 3 — Implement từng file

Với **mỗi file**, theo thứ tự:

1. Đọc file hiện tại (nếu modify)
2. Implement thay đổi
3. Report ngắn

**Template báo cáo sau mỗi file**:

```
## File [N/Total]: `[path]` ✅

**Thay đổi**:
- [Mô tả thay đổi 1]
- [Mô tả thay đổi 2]

**Tests**: [Viết inline / Cần viết riêng / N/A]
```

Dùng `question` tool:

question({
  questions: [{
    question: "File [N/Total] `[path]` đã xong. Tiếp tục?",
    header: "Tiếp tục",
    options: [
      { label: "Tiếp tục", description: "Sang file tiếp theo" },
      { label: "Dừng lại", description: "Cần điều chỉnh file này" },
    ]
  }]
})

**Chờ confirm trước khi sang file tiếp theo.**

Nếu gặp code không như expected (missing dependency, unexpected state, conflict với existing code) — dùng `question` tool để hỏi, không tự quyết định.

### Bước 4 — Gate: Post-implementation checklist

Sau khi tất cả files xong:

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
    question: "Dev self-check đã hoàn tất?",
    header: "Self-check",
    options: [
      { label: "Đã check xong", description: "Tất cả items pass" },
      { label: "Cần sửa", description: "Có item chưa pass" },
    ]
  }]
})

### Bước 5 — Verification Gate: Diff Review + Self-Test

Sau khi dev confirm Bước 4, spawn subagent để phân tích diff:

task(
  description: "Analyze git diff for verification",
  prompt: "Đọc `git diff main..HEAD` (hoặc diff của branch hiện tại). Trả về:\n1. **Impact summary**: những gì thay đổi, module nào bị ảnh hưởng, edge cases tiềm ẩn\n2. **Self-test steps**: 3-7 test steps cụ thể dựa trên thay đổi thực tế (không phải template chung). Mỗi step: action rõ ràng, expected result rõ ràng. Ưu tiên: happy path → edge case → error case.\nCHỈ đọc, không sửa gì.",
  subagent_type: "explorer"
)

Trình bày kết quả:

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
| T-01 | [Bước test cụ thể] | [Kết quả mong đợi] |
| T-02 | [Bước test cụ thể] | [Kết quả mong đợi] |
| T-03 | [Edge case] | [Kết quả mong đợi] |
| ... | | |

Hãy thực hiện các bước test trên và báo cáo kết quả:
- Mỗi test: PASS / FAIL / SKIP (+ ghi chú nếu FAIL)
```

**Chờ user báo cáo kết quả test.**

Sau khi nhận kết quả, tạo `docs/tasks/[TASK-ID]/verification.md`:

```markdown
# Verification: [TASK-ID]

## Diff Summary
[từ subagent output]

## AC Coverage
- ✅/❌ AC-001: [...]
- ✅/❌ AC-002: [...]

## Self-Test Results
| # | Action | Expected | Result | Notes |
|---|--------|---------|--------|-------|
| T-01 | [...] | [...] | PASS/FAIL | [...] |

## Sign-off
- Tester: [user]
- Date: [date]
- Status: PASS / FAIL / CONDITIONAL
```

```
## Verification hoàn tất ✓

`docs/tasks/[TASK-ID]/verification.md` đã được lưu.

**DỪNG TẠI ĐÂY.**

Bước tiếp theo (theo thứ tự):
1. `/sec:review` — security review trước khi tạo PR
2. `/dev:pr` — tạo PR (sẽ tự đọc verification.md)
```

**Không tự động chạy sec:review hay dev:pr.**

### Harness Delta Check

Trước khi kết thúc, tự hỏi:
- Có gate nào không rõ → phải đoán hành vi?
- Có template thiếu field quan trọng?
- Có vấn đề nào lặp lại từ task trước?

Nếu có → thêm entry vào `E:\AI Bootcamp\ClaudeSkill\docs\improvement-backlog.md` ngay (không cần confirm human):
```
| IB-XXX | dev:implement / [TASK-ID] | [mô tả friction] | [proposed fix] | open |
```

---

## Quy tắc

- Implement từng file một — không jump ahead
- Không refactor code ngoài scope task
- Không thêm feature ngoài AC đã định nghĩa
- Migration có thể mất data → **luôn hỏi confirm** trước khi tạo
- Nếu phát hiện bất kỳ thay đổi nhạy cảm nào → dừng, xem `E:\AI Bootcamp\ClaudeSkill\assets\ask-first-gates.md`
- Nếu phát hiện bug không liên quan → note lại, tạo issue riêng, không fix ngay
