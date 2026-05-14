---
name: ops:incident
description: >
  Guidance for incident triage, parallel 3-direction investigation, RCA template with 5 Whys.
  Trigger when: user says "there is an incident", "production system error", "triage incident",
  "write RCA", "root cause analysis", "on-call incident", or types /ops:incident.
---

# /ops:incident
**Role**: DevOps / On-call Engineer  
**Purpose**: Guidance for incident triage, creating RCA template, documenting lessons learned.

---

## Execution Guide

### Step 1 — Quick Triage (DO NOT stop to ask, run immediately)

When incident occurs, triage in order:

question({
  questions: [{
    question: "INCIDENT TRIAGE — Confirm incident information:",
    header: "Triage",
    options: [
      { label: "P1 — Down", description: "System completely down, affecting many users" },
      { label: "P2 — Degraded", description: "System degraded, subset of users affected" },
      { label: "P3 — Minor", description: "Minor issue, no user impact" },
    ]
  }]
})

### Step 2 — Support Investigation

Based on symptoms, suggest **3 parallel investigation directions**:

```
## Incident [INC-XXX] — P[N]

**Impact**: [Description]
**Started**: [Time]

### 3 priority investigation directions:

**Direction A**: [Hypothesis 1] — Check: [specific command/dashboard]
**Direction B**: [Hypothesis 2] — Check: [...]
**Direction C**: [Hypothesis 3] — Check: [...]

I suggest starting with Direction A because [reason].
Who will check which direction?
```

### Step 3 — Create RCA Template

After incident resolved, create `docs/decisions/INC-[XXX]-RCA.md`:

```markdown
# Root Cause Analysis: INC-[XXX]

**Severity**: P[N]  
**Duration**: [Start] → [End] ([X min/hours])  
**Impact**: [Number of users, revenue, SLA breach...]  
**Incident Commander**: [Name]  
**Date RCA completed**: [Date]

---

## Timeline

| Time | Event | Actor |
|------|-------|-------|
| HH:MM | Incident detected | [Monitor/User report] |
| HH:MM | On-call paged | [System] |
| HH:MM | Investigation started | [Name] |
| HH:MM | Root cause identified | [Name] |
| HH:MM | Fix deployed | [Name] |
| HH:MM | Incident resolved | [Name] |

## 5 Whys

**Symptom**: [Manifestation]

1. **Why?** → [Answer 1]
2. **Why?** → [Answer 2]
3. **Why?** → [Answer 3]
4. **Why?** → [Answer 4]
5. **Why?** → **Root Cause**: [Root cause]

## Root Cause

[Clear root cause description, no blame]

## Contributing Factors

- [Factor 1]
- [Factor 2]

## Impact Analysis

- Users affected: [N]
- Services affected: [list]
- Data integrity: [OK / At risk / Compromised]
- SLA breach: [Yes/No]

## Fix Applied

[Description of temporary fix and permanent fix]

## Action Items (Lessons Learned & Improvements)

| ID | Action | Owner | Deadline | Priority |
|----|--------|-------|----------|----------|
| AI-001 | [Prevent recurrence] | [Name] | [Date] | High |
| AI-002 | [Improve detection] | [Name] | [Date] | Medium |
| AI-003 | [Improve response] | [Name] | [Date] | Medium |

## What Went Well

- [Quick response at point X]
- [Good communication]

## What Needs Improvement

- [Alert too slow]
- [Runbook not updated]
```

### Step 4 — Final RCA Gate

question({
  questions: [{
    question: "RCA draft completed. Confirm root cause and action items?",
    header: "RCA Review",
    options: [
      { label: "OK", description: "Root cause is correct, action items are realistic" },
      { label: "Fix root cause", description: "There is a deeper layer to analyze" },
      { label: "Fix action items", description: "AIs need deadline or owner adjustment" },
    ]
  }]
})
