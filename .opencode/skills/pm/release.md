---
name: pm:release
description: >
  Tạo Release Notes / リリースノート tự động từ merged PRs và closed issues.
  Dùng trước mỗi release gửi cho khách JP hoặc stakeholder.
  Trigger khi: user nói "tạo release notes", "viết リリースノート", "changelog sprint",
  "release notes cho khách JP", "tổng hợp thay đổi release", hoặc gõ /pm:release.
---

# /pm:release
**Role**: PM / Bridge Engineer
**Mục đích**: Tạo Release Notes từ merged PRs + closed issues — đủ để gửi khách JP như một deliverable chính thức.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Xác định phạm vi release

```
question({
  questions: [{
    question: "Version/Sprint?",
    header: "Version",
    options: [
      { label: "Release v[X.Y.Z]", description: "Version number cụ thể" },
      { label: "Sprint [N]", description: "Sprint number" },
      { label: "Hotfix [date]", description: "Hotfix release" },
    ]
  }, {
    question: "Audience?",
    header: "Audience",
    options: [
      { label: "Team internal", description: "Release notes nội bộ" },
      { label: "Khách hàng JP", description: "Gửi cho khách Nhật" },
      { label: "Management", description: "Báo cáo management" },
      { label: "Public", description: "Release notes công khai" },
    ]
  }, {
    question: "Format output?",
    header: "Format",
    options: [
      { label: "HTML", description: "Recommend cho JP delivery" },
      { label: "Markdown", description: "Slack/Notion/commit" },
      { label: "Cả hai", description: "Cả HTML và Markdown" },
    ]
  }]
})
```

### Bước 2 — Thu thập dữ liệu

Spawn subagent để đọc:

```
task(
  description: "Collect release data from git and task docs",
  prompt: "Read the following and return structured JSON:
  1. git log --oneline --merges [base-tag]..HEAD — list of merged PRs
  2. git tag --sort=-version:refname | head -5 — recent tags
  3. List all docs/tasks/*/requirements.md for tasks completed this sprint
  4. List docs/tasks/*/verification.md for sign-off status

  Return JSON: { mergedPRs: [...], closedTasks: [...], openTasks: [...], tagHistory: [...] }
  Read only, no changes.",
  subagent_type: "explorer"
)
```

### Bước 3 — Phân loại thay đổi

Phân loại tự động từ PR titles + task descriptions:

| Category | Tiếng Việt | 日本語 |
|----------|-----------|--------|
| New Feature | Tính năng mới | 新機能 |
| Bug Fix | Sửa lỗi | バグ修正 |
| Improvement | Cải tiến | 改善 |
| Performance | Hiệu năng | パフォーマンス改善 |
| Security | Bảo mật | セキュリティ |
| Breaking Change | Thay đổi không tương thích | 互換性のない変更 |
| Maintenance | Bảo trì nội bộ | メンテナンス |

### Bước 4 — Tạo Release Notes

#### Format HTML (option A — cho JP delivery)

Sinh `E:\AI Bootcamp\ClaudeSkill\docs\reports\release-[version]-[date].html` từ template `E:\AI Bootcamp\ClaudeSkill\templates\html-artifact.html`:

- Header: Release [version] · [Date JST] · badge "リリース済み"
- Section **新機能 / New Features**: cards với icon ✨, mô tả JP + VN
- Section **バグ修正 / Bug Fixes**: cards với icon 🐛
- Section **改善 / Improvements**: cards với icon ⚡
- Section **⚠️ 互換性のない変更 / Breaking Changes**: nếu có, highlight đỏ
- Footer: link đến repo, PR list, Contact BE

`@media print`: A4 đẹp để forward email hoặc attach PDF cho khách JP.

#### Format Markdown (option B — commit/Slack)

```markdown
# Release Notes: v[X.Y.Z] / Sprint [N]

**Ngày release**: [YYYY-MM-DD JST]
**Môi trường**: Production / Staging
**Released by**: [PM name]

---

## 🆕 Tính năng mới (新機能)

- **[Tên feature]** — [Mô tả ngắn 1 câu] ([TASK-ID])
  > 新しい機能: [日本語説明]

## 🐛 Sửa lỗi (バグ修正)

- **[Tên bug fix]** — [Mô tả] ([TASK-ID])
  > バグ修正: [日本語説明]

## ⚡ Cải tiến (改善)

- [...]

## ⚠️ Breaking Changes (互換性のない変更)

> Nếu không có: "_Không có breaking changes trong release này._"

- [Mô tả breaking change]
  > **対応方法**: [Hướng dẫn migrate]

## 📦 Change Request đã implement

| CR | Tên | Approved by |
|----|-----|------------|
| CR-001 | [...] | [JP PM name], [date] |

## 📋 Danh sách PRs

| PR | Title | Author |
|----|-------|--------|
| #[N] | [...] | [...] |

---

*Xem chi tiết: [repo URL]*
```

### Bước 5 — Gate cuối

```
## Release Notes v[X.Y.Z] đã soạn xong.
```

```
question({
  questions: [{
    question: "Có thay đổi nào tôi bỏ sót không?",
    header: "Missing?",
    options: [
      { label: "Không", description: "Đã đầy đủ" },
      { label: "Có", description: "Cần thêm thay đổi" },
    ]
  }, {
    question: "Breaking Changes có được mô tả đủ rõ chưa?",
    header: "Breaking",
    options: [
      { label: "Đủ rõ", description: "Mô tả breaking change đã rõ" },
      { label: "Cần thêm guide", description: "Cần thêm migration guide" },
      { label: "Không có", description: "Không có breaking changes" },
    ]
  }, {
    question: "Gửi cho ai?",
    header: "Send to",
    options: [
      { label: "Khách JP (qua BE)", description: "Gửi cho khách Nhật qua BE" },
      { label: "Team internal Slack", description: "Gửi nội bộ team" },
      { label: "Cả hai", description: "Gửi cả khách JP và team" },
    ]
  }]
})
```

```
Bước tiếp theo nếu gửi JP:
- BE review lại phần 日本語 trước khi gửi
- Gửi kèm regression test results (từ /qa:regression)
```

---

## Quy tắc

- Breaking changes: LUÔN có migration guide — không chỉ ghi "có breaking change"
- Phần JP trong release notes: dùng thuật ngữ từ `E:\AI Bootcamp\ClaudeSkill\templates\jp-vn-en-glossary.md`
- CRs đã implement: list rõ ràng với CR number và ngày JP approved
- File HTML: lưu vào `docs/reports/` (có thể commit để lưu lịch sử release)
