---
name: qa:it
description: >
  Tạo Integration/E2E Test plan từ spec và kết quả UT, hỗ trợ human thực thi E2E và ghi kết quả.
  Chỉ chạy SAU KHI /qa:ut passed. Khi fail có bug feedback loop về dev:debug.
  Trigger khi: user nói "tạo IT plan", "integration test", "E2E test cases", "test tích hợp",
  "end-to-end test", "IT plan cho feature", hoặc gõ /qa:it.
---

# /qa:it
**Role**: QA Engineer  
**Mục đích**: Tạo Integration/E2E Test plan cover luồng nghiệp vụ end-to-end. Chỉ chạy SAU KHI UT passed. Khi fail → bug feedback loop về dev phase.

---

## Hướng dẫn thực hiện

### Bước 0 — Kiểm tra UT prerequisite

Đọc `docs/tasks/[TASK-ID]/ut-results.md`. Nếu không tồn tại hoặc verdict ≠ PASS → dừng và yêu cầu chạy `/qa:ut` trước.

### Bước 1 — Đọc input

Đọc `requirements.md`, `analysis.md`, `test-plan-ut.md`, và Screen/API docs liên quan.

### Bước 2 — Gate: Xác nhận scope IT

question({
  questions: [{
    question: "Xác nhận scope Integration Test?",
    header: "IT Scope",
    options: [
      { label: "Staging env", description: "Chạy trên staging — dùng mock external API" },
      { label: "Prod-like", description: "Chạy trên môi trường prod-like — dùng real services" },
      { label: "Dev env", description: "Chạy trên dev — có thể không đủ data" }
    ]
  }]
})

**Chờ confirm.**

### Bước 3 — Tạo IT Plan

Tạo `docs/tasks/[TASK-ID]/test-plan-it.md` với TC dạng `TC-IT-001`:

Mỗi TC có: Flow | Preconditions | Steps (numbered) | Expected | Postconditions | Type

Cover đầy đủ: happy flow (end-to-end), cross-component integration, error recovery, data integrity.

### Bước 4 — Gate cuối

question({
  questions: [{
    question: "IT plan đã đủ chưa?",
    header: "Validate",
    options: [
      { label: "Đủ rồi", description: "Tiến hành thực thi" },
      { label: "Thiếu flow", description: "Mô tả flow cần bổ sung" },
      { label: "Precondition khó", description: "Cần hỗ trợ setup data/env" }
    ]
  }]
})

### Bước 5 — Gate: Kết quả thực thi IT

**⚠️ HUMAN ONLY — AI không thực thi E2E test.**

question({
  questions: [{
    question: "Kết quả chạy E2E?",
    header: "IT Result",
    options: [
      { label: "Tất cả PASS", description: "Ghi it-results.md → sẵn sàng /dev:pr" },
      { label: "Có TC fail", description: "Mô tả TC fail + step + actual → tạo bug-handoff.md" },
      { label: "Lỗi environment", description: "Setup lỗi, không tính test fail" }
    ]
  }]
})

**Nếu PASS** → Tạo `docs/tasks/[TASK-ID]/it-results.md` (verdict: PASS, ut_prerequisite: PASS) → chỉ dẫn `/dev:pr`.

**Nếu FAIL** → Append vào `docs/tasks/[TASK-ID]/bug-handoff.md` với failing TC + suspected files → chỉ dẫn `/dev:debug`.
