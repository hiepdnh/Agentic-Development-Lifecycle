---
name: qa:testplan
description: >
  Tạo test plan toàn diện từ spec/user stories: strategy, test cases happy/edge/negative, exit criteria.
  Trigger khi: user nói "tạo test plan", "viết test cases", "soạn kế hoạch test",
  "create test plan", "QA plan cho feature", "test strategy", hoặc gõ /qa:testplan.
---

# /qa:testplan
**Role**: QA Engineer  
**Mục đích**: Tạo test plan toàn diện từ spec/user stories, bao gồm test cases và strategy.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc input

Đọc `docs/tasks/[TASK-ID]/requirements.md` và màn hình/API docs liên quan.

### Bước 2 — Gate: Xác nhận scope test

question({
  questions: [{
    question: "Xác nhận scope test cho feature?",
    header: "Test Scope",
    options: [
      { label: "Confirm", description: "Tạo test plan theo scope đã phân tích" },
    ]
  }]
})

### Bước 3 — Tạo Test Plan

Tạo file `docs/tasks/[TASK-ID]/test-plan.md` sử dụng template `templates/test-plan.md`. Điền vào:
- **QA** + **Ngày** + **Version**
- Scope: In scope (AC-001, AC-002...) và Out of scope
- Test Strategy: level (Unit/Integration/E2E/Performance), approach, tools
- Test Cases: TC-001 Happy Path, TC-002 Edge Case, TC-003 Negative Case (mỗi TC có pre-condition, steps, expected, priority)
- Test Data: bảng data + cách tạo
- Regression Checklist: features cần check regression
- Exit Criteria: điều kiện hoàn tất test

### Bước 3.5 — Render HTML companion (interactive checklist)

Sinh `docs/tasks/[TASK-ID]/test-plan.html` từ template `templates/html-artifact.html`:

- Inject `<ul class="checklist" data-storage-key="testplan-[TASK-ID]">` cho từng TC
- Mỗi `<li>` có `<input type="checkbox" data-id="TC-XXX">` + label = TC name
- Group theo type: Happy / Edge / Negative dùng `<details><summary>` mở rộng
- Header có `<input type="search" data-filter="...">` để filter TC theo từ khoá
- Pill `pill-ok|warn|err` cho priority High/Med/Low

QA tick checkbox khi chạy test, state lưu localStorage — không cần copy vào Markdown.
File HTML KHÔNG commit (đã có `.gitignore`). `test-plan.md` vẫn là source of truth commit vào repo.

```
✓ Đã sinh `docs/tasks/[TASK-ID]/test-plan.html`
  Mở bằng browser khi chạy test để tick checklist (state lưu localStorage).
```

### Bước 4 — Gate cuối

question({
  questions: [{
    question: "Test plan đã soạn xong. Có thiếu test case hay cần điều chỉnh không?",
    header: "Final Review",
    options: [
      { label: "Đủ rồi", description: "Test plan hoàn chỉnh, không cần bổ sung" },
      { label: "Thiếu TC", description: "Cần thêm test case: mô tả cụ thể" },
      { label: "Sửa exit criteria", description: "Cần thêm điều kiện exit" },
    ]
  }]
})

### Bước 5 — (Optional) Spawn subagent: test-gen

Nếu user chọn generate code, spawn test-gen để generate test code từ test plan đã approve:

```
task(
  description: "Generate test code from approved test plan",
  prompt: "Write test code per agents/test-gen.md spec.\n\nNEW CODE:\n[Files đã implement — chỉ pass files mới/changed]\n\nAC LIST:\n[AC list từ test plan]\n\nTEST FRAMEWORK:\n[Jest/JUnit/pytest/...]\n\nEXISTING TEST EXAMPLES:\n[1-2 file test hiện có]",
  subagent_type: "oracle"
)
```
