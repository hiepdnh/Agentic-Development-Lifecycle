---
name: qa:ut
description: >
  Tạo Unit Test plan (testcase-functional) từ spec/requirements, hỗ trợ human thực thi và ghi kết quả.
  Tách biệt hoàn toàn với IT (integration/E2E). Khi fail có bug feedback loop về dev:debug.
  Trigger khi: user nói "tạo unit test", "UT plan", "functional test cases", "viết test đơn vị",
  "test từng hàm", "unit test cho feature", hoặc gõ /qa:ut.
---
## Tóm tắt

Tạo Unit Test plan (testcase-functional) từ spec/requirements, hỗ trợ human thực thi và ghi kết quả. Tách biệt hoàn toàn với IT (integration/E2E). Khi fail có bug feedback loop về dev:debug. Trigger khi: user nói "tạo unit test", "UT plan", "functional test cases", "viết test đơn vị", "test từng hàm", "unit test cho feature", hoặc gõ /qa:ut.

## Quy trình

# /qa:ut
**Role**: QA Engineer  
**Mục đích**: Tạo Unit Test plan cho từng function/component, hỗ trợ thực thi và ghi kết quả. Khi fail → bug feedback loop rõ ràng về dev phase.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc input

Đọc `docs/tasks/[TASK-ID]/requirements.md`, `docs/tasks/[TASK-ID]/analysis.md`, và màn hình/API docs liên quan.

### Bước 2 — Gate: Xác nhận scope UT

question({
  questions: [{
    question: "Xác nhận scope Unit Test?",
    header: "UT Scope",
    options: [
      { label: "Mock all deps", description: "Pure unit test — mock toàn bộ dependencies" },
      { label: "Lean integration", description: "Mock chỉ external services, giữ DB thật" },
      { label: "Khác", description: "Mô tả thêm scope cụ thể" }
    ]
  }]
})

**Chờ confirm.**

### Bước 3 — Tạo UT Plan

Tạo `docs/tasks/[TASK-ID]/test-plan-ut.md` với các TC dạng `TC-UT-001`:

Mỗi TC có: Unit | Input | Expected | Assertion | Type (Happy/Edge/Negative/Error)

Cover đầy đủ: happy path, edge cases (boundary/null/zero), negative (invalid input), error (exception).

### Bước 4 — Gate cuối

question({
  questions: [{
    question: "Test plan UT đã đủ chưa?",
    header: "Validate",
    options: [
      { label: "Đủ rồi", description: "Tiếp tục — không cần bổ sung" },
      { label: "Thiếu TC", description: "Mô tả TC cần thêm" },
      { label: "Generate code", description: "AI sinh test code từ plan" }
    ]
  }]
})

### Bước 5 — (Optional) Spawn test-gen

Nếu user chọn "Generate code":

task({
  description: "Generate UT code from approved test plan",
  subagent_type: "oracle",
  prompt: "Write unit test code per agents/test-gen.md spec.\n\nIMPLEMENTED FILES:\n[files từ analysis.md]\n\nTC LIST:\n[TC-UT-xxx list]\n\nTEST FRAMEWORK:\n[framework]\n\nEXISTING TEST EXAMPLES:\n[1-2 file test hiện có]"
})

### Bước 6 — Gate: Kết quả thực thi UT

**⚠️ HUMAN ONLY — AI không thực thi test.**

question({
  questions: [{
    question: "Kết quả chạy UT suite?",
    header: "UT Result",
    options: [
      { label: "Tất cả PASS", description: "Ghi ut-results.md và chuyển sang /qa:it" },
      { label: "Có TC fail", description: "Mô tả TC fail + error → tạo bug-handoff.md" },
      { label: "Lỗi environment", description: "Setup lỗi, không tính test fail" }
    ]
  }]
})

**Nếu PASS** → Tạo `docs/tasks/[TASK-ID]/ut-results.md` (verdict: PASS) → chỉ dẫn `/qa:it`.

**Nếu FAIL** → Tạo `docs/tasks/[TASK-ID]/bug-handoff.md` với failing TC IDs + suspected files → chỉ dẫn `/dev:debug`.
