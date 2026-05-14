---
name: pm:maintain
description: >
  Workflow nhẹ cho dự án trong giai đoạn maintenance/sustain — sau go-live, chỉ còn
  bug fixes và minor improvements, không có active development sprint.
  Trigger khi: user nói "dự án đang maintenance", "chế độ bảo trì", "post go-live support",
  "sustain phase", "không có sprint mới chỉ fix bug", hoặc gõ /pm:maintain.
---

# /pm:maintain
**Role**: PM / Dev / BE
**Mục đích**: Workflow tối giản cho giai đoạn maintenance — đủ control mà không overhead như active sprint.

---

## Context VTI

Maintenance phase khác active development:
- Không có sprint planning / backlog grooming thường xuyên
- Requests đến theo kiểu "ad-hoc" — khách JP email bug report bất kỳ lúc
- Team nhỏ hơn — thường 1-2 dev + 1 BE part-time
- JP outsource: SLA / 保守契約 quy định response time và fix time
- Cần track history rõ để billing / báo cáo tháng cho khách

---

## Maintenance Workflow

```
JP Bug Report / Request
    → Triage (classify + priority)
    → Fix (tiny: patch trực tiếp / normal: dev:analyze → implement)
    → QA verify
    → Release (hotfix hoặc monthly batch)
    → 月次報告書 (monthly report gửi JP)
```

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Xác định loại yêu cầu

```
question({
  questions: [{
    question: "Loại yêu cầu?",
    header: "Type",
    options: [
      { label: "Bug fix", description: "Sửa lỗi" },
      { label: "Minor improvement", description: "Cải tiến nhỏ" },
      { label: "Performance issue", description: "Vấn đề hiệu năng" },
      { label: "Security patch", description: "Vá bảo mật" },
      { label: "Question từ JP", description: "Câu hỏi từ khách Nhật" },
    ]
  }, {
    question: "Source?",
    header: "Source",
    options: [
      { label: "Khách JP báo", description: "Khách hàng Nhật báo lỗi" },
      { label: "User báo", description: "Người dùng báo lỗi" },
      { label: "Monitoring alert", description: "Cảnh báo từ monitoring" },
      { label: "Internal discovery", description: "Phát hiện nội bộ" },
    ]
  }, {
    question: "SLA: Có SLA obligation không? Response time yêu cầu?",
    header: "SLA",
    options: [
      { label: "Có", description: "Có SLA obligation, cần đáp ứng response time" },
      { label: "Không", description: "Không có SLA ràng buộc" },
    ]
  }]
})
```

### Bước 2 — Triage

Classify theo Maintenance Priority Matrix:

```
## Triage: [Tên vấn đề]

**Priority**: P1 / P2 / P3 / P4

| Priority | Định nghĩa | Target fix time |
|----------|-----------|----------------|
| P1 — Critical | Production down / Data loss / Security breach | Fix ngay, trong ngày |
| P2 — High | Feature broken, workaround khó | Fix trong 1-3 ngày |
| P3 — Medium | Feature broken, có workaround | Fix trong 1-2 tuần |
| P4 — Low | UI glitch / minor inconvenience | Batch vào monthly release |

**Classification**: [P1/P2/P3/P4]
**Lý do**: [...]
**Assignee**: [Dev name]
**Fix deadline (JST)**: [Date]
```

### Bước 3 — Fix workflow theo priority

#### P1 — Critical (Hotfix)

```
P1 Hotfix Protocol:
1. Thông báo BE ngay → BE notify khách JP trong 30 phút
2. Dev fix (dùng tiny lane — patch trực tiếp)
3. QA quick verify (smoke test)
4. Deploy hotfix ngay
5. Post-mortem: ghi vào docs/reports/incident-[date].md
6. Gửi 障害報告書 cho khách JP (dùng /ops:incident)
```

#### P2/P3 — Normal fix

Áp dụng dev workflow rút gọn:

```
Với task có analysis.md (normal risk):
  /dev:analyze → /dev:implement → /dev:review → /dev:pr → merge → deploy

Với patch nhỏ (tiny):
  Fix trực tiếp → /dev:review → /dev:pr → merge → batch vào monthly release
```

#### P4 — Batch vào monthly release

Ghi vào `E:\AI Bootcamp\ClaudeSkill\docs\maintenance\[YEAR-MONTH]-backlog.md`:

```markdown
# Maintenance Backlog: [YYYY-MM]

| ID | Mô tả | Reporter | Priority | Status |
|----|-------|----------|----------|--------|
| M-001 | [...] | [JP client / internal] | P4 | Open |
```

### Bước 4 — Monthly Report

Tạo `E:\AI Bootcamp\ClaudeSkill\docs\reports\monthly-[YYYY-MM].md` vào cuối tháng:

```markdown
# 月次保守報告書 / Monthly Maintenance Report

**Period**: [YYYY-MM]
**Project**: [Tên]
**Prepared by**: [BE name]
**Date**: [YYYY-MM-DD JST]

---

## 月次サマリー / Summary

| 項目 | 件数 |
|------|------|
| 受付件数 (Total requests) | [N] |
| 完了件数 (Completed) | [N] |
| 継続中 (In progress) | [N] |
| 次月繰越 (Carried over) | [N] |

## 対応内訳 / Breakdown by Type

| 種別 | 件数 | 代表的な対応 |
|------|------|------------|
| バグ修正 (Bug fix) | [N] | [...] |
| 機能改善 (Improvement) | [N] | [...] |
| 問い合わせ対応 (Inquiry) | [N] | [...] |

## 完了した対応 / Completed Items

| ID | 内容 | 優先度 | 完了日 | 担当者 |
|----|------|--------|--------|--------|
| M-001 | [...] | P2 | [Date] | [...] |

## 未完了・次月繰越 / Outstanding Items

| ID | 内容 | 優先度 | 予定完了日 | 理由 |
|----|------|--------|-----------|------|
| M-005 | [...] | P3 | [Date] | [...] |

## 稼働時間 / Man-hours

| 担当者 | 工数 (人時) |
|--------|------------|
| [Dev name] | [X]h |
| [BE name] | [X]h |
| **合計** | **[Total]h** |

## 特記事項 / Notes

[Bất kỳ điều gì đặc biệt cần thông báo cho khách JP]

## 次月予定 / Next Month Plan

[Những gì sẽ làm tháng tới]
```

### Bước 5 — Gate cuối

```
## Maintenance task hoàn tất.
```

```
question({
  questions: [{
    question: "Task này cần ghi vào monthly report không?",
    header: "Monthly?",
    options: [
      { label: "Có", description: "Đã add vào backlog monthly report" },
      { label: "Không", description: "P1/P2 hotfix — report riêng" },
    ]
  }, {
    question: "Cần notify khách JP về fix này không?",
    header: "Notify JP",
    options: [
      { label: "Có", description: "BE sẽ email cho khách JP" },
      { label: "Không cần", description: "Không cần notify riêng" },
      { label: "Đợi monthly report", description: "Sẽ gộp vào monthly report" },
    ]
  }, {
    question: "Cần cập nhật baseline docs không?",
    header: "Docs?",
    options: [
      { label: "Có", description: "Chạy /docs:update" },
      { label: "Không", description: "Không thay đổi spec" },
    ]
  }]
})
```

---

## Quy tắc

- P1: Thông báo khách JP trước khi fix xong — không im lặng
- Mọi fix đều cần ticket (GitHub Issue) — dù nhỏ — để billing và monthly report
- Monthly report gửi vào ngày làm việc đầu tiên của tháng sau (JST)
- Khi monthly man-hours vượt 保守契約 limit → alert PM ngay để thương lượng CR
