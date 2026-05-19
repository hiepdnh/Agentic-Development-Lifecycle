---
name: ba:user-story
description: >
  Chuyển spec thành User Stories với Acceptance Criteria chuẩn, sẵn sàng để PM tạo issue.
  Trigger khi: user nói "tạo user stories", "viết user story", "breakdown spec thành stories",
  "create user stories", "AC cho stories", hoặc gõ /ba:user-story.
---
## Tóm tắt

Chuyển spec thành User Stories với Acceptance Criteria chuẩn, sẵn sàng để PM tạo issue. Trigger khi: user nói "tạo user stories", "viết user story", "breakdown spec thành stories", "create user stories", "AC cho stories", hoặc gõ /ba:user-story.

## Quy trình

# /ba:user-story
**Role**: Business Analyst  
**Mục đích**: Chuyển spec thành User Stories với Acceptance Criteria chuẩn, sẵn sàng để PM tạo issue.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc spec hiện có

Đọc `docs/tasks/[TASK-ID]/requirements.md` nếu có. Nếu chưa có, yêu cầu người dùng chạy `/ba:spec` trước.

### Bước 2 — Gate: Xác nhận scope

```
## Tôi sẽ tạo User Stories từ spec: [Tên feature]

Spec có [N] Use Cases và [M] Acceptance Criteria.
```

<!-- Gate: Xác nhận scope tạo stories -->
question({
  questions: [{
    question: "Granularity mong muốn?",
    header: "Granularity",
    options: [
      { label: "Mỗi Use Case = 1 story", description: "Tương ứng 1-1 với use case" },
      { label: "Gộp theo feature", description: "Gộp nhiều use case vào 1 story" },
      { label: "Tách nhỏ hơn Use Case", description: "Chi tiết hơn từng use case" }
    ]
  }, {
    question: "Story format?",
    header: "Format",
    options: [
      { label: "As a..., I want..., so that...", description: "Format chuẩn user story" },
      { label: "Format khác", description: "Tôi sẽ mô tả format mong muốn" }
    ]
  }, {
    question: "Có Epic đã tồn tại để link vào không?",
    header: "Epic",
    options: [
      { label: "Có", description: "Có Epic đã tồn tại — tôi sẽ cung cấp tên/link" },
      { label: "Không", description: "Không có Epic" }
    ]
  }]
})

### Bước 3 — Tạo User Stories

Tạo mỗi User Story sử dụng template `templates/user-story.md`.

### Bước 4 — Gate cuối: Review + Đề xuất thứ tự

```
## Đã tạo [N] User Stories:

| ID | Tên | Priority | Estimate | Dependencies |
|----|-----|----------|----------|--------------|
| US-001 | | | | |

**Đề xuất thứ tự implement** (dựa trên dependencies và value):
1. US-XXX — [lý do]
2. US-XXX — [lý do]
```

<!-- Gate cuối: Review stories -->
question({
  questions: [{
    question: "Estimate có hợp lý không?",
    header: "Estimate",
    options: [
      { label: "Hợp lý", description: "Estimate phù hợp" },
      { label: "Quá cao", description: "Tôi sẽ chỉ ra story cần giảm estimate" },
      { label: "Quá thấp", description: "Tôi sẽ chỉ ra story cần tăng estimate" }
    ]
  }, {
    question: "Có story nào có thể chia nhỏ hơn để dễ demo không?",
    header: "Chia nhỏ",
    options: [
      { label: "Không cần", description: "Các story đã đủ nhỏ" },
      { label: "Có", description: "Tôi sẽ chỉ ra story cần chia nhỏ" }
    ]
  }, {
    question: "Có story nào nên defer sang sprint sau không?",
    header: "Defer",
    options: [
      { label: "Không", description: "Tất cả đều làm trong sprint này" },
      { label: "Có", description: "Tôi sẽ chỉ ra story cần defer" }
    ]
  }]
})

---

## Output files

- Cập nhật `docs/tasks/[TASK-ID]/requirements.md` với User Stories section
- Sẵn sàng để PM dùng `/pm:breakdown` để tạo GitHub Issues
