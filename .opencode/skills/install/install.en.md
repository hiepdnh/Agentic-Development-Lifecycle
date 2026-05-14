---
name: install
description: >
  Install the VTI SDLC framework into the current project (OpenCode port).
  Copy skills, agents, templates, workflows to the .opencode/ directory.
  Trigger when: user says "install framework", "set up SDLC", "setup skills",
  "/install", or needs to bootstrap the framework for a new project.
---

# /install
**Role**: All
**Purpose**: Install the VTI SDLC framework (OpenCode port) into the current project.

---

## Method 1 — Auto install (recommended)

```bash
# From the target project directory (not the framework source directory)
npx github:hiepdnh/Agentic-Development-Lifecycle --yes

# If the framework repo is already cloned, use the installer
node /path/to/ClaudeSkill/bin/install.js --yes
```

## Method 2 — Manual install (using this skill)

---

## Input

No arguments needed. Skill auto-detects:
- **Source**: directory containing this framework (where `/install.md` resides = `[SOURCE]/.opencode/skills/install/`)
- **Target**: current working directory of the OpenCode session

---

## Execution Guide

### Step 0 — Gate: Confirmation

<!-- Gate: Confirm installation -->
question({
  questions: [{
    question: "Install the VTI SDLC Framework (OpenCode) into this project?",
    header: "Confirm",
    options: [
      { label: "Install", description: "Copy skills to .opencode/skills/" },
      { label: "Cancel", description: "Do not install" },
    ]
  }]
})

### Step 0b — Determine paths

Use Glob/Read to find:
- Source root: parent directory 3 levels up from this file (`../../../` from this file's location)
- Target root: `$PWD` of the current session (from working directory)

Check:
- If working directory = source directory → report error, do not install
- If different → display for user confirmation:

```
Source : [SOURCE_PATH]
Target : [TARGET_PATH]
```

### Step 1 — Copy `.opencode/skills/`

Use Glob to list all files in `[SOURCE]/.opencode/skills/**/*.md`.

For each file:
- Compute the target path: `[TARGET]/.opencode/skills/[relative_path]`
- If target file already exists → report `[SKIP]`, do not overwrite
- If not exists → use Read + Write to copy

Report per file: `[OK]` or `[SKIP]`.

### Step 2 — Copy `agents/`

Glob `[SOURCE]/agents/*.md`. Copy each file to `[TARGET]/agents/`.
Skip if already exists.

### Step 3 — Copy `templates/`

Glob ALL files in `[SOURCE]/templates/` (both `.md` and `.html`). Copy each file to `[TARGET]/templates/`.
Skip if already exists.

### Step 4 — Copy `docs/workflows/`

Glob `[SOURCE]/docs/workflows/*.md`. Copy to `[TARGET]/docs/workflows/`.
Skip if already exists.

### Step 4b — Copy framework doc files

For each file:
- `docs/risk-classifier.md`
- `docs/validation-matrix.md`

Read from `[SOURCE]/docs/[FILE]`, Write to `[TARGET]/docs/[FILE]`.
Skip if target already exists.

### Step 4c — Copy `docs/improvement-backlog.md` (user-mutable)

Only copy if `[TARGET]/docs/improvement-backlog.md` does NOT already exist.
This file is updated by the user after tasks — ABSOLUTELY never overwrite for any reason.

### Step 4d — Copy `docs/analysis/`

Glob `[SOURCE]/docs/analysis/*.md`. Copy to `[TARGET]/docs/analysis/`.
Skip if file already exists.

### Step 5 — Create empty doc dirs

Check and create (if not present) `.gitkeep` files in:
- `[TARGET]/docs/api/.gitkeep`
- `[TARGET]/docs/screens/.gitkeep`
- `[TARGET]/docs/tasks/.gitkeep`
- `[TARGET]/docs/decisions/.gitkeep`

Use Write tool with empty content.

### Step 6 — Copy `CLAUDE.md`

- If `[TARGET]/CLAUDE.md` already exists → report `[SKIP] CLAUDE.md already exists — merge manually`, print source path for reference
- If not → Read + Write

---

## Results

```
## Installation Results

.opencode/skills/             [OK/SKIP per file]
agents/                        [OK/SKIP]
templates/                     [OK/SKIP] (md + html)
docs/workflows/                [OK/SKIP]
docs/ (framework files)        [OK/SKIP] (risk-classifier, validation-matrix)
docs/improvement-backlog.md    [OK/SKIP]
docs/analysis/                 [OK/SKIP]
docs/ (empty dirs)             [OK/SKIP] (api, screens, tasks, decisions)
CLAUDE.md                      [OK/SKIP]

Next steps:
1. Open CLAUDE.md, update the "VTI Context" section (project name, client, repo URL, tech stack)
2. Type / to see available skills: pm:ideate  ba:spec  dev:analyze  qa:testplan ...
```

---

## Notes

- This skill does NOT use shell — only uses Glob, Read, Write tools from OpenCode
- Never overwrite existing files — always Skip and notify user to merge manually
- `docs/improvement-backlog.md` is user-mutable — never overwrite even if user requests re-install
- If working directory = source directory → report error, do not install
