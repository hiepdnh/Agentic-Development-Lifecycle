---
name: pm:maintain
description: >
  Lightweight workflow for projects in maintenance/sustain phase — post go-live, only
  bug fixes and minor improvements, no active development sprints.
  Triggers when: user says "project in maintenance", "maintenance mode", "post go-live support",
  "sustain phase", "no new sprints just bug fixes", or types /pm:maintain.
---
## Summary

Lightweight workflow for projects in maintenance/sustain phase — post go-live, only bug fixes and minor improvements, no active development sprints. Triggers when: user says "project in maintenance", "maintenance mode", "post go-live support", "sustain phase", "no new sprints just bug fixes", or types /pm:maintain.

## Workflow

# /pm:maintain
**Role**: PM / Dev / BE
**Purpose**: Minimal workflow for the maintenance phase — enough control without the overhead of an active sprint.

---

## Project Context

Maintenance phase differs from active development:
- No regular sprint planning / backlog grooming
- Requests come in ad-hoc — JP client emails bug reports anytime
- Smaller team — typically 1-2 devs + 1 part-time BE
- JP outsource: SLA / 保守契約 defines response time and fix time
- Need clear history tracking for billing / monthly client reports

---

## Maintenance Workflow

```
JP Bug Report / Request
    → Triage (classify + priority)
    → Fix (tiny: patch directly / normal: dev:analyze → implement)
    → QA verify
    → Release (hotfix or monthly batch)
    → 月次報告書 (monthly report sent to JP)
```

---

## Execution Guide

### Step 1 — Gate: Determine request type

```
question({
  questions: [{
    question: "Request type?",
    header: "Type",
    options: [
      { label: "Bug fix", description: "Fix a bug" },
      { label: "Minor improvement", description: "Small enhancement" },
      { label: "Performance issue", description: "Performance problem" },
      { label: "Security patch", description: "Security vulnerability fix" },
      { label: "Question from JP", description: "Question from Japanese client" },
    ]
  }, {
    question: "Source?",
    header: "Source",
    options: [
      { label: "JP client reported", description: "Japanese client reported the issue" },
      { label: "User reported", description: "End user reported the issue" },
      { label: "Monitoring alert", description: "Alert from monitoring" },
      { label: "Internal discovery", description: "Found internally" },
    ]
  }, {
    question: "SLA: Is there an SLA obligation? Required response time?",
    header: "SLA",
    options: [
      { label: "Yes", description: "Has SLA obligation, must meet response time" },
      { label: "No", description: "No binding SLA" },
    ]
  }]
})
```

### Step 2 — Triage

Classify using the Maintenance Priority Matrix:

```
## Triage: [Issue name]

**Priority**: P1 / P2 / P3 / P4

| Priority | Definition | Target fix time |
|----------|-----------|----------------|
| P1 — Critical | Production down / Data loss / Security breach | Fix immediately, within the day |
| P2 — High | Feature broken, no workaround | Fix within 1-3 days |
| P3 — Medium | Feature broken, has workaround | Fix within 1-2 weeks |
| P4 — Low | UI glitch / minor inconvenience | Batch into monthly release |

**Classification**: [P1/P2/P3/P4]
**Reason**: [...]
**Assignee**: [Dev name]
**Fix deadline (JST)**: [Date]
```

### Step 3 — Fix workflow by priority

#### P1 — Critical (Hotfix)

```
P1 Hotfix Protocol:
1. Notify BE immediately → BE notifies JP client within 30 minutes
2. Dev fixes (use tiny lane — patch directly)
3. QA quick verify (smoke test)
4. Deploy hotfix immediately
5. Post-mortem: write to docs/reports/incident-[date].md
6. Send 障害報告書 to JP client (use /ops:incident)
```

#### P2/P3 — Normal fix

Apply a simplified dev workflow:

```
For tasks with analysis.md (normal risk):
  /dev:analyze → /dev:implement → /dev:review → /dev:pr → merge → deploy

For small patches (tiny):
  Fix directly → /dev:review → /dev:pr → merge → batch into monthly release
```

#### P4 — Batch into monthly release

Record in `docs/maintenance/[YEAR-MONTH]-backlog.md`:

```markdown
# Maintenance Backlog: [YYYY-MM]

| ID | Description | Reporter | Priority | Status |
|----|-------------|----------|----------|--------|
| M-001 | [...] | [JP client / internal] | P4 | Open |
```

### Step 4 — Monthly Report

Create `docs/reports/monthly-[YYYY-MM].md` using template `templates/monthly-maintenance-report.en.md`.

Fill in the 5 sections:
1. **Objectives and Results This Month** — SLA %, bugs resolved, CRs implemented vs target
2. **Work Performed** — list every task/CR with ID, type, effort in 人日, result
3. **Incidents/Issues** — list all incidents with severity, RCA summary, status; calculate MTTR
4. **System Health** — assess Performance/Security/Dependencies/Backup status
5. **Next Month's Plan** — list planned work with priority and estimate; note any risks

Translate key sections to Japanese if the report will be sent to the JP client (BE reviews before sending).

### Step 5 — Final Gate

```
## Maintenance task complete.
```

```
question({
  questions: [{
    question: "Should this task be recorded in the monthly report?",
    header: "Monthly?",
    options: [
      { label: "Yes", description: "Already added to the monthly backlog report" },
      { label: "No", description: "P1/P2 hotfix — report separately" },
    ]
  }, {
    question: "Need to notify JP client about this fix?",
    header: "Notify JP",
    options: [
      { label: "Yes", description: "BE will email the JP client" },
      { label: "No need", description: "No separate notification needed" },
      { label: "Wait for monthly report", description: "Will include in the monthly report" },
    ]
  }, {
    question: "Need to update baseline docs?",
    header: "Docs?",
    options: [
      { label: "Yes", description: "Run /docs:update" },
      { label: "No", description: "No spec changes" },
    ]
  }]
})
```

---

## Rules

- P1: Notify JP client before the fix is complete — do not stay silent
- Every fix needs a ticket (GitHub Issue) — even small ones — for billing and monthly reporting
- Monthly report sent on the first business day of the following month (JST)
- When monthly man-hours exceed the 保守契約 limit → alert PM immediately for CR negotiation
