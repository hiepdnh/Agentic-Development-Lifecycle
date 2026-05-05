# Skill: /dev-pr
**Role**: Developer  
**Mục đích**: Tạo PR description chuẩn từ code changes, link đến task docs và cập nhật baseline.

---

## Ask First Gates (dừng lại trước khi tạo PR nếu có)

Những thay đổi sau cần senior review trước khi PR được tạo:
- Thay đổi authentication / authorization logic
- Breaking changes trong public API
- Database migration có thể mất data
- Thay đổi shared infrastructure hoặc config

Nếu phát hiện một trong những điều trên → flag rõ trong Gate 2 và chờ confirm.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc context

Spawn subagent để đọc:
- `git diff main..HEAD` — những gì thay đổi
- `docs/tasks/[TASK-ID]/analysis.md` — phương án đã chọn
- `docs/tasks/[TASK-ID]/requirements.md` — AC cần verify

Subagent trả về: summary of changes, files changed, AC coverage.

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

Câu hỏi trước khi tạo PR:
1. AC-003 — đây có được cover không? Nếu có, ở đâu?
2. Có breaking changes nào tôi cần note trong PR không?
3. PR này cần review từ ai? (Tag reviewer)
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
**Manual Testing**: [Đã test scenario nào]

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

Câu hỏi cuối:
1. Có gì cần thêm vào "Notes cho Reviewer" không?
2. Docs nào cần cập nhật sau khi PR được merge?
3. Cần squash commits trước khi merge không?

Sau khi PR được approve và merge, hãy chạy /docs-update để cập nhật baseline docs.
```
