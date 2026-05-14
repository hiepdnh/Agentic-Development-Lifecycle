# Developer Lite — Skill Pack for Claude Code

Minimal SDLC skill set for individual developers and small teams.  
Stripped from the full [Agentic Development Lifecycle](../../README.md) — no PM, BA, QA, Ops, or Bridge Engineer overhead.

## Skills included

| Skill | When to use |
|-------|-------------|
| `/dev:analyze` | Before coding — understand task, map code, pick approach |
| `/dev:implement` | Write code file-by-file with gates (TDD lane opt-in) |
| `/dev:review` | 4-lens review: code quality + architecture + performance + security |
| `/dev:pr` | Generate PR description, auto-populates from verification results |
| `/dev:debug` | Systematic debug: reproduce → localize → fix → guard |
| `/sec:review` | Security check before merge (OWASP Top 10) |
| `/arch:adr` | Document design decisions as ADRs |
| `/docs:update` | Sync baseline docs after task verified and merged |

## Install

```bash
# From your project directory
npx github:hiepdnh/Agentic-Development-Lifecycle/packages/developer-lite --yes
```

Or copy `.claude/` and `CLAUDE.md` into your project manually.

## Workflow

```
Task arrives
  → /dev:analyze     — understand + map code + pick option
  → /dev:implement   — file-by-file with self-test gate
  → /dev:review      — 4-lens quality gate
  → /dev:pr          — PR description ready
  → merge
  → /docs:update     — keep baseline docs fresh
```

For bugs:
```
Bug reported → /dev:debug → fix → /dev:review → /dev:pr
```

## What's NOT included (use full framework instead)

| Role | Skills |
|------|--------|
| PM | `/pm:ideate`, `/pm:breakdown`, `/pm:status`, `/pm:kickoff`, `/pm:release`, `/pm:maintain`, `/pm:handover` |
| BA | `/ba:spec`, `/ba:user-story`, `/ba:reverse` |
| Bridge Engineer | `/be:bridge`, `/be:changerequest`, `/be:glossary` |
| QA | `/qa:testplan`, `/qa:regression`, `/qa:bug` |
| DevOps | `/ops:deploy`, `/ops:incident` |
| Scrum Master | `/sm:standup`, `/sm:retro` |

Full framework: [Agentic-Development-Lifecycle](https://github.com/hiepdnh/Agentic-Development-Lifecycle)
