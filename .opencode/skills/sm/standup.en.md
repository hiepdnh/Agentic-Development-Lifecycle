---
name: sm:standup
description: >
  Summarize and format daily standup quickly from raw input, highlight blockers and sprint health.
  Trigger when: user says "summarize standup", "format daily standup", "daily scrum",
  "today's standup", "paste team update", or types /sm:standup.
---

# /sm:standup
**Role**: Scrum Master / Team  
**Purpose**: Summarize and format daily standup quickly, highlight blockers.

---

## Execution Guide

### Step 1 — Collect input

Receive input from the team (paste raw content from Slack/chat or a list per person):

```
## Paste team standup updates here.

Input format doesn't matter — raw text, bullet points, or prose are all OK.
I will reformat it properly.

Need to know: When does Sprint [N] end?
```

### Step 2 — Summarize and format

```markdown
# Daily Standup — [Date]
**Sprint [N]** | **Day [X]/[Y]**

---

## Team Updates

### [Member name 1]
- ✅ **Yesterday**: [...]
- 🔄 **Today**: [...]
- ⛔ **Blockers**: [None / Description]

### [Member name 2]
...

---

## 🚨 Blockers Needing Action

| Person | Blocker | Help needed from |
|--------|---------|-----------------|
| | | |

## ⚠️ Sprint Health

- Tasks completed: [N]/[Total]
- Days remaining: [X]
- At-risk items: [list if any]

## 📌 Follow-up

- [Were yesterday's action items completed?]
```

### Step 3 — Gate: Highlight concerns

question({
  questions: [{
    question: "Standup summary complete. Any concerns to escalate?",
    header: "Concerns",
    options: [
      { label: "OK", description: "No significant issues to note" },
      { label: "Escalate blocker", description: "Prolonged blocker needs immediate escalation" },
      { label: "Task at risk", description: "Task is at risk and needs additional support" },
    ]
  }]
})
