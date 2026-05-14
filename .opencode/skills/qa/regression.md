---
name: qa:regression
description: >
  Tạo regression test checklist trước release, phân tích blast radius, xác định go/no-go.
  Trigger khi: user nói "regression test", "test trước release", "verify không có regression",
  "sprint sign-off", "QA trước deploy production", hoặc gõ /qa:regression.
---

# /qa:regression
**Role**: QA Engineer  
**Mục đích**: Tạo regression test checklist trước release. Verify tính năng cũ không bị ảnh hưởng bởi changes mới.

---

## Khi nào dùng

- Trước mỗi release / sprint end
- Sau merge PR có changes ảnh hưởng shared code (auth, middleware, DB migration)
- Khi PM yêu cầu sign-off trước khi deploy production

---

## Hướng dẫn thực hiện

### Bước 1 — Thu thập scope changes

Spawn subagent để đọc:
- `git log [base]..HEAD --name-only` — files đã thay đổi
- `docs/tasks/[TASK-IDs]/requirements.md` — tất cả tasks trong release

Subagent trả về: file list + blast radius analysis.

### Bước 2 — Gate: Xác nhận regression scope

question({
  questions: [{
    question: "Xác nhận regression scope cho release?",
    header: "Scope",
    options: [
      { label: "Confirm", description: "Tạo checklist theo scope đã phân tích" },
      { label: "Điều chỉnh", description: "Sửa scope — thêm/bớt areas cần test" },
    ]
  }]
})

### Bước 3 — Tạo Regression Checklist (HTML là format chính)

Regression checklist là **one-shot decision artifact** (chạy → tick → go/no-go) — format chính là HTML, không cần Markdown commit. Sinh `docs/tasks/regression-[sprint-or-version].html` từ template `E:\AI Bootcamp\ClaudeSkill\templates\html-artifact.html`:

- 3 sections collapse `<details>` cho 🔴 Must Test / 🟡 Should Test / 🟢 Smoke
- Mỗi section là `<table data-sortable>` với cột: ID | Test Case | Steps | Expected | Result | Bug?
- Cột Result có `<select>` (Pass/Fail/Blocked) cập nhật vào `data-state`, đổi background row theo state
- Header có Go/No-Go badge tự động: chuyển đỏ nếu bất kỳ Must Test = Fail
- Toolbar có button "Export results" — copy bảng về Markdown để paste vào sprint report

File HTML KHÔNG commit (nằm trong `docs/tasks/**/*.html` đã ignore). Nếu khách JP yêu cầu evidence, **export ra PDF từ browser** (Cmd+P → Save as PDF) rồi attach.

Cấu trúc nội dung (skill inject vào HTML):

```markdown
# Regression Test: [Sprint/Version]

**QA**: [Name]  
**Date**: [Date]  
**Release scope**: [TASK-IDs]  
**Environment**: Staging  
**Status**: In Progress / Pass / Fail

---

## 🔴 Must Test (High Risk)

### [Area 1 — ví dụ: Auth Flow]

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-001 | Login với email/password hợp lệ | 1. POST /auth/login với credentials đúng | 200 + JWT token | | |
| RT-002 | Login sai password | 1. POST /auth/login với password sai | 401 + error message | | |
| RT-003 | [Feature mới vừa merge] | [...] | [...] | | |

### [Area 2 — nếu có]

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-XXX | | | | | |

---

## 🟡 Should Test (Medium Risk)

| ID | Test Case | Steps | Expected | Result | Bug? |
|----|-----------|-------|----------|--------|------|
| RT-XXX | | | | | |

---

## 🟢 Smoke Test (Low Risk)

| ID | Test Case | Result |
|----|-----------|--------|
| RT-XXX | Core flow X vẫn hoạt động | |

---

## Bugs Found

| Bug ID | Severity | Test Case | Mô tả | Status |
|--------|----------|-----------|-------|--------|
| | | | | |

---

## Sign-off

- [ ] Tất cả 🔴 Must Test pass
- [ ] Không có bug Critical/High chưa fix
- [ ] PM confirm acceptable risk cho bugs Medium/Low còn mở
- [ ] QA Lead sign-off: __________________  Date: __________
```

### Bước 4 — Gate: Sign-off confirmation

question({
  questions: [{
    question: "Regression checklist đã tạo. Điều kiện go/no-go đã rõ?",
    header: "Sign-off",
    options: [
      { label: "Sẵn sàng", description: "Must Test pass, không có Critical/High bug" },
      { label: "Chưa sẵn sàng", description: "Còn Must Test fail hoặc Critical bug" },
    ]
  }]
})

---

## Quy tắc

- Regression scope phải cover tất cả High Risk areas — không skip
- Nếu phát hiện bug mới → tạo issue ngay, đánh priority, không giả sử "sẽ fix sau"
- Không deploy production khi còn Critical hoặc High bug chưa xử lý
- Kết quả regression phải được lưu vào `docs/tasks/` để audit trail
