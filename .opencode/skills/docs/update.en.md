---
name: docs:update
description: >
  Update Baseline Docs (screen + API) after a task has been verified and merged. The final step of every task.
  Trigger when: user says "update docs", "update baseline", "task done need doc update",
  "sync docs after merge", "update screen doc", "update API doc", or types /docs:update.
---
## Summary

Update Baseline Docs (screen + API) after a task has been verified and merged. The final step of every task. Trigger when: user says "update docs", "update baseline", "task done need doc update", "sync docs after merge", "update screen doc", "update API doc", or types /docs:update.

## Workflow

# /docs:update
**Role**: Developer / QA (after verification)  
**Purpose**: Update Baseline Docs (screen + API) after a task has been verified and merged. This is the FINAL step of every task.

---

## Important

Baseline Docs are the **source of truth** for the team. Wrong updates = technical debt.  
This skill always proposes changes for human review, never overwrites automatically.

---

## Execution Guide

### Step 1 — Spawn subagent: diff-reader

Spawn subagent to read:
- `git diff [base-branch]..HEAD -- docs/` — have docs been changed?
- `git diff [base-branch]..HEAD -- [src/]` — what code has changed?
- `docs/tasks/[TASK-ID]/requirements.md` — original spec

```
task(
  description: "Map merged code changes to baseline docs that need updating",
  prompt: "Read git diff and spec, return docs impact per agents/diff-reader.md spec.\n\nGIT DIFF:\n[git diff base-branch..HEAD]\n\nSPEC PATH: docs/tasks/[TASK-ID]/requirements.md\n\nBASELINE DOCS TO CHECK: [list docs/screens/ and docs/api/ files related to this task]",
  subagent_type: "explorer"
)
```

Subagent returns: list of changes to reflect in docs.

### Step 1b — Spawn subagent: doc-updater

After receiving output from diff-reader, spawn doc-updater to create proposals:

```
task(
  description: "Propose specific content changes for each baseline doc",
  prompt: "Create update proposals per agents/doc-updater.md spec.\n\nDIFF READER OUTPUT:\n[JSON from diff-reader]\n\nCURRENT DOC CONTENT:\n[Current content of each file in docs_update_needed]\n\nCHANGES SUMMARY:\n[changes_summary from diff-reader]",
  subagent_type: "oracle"
)
```

### Step 2 — Gate: Confirm update scope

question({
  questions: [{
    question: "Task has been verified and merged. Confirm the scope of docs to update?",
    header: "Scope",
    options: [
      { label: "Complete", description: "Analyzed scope is comprehensive" },
      { label: "Missing", description: "Docs were overlooked and need to be added to scope" },
    ]
  }]
})

### Step 3 — Propose specific update content

For each file needing update, display the diff clearly:

```
## Proposed update: docs/screens/[feature]/screen.md

### New additions:
[New content]

### Changes:
~~[Old content]~~ → [New content]

### Deletions:
~~[Content to delete as no longer accurate]~~
```

### Step 4 — Gate: Review each file

question({
  questions: [{
    question: "Is the new content accurate?",
    header: "Accuracy",
    options: [
      { label: "Accurate", description: "Update content is correct" },
      { label: "Incorrect", description: "Content needs fixing" },
    ]
  }, {
    question: "Is there any other information I missed that needs updating?",
    header: "Missing",
    options: [
      { label: "No", description: "Already complete" },
      { label: "Yes", description: "There is additional information to add" },
    ]
  }]
})

### Step 5 — After applying

Before writing any doc file, get the current HEAD commit (must be post-merge — if not merged yet, this is the feature branch HEAD):

```bash
git log -1 --format="%h %s"   # short-sha + commit message
```

Use the result to fill in metadata fields for each updated doc:
- `**Last updated**: [YYYY-MM-DD HH:mm JST]` — time of running the skill
- `**Updated by task**: [TASK-ID]`
- `**Commit**: \`[short-sha]\` — [commit message]`

Update `docs/tasks/[TASK-ID]/verification.md` using template `templates/verification.en.md`. Fill in:
- **Verified by** + **Date** + **Status**
- List of verified ACs (AC-001, AC-002...)
- List of updated docs (screen.md, endpoint.md...)
- **Notes**: important observations for future maintainers

```
Task [TASK-ID] fully completed:
✅ Code merged
✅ Baseline docs updated
✅ Verification doc saved

Full task docs at: docs/tasks/[TASK-ID]/
```

---

## Core Principles for Docs Updates

- Docs describe **current behavior**, not history
- Delete old information, do not comment out
- If behavior changes significantly → consider creating an ADR (`/arch:adr`)
- Conflict between code and docs → code is the source of truth, update docs to match code
