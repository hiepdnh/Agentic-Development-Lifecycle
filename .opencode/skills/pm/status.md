---
name: pm:status
description: >
  Tổng hợp trạng thái sprint từ nhiều nguồn, tạo status report nhanh cho stakeholder.
  Trigger khi: user nói "báo cáo sprint", "status report", "tổng hợp tiến độ",
  "sprint health", "update cho PM", "report cho khách", hoặc gõ /pm:status.
---

# /pm:status
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
```

```
question({
  questions: [{
    question: "Báo cáo này dành cho ai?",
    header: "Audience",
    options: [
      { label: "Team internal", description: "Báo cáo nội bộ team" },
      { label: "Stakeholder", description: "Báo cáo cho stakeholder" },
      { label: "Management", description: "Báo cáo cho management" },
      { label: "Khách hàng JP", description: "Báo cáo cho khách hàng Nhật" },
    ]
  }, {
    question: "Format mong muốn?",
    header: "Format",
    options: [
      { label: "HTML dashboard", description: "Recommend cho stakeholder/khách JP" },
      { label: "Markdown", description: "Post Slack/Notion" },
      { label: "Text thuần", description: "Tóm tắt nhanh" },
    ]
  }, {
    question: "Có metric cụ thể nào cần highlight không?",
    header: "Metrics",
    options: [
      { label: "Velocity", description: "Highlight vận tốc sprint" },
      { label: "Burn rate", description: "Highlight burn rate" },
      { label: "Blockers", description: "Highlight blockers" },
      { label: "Không cần", description: "Không cần metric đặc biệt" },
    ]
  }]
})
```

### Bước 3 — Tạo Status Report

**Format quyết định ở Gate 2**:
- **HTML dashboard** (default cho stakeholder / khách JP): sinh `E:\AI Bootcamp\ClaudeSkill\docs\reports\sprint-[N]-status.html` từ template `E:\AI Bootcamp\ClaudeSkill\templates\html-artifact.html`
- **Markdown**: sinh inline trong chat hoặc save `E:\AI Bootcamp\ClaudeSkill\docs\reports\sprint-[N]-status.md` — dùng template Markdown phía dưới
- **Text**: tóm tắt 1 màn hình trong chat

#### HTML format

Inject vào template:
- Header: Sprint [N] · Velocity badge (X/Y points) · Burn rate pill (ok/warn/err)
- Section "Kanban view": 4 cột Done / In Progress / Blocked / To Do dùng CSS grid, mỗi card là một task
- `<table data-sortable>` cho Risks & Actions với cột Impact dùng pill
- Filter `<input type="search" data-filter="...">` cho task list
- `@media print` đảm bảo in A4 đẹp khi forward email cho khách JP

File HTML KHÔNG commit (nếu nằm trong `docs/tasks/`). Lưu vào `docs/reports/` thì commit được — quyết định theo nhu cầu lưu trữ của project.

#### Markdown format (fallback)

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
question({
  questions: [{
    question: "Có issue nào tôi hiểu sai trạng thái không?",
    header: "Accuracy",
    options: [
      { label: "Không", description: "Trạng thái chính xác" },
      { label: "Có", description: "Một số issue sai trạng thái — cần chỉnh" },
    ]
  }, {
    question: "Có risk nào bạn biết mà tôi chưa đề cập?",
    header: "Risks",
    options: [
      { label: "Không", description: "Không có risk thêm" },
      { label: "Có", description: "Có risk cần thêm vào báo cáo" },
    ]
  }, {
    question: "Tone báo cáo có phù hợp với audience chưa?",
    header: "Tone",
    options: [
      { label: "Phù hợp", description: "Tone đã phù hợp" },
      { label: "Cần formal hơn", description: "Cần chỉnh tone formal hơn" },
      { label: "Cần casual hơn", description: "Cần chỉnh tone casual hơn" },
    ]
  }]
})
```
