---
name: dev:pr
description: >
  Tạo PR description chuẩn từ code changes, verify AC coverage, link task docs.
  Trigger when: user says "create PR", "write PR description", "open pull request",
  "tạo PR", "viết PR description", or types /dev:pr.
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

### Bước 0 — Gate: Kiểm tra review

Kiểm tra `docs/tasks/[TASK-ID]/verification.md` có tồn tại và có dòng `review: approved` (hoặc tương đương) không.

Nếu không tìm thấy dấu hiệu `/dev:review` đã chạy → dùng `AskUserQuestion`:
- **Câu hỏi**: `/dev:review` đã chạy và Approve chưa?
- Options: `Đã approve — tiếp tục` / `Chưa chạy — chạy /dev:review trước`

Nếu user chọn chưa → dừng, hướng dẫn chạy `/dev:review` trước.

**Chờ confirm.**

---

### Bước 1 — Đọc context

Xác định base branch theo thứ tự: user cung cấp trong lệnh → `git remote show origin` → hỏi user.

Spawn subagent để đọc:
- `git diff <BASE_BRANCH>..HEAD` — những gì thay đổi
- `docs/tasks/[TASK-ID]/analysis.md` — phương án đã chọn
- `docs/tasks/[TASK-ID]/requirements.md` — AC cần verify
- `docs/tasks/[TASK-ID]/verification.md` — kết quả self-test (nếu tồn tại)

```
Agent(
  description: "Read git diff and map changes to AC coverage",
  prompt: "Read the git diff and spec, return AC coverage per agents/diff-reader.md spec.\n\nGIT DIFF:\n[git diff <BASE_BRANCH>..HEAD]\n\nBASE_BRANCH: <tên branch đã xác định>\n\nSPEC PATH: docs/tasks/[TASK-ID]/requirements.md\n\nBASELINE DOCS TO CHECK: [list relevant docs/screens/ and docs/api/ files]",
  model: "haiku"
)
```

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
|---|---------|-------|
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

### Bước 3b — PR Comment Resolver (opt-in)

Nếu PR đã có review comments từ reviewer (re-review cycle), hỏi:

```
## Có review comments cần resolve không?

| | Lựa chọn |
|---|---------|
| A | Có — spawn pr-resolver agent để phân tích và đề xuất fix |
| B | Không — bỏ qua bước này |
```

**Nếu chọn A**, spawn subagent:

```
Agent(
  description: "pr-resolver: analyze review comments and propose fixes",
  prompt: "[theo agents/pr-resolver.md input contract]\n\nPR NUMBER: [N]\nCOMMENTS: [paste từ GitHub/GitLab]\nDIFF CONTEXT: [git diff main..HEAD tóm tắt]",
  model: "sonnet"
)
```

Trình bày kết quả từ pr-resolver — blocking comments trước, sorted by priority.

**Chờ confirm từng blocking item trước khi implement fix.**

### Bước 4 — Gate cuối

```
PR description đã soạn xong.

| # | Câu hỏi | Lựa chọn |
|---|---------|-------|
| 1 | Có gì cần thêm vào "Notes cho Reviewer"? | A: Không cần / B: Thêm: ___ / C: Khác: ___ |
| 2 | Docs nào cần cập nhật sau merge? | A: Không có / B: Screen docs — path: ___ / C: API docs — path: ___ / D: Khác: ___ |
| 3 | Cần squash commits trước khi merge không? | A: Có / B: Không cần / C: Khác: ___ |

Sau khi PR được approve và merge, hãy chạy /docs:update để cập nhật baseline docs.
```
