---
name: be:changerequest
description: >
  Manage 変更依頼 (Change Requests) — analyze impact, create approval trail,
  version control spec changes. Use when specs change mid-sprint or after sign-off.
  Trigger when: user says "khách JP yêu cầu thay đổi", "tạo change request", "変更依頼",
  "spec thay đổi giữa chừng", "CR mới từ JP", "change request", or types /be:changerequest.
---

# Skill: /be:changerequest
**Role**: Bridge Engineer / PM  
**Purpose**: Handle change requests from JP clients in a controlled manner — clear impact analysis, full approval trail, no silent changes merged into specs.

---

## VTI Context

Spec changes after sign-off are the highest risk in JP outsource:
- JP clients often request small changes via email/chat without a formal CR
- VN devs implement "to be fast" without an approval trail → later the client questions it
- Impact is not estimated → scope creep goes uncontrolled

**Core Principle**: Every change after sign-off must have a CR document before dev touches code.

---

## Execution Guide

### Step 0 — Load glossary

Read `templates/jp-vn-en-glossary.md` before handling technical terminology.

### Step 1 — Gate: Collect CR information

Use the `AskUserQuestion` tool:

- **Request source**: Email from JP / Meeting / Slack/Teams / Formal 変更依頼書
- **Change type**: New feature addition / Existing spec modification / Scope removal / New performance requirement / UI/UX adjustment
- **Urgency**: Needed in current sprint / Next sprint / Flexible

**Wait for confirmation.**

### Step 2 — Impact Analysis

Read:
- `docs/tasks/[TASK-ID]/requirements.md` — the original spec being changed
- `docs/tasks/[TASK-ID]/analysis.md` — implementation already planned or in progress
- `docs/decisions/ADR-*.md` — related technical decisions

Analyze across 4 dimensions:

```
## Impact Analysis: CR-[NUMBER]

### Scope Impact
- Affected files/modules: [list]
- Changed / added / removed ACs: [diff from original spec]
- Test cases needing update: [list]

### Effort Impact
- Additional estimate: [X man-hours / man-days]
- Doable in current sprint: [Yes / No / Partial]
- If No: needs to be moved to sprint [N+1 / TBD]

### Risk Impact
- New risks: [list]
- Affected dependencies: [list]
- Regression risk: [Low / Medium / High]

### Schedule Impact
- Current deadline: [Date]
- Impact on deadline: [None / Delayed X days / Needs renegotiation]
```

### Step 3 — Gate: Confirm impact before drafting CR

```
## I have analyzed the impact of the change request.

[Display impact analysis from Step 2]

| # | Question | Options |
|---|---------|---------|
| 1 | Is the impact analysis accurate? | A: Accurate / B: Needs adjustment: ___ / C: Other: ___ |
| 2 | Who will approve the CR from VTI side? | _(enter PM / Tech Lead name)_ |
| 3 | Should we send the estimate to JP before approval? | A: Yes — send estimate email first / B: No — proceed with CR doc / C: Other: ___ |
```

**Wait for confirmation.**

### Step 4 — Create Change Request Documents

#### 4a. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md` (Vietnamese — internal)

```markdown
# Change Request: CR-[NUMBER]

**Project**: [Project name]  
**Original Task**: [TASK-ID]  
**CR Number**: CR-[NUMBER]  
**Date Created**: [YYYY-MM-DD JST]  
**Created by**: [Bridge Engineer name]  
**Status**: Draft / Pending Approval / Approved / Rejected

---

## 1. Change Request Description

**From JP client**: [Verbatim or summary of the request in Vietnamese]

**Source**: [Email/Meeting dated... / Slack message / ...]

## 2. Changes from Original Spec

| # | Original Spec | New Spec | Type |
|---|--------------|----------|------|
| 1 | [...] | [...] | Add / Modify / Remove |
| 2 | [...] | [...] | Add / Modify / Remove |

## 3. Impact Analysis

### Scope
- Affected files: [list]
- ACs changed: [list]
- Test cases needing update: [list]

### Effort
- Estimate: [X man-hours]
- Sprint: Sprint [N] / Sprint [N+1]

### Risk
- New risks: [list]
- Regression risk: [Low / Medium / High]

### Schedule
- Impact on deadline: [Description]

## 4. Approval

| Role | Name | Decision | Date | Notes |
|------|------|----------|------|-------|
| VTI PM | [...] | Approve / Reject / Pending | [...] | [...] |
| Tech Lead | [...] | Approve / Reject / Pending | [...] | [...] |
| JP Client | [...] | Approve / Reject / Pending | [...] | [...] |

## 5. History

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0 | [Date] | Initial creation | [Name] |
```

#### 4b. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md` (Japanese — send to JP client)

```markdown
# 変更依頼書: CR-[NUMBER]

**プロジェクト**: [Project name]  
**対象タスク**: [TASK-ID]  
**変更依頼番号**: CR-[NUMBER]  
**作成日**: [YYYY-MM-DD]  
**作成者**: [Bridge Engineer name]  
**ステータス**: ドラフト / 承認待ち / 承認済み / 却下

---

## 1. 変更内容

[Describe the change overview in Japanese]

## 2. 変更前・変更後の比較

| # | 変更前 | 変更後 | 変更種別 |
|---|--------|--------|---------|
| 1 | [...] | [...] | 追加 / 修正 / 削除 |

## 3. 影響範囲

### 工数への影響
- 追加工数: [X 人日]
- 対応スプリント: スプリント [N]

### スケジュールへの影響
- 現在の納期: [Date]
- 変更後の影響: [影響なし / X日遅延 / 要再調整]

### リスク
- [Risk details]

## 4. 承認欄

| 役割 | 氏名 | 承認 | 日付 | コメント |
|------|------|------|------|---------|
| VTI PM | [...] | 承認/却下/未回答 | [...] | [...] |
| Client PM | [...] | 承認/却下/未回答 | [...] | [...] |

## 5. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|---------|--------|
| 1.0 | [Date] | 初版作成 | [Name] |
```

### Step 5 — Final Gate

```
## Change Request CR-[NUMBER] has been drafted.

Files created:
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md (internal — commit)
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md (send to JP — commit)

Checklist:
- [ ] Impact analysis reviewed by PM and Tech Lead
- [ ] Estimate confirmed (not "TBD")
- [ ] CR-jp.md translated using correct glossary terminology
- [ ] Approval table includes all 3 parties: VTI PM + Tech Lead + JP Client

Next steps:
- [ ] Send CR-jp.md to JP client for confirmation
- [ ] After JP client approves: update requirements.md (note "CR-[NUMBER] approved [date]")
- [ ] Create new GitHub Issue or update original issue
```

**Wait for confirmation.**

---

## Rules

- **DO NOT** implement changes before the CR is approved by both VTI PM and JP client
- Every CR must have a number (CR-001, CR-002...) — track in `docs/tasks/[TASK-ID]/cr/`
- If the CR changes architecture → trigger `/arch:adr` after approval
- If the CR adds a security-sensitive feature → trigger `/sec:review` after implementation
