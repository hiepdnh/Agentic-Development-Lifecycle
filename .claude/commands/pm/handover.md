---
name: pm:handover
description: >
  Tạo gói tài liệu bàn giao dự án (引き継ぎ) đầy đủ: codebase map, decision log,
  glossary, open issues, contact matrix. Dùng khi dev rời team, dự án chuyển giao,
  hoặc kết thúc contract JP outsource.
  Trigger khi: user nói "bàn giao dự án", "tạo tài liệu handover", "引き継ぎ",
  "dev nghỉ cần handover", "chuyển giao project", "project handoff", hoặc gõ /pm:handover.
---

# Skill: /pm:handover
**Role**: PM / Bridge Engineer / Tech Lead  
**Mục đích**: Tạo gói bàn giao dự án toàn diện — đủ để người mới tiếp quản mà không cần hỏi lại team cũ.

---

## Context

Bàn giao trong JP outsource model có 2 scenario:
- **Dev rời team giữa project**: bàn giao cho dev mới trong cùng team VN
- **Kết thúc contract**: bàn giao lại cho khách JP hoặc vendor mới

Tài liệu bàn giao JP (引き継ぎ書) phải đủ rõ để khách JP hiểu mà không cần gọi điện.

---

## Hướng dẫn thực hiện

### Bước 0 — Load glossary

Đọc `templates/jp-vn-en-glossary.md` trước khi viết bất kỳ thuật ngữ kỹ thuật nào.

### Bước 1 — Gate: Xác định loại bàn giao

Dùng `AskUserQuestion` tool:

- **Loại**: Internal (dev sang dev trong team VN) / Client handover (bàn giao lại cho khách JP) / Vendor handover (chuyển sang vendor mới)
- **Scope**: Full project / Một module cụ thể / Một role cụ thể (dev / QA / BE)
- **Deadline**: Khi nào cần hoàn tất?

**Chờ confirm.**

### Bước 2 — Thu thập thông tin dự án

Đọc song song các nguồn có sẵn:

```
Nguồn đọc:
- docs/baseline/codebase-overview.md (nếu có)
- docs/decisions/ADR-*.md — tất cả ADRs
- docs/tasks/*/requirements.md — open/in-progress tasks
- docs/workflows/sprint-lifecycle.md
- templates/jp-vn-en-glossary.md
- git log --oneline -50 (recent history)
- git branch -a (active branches)
```

Nếu thiếu `codebase-overview.md` → đề xuất chạy `/ba:reverse` trước.

### Bước 3 — Tạo Handover Package

#### 3a. `docs/handover/[DATE]-handover.md` (tiếng Việt — cho team VN)

```markdown
# Tài liệu bàn giao: [Tên dự án]

**Ngày bàn giao**: [YYYY-MM-DD]  
**Người bàn giao**: [Tên]  
**Người tiếp nhận**: [Tên]  
**Loại bàn giao**: [Internal / Client / Vendor]

---

## 1. Tổng quan dự án

| Thông tin | Chi tiết |
|-----------|---------|
| Khách hàng JP | [Tên] |
| Bridge Engineer | [Tên] |
| Tech stack | [Languages, frameworks, DB] |
| Repo | [URL] |
| Staging URL | [URL] |
| Production URL | [URL] |
| CI/CD | [Platform + pipeline URL] |

## 2. Cấu trúc codebase

[Tóm tắt từ codebase-overview.md — modules chính, entry points, folder structure]

## 3. Setup môi trường dev

```bash
# Clone và setup
[các lệnh cụ thể]

# ENV variables cần thiết
[list ENV vars — không ghi giá trị, chỉ ghi tên + nguồn lấy]

# Chạy local
[lệnh cụ thể]
```

## 4. Kiến trúc và quyết định kỹ thuật

[Tóm tắt từ ADRs — mỗi quyết định 1 dòng + link ADR tương ứng]

| ADR | Quyết định | Lý do | File |
|-----|-----------|-------|------|
| ADR-001 | [...] | [...] | docs/decisions/ADR-001.md |

## 5. Tasks đang mở

| ID | Tên | Status | Assignee | Ghi chú |
|----|-----|--------|----------|---------|
| [ID] | [...] | In Progress / Blocked | [Tên] | [...] |

## 6. Known issues và tech debt

| Vấn đề | Mức độ | Hướng xử lý |
|--------|--------|------------|
| [...] | High/Medium/Low | [...] |

## 7. Lịch release và commitments với khách JP

| Ngày | Deliverable | Status | Ghi chú |
|------|------------|--------|---------|
| [...] | [...] | [...] | [...] |

## 8. Contact matrix

| Role | Tên | Email | Slack/Teams | Ghi chú |
|------|-----|-------|-------------|---------|
| Khách JP (PM) | [...] | [...] | [...] | Timezone: JST |
| Khách JP (Dev Lead) | [...] | [...] | [...] | |
| BE (Bridge Engineer) | [...] | [...] | [...] | |
| PM VN | [...] | [...] | [...] | |

## 9. Quy trình đặc thù cần biết

[Những điều không có trong tài liệu chuẩn — quirks của dự án này]

- [...]

## 10. Credential và access

> ⚠️ Không ghi credentials trực tiếp — chỉ ghi WHERE to get them

| Access | Nguồn lấy |
|--------|----------|
| DB production | [Vault / LastPass / người cụ thể] |
| AWS/GCP access | [...] |
| JP client portal | [...] |
```

#### 3b. `docs/handover/[DATE]-引き継ぎ書.md` (tiếng Nhật — khi bàn giao cho khách JP)

```markdown
# 引き継ぎ書: [プロジェクト名]

**引き継ぎ日**: [YYYY-MM-DD]  
**担当者**: [氏名]  
**引き継ぎ先**: [氏名または会社名]

---

## 1. プロジェクト概要

[プロジェクトの目的・背景・現状の簡潔なまとめ]

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

### Bước 4 — Checklist hoàn chỉnh

```
## Handover Package đã soạn xong.

Checklist:
- [ ] Tất cả ENV variables được liệt kê (không để trống section)
- [ ] Contact matrix đầy đủ — đặc biệt contact JP side
- [ ] Open tasks và blockers được ghi rõ
- [ ] Setup instructions đã test được (người mới có thể follow mà không cần hỏi)
- [ ] Known issues được ghi với mức độ và hướng xử lý
- [ ] Credentials: ghi nguồn lấy, KHÔNG ghi giá trị trực tiếp

Files tạo ra:
- docs/handover/[DATE]-handover.md (VN — commit)
- docs/handover/[DATE]-引き継ぎ書.md (JP — commit, nếu client handover)

Confirm để finalize?
```

**Chờ confirm.**

### Bước 5 — Kết luận

```
Handover package hoàn tất.

Gợi ý bước tiếp theo:
- Tổ chức handover meeting — người bàn giao walk-through tài liệu
- Người tiếp nhận làm shadow 1-2 sprint trước khi fully own
- Sau handover meeting: cập nhật tài liệu dựa trên Q&A
```

---

## Quy tắc

- Không giả định người tiếp nhận đã biết context — giải thích mọi thứ như fresh start
- Credentials: KHÔNG bao giờ ghi trực tiếp vào tài liệu
- JP deliverable: dùng kính ngữ (敬語) trong tài liệu tiếng Nhật
- Sau khi merge, update `docs/workflows/role-guide.md` nếu contact matrix thay đổi
