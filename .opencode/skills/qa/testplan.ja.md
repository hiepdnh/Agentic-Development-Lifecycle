---
name: qa:testplan
description: >
  仕様/ユーザーストーリーから包括的テストプラン作成: 戦略、ハッピー/エッジ/ネガティブテストケース、終了基準。
  トリガー: 「テストプランを作成」「テストケースを書く」「テスト計画を準備」「create test plan」「機能の QA プラン」「テスト戦略」、または /qa:testplan と入力時。
---
## 概要

仕様/ユーザーストーリーから包括的テストプラン作成: 戦略、ハッピー/エッジ/ネガティブテストケース、終了基準。 トリガー: 「テストプランを作成」「テストケースを書く」「テスト計画を準備」「create test plan」「機能の QA プラン」「テスト戦略」、または /qa:testplan と入力時。

## ワークフロー

## 概要

仕様/ユーザーストーリーから包括的テストプラン作成: 戦略、ハッピー/エッジ/ネガティブテストケース、終了基準。 トリガー: 「テストプランを作成」「テストケースを書く」「テスト計画を準備」「create test plan」「機能の QA プラン」「テスト戦略」、または /qa:testplan と入力時。

## ワークフロー

# /qa:testplan
**ロール**: QA
**目的**: 仕様/ユーザーストーリーから包括的テストプラン作成 — 戦略、テストケース（happy/edge/negative）、終了基準。

---

## 概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー、ゲート定義、サブエージェント仕様の詳細は以下を参照:
- 英語版: `testplan.en.md`
- ベトナム語版（正本）: `testplan.md`

**サブエージェント生成**: `task({ description, prompt, subagent_type })`。ゲートツール: `question`。

---

## JP 特有の考慮事項

- **JST タイムゾーン**: スケジュール、デッドライン、リリースには JST (UTC+9) を使用
- **用語**: 業務 / 技術用語は `templates/jp-vn-en-glossary.md` から使用 — 不整合があれば `/be:glossary` で追加
- **成果物フォーマット**: JP 顧客送付物は `templates/html-bilingual.html` または日本標準テンプレート使用
- **リスク分類**: タスク開始前に `docs/risk-classifier.ja.md` に従い分類（tiny/normal/high-risk）
- **Ask First Gates**: 機微変更（認証、データ損失、決済など）は `assets/ask-first-gates.ja.md` を参照 → 続行前にシニア確認

---

## 出力

test-plan.md + test-plan.html (チェック可能、localStorage 保存)

**テンプレート**: `templates/test-plan.ja.md`

---

## ヒューマンゲート

全ゲートはユーザー判断を待つ — 自動進行しない。プロンプト出力後、確認応答までブロック。
ゲート内容の詳細は VN/EN 版を参照。
