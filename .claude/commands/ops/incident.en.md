---
name: ops:incident
description: >
  Guide for triaging incidents, parallel 3-direction investigation, and creating an RCA template with 5 Whys.
  Triggers when: user says "there's an incident", "production system error", "triage an issue",
  "write RCA", "root cause analysis", "on-call incident", or types /ops:incident.
---

# Skill: /ops:incident
**Role**: DevOps / On-call Engineer  
**Purpose**: Guide for triaging incidents, creating an RCA template, and documenting lessons learned.

---

## Execution Guide

### Step 1 — Quick triage (DO NOT stop to ask, run immediately)

When an incident occurs, triage in order:

```
## INCIDENT TRIAGE

| # | Question | Options |
|---|---------|---------|
| 1 | IMPACT: How many users/services are affected? | _(type here)_ |
| 2 | SEVERITY | A: P1 — complete outage / B: P2 — degraded / C: P3 — minor / D: Other: ___ |
| 3 | STARTED: When did it start? | _(enter time)_ |
| 4 | SYMPTOMS: What specific symptoms? | _(type here)_ |
```

### Step 2 — Assist Investigation

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

After the incident is resolved, create `docs/decisions/INC-[XXX]-RCA.md`:

```markdown
# Root Cause Analysis: INC-[XXX]

**Severity**: P[N]  
**Duration**: [Start] → [End] ([X minutes/hours])  
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

**Symptom**: [Observable symptom]

1. **Why?** → [Answer 1]
2. **Why?** → [Answer 2]
3. **Why?** → [Answer 3]
4. **Why?** → [Answer 4]
5. **Why?** → **Root Cause**: [Root cause]

## Root Cause

[Clear description of root cause, no blame assigned]

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

## Action Items (Lessons & Improvements)

| ID | Action | Owner | Deadline | Priority |
|----|--------|-------|----------|----------|
| AI-001 | [Prevent recurrence] | [Name] | [Date] | High |
| AI-002 | [Improve detection] | [Name] | [Date] | Medium |
| AI-003 | [Improve response] | [Name] | [Date] | Medium |

## What Went Well

- [Fast response at point X]
- [Good communication]

## What Needs Improvement

- [Alert was too slow]
- [Runbook not updated]
```

### Step 4 — Final RCA gate

```
RCA draft completed.

Important questions:

| # | Question | Options |
|---|---------|---------|
| 1 | "5 Whys" — is root cause [X] correct? | A: Correct / B: There's a deeper layer — that layer is: ___ / C: Other: ___ |
| 2 | Action Items — is AI-001 realistic within the deadline? | A: Yes / B: No — needs adjustment: ___ / C: Other: ___ |
| 3 | Is there any contributing factor that was missed? | A: No / B: Yes — factor: ___ / C: Other: ___ |
| 4 | Who needs to review this RCA before wider sharing? | _(enter name)_ |
```
