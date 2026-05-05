# Skill: /pm:status
**Role**: Project Manager  
**Mục đích**: Tổng hợp trạng thái sprint/project từ nhiều nguồn, tạo báo cáo nhanh cho stakeholder.

---

## Hướng dẫn thực hiện

### Bước 1 — Thu thập thông tin

Yêu cầu người dùng cung cấp (hoặc đọc từ context có sẵn):
- Danh sách issues/tasks trong sprint và trạng thái
- Blockers đã biết
- Thời gian còn lại trong sprint

### Bước 2 — Gate: Xác nhận phạm vi báo cáo

```
## Tôi sẽ tạo status report cho Sprint [N].

Trước khi tổng hợp, cho tôi biết:
1. Báo cáo này dành cho ai? (Team internal / Stakeholder / Management)
2. Format mong muốn? (Markdown, text thuần, slide outline)
3. Có metric cụ thể nào cần highlight không? (velocity, burn rate...)
```

### Bước 3 — Tạo Status Report

```markdown
# Sprint [N] Status Report
**Ngày**: [Date]  
**PM**: [Name]

## 🟢 Tổng quan
[1-2 câu tóm tắt trạng thái tổng thể]

## ✅ Hoàn thành (Done)
| Task | Assignee | Story Points |
|------|----------|-------------|
| | | |

## 🔄 Đang làm (In Progress)
| Task | Assignee | % Done | Dự kiến xong |
|------|----------|--------|-------------|
| | | | |

## ⛔ Blocked
| Task | Blocker | Người cần action | Deadline |
|------|---------|-----------------|----------|
| | | | |

## 📋 Chưa bắt đầu (To Do)
| Task | Priority | Sprint Risk |
|------|----------|------------|
| | | |

## 📊 Sprint Health
- **Velocity**: [X] points done / [Y] points planned
- **Burn rate**: On track / At risk / Behind
- **Scope change**: [Mô tả nếu có]

## 🚨 Risks & Actions
| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| | | | |

## 📅 Lịch quan trọng
- [Event/Deadline sắp tới]
```

### Bước 4 — Gate cuối

```
Báo cáo đã soạn xong.

Câu hỏi trước khi gửi:
1. Có issue nào tôi hiểu sai trạng thái không?
2. Có risk nào bạn biết mà tôi chưa đề cập?
3. Tone của báo cáo có phù hợp với audience chưa?
```
