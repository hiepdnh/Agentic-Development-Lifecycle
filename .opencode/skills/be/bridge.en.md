---
name: be:bridge
description: >
  Supports Bridge Engineer in translating Japanese client requirements, creating bilingual JP-VN documents,
  preparing deliverables per Japanese standards (設計書, 単体テスト仕様書, 成果物).
  Triggers when: user says "dịch yêu cầu JP", "tạo 設計書", "soạn tài liệu cho khách Nhật",
  "bridge engineer", "JP requirement", "translate JP spec", or types /be:bridge.
---

# /be:bridge
**Role**: Bridge Engineer (JP ↔ VN Bridge)  
**Purpose**: Supports the Bridge Engineer in translating Japanese client requirements, creating bilingual documents, and preparing deliverables per Japanese standards.

---

## Project Context

The Bridge Engineer is the bridge between the Japanese client and the VN dev team:
- **Input**: Request from JP (Japanese or English) — email, meeting notes, original 仕様書
- **Output**: Spec for VN dev team (Vietnamese) + Deliverables for JP (Japanese)
- **Standard**: Documentation per Japanese SI standards — 設計書, 単体テスト仕様書, 成果物

---

## Execution Guide

### Step 0 — Load glossary (mandatory)

Before analyzing/translating any terms, read `templates/jp-vn-en-glossary.md` to load the standard JP↔VN↔EN vocabulary.

Throughout this skill (Steps 1→4), when encountering technical/business JP terms:
- Prefer the corresponding term from the glossary
- If the term is NOT in the glossary → mark it as `[GLOSSARY?]` and suggest adding it in Step 4

### Step 1 — Gate: Determine the type of work

```
## I received a request from the Japanese client.

Type of document to create:
- 基本設計書 (Basic Design) — high-level spec, confirm with JP before dev
- 詳細設計書 (Detail Design) — detailed spec for VN dev team
- 単体テスト仕様書 (UT Spec) — test cases in standard JP format
- 変更依頼 (Change Request) — change request + impact analysis → **use `/be:changerequest` instead** for full approval trail
- 障害報告書 (Incident Report) — bug/incident report

Input language: JP / EN / VN
Output needed: Bilingual JP+VN / JP only / VN only
```

<!-- Gate: Determine the type of work -->
question({
  questions: [{
    question: "What type of document needs to be created?",
    header: "Doc type",
    options: [
      { label: "基本設計書", description: "Basic Design — high-level spec, confirm with JP before dev" },
      { label: "詳細設計書", description: "Detail Design — detailed spec for VN dev team" },
      { label: "単体テスト仕様書", description: "UT Spec — test cases in standard JP format" },
      { label: "変更依頼", description: "Change Request — use /be:changerequest for full approval trail" },
      { label: "障害報告書", description: "Incident Report — bug/incident report" }
    ]
  }, {
    question: "What is the input language?",
    header: "Input lang",
    options: [
      { label: "JP", description: "Japanese" },
      { label: "EN", description: "English" },
      { label: "VN", description: "Vietnamese" }
    ]
  }, {
    question: "What output type is needed?",
    header: "Output",
    options: [
      { label: "Bilingual JP+VN", description: "Create in both languages" },
      { label: "JP only", description: "Japanese only" },
      { label: "VN only", description: "Vietnamese only" }
    ]
  }]
})

### Step 2 — Analyze and clarify the request

Read the request and identify:

```
## Analysis of the JP Request

**Summary** (VI): [...]
**要約** (JP): [...]

**Points needing clarification with the Japanese client**:

| # | Question (VI) | 質問 (JP) |
|---|--------------|-----------|
| 1 | [...] | [...] |
| 2 | [...] | [...] |

**Assumptions I'm making** (need confirmation before documenting):
- [...]
```

<!-- Gate: Confirm how to handle unclear points -->
question({
  questions: [{
    question: "How would you like to handle the unclear points?",
    header: "Approach",
    options: [
      { label: "Send questions to JP", description: "Yes — send questions to JP first" },
      { label: "Proceed with assumptions", description: "No — proceed with stated assumptions" },
      { label: "Other", description: "Enter a different approach" }
    ]
  }]
})

### Step 3 — Create deliverables

#### 3a. Spec for VN dev

Create `docs/tasks/[TASK-ID]/requirements.md` using the standard template (see `templates/task-doc-requirements.en.md`).
Language: Vietnamese.

#### 3b. 設計書 for the Japanese client

Create `docs/tasks/[TASK-ID]/design-jp.md`:

```markdown
# 詳細設計書: [機能名]

**プロジェクト**: [Project name]  
**作成日**: [YYYY-MM-DD]  
**バージョン**: 1.0  
**作成者**: [Bridge Engineer name]  
**ステータス**: Draft / レビュー中 / 確定

---

## 1. 概要

[機能の概要を記述。背景と目的を含める。]

## 2. 対象画面

| 画面名 | URL/Route | 説明 |
|--------|-----------|------|
| | | |

## 3. 画面仕様

### 3.1 [画面名]

**項目定義**:

| 項目名 | 型 | 必須 | バリデーション | 備考 |
|--------|-----|------|----------------|------|
| | | | | |

**画面遷移**:
[遷移フローを記述]

## 4. API仕様

| エンドポイント | メソッド | リクエスト | レスポンス | 認証 |
|----------------|----------|-----------|-----------|------|
| | | | | |

## 5. エラー処理

| エラーコード | 発生条件 | メッセージ | 対応方法 |
|--------------|----------|-----------|---------|
| | | | |

## 6. 非機能要件

- **パフォーマンス**: [要件があれば]
- **セキュリティ**: [要件があれば]
- **互換性**: [要件があれば]

## 7. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|---------|--------|
| 1.0 | [Date] | 初版作成 | [Name] |
```

#### 3c. 単体テスト仕様書 (if needed)

Create `docs/tasks/[TASK-ID]/ut-spec-jp.md`:

```markdown
# 単体テスト仕様書: [機能名]

**作成日**: [YYYY-MM-DD]  
**対象**: [TASK-ID] [機能名]

## テストケース一覧

| No. | テスト項目 | 入力値 | 期待結果 | 担当者 | 結果 | 備考 |
|-----|-----------|--------|---------|--------|------|------|
| 1 | | | | | | |
| 2 | | | | | | |

## 結果凡例

- ○ : Test passed
- × : Test failed → create bug report
- — : Not applicable
```

#### 3d. Bilingual Deliverable HTML (for JP client)

Generate `docs/tasks/[TASK-ID]/deliverable.html` from the template `templates/html-bilingual.html` — this is the main format to send to the Japanese client:

- Header: title JP/VN, TASK-ID, timestamp JST, label "成果物"
- Each content item creates 1 `<div class="row">` with 2 columns (JP left, VN right) with corresponding content
- JP technical terms found in the glossary → wrap with `<span class="glossary" data-tooltip="JP=VN">` so the client can hover to see the translation
- Copy button per row (`data-copy-parent`) so the client can copy any JP/VN segment
- `@media print`: clean A4 print, 2 columns preserved, copy button hidden — client can Cmd+P → Save as PDF for the official version

The HTML file is NOT committed (`.gitignore` already covers `docs/tasks/**/*.html`). If an official version needs to be saved for the client → export as PDF and attach to email/issue.

```
✓ Generated:
  - docs/tasks/[TASK-ID]/requirements.md   (for VN dev, commit)
  - docs/tasks/[TASK-ID]/design-jp.md       (send to JP client via email, commit)
  - docs/tasks/[TASK-ID]/deliverable.html   (internal review before sending to client, DO NOT commit)
```

### Step 4 — Final Gate

<!-- Final Gate: Review checklist -->
question({
  questions: [{
    question: "Bilingual checklist complete? Confirm to finalize?",
    header: "Finalize",
    options: [
      { label: "Confirm", description: "Documents are ready to send" },
      { label: "Needs editing", description: "I will describe what needs to be changed" }
    ]
  }]
})

Checklist:
- JP ↔ VN terms consistent throughout all documents
- All terms matched against `templates/jp-vn-en-glossary.md` — no unresolved `[GLOSSARY?]` remaining
- New terms (not in glossary) listed for glossary addition
- Business logic in VN spec = 設計書 JP (no extra/missing items)
- Open questions resolved or marked as [要確認]
- JP document format follows correct standards (tables, section ordering)

Files:
- Send to JP: `docs/tasks/[TASK-ID]/design-jp.md`
- For VN dev: `docs/tasks/[TASK-ID]/requirements.md`

---

## Standard JP ↔ VN ↔ EN Vocabulary

> Full list (70+ terms): `templates/jp-vn-en-glossary.md`

Most commonly used terms:

| JP | VN | EN |
|----|----|----|
| 基本設計 | Basic Design | Basic Design |
| 詳細設計 | Detailed Design | Detail Design |
| 単体テスト仕様書 | Unit Test Specification | Unit Test Specification |
| 不具合 | Defect | Defect |
| 要確認 | To be confirmed | To be confirmed |
| 対象外 | Not applicable | N/A |
| 成果物 | Deliverable | Deliverable |
| 担当者 | Assignee | Assignee |
| 納期 | Delivery Date | Delivery Date |
| 工数 | Man-hours | Man-hours |

---

## Rules

- Do not assume when JP requirements are unclear — ask immediately
- JP technical terms (ログイン, トークン...) → keep as-is or use standard terms from the vocabulary
- VN spec must be sufficient for VN dev to work without needing to read the original JP documents
- JP documents must be sufficient for the Japanese client to confirm without needing to read the VN spec
