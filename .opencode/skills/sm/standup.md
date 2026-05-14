---
name: sm:standup
description: >
  Tổng hợp và format daily standup nhanh từ input thô, highlight blockers và sprint health.
  Trigger khi: user nói "tổng hợp standup", "format daily standup", "daily scrum",
  "standup hôm nay", "paste update team vào", hoặc gõ /sm:standup.
---

# /sm:standup
**Role**: Scrum Master / Team  
**Mục đích**: Tổng hợp và format daily standup nhanh, highlight blockers.

---

## Hướng dẫn thực hiện

### Bước 1 — Thu thập input

Nhận input từ team (paste nội dung thô từ Slack/chat hoặc danh sách từng người):

```
## Paste standup updates của team vào đây.

Format input không quan trọng — text thô, bullet points, hay prose đều OK.
Tôi sẽ format lại cho chuẩn.

Cần biết thêm: Sprint [N] kết thúc khi nào?
```

### Bước 2 — Tổng hợp và format

```markdown
# Daily Standup — [Date]
**Sprint [N]** | **Day [X]/[Y]**

---

## Team Updates

### [Tên member 1]
- ✅ **Hôm qua**: [...]
- 🔄 **Hôm nay**: [...]
- ⛔ **Blockers**: [None / Mô tả]

### [Tên member 2]
...

---

## 🚨 Blockers cần action

| Người | Blocker | Cần hỗ trợ từ |
|-------|---------|--------------|
| | | |

## ⚠️ Sprint Health

- Tasks completed: [N]/[Total]
- Days remaining: [X]
- At-risk items: [list nếu có]

## 📌 Follow-up

- [Action item từ hôm qua đã xong chưa?]
```

### Bước 3 — Gate: Highlight concerns

question({
  questions: [{
    question: "Standup tổng hợp xong. Có concerns cần escalate?",
    header: "Concerns",
    options: [
      { label: "OK", description: "Không có vấn đề gì đáng chú ý" },
      { label: "Escalate blocker", description: "Blocker kéo dài cần escalate ngay" },
      { label: "Task at risk", description: "Task đang at risk cần hỗ trợ thêm" },
    ]
  }]
})
