---
name: qa:ut
description: >
  仕様/要件からユニットテストプランを作成し、人手実行と結果記録をサポート。IT（統合/E2E）とは完全に分離。
  失敗時は dev:debug へのバグフィードバックループあり。
  トリガー: 「ユニットテスト作成」「UTプラン」「機能テストケース」「単体テスト」、または /qa:ut と入力時。
---
## 概要

仕様/要件からユニットテストプランを作成し、人手実行と結果記録をサポート。IT（統合/E2E）とは完全に分離。 失敗時は dev:debug へのバグフィードバックループあり。 トリガー: 「ユニットテスト作成」「UTプラン」「機能テストケース」「単体テスト」、または /qa:ut と入力時。

## ワークフロー

## 概要

仕様/要件からユニットテストプランを作成し、人手実行と結果記録をサポート。IT（統合/E2E）とは完全に分離。 失敗時は dev:debug へのバグフィードバックループあり。 トリガー: 「ユニットテスト作成」「UTプラン」「機能テストケース」「単体テスト」、または /qa:ut と入力時。

## ワークフロー

# /qa:ut
**ロール**: QA Engineer  
**目的**: 関数/コンポーネントごとのユニットテストプラン作成、実行サポート、結果記録。失敗時 → dev フェーズへの明示的なバグフィードバックループ。

---

## ワークフロー概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー詳細は `ut.en.md` を参照。

### ステップ 1 — 入力読み込み

`requirements.md` + `analysis.md` を読み込む。

### ステップ 2 — ゲート: UT スコープ確認

question({
  questions: [{
    question: "ユニットテストのスコープを確認?",
    header: "UT Scope",
    options: [
      { label: "全モック", description: "純粋ユニットテスト — 全依存をモック" },
      { label: "リーン統合", description: "外部サービスのみモック、DB は実物" },
      { label: "その他", description: "具体的なスコープを記述" }
    ]
  }]
})

### ステップ 3 — UT プラン作成

`test-plan-ut.md` を作成 — TC-UT-001 形式、Happy/Edge/Negative/Error カバー。

### ステップ 6 — ゲート: 実行結果 (HUMAN ONLY)

question({
  questions: [{
    question: "UT スイートの実行結果は?",
    header: "UT Result",
    options: [
      { label: "全 PASS", description: "ut-results.md 記録 → /qa:it へ" },
      { label: "失敗あり", description: "失敗 TC + エラー → bug-handoff.md 作成" },
      { label: "環境エラー", description: "セットアップエラー（テスト失敗ではない）" }
    ]
  }]
})
