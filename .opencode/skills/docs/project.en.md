---
name: docs:project
description: >
  Update project-level documentation: README, workflow guides, installation guide, install scripts, AGENTS.md.
  Different from /docs:update (baseline screen/API after task) — this skill is for project-level docs.
  Trigger when: user says "update README", "update installation guide", "fix workflow guide",
  "update install script", "update AGENTS.md", "sync project docs", or types /docs:project.
---

# /docs:project
**Role**: Developer / Tech Lead / DevOps  
**Purpose**: Sync all project-level documentation (README, guides, install scripts, AGENTS.md) with the actual state of the codebase.

---

## Distinction from /docs:update

| Skill | When to use | Trigger |
|-------|-------------|---------|
| `/docs:update` | Baseline screen + API docs after task verify | After each task merge |
| `/docs:project` | README, workflow, install, AGENTS.md | When project undergoes major changes |

---

## Execution Guide

### Step 1 — Determine scope

Read the following files to understand the current state:
- `README.md` (or `README.vi.md` if available)
- `AGENTS.md`
- `docs/workflows/*.md`
- `bin/install.js`, `setup.sh`, `setup.ps1` (if any)
- `package.json` (scripts, version, dependencies)
- `pubspec.yaml` (if Flutter project)

Use the `question` tool to ask:

question({
  questions: [{
    question: "Which part would you like to update?",
    header: "Update Type",
    options: [
      { label: "README", description: "Introduction, quick start, badges" },
      { label: "Workflow guides", description: "docs/workflows/*.md (sprint lifecycle, role guide)" },
      { label: "Install scripts", description: "bin/install.js, setup.sh, setup.ps1" },
      { label: "AGENTS.md", description: "Skill commands, directory structure, VTI context" },
      { label: "All", description: "Scan everything and suggest what is outdated" },
    ]
  }, {
    question: "Where is the change coming from?",
    header: "Source of Change",
    options: [
      { label: "New code/feature", description: "New code/feature just merged" },
      { label: "New skill", description: "New skill commands added" },
      { label: "Process change", description: "Team/process changes" },
      { label: "Onboarding", description: "Onboarding new developer (needs comprehensive review)" },
    ]
  }]
})

---

### Step 2 — Audit: Find outdated content

For each file in scope, compare current content against reality:

**README audit checklist:**
- [ ] Are version numbers / badges still correct?
- [ ] Do the quick start steps still work? (test each command)
- [ ] Is the prerequisites list missing any new tools?
- [ ] Are screenshots/demos outdated?
- [ ] Are links to docs still valid?

**AGENTS.md audit checklist:**
- [ ] Does the skill commands table include all 22+ skills?
- [ ] Does the directory structure match `ls .opencode/skills/`?
- [ ] Is the subagent table in `agents/` correct?
- [ ] Does the VTI Context need a project name / repo URL update?

**Workflow guides audit checklist:**
- [ ] `docs/workflows/sprint-lifecycle.md` — is the process still accurate?
- [ ] `docs/workflows/role-guide.md` — are there new roles not yet added?
- [ ] Does the workflow reference any renamed skill commands?

**Install scripts audit checklist:**
- [ ] `bin/install.js` — does the file list include all new skills?
- [ ] `setup.sh` / `setup.ps1` — are dependency versions correct?
- [ ] Do `package.json` scripts reflect the correct install workflow?
- [ ] Does the `npx` command in README work?

---

### Step 3 — Propose changes

For each file needing an update, present in this format:

```
## 📄 [File name]

**Issues found:**
- [Description of outdated / incorrect / missing content]

**Proposed changes:**

--- CURRENT ---
[Content to delete/modify]

--- PROPOSED ---
[New content]

**Reason:** [Brief explanation of why the change is needed]
```

If a new section is needed (not a modification): present the full new content and suggest insertion location.

**Wait for confirmation on each file before applying.**

---

### Step 4 — Gate: Review each change

question({
  questions: [{
    question: "Is the proposed content accurate and complete?",
    header: "Content",
    options: [
      { label: "Accurate", description: "Update content is correct" },
      { label: "Needs fix", description: "Content is not accurate, needs editing" },
      { label: "Missing", description: "Some content was overlooked" },
    ]
  }]
})

**Wait for confirmation before writing files.**

---

### Step 5 — Apply and verify

After user confirms, apply each change:

1. **Edit files** — use the Edit tool, do not rewrite the entire file unless necessary
2. **Verify links** — check internal links (relative paths) after editing
3. **Verify install script** — if `bin/install.js` changed, check the `FILES_TO_COPY` list:
   ```bash
   node bin/install.js --dry-run 2>/dev/null || echo "dry-run not supported, review manually"
   ```
4. **Check README quick start** — if quick start commands changed, verify syntax is correct

---

### Step 6 — Create commit

After all files have been updated and verified:

```bash
git add README.md AGENTS.md docs/workflows/ bin/install.js setup.sh setup.ps1
git status
```

Propose commit message following convention:

```
docs: sync project docs with [feature/change name]

- README: [summary of changes]
- AGENTS.md: [summary of changes]  
- docs/workflows/: [summary of changes]
- bin/install.js: [summary of changes]
```

**Ask user before committing** — do not auto-commit.

---

### Step 7 — Notify team (optional)

If changes affect the onboarding flow (install script, README quick start), suggest:

- Create a GitLab/GitHub issue to notify the team to re-install
- Post to the relevant Slack/Teams channel
- If a breaking change in `npx` install: bump version in `package.json`

---

## Core Principles

- **Do not auto-commit** — always show diff and wait for confirmation
- **Edit, don't rewrite** — keep correct content, only fix what's wrong
- **Verify after editing** — especially with install scripts and links
- **Audience-aware** — README for end users differs from AGENTS.md for AI
- **Vietnamese for internal documentation** — README can be bilingual if there are JP clients
