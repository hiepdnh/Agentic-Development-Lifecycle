# Skill: /ba-spec
**Role**: Business Analyst  
**Mục đích**: Chuyển đổi yêu cầu thô (raw requirement) thành tài liệu đặc tả nghiệp vụ có cấu trúc.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc và phân tích input

Nhận input từ người dùng (email, meeting notes, verbal description, Jira ticket...). Phân tích để xác định:
- Stakeholder chính
- Vấn đề cần giải quyết (problem statement)
- Phạm vi (scope)
- Các actor liên quan
- Điều kiện ràng buộc đã biết

### Bước 2 — Gate: Trình bày hiểu biết ban đầu + Hỏi làm rõ

Trình bày theo format:

```
## Tôi hiểu yêu cầu như sau:

**Vấn đề cần giải quyết**: [...]
**Stakeholder chính**: [...]
**Phạm vi sơ bộ**: [...]
**Các actor**: [...]

## Trước khi tôi soạn spec, tôi cần làm rõ:

1. [Câu hỏi về business rule chưa rõ]
2. [Câu hỏi về edge case hoặc exception]
3. [Câu hỏi về tích hợp với hệ thống khác nếu có]
```

**Chờ human trả lời trước khi tiếp tục.**

### Bước 3 — Soạn Specification Document

Sau khi nhận câu trả lời, tạo `docs/tasks/[TASK-ID]/requirements.md` dùng template `templates/task-doc-requirements.md`.

Điền đầy đủ:
- Section 1-3: Context, mục tiêu, phạm vi
- Section 4-5: Actors + Business Rules (BR phải có ID để tham chiếu)
- Section 6-7: Happy path + alternative flows
- Section 8: Acceptance Criteria — mỗi AC phải testable (Given/When/Then nếu cần)
- Section 9: NFR nếu có performance/security requirements
- Section 10: Câu hỏi mở còn lại (không tự answer nếu không chắc)

### Bước 4 — Gate cuối: Review và confirm

```
## Spec đã soạn xong.

Trước khi finalize, tôi muốn hỏi:
1. Có business rule nào tôi bỏ sót không?
2. Acceptance Criteria [AC-XXX] có đủ cụ thể để QA test được không?
3. Có Open Question nào cần resolve trước khi đưa cho Dev không?

Nếu ok, tôi sẽ lưu file và bạn có thể dùng /ba-user-story để tạo User Stories từ spec này.
```

---

## Lưu ý quan trọng

- **Không bao giờ** tự động tạo spec mà không qua Gate làm rõ.
- Luôn highlight những gì **không chắc chắn** bằng `[?]` trong draft.
- Nếu input quá mơ hồ, hỏi thêm thay vì giả định.
