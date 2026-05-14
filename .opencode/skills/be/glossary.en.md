---
name: be:glossary
description: >
  Maintain the JP-VN-EN glossary — add new terms, resolve translation conflicts,
  sync with project documents. Triggers when: user says "thêm từ vào glossary",
  "cập nhật glossary", "thuật ngữ mới từ JP", "glossary có thiếu từ",
  "term không nhất quán", or types /be:glossary.
---

# /be:glossary
**Role**: Bridge Engineer  
**Purpose**: Maintain `E:\AI Bootcamp\ClaudeSkill\templates\jp-vn-en-glossary.md` — the standard vocabulary set shared across the entire JP outsourcing project.

---

## VTI Context

The glossary is the single source of truth for terminology:
- BE uses it when translating JP → VN requirements
- Dev uses it when reading specs
- QA uses it when writing test reports
- PM uses it when writing status reports

Whenever `be:bridge` encounters a `[GLOSSARY?]` tag → that is a signal to run this skill.

---

## Execution Guide

### Step 1 — Gate: Determine the task

<!-- Gate: Determine the type of work -->
question({
  questions: [{
    question: "What type of glossary task?",
    header: "Task",
    options: [
      { label: "Add new terms", description: "From the just-completed be:bridge session" },
      { label: "Review & standardize", description: "Review and standardize existing terms" },
      { label: "Search for a term", description: "Search for a term in the glossary" },
      { label: "Export glossary", description: "Export glossary for JP documents" }
    ]
  }]
})

### Step 2 — Read the current glossary

Read the entire `E:\AI Bootcamp\ClaudeSkill\templates\jp-vn-en-glossary.md`.

Check:
- Are there any terms that use multiple different translations?
- Are there any terms missing the JP or VN column?
- Are there any outdated terms?

### Step 3 — Process by task type

#### 3a. Add new terms

For each term to add, confirm:

```
## New terms to add to the glossary

| # | JP | Proposed VN | EN | Context | Conflict? |
|---|----|-----------|----|---------|----------|
| 1 | [JP term] | [VN] | [EN] | [Context where it's used] | [Any similar existing term?] |
| 2 | [...] | [...] | [...] | [...] | [...] |
```

<!-- Gate: Confirm adding terms -->
question({
  questions: [{
    question: "Confirm adding these terms to the glossary?",
    header: "Add terms",
    options: [
      { label: "Confirm", description: "Add to glossary" },
      { label: "Edit", description: "Need to edit before adding" }
    ]
  }]
})

After confirmation: edit `E:\AI Bootcamp\ClaudeSkill\templates\jp-vn-en-glossary.md` — add to the correct section alphabetically (JP reading order).

#### 3b. Resolve translation conflicts

When a term is found with multiple translations:

```
## Conflict detected: "[JP term]"

Currently in the glossary/documents:
- Version 1: [VN variant A] — appears in: [file list]
- Version 2: [VN variant B] — appears in: [file list]

Recommendation: [Which variant + reason]
```

<!-- Gate: Choose a variant -->
question({
  questions: [{
    question: "Which variant should be used for this term?",
    header: "Variant",
    options: [
      { label: "Variant A", description: "Use variant A — update all documents" },
      { label: "Variant B", description: "Use variant B — update all documents" },
      { label: "Other", description: "Enter a different variant" }
    ]
  }]
})

After confirmation: update the glossary + search-replace in `docs/` for consistency.

#### 3c. Search for a term

```
## Search results: "[query]"

| JP | VN | EN | Context |
|----|----|----|---------|
| [...] | [...] | [...] | [...] |

No exact match found. Closest terms:
- [Related term 1]
- [Related term 2]
```

#### 3d. Export glossary for JP documents

Create `docs/handover/glossary-export-[date].md` in a format suitable for attaching to 引き継ぎ書 or sending to the Japanese client:

```markdown
# 用語集 / Glossary / Bảng thuật ngữ

**Project**: [Name]  
**Updated**: [YYYY-MM-DD]

| 日本語 (JP) | ベトナム語 (VN) | English (EN) | 備考 / Notes |
|------------|---------------|-------------|---------------|
| [...] | [...] | [...] | [...] |
```

### Step 4 — Summary

```
## Glossary update complete.

Changes:
- Newly added: [N] terms
- Updated: [N] terms
- Conflicts resolved: [N]

Notable new terms:
| JP | VN | EN |
|----|----|----|
| [...] | [...] | [...] |

Updated file: E:\AI Bootcamp\ClaudeSkill\templates\jp-vn-en-glossary.md
```

---

## Rules

- Every term must have all 3 columns: JP + VN + EN — do not leave blanks
- Standard technical terms (JWT, API, CRUD...) → keep English in the VN column
- The Context column is important — clearly state which domain the term is used in (auth / payment / UI...)
- When there is a conflict: always ask the BE/domain expert — do not decide on your own
- After adding a new term → grep `docs/` to check if any files use an old translation that needs updating
