---
name: qa:testplan
description: >
  Tạo test plan toàn diện từ spec/user stories: strategy, test cases happy/edge/negative, exit criteria.
  Trigger khi: user nói "tạo test plan", "viết test cases", "soạn kế hoạch test",
  "create test plan", "QA plan cho feature", "test strategy", hoặc gõ /qa:testplan.
---

# Skill: /qa:testplan
**Role**: QA Engineer  
**Mục đích**: Tạo test plan toàn diện từ spec/user stories, bao gồm test cases và strategy.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc input

Đọc `docs/tasks/[TASK-ID]/requirements.md` và màn hình/API docs liên quan.

### Bước 2 — Gate: Xác nhận scope test

```
## Tôi sẽ tạo test plan cho: [Feature name]

Tôi đọc spec và xác định:
- [N] Acceptance Criteria cần verify
- [M] Business Rules cần test
- Màn hình liên quan: [list]
- API liên quan: [list]

Trước khi soạn test plan, tôi cần hỏi:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Test level cần cover? | A: Unit / B: Integration / C: E2E / D: Performance / E: Security / F: Tất cả / G: Khác: ___ |
| 2 | Môi trường test? | A: Dev / B: Staging / C: Prod-like / D: Khác: ___ |
| 3 | Có dữ liệu test đặc biệt cần chuẩn bị không? | A: Không / B: Có — loại data: ___ / C: Khác: ___ |
| 4 | Regression scope — những gì cần retest? | _(liệt kê features/flows cần retest)_ |
```

### Bước 3 — Tạo Test Plan

Tạo file `docs/tasks/[TASK-ID]/test-plan.md`:

```markdown
# Test Plan: [TASK-ID] — [Feature name]

**QA**: [Name]  
**Ngày**: [Date]  
**Version**: 1.0

## 1. Scope

### In scope
- [AC-001]: [...]
- [AC-002]: [...]

### Out of scope
- [Không test gì trong sprint này]

## 2. Test Strategy

| Level | Approach | Tools |
|-------|----------|-------|
| Unit | [Dev tự test] | [JUnit/Jest/...] |
| Integration | [API testing] | [Postman/RestAssured] |
| E2E | [Manual/Selenium] | [...] |
| Performance | [Load test nếu cần] | [...] |

## 3. Test Cases

### TC-001: [Happy Path — Tên]
**Pre-condition**: [Trạng thái trước khi test]  
**Steps**:
1. [Bước 1]
2. [Bước 2]  
**Expected**: [Kết quả mong đợi]  
**Priority**: High/Medium/Low

### TC-002: [Edge Case — Tên]
...

### TC-003: [Negative Case — Tên]
...

## 4. Test Data

| Data | Mô tả | Cách tạo |
|------|-------|----------|
| | | |

## 5. Regression Checklist

- [ ] [Feature A] vẫn hoạt động bình thường
- [ ] [Feature B] không bị ảnh hưởng

## 6. Exit Criteria

- [ ] Tất cả test cases High priority pass
- [ ] Không có bug Critical/High chưa fix
- [ ] Regression không có regression mới
```

### Bước 4 — Gate cuối

```
Test plan đã soạn xong với [N] test cases.

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Test case nào có vẻ thiếu? | A: Không thiếu / B: Thiếu — mô tả: ___ / C: Khác: ___ |
| 2 | Có edge case domain đặc thù tôi chưa cover? | A: Không / B: Có — edge case: ___ / C: Khác: ___ |
| 3 | Exit criteria có đủ chặt không? | A: Đủ rồi / B: Cần thêm điều kiện: ___ / C: Khác: ___ |
```
