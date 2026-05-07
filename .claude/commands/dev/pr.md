---
name: dev:pr
description: >
  Tạo PR description chuẩn từ code changes, verify AC coverage, link task docs.
  Trigger khi: user nói "tạo PR", "viết PR description", "chuẩn bị pull request",
  "create PR", "soạn mô tả PR", hoặc gõ /dev:pr.
---

# Skill: /dev:pr
**Role**: Developer  
**Mục đích**: Tạo PR description chuẩn từ code changes, link đến task docs và cập nhật baseline.

---

## Ask First Gates (dừng lại trước khi tạo PR nếu có)

> Danh sách đầy đủ + lý do: `assets/ask-first-gates.md`

Nếu PR chứa bất kỳ thay đổi nhạy cảm nào trong danh sách trên → flag rõ trong Gate 2 và chờ confirm senior.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc context

Spawn subagent để đọc:
- `git diff main..HEAD` — những gì thay đổi
- `docs/tasks/[TASK-ID]/analysis.md` — phương án đã chọn
- `docs/tasks/[TASK-ID]/requirements.md` — AC cần verify
- `docs/tasks/[TASK-ID]/verification.md` — kết quả self-test (nếu tồn tại)

Subagent trả về: summary of changes, files changed, AC coverage, test results (nếu có).

### Bước 2 — Gate: Xác nhận coverage

```
## Tôi đọc code changes và thấy:

**Files thay đổi**: [N files]
**AC coverage**:
- ✅ AC-001: [Covered bởi file X]
- ✅ AC-002: [Covered bởi file Y]
- ⚠️ AC-003: [Chưa rõ có cover không — cần clarify]

**Tests**:
- Unit tests: [Có/Không/Partial]
- Integration tests: [Có/Không]

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | AC-003 — đây có được cover không? | A: Có — ở file: ___ / B: Chưa cover / C: Không áp dụng / D: Khác: ___ |
| 2 | Có breaking changes nào cần note trong PR? | A: Không / B: Có — mô tả: ___ / C: Khác: ___ |
| 3 | PR này cần review từ ai? | _(điền username)_ |
```

### Bước 3 — Tạo PR Description

```markdown
## [TASK-ID] [Tên feature/fix ngắn gọn]

### 📋 Summary
[2-3 câu mô tả WHAT và WHY của PR này]

### 🔗 Liên kết
- Issue: #[number]
- Spec: `docs/tasks/[TASK-ID]/requirements.md`
- Analysis: `docs/tasks/[TASK-ID]/analysis.md`

### ✅ Acceptance Criteria
- [x] AC-001: [Mô tả] — verified bởi [test/manual]
- [x] AC-002: [Mô tả] — verified bởi [test/manual]

### 🔧 Changes
| File | Loại thay đổi | Mô tả |
|------|--------------|-------|
| `[file]` | Added/Modified/Deleted | [...] |

### 🧪 Testing
**Unit Tests**: [Pass/Fail/N/A]  
**Integration Tests**: [Pass/Fail/N/A]  
**Self-Test Results**: [Lấy từ `docs/tasks/[TASK-ID]/verification.md` — tóm tắt T-01…T-N]  
**Overall**: PASS / FAIL / CONDITIONAL

### ⚠️ Breaking Changes
[None / Mô tả nếu có]

### 📝 Notes cho Reviewer
[Những điểm cần chú ý khi review, quyết định design quan trọng]

### 📚 Docs cần cập nhật sau merge
- [ ] `docs/screens/[feature]/screen.md`
- [ ] `docs/api/[domain]/[endpoint].md`
```

### Bước 4 — Gate cuối

```
PR description đã soạn xong.

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Có gì cần thêm vào "Notes cho Reviewer"? | A: Không cần / B: Thêm: ___ / C: Khác: ___ |
| 2 | Docs nào cần cập nhật sau merge? | A: Không có / B: Screen docs — path: ___ / C: API docs — path: ___ / D: Khác: ___ |
| 3 | Cần squash commits trước khi merge không? | A: Có / B: Không cần / C: Khác: ___ |

Sau khi PR được approve và merge, hãy chạy /docs:update để cập nhật baseline docs.
```
