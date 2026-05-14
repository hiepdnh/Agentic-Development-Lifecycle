---
name: sm:retro
description: >
  Facilitate sprint retrospective, tổng hợp feedback theo theme, tạo action items actionable.
  Trigger khi: user nói "retro sprint", "retrospective", "họp cuối sprint",
  "tổng kết sprint", "what went well", "action items từ retro", hoặc gõ /sm:retro.
---

# /sm:retro
**Role**: Scrum Master  
**Mục đích**: Facilitate sprint retrospective, tổng hợp feedback, tạo action items có thể thực hiện được.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Setup retro

question({
  questions: [{
    question: "Format retro ưa thích?",
    header: "Format",
    options: [
      { label: "Start/Stop/Continue", description: "Classic format: bắt đầu/dừng/tiếp tục" },
      { label: "4Ls", description: "Liked/Learned/Lacked/Longed for" },
      { label: "Mad/Sad/Glad", description: "Emotion-based format" },
    ]
  }, {
    question: "Có action items từ retro trước chưa done không?",
    header: "Prev Items",
    options: [
      { label: "Không", description: "Tất cả items từ retro trước đã done" },
      { label: "Có", description: "Còn items chưa done cần review" },
    ]
  }]
})

### Bước 2 — Tổng hợp feedback

Nhận input từ team (paste anonymous feedback hay notes từ session).

Phân loại và nhóm themes:

```markdown
# Sprint [N] Retrospective

**Date**: [Date]  
**Facilitator**: [SM name]  
**Attendees**: [N] people  
**Sprint**: [N] | [Start date] → [End date]

---

## Sprint Highlights

- **Velocity**: [X] points ([+/-N%] vs previous sprint)
- **Delivered**: [N]/[M] planned items
- **Team health**: 🟢 Good / 🟡 OK / 🔴 Needs attention

---

## What Went Well ✅

### [Theme 1: e.g., "Collaboration"]
- [Specific observation]
- [Votes: N]

### [Theme 2]
...

---

## What Needs Improvement 🔧

### [Theme 1: e.g., "Requirements clarity"]
- [Specific observation]
- [Votes: N]
- [Suggested fix]

### [Theme 2]
...

---

## Action Items

| # | Action | Owner | Done by | Success metric |
|---|--------|-------|---------|----------------|
| 1 | [Specific action, not vague] | [Name] | Sprint [N+1] Day 1 | [...] |
| 2 | | | | |

---

## Action Items từ Retro trước

| Action | Owner | Status | Ghi chú |
|--------|-------|--------|---------|
| [Action từ Sprint N-1] | [Name] | ✅ Done / ❌ Not done / 🔄 In progress | [...] |

---

## Shoutouts 🌟

- [Member X] — [cụ thể tại sao được shoutout]
```

### Bước 3 — Gate cuối

question({
  questions: [{
    question: "Retro summary đã soạn xong. Xác nhận action items?",
    header: "Final Review",
    options: [
      { label: "OK", description: "Action items đúng owner và realistic" },
      { label: "Quá nhiều", description: "Cắt xuống top 2-3 action items" },
      { label: "Sửa owner", description: "Cần reassign ownership" },
      { label: "Escalate cũ", description: "Action items cũ chưa done cần escalate" },
    ]
  }]
})
