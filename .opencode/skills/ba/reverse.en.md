---
name: ba:reverse
description: >
  Reverse engineer brownfield codebases (legacy/take-over from old vendor) into baseline
  documentation: business overview, tech stack, package inventory, key APIs, technical debt.
  Triggers when: user says "reverse engineer codebase", "onboard codebase legacy", "phân tích codebase cũ",
  "take-over từ vendor", "tạo codemap", "brownfield analysis", or types /ba:reverse.
---
## Summary

Reverse engineer brownfield codebases (legacy/take-over from old vendor) into baseline documentation: business overview, tech stack, package inventory, key APIs, technical debt. Triggers when: user says "reverse engineer codebase", "onboard codebase legacy", "phân tích codebase cũ", "take-over từ vendor", "tạo codemap", "brownfield analysis", or types /ba:reverse.

## Workflow

# /ba:reverse
**Role**: Business Analyst / Tech Lead  
**Purpose**: Onboard brownfield codebases (legacy or take-over from an old vendor) — generate baseline documentation so the VN team has context before taking on maintenance/new features.

**When to use**:
- Japanese client takes over a project from another vendor → needs to understand the codebase before committing estimates
- VN team inherits a legacy codebase with no documentation
- Audit an old codebase before deciding to refactor / rebuild

**When NOT to use**: Greenfield projects (use `/ba:spec` from scratch).

---

## Execution Guide

### Step 1 — Gate: Determine reverse scope

<!-- Gate: Determine reverse goal -->
question({
  questions: [
    {
      question: "What is the goal of the reverse engineering?",
      header: "Goal",
      options: [
        { label: "Full take-over", description: "Preparing to take over maintenance — need to understand everything" },
        { label: "New scope estimate", description: "Only need an overview to estimate a new feature — no deep dive" },
        { label: "Refactor audit", description: "Assess technical debt to decide on refactor/rebuild" }
      ]
    },
    {
      question: "Scope of the codebase?",
      header: "Scope",
      options: [
        { label: "Entire repo", description: "Scan every package/module" },
        { label: "Specific subset", description: "User specifies path/module" },
        { label: "Single service", description: "Only 1 service in a monorepo" }
      ]
    }
  ]
})

### Step 2 — Spawn subagent to scan (avoid bloating the main context)

Use an **explorer subagent** (read-only, fast) for parallel survey:

```markdown
task({
  description: "Codebase scout for reverse engineering",
  subagent_type: "explorer",
  prompt: "Scan codebase at [scope]. Find and report using this structure:
    1. Languages + frameworks (read package.json/pom.xml/requirements.txt/go.mod...)
    2. Top-level package structure (max 3 levels)
    3. Entry points (main, server start, CLI)
    4. Database schemas (migrations folder, ORM models)
    5. External integrations (API clients, SDK imports)
    6. Test coverage signals (test folder size, CI config)
    7. Code quality red flags (TODO/FIXME density, file size outliers)
  Report under 600 words, include file path:line for each important finding."
})
```

### Step 3 — Gate: Present findings + confirm depth direction

```
## I have scanned the codebase. Initial findings:

**Tech stack**: [...]
**Architecture pattern**: [Monolith / Microservices / Modular monolith]
**Entry points**: [...]
**Red flags detected**: [Top 3 technical debt items — file:line]
```

<!-- Gate: Confirm detail level -->
question({
  questions: [
    {
      question: "How detailed should the codemap be?",
      header: "Depth",
      options: [
        { label: "Overview (1 page)", description: "Architecture diagram + tech stack — enough for estimating" },
        { label: "Standard (5-10 pages)", description: "+ package inventory + API list + DB schema — enough for take-over" },
        { label: "Deep (20+ pages)", description: "+ data flow + business rules inferred from code — enough for rebuild" }
      ]
    },
    {
      question: "Output language?",
      header: "Lang",
      options: [
        { label: "Vietnamese", description: "For the VN team" },
        { label: "Bilingual VN-JP", description: "JP client will review — needs /be:bridge to review afterwards" },
        { label: "English", description: "For a mixed team" }
      ]
    }
  ]
})

### Step 4 — Generate baseline docs

Before writing any files, capture the current baseline commit:

```bash
git log -1 --format="%h %s"   # short-sha + commit message
```

Use the result to fill in `generatedFrom` (short-sha) and `generatedAt` (JST timestamp at the time this skill is run).

Create the `docs/baseline/` folder (if it doesn't exist) and write:

**`docs/baseline/codebase-overview.md`** — always create:
```markdown
---
generatedAt: [YYYY-MM-DD HH:mm JST]
generatedFrom: [short-sha]
scope: [path scanned]
---

# Codebase Overview — [Project Name]

## 1. Business Context (inferred from code)
[Description of what the app does, based on route names + DB tables + UI labels]

## 2. Tech Stack
| Layer | Technology | Version | Notes |

## 3. Architecture
[ASCII/Mermaid diagram + 1 paragraph description]

## 4. Package Inventory
[Top 10 most important packages + 1-line description each]

## 5. Entry Points
[How the app starts — main file, server start, CLI commands]

## 6. External Integrations
[External API/SDK/MQ the code calls]

## 7. Database
[Schema overview — main tables, relationships]

## 8. Code Quality Assessment
- **Test coverage signal**: [folder size ratio, CI badge if any]
- **Technical debt** (top 5 hotspots — file:line + reason)
- **Security red flags** (hardcoded secrets, outdated deps — flag only, do not fix)

## 9. Unknown / Need client clarification
- [Q1: Is there an original spec?]
- [Q2: What is the business purpose of module X?]
```

**Optional** (if Standard/Deep depth):
- `docs/baseline/api-inventory.md` — list endpoints + code origin
- `docs/baseline/db-schema.md` — tables + relationships

**Audit**: append an entry to `docs/baseline/audit.md` (template: `templates/audit.en.md`).

### Step 5 — Final Gate: Review + handoff

```
## Baseline docs created:
- docs/baseline/codebase-overview.md ([N] sections)
- [other files if any]

**Notable findings the client/PM should know**:
1. [Top finding 1 — e.g., 30% of code has no tests]
2. [Top finding 2 — e.g., uses framework EOL since 2022]
3. [Top finding 3 — e.g., 15 endpoints undocumented]
```

<!-- Final Gate: Review baseline docs -->
question({
  questions: [{
    question: "Baseline docs have been created. Confirm?",
    header: "Finalize",
    options: [
      { label: "Confirm", description: "Baseline docs are complete" },
      { label: "Needs editing", description: "I will describe what needs to be changed" }
    ]
  }]
})

**Next steps**:
- If **Take-over**: use `/be:bridge` to review docs + format in JP before sending to the client
- If **New scope estimate**: use `/ba:spec` with context from codebase-overview.md
- If **Refactor audit**: use `/arch:adr` to document the refactor/rebuild decision

---

## Important Notes

- **Do not** infer business rules without evidence in the code → mark as `[?]` and add to the "Unknown" section
- **Do not fix anything** in this skill — only document. Fixing is the job of `/dev:implement` or a separate refactor task
- **Do not expose secrets** even if found — only flag "hardcoded credential at file:line" without pasting content
- **Always** use an explorer subagent for scanning — do not scan in the main context to avoid token bloat
- **Output `docs/baseline/`** — distinct from `docs/screens/` (screen baseline) and `docs/api/` (API baseline for new features)
- **Re-run after N months**: if the codebase has changed significantly, append a section `## Drift since [date] · commit=[short-sha]` instead of overwriting. Update the frontmatter:
  ```yaml
  generatedAt: [original date]
  generatedFrom: [original short-sha]
  updatedAt: [YYYY-MM-DD HH:mm JST]
  updatedCommit: [new short-sha]
  ```
