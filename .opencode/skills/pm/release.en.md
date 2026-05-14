---
name: pm:release
description: >
  Generate Release Notes / リリースノート automatically from merged PRs and closed issues.
  Use before each release to send to JP clients or stakeholders.
  Triggers when: user says "create release notes", "write リリースノート", "sprint changelog",
  "release notes for JP client", "summarize release changes", or types /pm:release.
---

# /pm:release
**Role**: PM / Bridge Engineer
**Purpose**: Generate Release Notes from merged PRs + closed issues — sufficient to send to JP clients as an official deliverable.

---

## Execution Guide

### Step 1 — Gate: Define release scope

```
question({
  questions: [{
    question: "Version/Sprint?",
    header: "Version",
    options: [
      { label: "Release v[X.Y.Z]", description: "Specific version number" },
      { label: "Sprint [N]", description: "Sprint number" },
      { label: "Hotfix [date]", description: "Hotfix release" },
    ]
  }, {
    question: "Audience?",
    header: "Audience",
    options: [
      { label: "Team internal", description: "Internal release notes" },
      { label: "JP client", description: "Send to Japanese client" },
      { label: "Management", description: "Management report" },
      { label: "Public", description: "Public release notes" },
    ]
  }, {
    question: "Output format?",
    header: "Format",
    options: [
      { label: "HTML", description: "Recommended for JP delivery" },
      { label: "Markdown", description: "Slack/Notion/commit" },
      { label: "Both", description: "Both HTML and Markdown" },
    ]
  }]
})
```

### Step 2 — Collect data

Spawn subagent to read:

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

### Step 3 — Categorize changes

Auto-categorize from PR titles + task descriptions:

| Category | English | 日本語 |
|----------|---------|--------|
| New Feature | New Feature | 新機能 |
| Bug Fix | Bug Fix | バグ修正 |
| Improvement | Improvement | 改善 |
| Performance | Performance | パフォーマンス改善 |
| Security | Security | セキュリティ |
| Breaking Change | Breaking Change | 互換性のない変更 |
| Maintenance | Maintenance | メンテナンス |

### Step 4 — Generate Release Notes

#### HTML format (option A — for JP delivery)

Generate `docs/reports/release-[version]-[date].html` from template `templates/html-artifact.html`:

- Header: Release [version] · [Date JST] · badge "リリース済み"
- Section **新機能 / New Features**: cards with ✨ icon, JP + VN description
- Section **バグ修正 / Bug Fixes**: cards with 🐛 icon
- Section **改善 / Improvements**: cards with ⚡ icon
- Section **⚠️ 互換性のない変更 / Breaking Changes**: if any, red highlight
- Footer: link to repo, PR list, Contact BE

`@media print`: Clean A4 for email forwarding or PDF attachment for JP clients.

#### Markdown format (option B — commit/Slack)

```markdown
# Release Notes: v[X.Y.Z] / Sprint [N]

**Release date**: [YYYY-MM-DD JST]
**Environment**: Production / Staging
**Released by**: [PM name]

---

## 🆕 New Features (新機能)

- **[Feature name]** — [1-sentence description] ([TASK-ID])
  > 新しい機能: [Japanese description]

## 🐛 Bug Fixes (バグ修正)

- **[Bug fix name]** — [Description] ([TASK-ID])
  > バグ修正: [Japanese description]

## ⚡ Improvements (改善)

- [...]

## ⚠️ Breaking Changes (互換性のない変更)

> If none: "_No breaking changes in this release._"

- [Breaking change description]
  > **Migration**: [Migration guide]

## 📦 Implemented Change Requests

| CR | Name | Approved by |
|----|------|------------|
| CR-001 | [...] | [JP PM name], [date] |

## 📋 PR List

| PR | Title | Author |
|----|-------|--------|
| #[N] | [...] | [...] |

---

*See details: [repo URL]*
```

### Step 5 — Final Gate

```
## Release Notes v[X.Y.Z] prepared.
```

```
question({
  questions: [{
    question: "Any changes I missed?",
    header: "Missing?",
    options: [
      { label: "No", description: "All changes covered" },
      { label: "Yes", description: "Need to add changes" },
    ]
  }, {
    question: "Are Breaking Changes described clearly enough?",
    header: "Breaking",
    options: [
      { label: "Clear enough", description: "Breaking change description is clear" },
      { label: "Need more guide", description: "Need to add migration guide" },
      { label: "None", description: "No breaking changes" },
    ]
  }, {
    question: "Send to whom?",
    header: "Send to",
    options: [
      { label: "JP client (via BE)", description: "Send to Japanese client via BE" },
      { label: "Team internal Slack", description: "Send internally to team" },
      { label: "Both", description: "Send to both JP client and team" },
    ]
  }]
})
```

```
Next steps if sending to JP:
- BE reviews the 日本語 section before sending
- Attach regression test results (from /qa:regression)
```

---

## Rules

- Breaking changes: ALWAYS include a migration guide — don't just say "has breaking change"
- JP sections in release notes: use terminology from `templates/jp-vn-en-glossary.md`
- Implemented CRs: list clearly with CR number and JP approval date
- HTML files: save to `docs/reports/` (can be committed to preserve release history)
