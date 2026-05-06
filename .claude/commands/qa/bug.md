---
name: qa:bug
description: >
  Tạo bug report chuẩn với severity, steps to reproduce, và evidence đủ để dev fix.
  Trigger khi: user nói "tìm thấy bug", "viết bug report", "báo cáo lỗi",
  "create bug ticket", "có defect", "lỗi cần report", hoặc gõ /qa:bug.
---

# Skill: /qa:bug
**Role**: QA Engineer  
**Mục đích**: Tạo bug report chuẩn, đủ thông tin để dev reproduce và fix.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập thông tin

```
## Tôi sẽ giúp bạn soạn bug report.

Cho tôi biết:
1. Mô tả ngắn gọn lỗi gì xảy ra?
2. Môi trường phát hiện: (Dev/Staging/Prod) + browser/OS/device
3. Steps to reproduce (dù rough cũng được, tôi sẽ format lại)
4. Expected vs Actual behavior
5. Có screenshot/log không?
6. Lỗi này có xảy ra thường xuyên không (100%/intermittent)?
```

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

```
Bug report đã soạn xong.

Trước khi submit:
1. Steps to reproduce — bạn có thể confirm reproduce được với steps này không?
2. Severity [X] — có đúng không? Impact có larger hơn tôi estimate không?
3. Có cần tag thêm người nào không?
```
