---
name: qa:it
description: >
  仕様と UT 結果から Integration/E2E テストプランを作成し、人手 E2E 実行と結果記録をサポート。
  /qa:ut 通過後にのみ実行。失敗時は dev:debug へのバグフィードバックループあり。
  トリガー: 「ITプラン作成」「統合テスト」「E2Eテストケース」「インテグレーションテスト」、または /qa:it と入力時。
---
## 概要

仕様と UT 結果から Integration/E2E テストプランを作成し、人手 E2E 実行と結果記録をサポート。 /qa:ut 通過後にのみ実行。失敗時は dev:debug へのバグフィードバックループあり。 トリガー: 「ITプラン作成」「統合テスト」「E2Eテストケース」「インテグレーションテスト」、または /qa:it と入力時。

## ワークフロー

## 概要

仕様と UT 結果から Integration/E2E テストプランを作成し、人手 E2E 実行と結果記録をサポート。 /qa:ut 通過後にのみ実行。失敗時は dev:debug へのバグフィードバックループあり。 トリガー: 「ITプラン作成」「統合テスト」「E2Eテストケース」「インテグレーションテスト」、または /qa:it と入力時。

## ワークフロー

# /qa:it
**ロール**: QA Engineer  
**目的**: エンドツーエンドのビジネスフローをカバーする Integration/E2E テストプラン作成。UT 通過後にのみ実行。失敗時 → dev フェーズへの明示的なバグフィードバックループ。

---

## ワークフロー概要

このスキルは日本語ネイティブで利用可能です。フルワークフロー詳細は `it.en.md` を参照。

### ステップ 0 — UT 前提条件確認

`ut-results.md` を確認。未通過なら `/qa:ut` を先に実行するよう指示して停止。

### ステップ 2 — ゲート: IT スコープ確認

question({
  questions: [{
    question: "インテグレーションテストのスコープを確認?",
    header: "IT Scope",
    options: [
      { label: "ステージング", description: "ステージング環境 — 外部 API モック使用" },
      { label: "本番同等", description: "本番同等環境 — 実サービス使用" },
      { label: "開発環境", description: "開発環境 — データが限定的な場合あり" }
    ]
  }]
})

### ステップ 3 — IT プラン作成

`test-plan-it.md` を作成 — TC-IT-001 形式、Flow/Preconditions/Steps/Expected/Postconditions/Type。

### ステップ 5 — ゲート: 実行結果 (HUMAN ONLY)

question({
  questions: [{
    question: "E2E テストの実行結果は?",
    header: "IT Result",
    options: [
      { label: "全 PASS", description: "it-results.md 記録 → /dev:pr へ" },
      { label: "失敗あり", description: "失敗 TC + ステップ + 実際の動作 → bug-handoff.md 追記" },
      { label: "環境エラー", description: "セットアップエラー（テスト失敗ではない）" }
    ]
  }]
})
