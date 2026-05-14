---
name: sm:retro
description: >
  Facilitate sprint retrospective, summarize feedback by theme, create actionable action items.
  Trigger when: user says "sprint retro", "retrospective", "end of sprint meeting",
  "sprint summary", "what went well", "action items from retro", or types /sm:retro.
---

# /sm:retro
**Role**: Scrum Master  
**Purpose**: Facilitate sprint retrospective, summarize feedback, create actionable action items.

---

## Execution Guide

### Step 1 — Gate: Setup retro

question({
  questions: [{
    question: "Preferred retro format?",
    header: "Format",
    options: [
      { label: "Start/Stop/Continue", description: "Classic format: start/stop/continue" },
      { label: "4Ls", description: "Liked/Learned/Lacked/Longed for" },
      { label: "Mad/Sad/Glad", description: "Emotion-based format" },
    ]
  }, {
    question: "Are there any unresolved action items from the previous retro?",
    header: "Prev Items",
    options: [
      { label: "No", description: "All items from the previous retro are done" },
      { label: "Yes", description: "There are unfinished items to review" },
    ]
  }]
})

### Step 2 — Summarize feedback

Receive input from the team (paste anonymous feedback or notes from the session).

Categorize and group by themes:

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

## Action Items from Previous Retro

| Action | Owner | Status | Notes |
|--------|-------|--------|-------|
| [Action from Sprint N-1] | [Name] | ✅ Done / ❌ Not done / 🔄 In progress | [...] |

---

## Shoutouts 🌟

- [Member X] — [specific reason for shoutout]
```

### Step 3 — Final Gate

question({
  questions: [{
    question: "Retro summary is ready. Confirm action items?",
    header: "Final Review",
    options: [
      { label: "OK", description: "Action items have correct owners and are realistic" },
      { label: "Too many", description: "Trim down to top 2-3 action items" },
      { label: "Fix owner", description: "Need to reassign ownership" },
      { label: "Escalate old", description: "Unresolved old action items need escalation" },
    ]
  }]
})
