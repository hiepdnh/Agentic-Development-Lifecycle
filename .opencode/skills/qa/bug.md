---
name: qa:bug
description: >
  Tạo bug report chuẩn với severity, steps to reproduce, và evidence đủ để dev fix.
  Trigger khi: user nói "tìm thấy bug", "viết bug report", "báo cáo lỗi",
  "create bug ticket", "có defect", "lỗi cần report", hoặc gõ /qa:bug.
---

# /qa:bug
**Role**: QA Engineer  
**Mục đích**: Tạo bug report chuẩn, đủ thông tin để dev reproduce và fix.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập thông tin

question({
  questions: [{
    question: "Cung cấp thông tin về lỗi:",
    header: "Bug Info",
    options: [
      { label: "Có screenshot", description: "Tôi sẽ đính kèm screenshot/log" },
      { label: "Không có evidence", description: "Chỉ mô tả text, không có screenshot" },
    ]
  }]
})

### Bước 2 — Phân loại severity

Đánh giá dựa trên impact:

- **Critical**: Crash, data loss, security breach, payment failure
- **High**: Core feature broken, no workaround
- **Medium**: Feature degraded, workaround exists
- **Low**: UI issue, minor inconvenience

Hỏi nếu chưa rõ: *"Lỗi này có workaround không? User có thể tiếp tục công việc không?"*

### Bước 3 — Tạo Bug Report

Tạo bug report sử dụng template `templates/bug-report.md`. Điền vào:
- **Tiêu đề** ngắn gọn mô tả lỗi
- **Severity** (Critical/High/Medium/Low) + **Priority** (P1/P2/P3)
- **Reporter** + **Ngày báo cáo** + **Assigned to**
- **Môi trường**: Môi trường, Browser/App version, OS, User role, Test data
- **Mô tả**: 1-2 câu rõ ràng về lỗi
- **Steps to Reproduce**: từng bước cụ thể (URL/menu/action)
- **Expected Behavior** vs **Actual Behavior**
- **Evidence**: screenshot, video, error log
- **Tần suất**: 100% hay intermittent
- **Impact**: user bị ảnh hưởng, feature bị block
- **Workaround** nếu có
- **Related**: issue number, ADR/Design link

### Bước 4 — Gate cuối

question({
  questions: [{
    question: "Bug report đã soạn xong. Xác nhận trước khi submit?",
    header: "Final Review",
    options: [
      { label: "OK", description: "Steps reproduce được, severity đúng" },
      { label: "Sửa steps", description: "Steps to reproduce cần chỉnh sửa" },
      { label: "Sửa severity", description: "Severity chưa đúng, cần điều chỉnh" },
    ]
  }]
})
