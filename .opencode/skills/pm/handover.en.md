---
name: pm:handover
description: >
  Create a comprehensive project handover package (引き継ぎ): codebase map, decision log,
  glossary, open issues, contact matrix. Use when a dev leaves the team, project is transferred,
  or a JP outsource contract ends.
  Triggers when: user says "handover project", "create handover docs", "引き継ぎ",
  "dev leaving needs handover", "project transfer", "project handoff", or types /pm:handover.
---

# /pm:handover
**Role**: PM / Bridge Engineer / Tech Lead
**Purpose**: Create a comprehensive project handover package — sufficient for a new person to take over without needing to ask the old team.

---

## VTI Context

Handover in the JP outsource model has 2 scenarios:
- **Dev leaves mid-project**: handover to a new dev within the same VN team
- **Contract ends**: handover back to the JP client or a new vendor

JP handover docs (引き継ぎ書) must be clear enough for the JP client to understand without needing a phone call.

---

## Execution Guide

### Step 0 — Load glossary

Read `templates/jp-vn-en-glossary.md` before writing any technical terms.

### Step 1 — Gate: Determine handover type

```
question({
  questions: [{
    question: "Handover type?",
    header: "Type",
    options: [
      { label: "Internal", description: "Dev to dev within VN team" },
      { label: "Client handover", description: "Handover back to JP client" },
      { label: "Vendor handover", description: "Transfer to new vendor" },
    ]
  }, {
    question: "Scope?",
    header: "Scope",
    options: [
      { label: "Full project", description: "Entire project" },
      { label: "One module", description: "Specific module" },
      { label: "One role", description: "Specific role (dev / QA / BE)" },
    ]
  }, {
    question: "Deadline: when must it be completed? (YYYY-MM-DD)",
    header: "Deadline",
    options: [
      { label: "Enter date", description: "Provide a specific date" },
    ]
  }]
})
```

### Step 2 — Collect project information

Read from available sources in parallel:

```
Sources to read:
- docs/baseline/codebase-overview.md (if available)
- docs/decisions/ADR-*.md — all ADRs
- docs/tasks/*/requirements.md — open/in-progress tasks
- docs/workflows/sprint-lifecycle.md
- templates/jp-vn-en-glossary.md
- git log --oneline -50 (recent history)
- git branch -a (active branches)
```

If `codebase-overview.md` is missing → suggest running `/ba:reverse` first.

### Step 3 — Create Handover Package

#### 3a. `docs/handover/[DATE]-handover.md` (Vietnamese — for VN team)

```markdown
# Handover Document: [Project name]

**Handover date**: [YYYY-MM-DD]
**Handed over by**: [Name]
**Received by**: [Name]
**Handover type**: [Internal / Client / Vendor]

---

## 1. Project Overview

| Info | Details |
|------|---------|
| JP Client | [Name] |
| Bridge Engineer | [Name] |
| Tech stack | [Languages, frameworks, DB] |
| Repo | [URL] |
| Staging URL | [URL] |
| Production URL | [URL] |
| CI/CD | [Platform + pipeline URL] |

## 2. Codebase Structure

[Summary from codebase-overview.md — main modules, entry points, folder structure]

## 3. Dev Environment Setup

```bash
# Clone and setup
[specific commands]

# Required ENV variables
[list ENV vars — do not write values, only names + sources]

# Run locally
[specific commands]
```

## 4. Architecture and Technical Decisions

[Summary from ADRs — each decision 1 line + link to corresponding ADR]

| ADR | Decision | Reason | File |
|-----|----------|--------|------|
| ADR-001 | [...] | [...] | docs/decisions/ADR-001.md |

## 5. Open Tasks

| ID | Name | Status | Assignee | Notes |
|----|------|--------|----------|-------|
| [ID] | [...] | In Progress / Blocked | [Name] | [...] |

## 6. Known Issues and Tech Debt

| Issue | Severity | Mitigation |
|-------|----------|------------|
| [...] | High/Medium/Low | [...] |

## 7. Release Schedule and JP Client Commitments

| Date | Deliverable | Status | Notes |
|------|------------|--------|-------|
| [...] | [...] | [...] | [...] |

## 8. Contact Matrix

| Role | Name | Email | Slack/Teams | Notes |
|------|------|-------|-------------|-------|
| JP Client (PM) | [...] | [...] | [...] | Timezone: JST |
| JP Client (Dev Lead) | [...] | [...] | [...] | |
| BE (Bridge Engineer) | [...] | [...] | [...] | |
| PM VN | [...] | [...] | [...] | |

## 9. Project-Specific Processes

[Things not covered in standard docs — quirks of this project]

- [...]

## 10. Credentials and Access

> ⚠️ Do not write credentials directly — only state WHERE to get them

| Access | Source |
|--------|--------|
| Production DB | [Vault / LastPass / specific person] |
| AWS/GCP access | [...] |
| JP client portal | [...] |
```

#### 3b. `docs/handover/[DATE]-引き継ぎ書.md` (Japanese — when handing over to JP client)

```markdown
# 引き継ぎ書: [Project name]

**引き継ぎ日**: [YYYY-MM-DD]
**担当者**: [Name]
**引き継ぎ先**: [Name or company name]

---

## 1. プロジェクト概要

[Concise summary of project objectives, background, and current status]

## 2. システム構成

| Item | Details |
|------|---------|
| 技術スタック | [Languages, Frameworks, DB] |
| リポジトリ | [URL] |
| ステージング環境 | [URL] |
| 本番環境 | [URL] |

## 3. 未完了タスク

| ID | Task name | Status | Priority | Notes |
|----|-----------|--------|----------|-------|
| [ID] | [...] | In Progress/Blocked | High/Medium/Low | [...] |

## 4. 既知の課題

| Issue | Severity | Mitigation |
|-------|----------|------------|
| [...] | 高/中/低 | [...] |

## 5. 重要な設計判断

[ADR summaries — why this architecture was chosen]

## 6. 連絡先

| Role | Name | Email | Notes |
|------|------|-------|-------|
| PM (VTI) | [...] | [...] | |
| Bridge Engineer | [...] | [...] | |
| Tech Lead | [...] | [...] | |

## 7. 変更履歴

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | [Date] | Initial version | [Name] |
```

### Step 4 — Completion Checklist

```
## Handover Package prepared.

Checklist:
- [ ] All ENV variables listed (no empty sections)
- [ ] Contact matrix complete — especially JP side contacts
- [ ] Open tasks and blockers clearly documented
- [ ] Setup instructions tested (newcomer can follow without asking)
- [ ] Known issues documented with severity and mitigation
- [ ] Credentials: documented sources, NOT actual values

Files created:
- docs/handover/[DATE]-handover.md (VN — commit)
- docs/handover/[DATE]-引き継ぎ書.md (JP — commit, if client handover)
```

```
question({
  questions: [{
    question: "Confirm to finalize the handover package?",
    header: "Confirm",
    options: [
      { label: "Finalize", description: "Complete and save the handover package" },
      { label: "Need editing", description: "Need adjustments before finalizing" },
    ]
  }]
})
```

### Step 5 — Conclusion

```
Handover package complete.

Suggested next steps:
- Schedule a handover meeting — the handing-over person walks through the docs
- The receiver shadows 1-2 sprints before fully owning
- After the handover meeting: update docs based on Q&A
```

---

## Rules

- Do not assume the receiver already knows the context — explain everything as if starting fresh
- Credentials: NEVER write directly into the document
- JP deliverable: use honorific language (敬語) in Japanese documents
- After merging, update `docs/workflows/role-guide.md` if the contact matrix changes
