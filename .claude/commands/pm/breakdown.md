---
name: pm:breakdown
description: >
  Phân rã Epic/User Stories thành Tasks cụ thể với estimate, tạo GitHub Issues chuẩn.
  Trigger khi: user nói "breakdown epic", "tạo tasks từ story", "phân rã feature",
  "tạo github issues", "sprint planning", "estimate tasks", hoặc gõ /pm:breakdown.
---

# Skill: /pm:breakdown
**Role**: Project Manager  
**Mục đích**: Phân rã Epic/User Stories thành Tasks cụ thể, tạo GitHub Issues với template chuẩn.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc input

Nhận vào: Epic description, User Stories, hoặc yêu cầu trực tiếp từ PM.  
Đọc `docs/tasks/[TASK-ID]/requirements.md` nếu có.

### Bước 2 — Gate: Clarify trước khi breakdown

```
## Tôi sẽ breakdown [Epic/Feature name] thành tasks.

Tôi hiểu phạm vi gồm: [tóm tắt]

Trước khi tôi đề xuất task list, tôi cần hỏi:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Sprint này có bao nhiêu dev? Capacity? | _(điền số dev và giờ/điểm)_ |
| 2 | Có task nào đã được assign trước chưa? | A: Không / B: Có — task: ___ / C: Khác: ___ |
| 3 | Milestone/deadline quan trọng cần biết? | _(điền ngày nếu có)_ |
| 4 | Tech stack chính: [liệt kê] — có đúng không? | A: Đúng / B: Sai — sửa lại: ___ / C: Khác: ___ |
```

**Chờ confirm.**

### Bước 3 — Đề xuất task breakdown (2-3 phương án)

```
## Tôi có [N] phương án breakdown:

### Phương án A: [Tên] — [Ưu điểm chính]
[Task list với estimate]
- Ưu: [...]
- Nhược: [...]

### Phương án B: [Tên] — [Ưu điểm chính]  
[Task list với estimate]
- Ưu: [...]
- Nhược: [...]

**Đề xuất của tôi**: Phương án [X] vì [lý do].  
Bạn muốn chọn phương án nào, hoặc kết hợp?
```

### Bước 4 — Tạo GitHub Issue format

Sau khi PM confirm, tạo nội dung issue theo template:

```markdown
## [TASK-ID] [Tên Task]

**Type**: Feature / Bug / Tech Debt / Refactor  
**Priority**: 🔴 High / 🟡 Medium / 🟢 Low  
**Estimate**: [X] story points / [X] giờ  
**Sprint**: Sprint [N]  
**Assigned to**: [Username]  
**Labels**: [backend, frontend, api, ...]

---

### Mô tả
[Mô tả ngắn gọn task cần làm]

### Liên kết
- User Story: US-[XXX]
- Spec: `docs/tasks/[TASK-ID]/requirements.md`
- Màn hình liên quan: `docs/screens/[feature]/screen.md`
- API liên quan: `docs/api/[domain]/[endpoint].md`

### Acceptance Criteria
- [ ] AC-001: [Điều kiện nghiệm thu]
- [ ] AC-002: [Điều kiện nghiệm thu]

### Technical Notes
[Những ghi chú kỹ thuật quan trọng cho dev]

### Definition of Done
- [ ] Code complete + unit tests pass
- [ ] Code review approved
- [ ] Integration tests pass
- [ ] Docs updated (nếu thay đổi API/screen)
- [ ] Demo cho BA/PM
```

### Bước 5 — Gate cuối

```
## Đã chuẩn bị [N] issues sẵn sàng tạo trên GitHub:

[Liệt kê danh sách]

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Issue nào cần adjust priority? | A: Không cần / B: Có — issue + priority mới: ___ / C: Khác: ___ |
| 2 | Estimate có ổn với capacity sprint không? | A: Ổn / B: Quá nhiều — cắt: ___ / C: Còn capacity — thêm: ___ / D: Khác: ___ |
| 3 | Dependencies giữa các task có đúng không? | A: Đúng / B: Sai — sửa: ___ / C: Khác: ___ |

Confirm để tôi tạo issues, hoặc cho tôi biết cần sửa gì.
```

---

## Lưu ý

- Mỗi issue phải self-contained: dev đọc xong hiểu ngay mà không cần hỏi thêm.
- Link đến docs luôn dùng relative path trong repo.
- Task ID format: `[PROJECT-XXX]` — customize theo convention của team.
