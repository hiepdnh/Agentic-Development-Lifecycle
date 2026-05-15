---
name: be:changerequest
description: >
  Manages 変更依頼 (Change Request) — impact analysis, approval trail,
  version control for spec changes. Use when specs change mid-sprint or after sign-off.
  Triggers when: user says "khách JP yêu cầu thay đổi", "tạo change request", "変更依頼",
  "spec thay đổi giữa chừng", "CR mới từ JP", "change request", or types /be:changerequest.
---

# /be:changerequest
**Role**: Bridge Engineer / PM  
**Purpose**: Handle change requests from the Japanese client in a controlled manner — clear impact analysis, full approval trail, no silent spec changes.

---

## Project Context

Spec changes after sign-off are the highest risk in JP outsourcing:
- Japanese clients often request small changes via email/chat without a formal CR
- VN dev implements "quickly" without an approval trail → later the client questions it
- Impact is not estimated → scope creep becomes uncontrollable

**Core Principle**: Every change after sign-off must have a CR document before dev touches code.

---

## Execution Guide

### Step 0 — Load glossary

Read `templates/jp-vn-en-glossary.md` before handling technical terminology.

### Step 1 — Gate: Gather CR information

<!-- Gate: Gather CR information -->
question({
  questions: [{
    question: "Where does the CR request come from?",
    header: "Source",
    options: [
      { label: "Email from JP", description: "Request via email" },
      { label: "Meeting", description: "Request from a meeting" },
      { label: "Slack/Teams", description: "Request from chat" },
      { label: "Formal 変更依頼書", description: "Formal written document" }
    ]
  }, {
    question: "Type of change?",
    header: "Type",
    options: [
      { label: "New feature", description: "New functionality request" },
      { label: "Modify existing spec", description: "Change to a signed-off spec" },
      { label: "Remove scope", description: "Remove an existing requirement" },
      { label: "New performance", description: "Additional performance requirement" },
      { label: "UI/UX adjustment", description: "Interface adjustments" }
    ]
  }, {
    question: "Urgency?",
    header: "Urgency",
    options: [
      { label: "Current sprint", description: "Needs to be done immediately in this sprint" },
      { label: "Next sprint", description: "Can wait for the next sprint" },
      { label: "Flexible", description: "Timing not yet determined" }
    ]
  }]
})

### Step 2 — Impact Analysis

Read:
- `docs/tasks/[TASK-ID]/requirements.md` — original spec being changed
- `docs/tasks/[TASK-ID]/analysis.md` — planned or in-progress implementation
- `docs/decisions/ADR-*.md` — related technical decisions

Analyze across 4 dimensions:

```
## Impact Analysis: CR-[NUMBER]

### Scope Impact
- Files/modules affected: [list]
- ACs changed / added / removed: [diff from original spec]
- Test cases needing updates: [list]

### Effort Impact
- Additional estimate: [X man-hours / man-days]
- Can be done in current sprint: [Yes / No / Partial]
- If No: needs to be pushed to sprint [N+1 / TBD]

### Risk Impact
- New risks: [list]
- Affected dependencies: [list]
- Regression risk: [Low / Medium / High]

### Schedule Impact
- Current deadline: [Date]
- Impact on deadline: [None / Delayed X days / Needs renegotiation]
```

### Step 3 — Gate: Confirm impact before drafting the CR

```
## I have analyzed the impact of the change request.

[Display impact analysis from Step 2]
```

<!-- Gate: Confirm impact -->
question({
  questions: [{
    question: "Is the impact analysis accurate?",
    header: "Accuracy",
    options: [
      { label: "Accurate", description: "Impact analysis is correct" },
      { label: "Needs adjustment", description: "I will describe what needs to be changed" }
    ]
  }, {
    question: "Who is the team-side CR approver?",
    header: "VN Approver",
    options: [
      { label: "PM", description: "PM approves" },
      { label: "Tech Lead", description: "Tech Lead approves" },
      { label: "Both", description: "Both PM and Tech Lead" }
    ]
  }, {
    question: "Should we send the estimate to JP before approval?",
    header: "JP Estimate",
    options: [
      { label: "Yes", description: "Send estimate email first" },
      { label: "No", description: "Proceed with creating the CR doc" }
    ]
  }]
})

### Step 4 — Create Change Request Documents

#### 4a. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md` (Vietnamese — internal)

Create using template `templates/change-request.en.md`.

Fill in completely:
- CR Number, original Task, author, Status
- Change request description from JP client (verbatim or summary)
- Spec before vs after comparison table
- Impact Analysis across 4 dimensions: Scope / Effort / Risk / Schedule
- Approval table with all 3 parties: PM + Tech Lead + JP Client

#### 4b. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md` (Japanese — send to JP client)

Create using template `templates/change-request.ja.md`.

This is the formal document sent to the JP client. Ensure:
- All sections in Japanese with keigo (敬語)
- Effort figures in 人日 (man-days)
- Approval table has JP side confirm

### Step 5 — Final Gate

```
## Change Request CR-[NUMBER] has been drafted.

Files created:
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md (internal — commit)
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md (send to JP — commit)

Checklist:
- [ ] Impact analysis reviewed by PM and Tech Lead
- [ ] Estimate confirmed (not "TBD")
- [ ] CR-jp.md translated using correct terms from the glossary
- [ ] Approval table includes all 3 parties: PM + Tech Lead + JP Client

Next steps:
- [ ] Send CR-jp.md to the Japanese client for confirmation
- [ ] After JP client approves: update requirements.md (note "CR-[NUMBER] approved [date]")
- [ ] Create new GitHub issue or update the original issue
```

<!-- Final Gate -->
question({
  questions: [{
    question: "CR documents are complete. Confirm?",
    header: "Finalize",
    options: [
      { label: "Confirm", description: "CR docs complete, ready to send" },
      { label: "Needs editing", description: "I will describe what needs to be changed" }
    ]
  }]
})

---

## Rules

- **DO NOT** implement changes before the CR is approved by both PM and the Japanese client
- Every CR must have a number (CR-001, CR-002...) — track in `docs/tasks/[TASK-ID]/cr/`
- If the CR changes the architecture → trigger `/arch:adr` after approval
- If the CR adds a security-sensitive feature → trigger `/sec:review` after implementation
