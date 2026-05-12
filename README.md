# VTI SDLC Skill Framework

<div align="right">
  <strong>🇬🇧 English</strong> &nbsp;|&nbsp; <a href="README.vi.md">🇻🇳 Tiếng Việt</a>
</div>

<p align="center">
  <img src="assets/banner.png" alt="VTI SDLC Skill Framework" width="100%">
</p>

> **26 slash commands** covering the full SDLC — for teams building software with AI assistance.

---

## What is this?

A **Claude Code skill pack** for software development teams. Install it into any project to get structured, role-aware AI commands that cover every phase of the sprint lifecycle.

Built for [VTI Software](https://vti.com.vn) outsource model (Vietnamese dev team → Bridge Engineer → Japanese clients), but works for any team that wants structured AI assistance.

---

## Quick Install

```bash
# macOS / Linux — run from your target project directory
npx github:hiepdnh/Agentic-Development-Lifecycle --yes
```

```powershell
# Windows
$tmp = "$env:TEMP\vti-install"; mkdir $tmp -Force; Set-Location $tmp
npx github:hiepdnh/Agentic-Development-Lifecycle --yes
```

Or update an existing install:

```bash
npx github:hiepdnh/Agentic-Development-Lifecycle --update --yes
```

**What gets installed**: `.claude/commands/` (skill files) + `agents/` (subagent definitions) + `templates/` + `docs/workflows/`

### Developer Lite (minimal install)

Just want the developer workflow without PM/BA/QA/Ops overhead?

```bash
# Copy only developer skills into your project
node packages/developer-lite/bin/install.js --yes
```

Includes: `/dev:analyze` `/dev:implement` `/dev:review` `/dev:pr` `/dev:debug` `/sec:review` `/arch:adr` `/docs:update`

---

## Skill Commands

### Business Analysis

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/pm:ideate` | Refine vague idea → clear concept with problem statement + NOT Doing list | Rough idea → Concept doc |
| `/ba:spec` | Raw requirement → structured spec | Requirements → `requirements.md` |
| `/ba:user-story` | Spec → User Stories with AC | Spec → User Stories |
| `/ba:reverse` | Reverse engineer legacy codebase → baseline docs | Codebase → `docs/baseline/` |
| `/be:bridge` | Translate JP requirements, create bilingual JP-VN deliverables | JP req → VN spec + JP doc |

### Project Management

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/pm:breakdown` | Epic/Stories → Tasks with estimates + GitHub/GitLab Issues | Epic → Issues |
| `/pm:status` | Sprint status report for stakeholders | Tasks → Status report |
| `/pm:dashboard` | Static HTML sprint dashboard (kanban + health + backlog) | `docs/tasks/*/` → HTML |

### Development

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/dev:analyze` | Task → 2-3 implementation options with trade-offs | Issue + codebase → `analysis.md` |
| `/dev:implement` | Implement file-by-file with human gates + verification + harness delta check | `analysis.md` → Code → `verification.md` |
| `/dev:review` | Holistic review after implement: code quality + architecture + security in one run | Diff + `analysis.md` → Review report → Approve / Request Changes |
| `/dev:pr` | Generate PR description | Code diff → PR description |
| `/dev:debug` | Structured debugging: reproduce → localize → fix | Bug report → Fix |

### Architecture

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/arch:review` | Design decision review | Design → Feedback |
| `/arch:adr` | Create Architecture Decision Record | Decision → `docs/decisions/ADR-NNN.md` |

### QA

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/qa:testplan` | Spec → Test plan | Spec → `test-plan.md` |
| `/qa:bug` | Standardized bug report | Bug info → Bug report |
| `/qa:regression` | Regression checklist before release | Release → Go/No-go checklist |

### DevOps

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/ops:deploy` | Deployment checklist + CI quality gate + rollback plan | Release → Checklist |
| `/ops:incident` | Incident triage + parallel investigation + RCA template | Incident → RCA |

### Security

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/sec:review` | Security review: Always check / Ask First / Never (OWASP Top 10) | Code → Security report |

### Documentation

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/docs:update` | Update baseline screen/API docs after task verify | Verified task → Updated docs |
| `/docs:project` | Sync project-level docs: README, workflow guides, CLAUDE.md | Changes → Updated project docs |

### Scrum

| Command | What it does | Input → Output |
|---------|-------------|----------------|
| `/sm:standup` | Daily standup summary | Updates → Standup report |
| `/sm:retro` | Sprint retrospective | Sprint → Retro report |

---

## How It Works

### Subagents (multi-agent pattern)

Heavy tasks spawn lightweight subagents to keep context clean:

| Agent | Used by | Model | Purpose |
|-------|---------|-------|---------|
| `task-reader` | `/dev:analyze` | haiku | Parse issue → structured JSON |
| `code-scout` | `/dev:analyze` | haiku | Find relevant files |
| `planner` | `/dev:analyze` | sonnet | Synthesize options |
| `diff-reader` | `/dev:pr`, `/docs:update` | haiku | Map diff → AC coverage |
| `review-reader` | `/dev:review` | haiku | Parse diff → code/arch/security signals |
| `test-gen` | `/qa:testplan` | sonnet | Generate test cases |
| `doc-updater` | `/docs:update` | sonnet | Update baseline docs |

### Human Gates

Every command has at least one `AskUserQuestion` gate — Claude presents options and **waits for your decision** before proceeding. No auto-execution.

### Typical Workflows

<p align="center">
  <img src="assets/workflow.png" alt="Sprint Workflow" width="100%">
</p>

### Full sprint (end to end)

```
/pm:ideate → /ba:spec → /ba:user-story → /pm:breakdown

    ↓ (per task)

/dev:analyze → [review analysis.md] → /dev:implement
    → /dev:review → /dev:pr
```

### Developer flow (single task)

```
/dev:analyze → [review analysis.md] → /dev:implement → /dev:review → /dev:pr
```

> **`/dev:analyze`** classifies risk first (tiny / normal / high-risk), then stops after writing `analysis.md`. Review it, then trigger `/dev:implement` manually.  
> **`/dev:implement`** stops after writing `verification.md` (diff review + self-test results), then prompts a Harness Delta check. Then trigger `/dev:review` — 3-lens report (code quality, architecture, security). After Approve, trigger `/dev:pr`.

Full step-by-step: [`docs/workflows/sprint-lifecycle.md`](docs/workflows/sprint-lifecycle.md)  
Who uses which skill: [`docs/workflows/role-guide.md`](docs/workflows/role-guide.md)

---

## Two-tier Documentation

```
docs/
  tasks/          ← Type 1: Per-task (ephemeral, gitignored in framework source)
    TASK-001/
      requirements.md
      analysis.md
      test-plan.md
      verification.md
      audit.md        ← Append-only log of all skill runs + user input verbatim
  baseline/         ← Type 2: Baseline (living docs, updated after verify)
  screens/
  api/
  decisions/        ← ADRs
  workflows/        ← Process guides
```

**Type 1** (task docs): Created per issue, gitignored in this framework repo. Your project keeps them.  
**Type 2** (baseline docs): Updated after each verified task merge via `/docs:update`.

---

## VTI Context

Optimized for the VTI outsource model:

- **Bridge Engineer** — translates JP client requirements → VN team spec (`/be:bridge`)
- **BA** — writes spec in Vietnamese from clarified requirements (`/ba:spec`)
- **Dev** — implements with structured AI guidance, code comments in English
- **QA** — tests per spec, generates JP-format test reports if needed
- **Deliverables** — 設計書, 単体テスト仕様書, 成果物 formatted for Japanese clients

---

## Project Structure

```
.claude/commands/    # 26 slash command files
agents/              # 7 subagent definitions
docs/
  workflows/         # Sprint lifecycle, role guide, flowchart
  decisions/         # ADR templates
templates/           # Skeleton templates referenced by commands
bin/install.js       # Interactive installer (@clack/prompts)
setup.ps1            # PowerShell installer
setup.sh             # Bash installer
```

---

## Development

This repo IS the framework. The “product” is `.claude/commands/` — 26 Markdown skill files.

### Test skill triggering

```bash
# Run all 26 skill trigger tests
bash tests/skill-triggering/run-all.sh

# Verbose output
bash tests/skill-triggering/run-all.sh --verbose

# Filter by prefix
bash tests/skill-triggering/run-all.sh --filter dev-*
```

Requires: `claude` CLI authenticated + `jq` installed.

---

## License

MIT — Free to use and customize for your own projects.
