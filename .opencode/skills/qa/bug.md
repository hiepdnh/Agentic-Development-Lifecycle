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

```markdown
# [BUG-XXX] [Tiêu đề ngắn, mô tả lỗi]

**Severity**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low  
**Priority**: P1 / P2 / P3  
**Reporter**: [Name]  
**Ngày báo cáo**: [Date]  
**Trạng thái**: New  
**Assigned to**: [Dev name nếu biết]

---

## Môi trường

| Key | Value |
|-----|-------|
| Môi trường | Dev / Staging / Production |
| Browser / App version | [...] |
| OS | [...] |
| User role | [...] |
| Test data dùng | [...] |

## Mô tả

[1-2 câu mô tả rõ lỗi là gì]

## Steps to Reproduce

1. [Bước 1 — URL/menu/action cụ thể]
2. [Bước 2]
3. [Bước N — trigger lỗi]

## Expected Behavior

[Điều gì PHẢI xảy ra]

## Actual Behavior

[Điều gì THỰC TẾ xảy ra]

## Evidence

- Screenshot: [attach]
- Video: [attach nếu có]
- Log/Error message:
```
[paste error log]
```

## Tần suất

[ ] Xảy ra 100% khi reproduce  
[ ] Intermittent (~[X]% lần)

## Impact

[Bao nhiêu user bị ảnh hưởng? Feature nào bị block?]

## Workaround

[Có workaround không? Nếu có, mô tả]

## Related

- Issue: #[number nếu có]
- ADR / Design: [link nếu liên quan]
```

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
