---
name: dev:debug
description: >
  Systematic debugging — tìm root cause trước khi fix. Reproduce → Localize → Reduce → Fix → Guard.
  Trigger khi: user nói "debug lỗi", "tìm nguyên nhân bug", "tại sao bị lỗi",
  "fix bug", "investigate error", "lỗi không biết tại sao", hoặc gõ /dev:debug.
---

# /dev:debug
**Role**: Developer  
**Mục đích**: Systematic debugging — tìm root cause trước khi fix. Tránh "fix ngẫu nhiên cho đến khi hết lỗi".

---

## Nguyên tắc cốt lõi

**Không bao giờ** touch code trước khi có minimal reproduction.  
Fix sai root cause = tạo thêm bugs.

## Quy trình 5 bước

### Bước 1 — Reproduce

Dùng `question` tool để thu thập thông tin:

question({
  questions: [{
    question: "Mô tả lỗi: gì xảy ra vs gì mong đợi?",
    header: "Mô tả lỗi",
    options: [
      { label: "Sẽ mô tả", description: "Cung cấp description + steps" },
    ]
  }, {
    question: "Lỗi này mới xuất hiện hay luôn có?",
    header: "Timing",
    options: [
      { label: "Mới xuất hiện", description: "Sau thay đổi gần đây" },
      { label: "Luôn có", description: "Lỗi tồn tại từ lâu" },
      { label: "Không chắc", description: "Chưa xác định được" },
    ]
  }, {
    question: "Có error message / stack trace không?",
    header: "Error info",
    options: [
      { label: "Có", description: "Sẽ paste stack trace" },
      { label: "Không có", description: "Không có error message" },
    ]
  }]
})

**Ask First Gate**: Nếu lỗi xảy ra trên production với user thật → báo ngay cho team trước khi debug. Xem thêm `E:\AI Bootcamp\ClaudeSkill\assets\ask-first-gates.md`.

### Bước 2 — Localize

Spawn subagent để đọc code liên quan (read-only):

task(
  description: "Find code related to reported bug",
  prompt: "Tìm code xử lý [behavior mô tả]. Trả về file:line và flow từ entry point đến điểm có thể fail. Không sửa gì.",
  subagent_type: "explorer"
)

Trình bày:

```
## Tôi xác định vùng code có thể là nguồn lỗi:

1. [file:line] — [lý do suspect]
2. [file:line] — [lý do suspect]

Hypothesis:
- H1: [Giả thuyết 1 về nguyên nhân]
- H2: [Giả thuyết 2]

Tôi sẽ kiểm tra H1 trước vì [lý do].
```

Dùng `question` tool:

question({
  questions: [{
    question: "Bạn có thêm hypothesis nào dựa trên context bạn biết không?",
    header: "Hypothesis",
    options: [
      { label: "Không", description: "Tiếp tục với hypothesis hiện tại" },
      { label: "Có", description: "Sẽ bổ sung hypothesis" },
    ]
  }]
})

### Bước 3 — Reduce

Tạo minimal reproduction — code nhỏ nhất có thể trigger lỗi.

```
## Minimal reproduction:

[Code snippet hoặc steps tối thiểu]

Lỗi có reproduce với code này không?
(Nếu không → vấn đề nằm ở interaction với phần khác, không phải đây)
```

**Không tiếp tục nếu chưa có minimal reproduction.**

### Bước 4 — Fix

Chỉ sau khi xác nhận root cause, dùng `question` tool:

question({
  questions: [{
    question: "Root cause đã xác định. Chọn approach fix?",
    header: "Fix",
    options: [
      { label: "Targeted fix", description: "Sửa đúng chỗ, ít side effect nhất" },
      { label: "Broader fix", description: "Sửa cả pattern, nhiều file hơn" },
    ]
  }]
})

**Ask First Gate**: Nếu fix liên quan đến bất kỳ thay đổi nhạy cảm nào (`E:\AI Bootcamp\ClaudeSkill\assets\ask-first-gates.md`) → cần senior review trước khi apply.

### Bước 5 — Guard

Sau khi fix, dùng `question` tool:

question({
  questions: [{
    question: "Đã apply fix. Cần thêm test để prevent regression không?",
    header: "Guard",
    options: [
      { label: "Không cần", description: "Fix đã đủ" },
      { label: "Cần thêm test", description: "Thêm regression test" },
    ]
  }]
})

---

## Red Flags (dừng lại nếu thấy)

- Đang thử fix nhiều thứ cùng lúc mà không hiểu tại sao
- Lỗi "biến mất" nhưng không biết tại sao
- Fix xong nhưng không thể reproduce được trường hợp fail ban đầu
- Stack trace trỏ vào library code — thường là cách dùng sai, không phải bug trong lib
