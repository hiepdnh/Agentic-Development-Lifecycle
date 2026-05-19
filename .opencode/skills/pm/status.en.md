---
name: pm:status
description: >
  Aggregate sprint status from multiple sources, generate a quick status report for stakeholders.
  Triggers when: user says "sprint report", "status report", "progress summary",
  "sprint health", "update for PM", "report for client", or types /pm:status.
---
## Summary

Aggregate sprint status from multiple sources, generate a quick status report for stakeholders. Triggers when: user says "sprint report", "status report", "progress summary", "sprint health", "update for PM", "report for client", or types /pm:status.

## Workflow

# /pm:status
**Role**: Project Manager
**Purpose**: Aggregate sprint/project status from multiple sources, generate a quick report for stakeholders.

---

## Execution Guide

### Step 1 — Collect information

Ask the user to provide (or read from available context):
- List of issues/tasks in the sprint and their status
- Known blockers
- Time remaining in the sprint

### Step 2 — Gate: Confirm report scope

```
## I will create a status report for Sprint [N].

Before summarizing, let me know:
```

```
question({
  questions: [{
    question: "Who is this report for?",
    header: "Audience",
    options: [
      { label: "Team internal", description: "Internal team report" },
      { label: "Stakeholder", description: "Stakeholder report" },
      { label: "Management", description: "Management report" },
      { label: "JP client", description: "Report for Japanese client" },
    ]
  }, {
    question: "Preferred format?",
    header: "Format",
    options: [
      { label: "HTML dashboard", description: "Recommended for stakeholders/JP clients" },
      { label: "Markdown", description: "Post to Slack/Notion" },
      { label: "Plain text", description: "Quick summary" },
    ]
  }, {
    question: "Any specific metrics to highlight?",
    header: "Metrics",
    options: [
      { label: "Velocity", description: "Highlight sprint velocity" },
      { label: "Burn rate", description: "Highlight burn rate" },
      { label: "Blockers", description: "Highlight blockers" },
      { label: "None", description: "No special metrics needed" },
    ]
  }]
})
```

### Step 3 — Generate Status Report

**Format determined in Gate 2**:
- **HTML dashboard** (default for stakeholders / JP clients): generate `docs/reports/sprint-[N]-status.html` from template `templates/html-artifact.html`
- **Markdown**: generate inline in chat or save `docs/reports/sprint-[N]-status.md` — use Markdown template below
- **Text**: one-screen summary in chat

#### HTML format

Inject into template:
- Header: Sprint [N] · Velocity badge (X/Y points) · Burn rate pill (ok/warn/err)
- Section "Kanban view": 4 columns Done / In Progress / Blocked / To Do using CSS grid, each card is a task
- `<table data-sortable>` for Risks & Actions with Impact column using pills
- Filter `<input type="search" data-filter="...">` for task list
- `@media print` ensures clean A4 printing when forwarding email to JP clients

HTML file is NOT committed (if inside `docs/tasks/`). Save to `docs/reports/` and it can be committed — decide based on project storage needs.

#### Markdown format (fallback)

```markdown
# Sprint [N] Status Report
**Date**: [Date]
**PM**: [Name]

## 🟢 Overview
[1-2 sentence summary of overall status]

## ✅ Done
| Task | Assignee | Story Points |
|------|----------|-------------|
| | | |

## 🔄 In Progress
| Task | Assignee | % Done | Est. Completion |
|------|----------|--------|-------------|
| | | | |

## ⛔ Blocked
| Task | Blocker | Action Needed From | Deadline |
|------|---------|-----------------|----------|
| | | | |

## 📋 To Do
| Task | Priority | Sprint Risk |
|------|----------|------------|
| | | |

## 📊 Sprint Health
- **Velocity**: [X] points done / [Y] points planned
- **Burn rate**: On track / At risk / Behind
- **Scope change**: [Describe if any]

## 🚨 Risks & Actions
| Risk | Impact | Mitigation | Owner |
|------|--------|------------|-------|
| | | | |

## 📅 Important Dates
- [Upcoming events/deadlines]
```

### Step 4 — Final Gate

```
question({
  questions: [{
    question: "Are there any issues whose status I misunderstood?",
    header: "Accuracy",
    options: [
      { label: "No", description: "Status is accurate" },
      { label: "Yes", description: "Some issues have wrong status — need correction" },
    ]
  }, {
    question: "Any risks you know of that I haven't mentioned?",
    header: "Risks",
    options: [
      { label: "No", description: "No additional risks" },
      { label: "Yes", description: "There are risks to add to the report" },
    ]
  }, {
    question: "Is the tone appropriate for the audience?",
    header: "Tone",
    options: [
      { label: "Appropriate", description: "Tone is suitable" },
      { label: "Need more formal", description: "Need to adjust tone to be more formal" },
      { label: "Need more casual", description: "Need to adjust tone to be more casual" },
    ]
  }]
})
```
