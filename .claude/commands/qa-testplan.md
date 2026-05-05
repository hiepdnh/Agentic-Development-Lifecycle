# Skill: /qa-testplan
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
1. Test level nào cần cover? (Unit / Integration / E2E / Performance / Security)
2. Môi trường test: [Dev/Staging/Prod-like]
3. Có dữ liệu test đặc biệt nào cần chuẩn bị không?
4. Regression scope: những gì đã có cần retest?
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

Câu hỏi:
1. Test case nào có vẻ thiếu từ góc nhìn của bạn?
2. Có edge case đặc thù của domain (nghiệp vụ) nào tôi chưa cover?
3. Exit criteria có đủ chặt không, hay cần thêm điều kiện?
```
