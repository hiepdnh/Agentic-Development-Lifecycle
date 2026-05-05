# Skill: /docs-update
**Role**: Developer / QA (sau verify)  
**Mục đích**: Cập nhật Baseline Docs (screen + API) sau khi task đã verify và merge. Đây là bước CUỐI CÙNG của mọi task.

---

## Quan trọng

Baseline Docs là **nguồn sự thật** cho team. Cập nhật sai = technical debt.  
Skill này luôn đề xuất thay đổi để human review, không tự động ghi đè.

---

## Hướng dẫn thực hiện

### Bước 1 — Spawn subagent: diff-reader

Spawn subagent để đọc:
- `git diff [base-branch]..HEAD -- docs/` — docs đã thay đổi chưa?
- `git diff [base-branch]..HEAD -- [src/]` — code thay đổi gì?
- `docs/tasks/[TASK-ID]/requirements.md` — spec gốc

Subagent trả về: danh sách thay đổi cần reflect vào docs.

### Bước 2 — Gate: Xác nhận scope update

```
## Task [TASK-ID] đã verify và merge.

Tôi phân tích code changes và thấy cần update docs:

**Screen docs cần update**:
- `docs/screens/[feature]/screen.md` — [lý do: field mới / flow thay đổi / ...]

**API docs cần update**:
- `docs/api/[domain]/[endpoint].md` — [lý do: response format thay đổi / new endpoint / ...]

**Không cần update**:
- [Những file docs không bị ảnh hưởng]

Có docs nào khác tôi bỏ sót không?
```

### Bước 3 — Đề xuất nội dung update cụ thể

Với mỗi file cần update, hiển thị diff rõ ràng:

```
## Đề xuất update: docs/screens/[feature]/screen.md

### Thêm mới:
[Nội dung mới]

### Thay đổi:
~~[Nội dung cũ]~~ → [Nội dung mới]

### Xóa:
~~[Nội dung cần xóa vì không còn đúng]~~
```

### Bước 4 — Gate: Review từng file

```
Với mỗi file update đề xuất:

1. Nội dung mới có chính xác không?
2. Có thông tin nào khác cần update mà tôi bỏ sót?
3. Ngôn ngữ mô tả có đủ rõ để người đọc sau hiểu không?

Confirm để tôi apply thay đổi.
```

### Bước 5 — Sau khi apply

Cập nhật `docs/tasks/[TASK-ID]/verification.md`:

```markdown
# Verification: [TASK-ID]

**Verified by**: [Name]  
**Date**: [Date]  
**Status**: ✅ Done

## AC Verification
- [x] AC-001: [Verified bởi test/manual]
- [x] AC-002: [...]

## Docs Updated
- [x] `docs/screens/[feature]/screen.md` — [summary of change]
- [x] `docs/api/[domain]/[endpoint].md` — [summary of change]

## Notes
[Bất kỳ observation nào quan trọng cho người duy trì sau]
```

```
Task [TASK-ID] đã hoàn tất đầy đủ:
✅ Code merged
✅ Baseline docs cập nhật
✅ Verification doc lưu

Task doc đầy đủ tại: docs/tasks/[TASK-ID]/
```

---

## Nguyên tắc cập nhật docs

- Docs mô tả **hành vi hiện tại**, không phải lịch sử
- Xóa thông tin cũ, không comment out
- Nếu behavior thay đổi lớn → xem xét tạo ADR (`/arch-adr`)
- Conflict giữa code và docs → code là nguồn sự thật, update docs theo code
