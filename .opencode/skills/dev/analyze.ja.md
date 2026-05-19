---
name: dev:analyze
description: >
  タスク/Issue を分析し、トレードオフ付き 2-3 案を提案。マルチエージェントでコンテキストを清潔に保つ。
  トリガー: ユーザーが「タスク分析」「issue を分析して」「実装方法を提案」「実装オプション」「方針を検討」と言った時、または /dev:analyze と入力時。
---
## 概要

タスク/Issue を分析し、トレードオフ付き 2-3 案を提案。マルチエージェントでコンテキストを清潔に保つ。 トリガー: ユーザーが「タスク分析」「issue を分析して」「実装方法を提案」「実装オプション」「方針を検討」と言った時、または /dev:analyze と入力時。

## ワークフロー

## 概要

タスク/Issue を分析し、トレードオフ付き 2-3 案を提案。マルチエージェントでコンテキストを清潔に保つ。 トリガー: ユーザーが「タスク分析」「issue を分析して」「実装方法を提案」「実装オプション」「方針を検討」と言った時、または /dev:analyze と入力時。

## ワークフロー

# /dev:analyze
**ロール**: Developer
**目的**: タスク/Issue を分析し、実装オプションを提案する。マルチエージェントでコンテキストを清潔に保つ。

---

## ブレインダンプパターン（入力契約）

スキル実行前、開発者は幻覚を減らすために以下のコンテキストブロックを提供すべき:

```
Tech stack: [言語、フレームワーク、DB、インフラ]
Relevant files: [既知の関連ファイルパス]
Constraints: [パフォーマンス、セキュリティ、後方互換性、デッドライン]
Known gotchas: [コードベースの既知の問題]
Issue/Task: [リンクまたは内容ペースト]
```

コンテキスト不足時 → スキルは続行前に質問する。

---

## マルチエージェントアーキテクチャ

```
dev-analyze (オーケストレータ)
├── [Subagent 1] task-reader    → Issue 解析 → 構造化された理解
├── [Subagent 2] code-scout     → 関連コード探索（読取専用）
└── [Subagent 3] planner        → 統合 → オプション提案
```

各サブエージェントは **必要最小限のコンテキストのみ** 受領、圧縮された結果を返す。

## サブエージェント生成方法

OpenCode の **task tool** で各サブエージェントを生成。プロンプトは自己完結 — 完全な会話履歴を渡さない。

task-reader 生成例:
```
task(
  description: "Parse GitHub issue into structured JSON",
  prompt: "Read this issue and return structured JSON per agents/task-reader.md spec.\n\nISSUE CONTENT:\n[paste issue content here]",
  subagent_type: "explorer"
)
```

code-scout 生成例:
```
task(
  description: "Find relevant files for auth task",
  prompt: "Find files relevant to this task. Return JSON per agents/code-scout.md spec.\n\nTASK SUMMARY: [summary]\nTECH STACK: [stack]\nAFFECTED AREAS: [areas]",
  subagent_type: "explorer"
)
```

planner 生成例:
```
task(
  description: "Synthesize task + code map into implementation options",
  prompt: "Create 2-3 implementation options per agents/planner.md spec.\n\nTASK: [task-reader JSON]\nCODE MAP: [code-scout JSON]\nCONSTRAINTS: [from Gate 1]",
  subagent_type: "oracle"
)
```

---

## 実施手順

### ステップ 0 — リスク分類

`docs/risk-classifier.ja.md` に従ってリスク分類:

```
## リスク分類 — [TASK-ID]

**入力タイプ**: [new-spec | spec-slice | change-request | maintenance | new-initiative | framework-improvement]
**リスクチェックリスト**: [YES 項目のみ列挙 — 例: R-06 ✅ (shared config)]
**レーン**: tiny | normal | high-risk
**理由**: [1 文]
```

- **Tiny レーン** → 全スキルスキップ、直接パッチ
- **High-risk レーン** → 即停止、`⚠️ Ask First Gate` 表示、シニア確認まで停止
- **Normal レーン** → ステップ 1 へ続行

### ステップ 1 — サブエージェント生成: task-reader

> 「次の Issue/タスクを読み、構造化 JSON を返す:
> - task_id, title, type (feature/bug/refactor)
> - business_goal（なぜ必要か）
> - acceptance_criteria（リスト）
> - technical_hints（あれば）
> - unknowns（未解決事項）
>
> Issue content: [ペースト]」

### ステップ 2 — ゲート 1: タスク理解の確認

`question` tool で確認:

```
question({
  questions: [{
    question: "タスクの目的の理解は正しいですか?",
    header: "理解確認",
    options: [
      { label: "正しい", description: "コードベーススキャン続行" },
      { label: "違う", description: "目的の修正が必要" },
      { label: "制約不足", description: "未記載の制約あり" },
    ]
  }, {
    question: "事前に読むべき画面/API 文書はありますか?",
    header: "Docs",
    options: [
      { label: "不要", description: "続行" },
      { label: "あり", description: "link/path 提供予定" },
    ]
  }]
})
```

**確認待ち。**

### ステップ 3 — サブエージェント生成: code-scout

> 「コードベース内で次に関連するファイル/モジュールを探索: [task summary]。
> 返却:
> - 各関連箇所の file_path:line_number
> - 関連理由の簡潔な説明
> - 従うべき既存パターン/規約
>
> **読取のみ、変更なし**。」

### ステップ 4 — ゲート 2: コードマップ確認

```
question({
  questions: [{
    question: "重要なファイルで漏れているものはありますか?",
    header: "Files",
    options: [
      { label: "漏れなし", description: "コードマップ完全" },
      { label: "漏れあり", description: "ファイル追加予定" },
    ]
  }, {
    question: "このタスクで触れるべきでないモジュールはありますか?",
    header: "Avoid",
    options: [
      { label: "なし", description: "全ファイル変更可" },
      { label: "禁止モジュールあり", description: "リスト予定" },
    ]
  }]
})
```

**確認待ち。**

### ステップ 5 — サブエージェント生成: planner

> 「以下に基づき:
> - Task: [summary]
> - AC: [list]
> - Relevant files: [file map]
> - Constraints: [ゲート 1 から]
>
> トレードオフ付き 2-3 案を提案。
> 各案: 名前、説明、変更ファイル、見積もり、長所/短所。」

### ステップ 6 — ゲート 3: オプション提示（最重要）

```
## [N] 実装オプション:

### オプション A: [名前] — [特徴]
**説明**: [...]
**変更ファイル**: `[file]` — [理由]
**見積もり**: [X 時間]
**長所**: [...]
**短所**: [...]
**リスク**: [...]

### オプション B / C: [同様]

---
**推奨**: オプション [X]、理由: [具体的]。
```

`question` tool で選択:

```
question({
  questions: [{
    question: "優先度: スピード vs 保守性?",
    header: "Priority",
    options: [
      { label: "Speed", description: "デリバリースピード優先" },
      { label: "Maintainability", description: "保守性優先" },
      { label: "バランス", description: "両者バランス" },
    ]
  }, {
    question: "どのオプションを選択しますか?",
    header: "選択",
    options: [
      { label: "オプション A", description: "[Name A]" },
      { label: "オプション B", description: "[Name B]" },
      { label: "オプション C", description: "[Name C]（あれば）" },
    ]
  }]
})
```

**ユーザー選択待ち。**

### ステップ 6.5 — HTML コンパニオン

`templates/html-artifact.html` から `docs/tasks/[TASK-ID]/analysis-compare.html` 生成:

- `<table id="options" data-sortable>` 挿入、カラム: オプション | 工数 (h) | リスク | 影響ファイル | 長所 | 短所
- リスクは `<span class="pill pill-ok|warn|err">` でレンダリング
- 各オプションに `<details>` 展開可能

HTML はワンショット — **コミットしない**（`.gitignore` 設定済）。

### ステップ 7 — タスク文書作成

`docs/tasks/[TASK-ID]/analysis.md` 作成:

```markdown
# Analysis: [TASK-ID]

## 選択オプション: [名前]
**理由**: [...]

## 変更予定ファイル
| File | 変更種別 | 備考 |

## 不採用案と理由
- オプション A: [...]
- オプション B: [...]

## 残存する未解決の質問
- [ ] [Question]
```

```
## 分析完了 ✓

`docs/tasks/[TASK-ID]/analysis.md` 保存完了。

**ここで停止。** 自動実装しない。

`analysis.md` をレビュー後、`/dev:implement` でコーディング開始。
```

**ユーザーが `/dev:implement` トリガーするまで待つ。**

---

## オーケストレータへの注意

- 各サブエージェントは必要最小限のコンテキストのみ
- 完全な会話履歴をサブエージェントに渡さない
- サブエージェントからの結果は次へ渡す前に要約
- 過剰なファイル（>20）が返ってきた場合、追加フィルタリングを要求
