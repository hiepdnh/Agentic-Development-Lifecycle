---
name: be:changerequest
description: >
  Quản lý 変更依頼 (Change Request) — phân tích impact, tạo approval trail,
  version control thay đổi spec. Dùng khi spec thay đổi giữa sprint hoặc sau sign-off.
  Trigger khi: user nói "khách JP yêu cầu thay đổi", "tạo change request", "変更依頼",
  "spec thay đổi giữa chừng", "CR mới từ JP", "change request", hoặc gõ /be:changerequest.
---

# Skill: /be:changerequest
**Role**: Bridge Engineer / PM  
**Mục đích**: Xử lý yêu cầu thay đổi từ khách JP một cách có kiểm soát — impact analysis rõ ràng, approval trail đầy đủ, không merge thay đổi ngầm vào spec.

---

## Context

Thay đổi spec sau sign-off là rủi ro cao nhất trong JP outsource:
- Khách JP hay yêu cầu thay đổi nhỏ qua email/chat mà không có formal CR
- Dev VN implement "cho nhanh" mà không có approval trail → sau này khách chất vấn
- Impact chưa được estimate → scope creep không kiểm soát được

**Nguyên tắc**: Mọi thay đổi sau sign-off đều phải có CR document trước khi dev touch code.

---

## Hướng dẫn thực hiện

### Bước 0 — Load glossary

Đọc `templates/jp-vn-en-glossary.md` trước khi xử lý thuật ngữ kỹ thuật.

### Bước 1 — Gate: Thu thập thông tin CR

Dùng `AskUserQuestion` tool:

- **Nguồn yêu cầu**: Email từ JP / Meeting / Slack/Teams / Formal 変更依頼書
- **Loại thay đổi**: Thêm feature mới / Sửa spec hiện tại / Bỏ scope / Performance requirement mới / UI/UX adjustment
- **Urgency**: Cần trong sprint hiện tại / Sprint sau / Flexible

**Chờ confirm.**

### Bước 2 — Phân tích Impact

Đọc:
- `docs/tasks/[TASK-ID]/requirements.md` — spec gốc đang bị thay đổi
- `docs/tasks/[TASK-ID]/analysis.md` — implementation đã plan hoặc đang làm
- `docs/decisions/ADR-*.md` — quyết định kỹ thuật liên quan

Phân tích theo 4 chiều:

```
## Impact Analysis: CR-[NUMBER]

### Scope Impact
- Files/modules bị ảnh hưởng: [list]
- ACs bị thay đổi / thêm / bỏ: [diff so với spec gốc]
- Test cases cần cập nhật: [list]

### Effort Impact
- Estimate thêm: [X man-hours / man-days]
- Có thể làm trong sprint hiện tại: [Yes / No / Partial]
- Nếu No: cần push sang sprint [N+1 / TBD]

### Risk Impact
- Risk mới: [list]
- Dependencies bị ảnh hưởng: [list]
- Regression risk: [Low / Medium / High]

### Schedule Impact
- Deadline hiện tại: [Date]
- Impact đến deadline: [None / Trễ X ngày / Cần thương lượng lại]
```

### Bước 3 — Gate: Xác nhận impact trước khi soạn CR

```
## Tôi đã phân tích impact của yêu cầu thay đổi.

[Hiển thị impact analysis từ Bước 2]

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | Impact analysis có chính xác không? | A: Chính xác / B: Cần điều chỉnh: ___ / C: Khác: ___ |
| 2 | Ai là người approve CR phía team? | _(điền tên PM / Tech Lead)_ |
| 3 | Cần gửi estimate cho JP trước khi approve không? | A: Có — gửi email estimate trước / B: Không — tiếp tục tạo CR doc / C: Khác: ___ |
```

**Chờ confirm.**

### Bước 4 — Tạo Change Request Documents

#### 4a. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md` (tiếng Việt — nội bộ)

```markdown
# Change Request: CR-[NUMBER]

**Dự án**: [Tên dự án]  
**Task gốc**: [TASK-ID]  
**CR Number**: CR-[NUMBER]  
**Ngày tạo**: [YYYY-MM-DD JST]  
**Người tạo**: [Bridge Engineer name]  
**Status**: Draft / Pending Approval / Approved / Rejected

---

## 1. Mô tả yêu cầu thay đổi

**Từ khách JP**: [Mô tả nguyên văn hoặc tóm tắt yêu cầu bằng tiếng Việt]

**Nguồn**: [Email/Meeting ngày... / Slack message / ...]

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
- Impact đến deadline: [Mô tả]

## 4. Approval

| Role | Tên | Quyết định | Ngày | Ghi chú |
|------|-----|-----------|------|---------|
| PM | [...] | Approve / Reject / Pending | [...] | [...] |
| Tech Lead | [...] | Approve / Reject / Pending | [...] | [...] |
| Khách JP | [...] | Approve / Reject / Pending | [...] | [...] |

## 5. Lịch sử

| Version | Ngày | Thay đổi | Người thực hiện |
|---------|------|---------|----------------|
| 1.0 | [Date] | Tạo mới | [Name] |
```

#### 4b. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md` (tiếng Nhật — gửi khách JP)

```markdown
# 変更依頼書: CR-[NUMBER]

**プロジェクト**: [プロジェクト名]  
**対象タスク**: [TASK-ID]  
**変更依頼番号**: CR-[NUMBER]  
**作成日**: [YYYY-MM-DD]  
**作成者**: [Bridge Engineer 氏名]  
**ステータス**: ドラフト / 承認待ち / 承認済み / 却下

---

## 1. 変更内容

[変更の概要を日本語で記述]

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
- [リスク内容]

## 4. 承認欄

| 役割 | 氏名 | 承認 | 日付 | コメント |
|------|------|------|------|---------|
| PM | [...] | 承認/却下/未回答 | [...] | [...] |
| お客様 PM | [...] | 承認/却下/未回答 | [...] | [...] |

## 5. 変更履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|---------|--------|
| 1.0 | [Date] | 初版作成 | [Name] |
```

### Bước 5 — Gate cuối

```
## Change Request CR-[NUMBER] đã soạn xong.

Files tạo ra:
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md (nội bộ — commit)
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md (gửi JP — commit)

Checklist:
- [ ] Impact analysis đã được PM và Tech Lead review
- [ ] Estimate đã được confirm (không phải "TBD")
- [ ] CR-jp.md đã được dịch đúng thuật ngữ từ glossary
- [ ] Approval table có đủ 3 bên: PM + Tech Lead + Khách JP

Bước tiếp theo:
- [ ] Gửi CR-jp.md cho khách JP để confirm
- [ ] Sau khi khách JP approve: cập nhật requirements.md (ghi rõ "CR-[NUMBER] approved [date]")
- [ ] Tạo GitHub Issue mới hoặc cập nhật issue gốc
```

**Chờ confirm.**

---

## Quy tắc

- **KHÔNG** implement thay đổi trước khi CR được approve bởi cả PM và khách JP
- Mọi CR phải có số (CR-001, CR-002...) — track trong `docs/tasks/[TASK-ID]/cr/`
- Nếu CR thay đổi kiến trúc → trigger `/arch:adr` sau khi approve
- Nếu CR thêm security-sensitive feature → trigger `/sec:review` sau implement
