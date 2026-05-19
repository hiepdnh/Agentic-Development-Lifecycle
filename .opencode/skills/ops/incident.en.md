---
name: ops:incident
description: >
  Guidance for incident triage, parallel 3-direction investigation, RCA template with 5 Whys.
  Trigger when: user says "there is an incident", "production system error", "triage incident",
  "write RCA", "root cause analysis", "on-call incident", or types /ops:incident.
---
## Summary

Guidance for incident triage, parallel 3-direction investigation, RCA template with 5 Whys. Trigger when: user says "there is an incident", "production system error", "triage incident", "write RCA", "root cause analysis", "on-call incident", or types /ops:incident.

## Workflow

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

After the incident is resolved, create `docs/reports/INC-[XXX]-RCA.md` using template `templates/incident-report.en.md`.

Fill in:
- **Frontmatter**: incidentId, severity (P1-P4), startTime/endTime/durationMinutes, incidentCommander
- **Summary**: 2-3 sentences — what happened, when, user impact
- **Impact**: number of affected users, affected features, SLA impact, whether JP client was notified
- **Timeline**: actual timestamps from incident; include detect → ack → root cause found → fix → resolved
- **Root Cause**: trigger event + 5 Whys analysis + contributing factors
- **What Went Well / What Needs Improvement**: blameless — focus on the system, not individuals
- **Action Items**: at minimum AI-001 (prevent recurrence), AI-002 (improve detection), AI-003 (update runbook)
- **Supporting Documents**: links to logs, dashboards, related PRs

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
