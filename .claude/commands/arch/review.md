# Skill: /arch:review
**Role**: Tech Lead / Architect  
**Mục đích**: Review design decision, phát hiện vấn đề kiến trúc, đề xuất cải thiện.

---

## Hướng dẫn thực hiện

### Bước 1 — Nhận input

Input có thể là:
- Mô tả design decision cần review
- Code snippet / diagram
- PR link
- Spec document

### Bước 2 — Gate: Xác nhận scope review

```
## Tôi sẽ review [tên design/component].

Trước khi bắt đầu, cho tôi biết:
1. Review tập trung vào gì? (scalability / security / maintainability / performance / tất cả)
2. Có constraint nào tôi cần biết? (team size, deadline, existing tech debt...)
3. Đã có ADR nào liên quan chưa?
```

### Bước 3 — Phân tích và Review

Đánh giá theo các lens:

**1. Correctness** — Logic có đúng không?
**2. Scalability** — Chịu được load tăng không?
**3. Maintainability** — Team sau có hiểu và sửa được không?
**4. Security** — Có surface attack nào không?
**5. Performance** — Bottleneck ở đâu?
**6. Coupling** — Phụ thuộc quá nhiều vào module khác không?
**7. Testability** — Có thể test được dễ không?

### Bước 4 — Trình bày kết quả

```
## Architecture Review: [Tên]

### 🟢 Điểm mạnh
- [Điều tốt 1]
- [Điều tốt 2]

### 🔴 Vấn đề nghiêm trọng (cần sửa trước khi merge)
| ID | Vấn đề | Impact | Đề xuất sửa |
|----|--------|--------|------------|
| | | | |

### 🟡 Vấn đề nên cải thiện (không blocking)
| ID | Vấn đề | Đề xuất |
|----|--------|---------|
| | | |

### 💡 Đề xuất dài hạn
- [Cải tiến có thể làm sau]

### Câu hỏi cần làm rõ
1. [Quyết định design chưa rõ lý do]
2. [Trade-off chưa được document]
```

### Bước 5 — Gate: Discussion

```
Sau khi review:
1. Vấn đề [ID] — bạn có thể giải thích lý do design như vậy không? Có thể tôi đang miss context.
2. Đề xuất [X] — có feasible trong timeline hiện tại không?
3. Bạn muốn tôi tạo ADR cho quyết định này không? (/arch:adr)
```
