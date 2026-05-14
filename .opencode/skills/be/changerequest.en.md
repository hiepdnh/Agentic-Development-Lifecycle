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

## VTI Context

Spec changes after sign-off are the highest risk in JP outsourcing:
- Japanese clients often request small changes via email/chat without a formal CR
- VN dev implements "quickly" without an approval trail → later the client questions it
- Impact is not estimated → scope creep becomes uncontrollable

**Core Principle**: Every change after sign-off must have a CR document before dev touches code.

---

## Execution Guide

### Step 0 — Load glossary

Read `E:\AI Bootcamp\ClaudeSkill\templates\jp-vn-en-glossary.md` before handling technical terminology.

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
    question: "Who is the VTI-side CR approver?",
    header: "VN Approver",
    options: [
      { label: "PM", description: "VTI PM approves" },
      { label: "Tech Lead", description: "VTI Tech Lead approves" },
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

```markdown
# Change Request: CR-[NUMBER]

**Dự án**: [Project name]  
**Task gốc**: [TASK-ID]  
**CR Number**: CR-[NUMBER]  
**Ngày tạo**: [YYYY-MM-DD JST]  
**Người tạo**: [Bridge Engineer name]  
**Status**: Draft / Pending Approval / Approved / Rejected

---

## 1. Mô tả yêu cầu thay đổi

**Từ khách JP**: [Original description or Vietnamese summary of the request]

**Nguồn**: [Email/Meeting date... / Slack message / ...]

## 2. Thay đổi so với spec gốc

| # | Spec gốc | Spec mới | Loại |
|---|---------|---------|------|
| 1 | [...] | [...] | Thêm / Sửa / Bỏ |
| 2 | [...] | [...] | Thêm / Sửa / Bỏ |

## 3. Impact Analysis

### Scope
- Files bị ảnh hưởng: [list]
- ACs thay đổi: [list]
- Test cases cần cập nhật: [list]

### Effort
- Estimate: [X man-hours]
- Sprint: Sprint [N] / Sprint [N+1]

### Risk
- Risk mới: [list]
- Regression risk: [Low / Medium / High]

### Schedule
- Impact đến deadline: [Description]

## 4. Approval

| Role | Tên | Quyết định | Ngày | Ghi chú |
|------|-----|-----------|------|---------|
| VTI PM | [...] | Approve / Reject / Pending | [...] | [...] |
| Tech Lead | [...] | Approve / Reject / Pending | [...] | [...] |
| JP Client | [...] | Approve / Reject / Pending | [...] | [...] |

## 5. Lịch sử

| Version | Ngày | Thay đổi | Người thực hiện |
|---------|------|---------|----------------|
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
**ステータス**: Draft / 承認待ち / 承認済み / 却下

---

## 1. 変更内容

[Description of the change in Japanese]

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
| お客様 PM | [...] | 承認/却下/未回答 | [...] | [...] |

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
- [ ] CR-jp.md translated using correct terms from the glossary
- [ ] Approval table includes all 3 parties: VTI PM + Tech Lead + JP Client

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

- **DO NOT** implement changes before the CR is approved by both VTI PM and the Japanese client
- Every CR must have a number (CR-001, CR-002...) — track in `docs/tasks/[TASK-ID]/cr/`
- If the CR changes the architecture → trigger `/arch:adr` after approval
- If the CR adds a security-sensitive feature → trigger `/sec:review` after implementation
