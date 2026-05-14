---
name: pm:handover
description: >
  Create a comprehensive project handover package (引き継ぎ): codebase map, decision log,
  glossary, open issues, contact matrix. Use when a dev leaves the team, project is transferred,
  or a JP outsource contract ends.
  Trigger when: user says "bàn giao dự án", "tạo tài liệu handover", "引き継ぎ",
  "dev nghỉ cần handover", "chuyển giao project", "project handoff",
  "project handover", "handover documents", "transfer project",
  "dev leaving handover", or type /pm:handover.
---

# Skill: /pm:handover
**Role**: PM / Bridge Engineer / Tech Lead  
**Purpose**: Create a comprehensive project handover package — sufficient for a new person to take over without needing to ask the old team.

---

## Project Context

Handover in the JP outsource model has 2 scenarios:
- **Dev leaves mid-project**: handover to a new dev within the same VN team
- **Contract ends**: handover back to the JP client or a new vendor

JP handover documents (引き継ぎ書) must be clear enough for the JP client to understand without needing a phone call.

---

## Execution Guide

### Step 0 — Load glossary

Read `templates/jp-vn-en-glossary.md` before writing any technical terms.

### Step 1 — Gate: Determine handover type

Use the `AskUserQuestion` tool:

- **Type**: Internal (dev to dev within VN team) / Client handover (handover back to JP client) / Vendor handover (transfer to new vendor)
- **Scope**: Full project / A specific module / A specific role (dev / QA / BE)
- **Deadline**: When does it need to be completed?

**Wait for confirmation.**

### Step 2 — Collect project information

Read available sources in parallel:

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
**Handover by**: [Name]  
**Handover to**: [Name]  
**Handover type**: [Internal / Client / Vendor]

---

## 1. Project Overview

| Information | Details |
|-------------|---------|
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
[list ENV vars — don't write values, only names + source of truth]

# Run locally
[specific commands]
```

## 4. Architecture and Technical Decisions

[Summary from ADRs — one line per decision + link to corresponding ADR]

| ADR | Decision | Reason | File |
|-----|----------|--------|------|
| ADR-001 | [...] | [...] | docs/decisions/ADR-001.md |

## 5. Open Tasks

| ID | Name | Status | Assignee | Notes |
|----|------|--------|----------|-------|
| [ID] | [...] | In Progress / Blocked | [Name] | [...] |

## 6. Known Issues and Tech Debt

| Issue | Severity | Resolution approach |
|-------|----------|--------------------|
| [...] | High/Medium/Low | [...] |

## 7. Release Schedule and Commitments to JP Client

| Date | Deliverable | Status | Notes |
|------|-------------|--------|-------|
| [...] | [...] | [...] | [...] |

## 8. Contact Matrix

| Role | Name | Email | Slack/Teams | Notes |
|------|------|-------|-------------|-------|
| JP Client (PM) | [...] | [...] | [...] | Timezone: JST |
| JP Client (Dev Lead) | [...] | [...] | [...] | |
| BE (Bridge Engineer) | [...] | [...] | [...] | |
| VN PM | [...] | [...] | [...] | |

## 9. Project-Specific Processes

[Things not covered in standard documentation — quirks of this project]

- [...]

## 10. Credentials and Access

> ⚠️ Do not write credentials directly — only document WHERE to get them

| Access | Source |
|--------|--------|
| Production DB | [Vault / LastPass / specific person] |
| AWS/GCP access | [...] |
| JP client portal | [...] |
```

#### 3b. `docs/handover/[DATE]-引き継ぎ書.md` (Japanese — when handing over to JP client)

```markdown
# 引き継ぎ書: [プロジェクト名]

**引き継ぎ日**: [YYYY-MM-DD]  
**担当者**: [氏名]  
**引き継ぎ先**: [氏名または会社名]

---

## 1. プロジェクト概要

[簡潔なプロジェクトの目的・背景・現状のまとめ]

## 2. システム構成

| 項目 | 詳細 |
|------|------|
| 技術スタック | [Languages, Frameworks, DB] |
| リポジトリ | [URL] |
| ステージング環境 | [URL] |
| 本番環境 | [URL] |

## 3. 未完了タスク

| ID | タスク名 | ステータス | 優先度 | 備考 |
|----|---------|-----------|--------|------|
| [ID] | [...] | 進行中/保留 | 高/中/低 | [...] |

## 4. 既知の課題

| 課題 | 重要度 | 対応方針 |
|------|--------|---------|
| [...] | 高/中/低 | [...] |

## 5. 重要な設計判断

[ADRsの要約 — なぜこのアーキテクチャにしたか]

## 6. 連絡先

| 役割 | 氏名 | メール | 備考 |
|------|------|-------|------|
| PM | [...] | [...] | |
| Bridge Engineer | [...] | [...] | |
| Tech Lead | [...] | [...] | |

## 7. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|---------|--------|
| 1.0 | [Date] | 初版作成 | [Name] |
```

### Step 4 — Completion checklist

```
## Handover Package has been prepared.

Checklist:
- [ ] All ENV variables listed (no empty sections)
- [ ] Contact matrix complete — especially JP side contacts
- [ ] Open tasks and blockers clearly documented
- [ ] Setup instructions are testable (new person can follow without asking)
- [ ] Known issues documented with severity and resolution approach
- [ ] Credentials: source documented, DO NOT write actual values

Files created:
- docs/handover/[DATE]-handover.md (VN — commit)
- docs/handover/[DATE]-引き継ぎ書.md (JP — commit, if client handover)

Confirm to finalize?
```

**Wait for confirmation.**

### Step 5 — Conclusion

```
Handover package complete.

Suggested next steps:
- Schedule a handover meeting — the person handing over walks through the document
- The recipient shadows for 1-2 sprints before fully owning
- After handover meeting: update documents based on Q&A
```

---

## Rules

- Do not assume the recipient already knows the context — explain everything as if starting fresh
- Credentials: NEVER write directly into the document
- JP deliverable: use honorific language (敬語) in Japanese documents
- After merge, update `docs/workflows/role-guide.md` if the contact matrix changes
