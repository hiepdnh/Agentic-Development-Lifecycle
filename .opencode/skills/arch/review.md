---
name: arch:review
description: >
  Review design decision, phát hiện vấn đề kiến trúc, đề xuất cải thiện.
  Trigger khi: user nói "review design", "kiểm tra kiến trúc", "architecture review",
  "review technical decision", "xem design có ổn không", hoặc gõ /arch:review.
---
## Tóm tắt

Review design decision, phát hiện vấn đề kiến trúc, đề xuất cải thiện. Trigger khi: user nói "review design", "kiểm tra kiến trúc", "architecture review", "review technical decision", "xem design có ổn không", hoặc gõ /arch:review.

## Quy trình

# /arch:review
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

question({
  questions: [{
    question: "Review tập trung vào khía cạnh nào?",
    header: "Focus",
    options: [
      { label: "Scalability", description: "Kiểm tra khả năng scale của design" },
      { label: "Security", description: "Phát hiện lỗ hổng bảo mật" },
      { label: "Maintainability", description: "Code có dễ maintain không" },
      { label: "Performance", description: "Tìm bottleneck" },
      { label: "Tất cả", description: "Review toàn diện tất cả khía cạnh" },
    ]
  }, {
    question: "Đã có ADR nào liên quan chưa?",
    header: "ADR",
    options: [
      { label: "Có", description: "Đã có ADR, tôi sẽ đọc thêm" },
      { label: "Không", description: "Chưa có ADR cho design này" },
    ]
  }]
})

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

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | [Quyết định design chưa rõ lý do] | _(điền vào)_ |
| 2 | [Trade-off chưa được document] | _(điền vào)_ |
```

### Bước 5 — Gate: Discussion

question({
  questions: [{
    question: "Sau khi review — đề xuất có feasible trong timeline hiện tại không?",
    header: "Discussion",
    options: [
      { label: "Sẽ làm", description: "Đề xuất feasible, sẽ implement" },
      { label: "Không feasible", description: "Không khả thi trong timeline hiện tại" },
      { label: "Cần cân nhắc", description: "Cần thêm thảo luận trước khi quyết định" },
    ]
  }]
})
