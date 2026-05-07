# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# SDLC Skill Framework — VTI Software

Framework hỗ trợ toàn bộ SDLC cho mọi role. Tối ưu cho VTI outsource model (team VN → BE → khách Nhật).

---

## Developing This Framework

This repo IS the framework source. The "product" is the `.claude/commands/` directory — 21 Markdown skill files that Claude Code loads as slash commands.

### Run installer locally

```bash
# From a DIFFERENT directory (installer blocks src === dst)
node /path/to/ClaudeSkill/bin/install.js

# Non-interactive
node /path/to/ClaudeSkill/bin/install.js --yes

# Update existing install (overwrites all skill files)
node /path/to/ClaudeSkill/bin/install.js --update
node /path/to/ClaudeSkill/bin/install.js --update --yes
```

Or via npm:

```bash
npm run install-framework           # fresh install
npm run install-framework -- --update  # update existing
```

### Test installation

```powershell
# Windows: copy framework to temp dir, run from there
$tmp = "$env:TEMP\test-install"; mkdir $tmp -Force
node bin/install.js --yes   # run from project root — blocked (src===dst)
# Instead: npx . from temp target
Set-Location $tmp; npx github:hiepdnh/Agentic-Development-Lifecycle --yes
```

### Testing skill triggering

Verify Claude auto-invokes the correct skill for naive prompts (no `/command` syntax):

```bash
# All 21 skills
bash tests/skill-triggering/run-all.sh

# Single skill
bash tests/skill-triggering/run-test.sh tests/skill-triggering/prompts/ba-spec.txt
```

Requires: `claude` CLI authenticated, `jq` installed. Raw logs in `tests/.results/` (gitignored). See `tests/README.md` for debugging failures.

### Command file anatomy

Every `.claude/commands/[role]/[name].md` must have frontmatter + `# Skill:` header:

```markdown
---
name: role:command
description: >
  One-line description for Claude to match triggers.
  Trigger khi: user nói "...", hoặc gõ /role:command.
---

# Skill: /role:command
**Role**: [Role name]
**Mục đích**: [Purpose]

## [Steps with Human Gates]
```

- `name` — must match the file path convention (`role:command`)
- `description` — used by Claude to decide when to auto-trigger; include Vietnamese trigger phrases
- Every command must have at least 1 `**Chờ confirm.**` gate

### Subagent definitions (`agents/`)

Each agent file defines an **input contract** and **output JSON shape**. When spawning:
- Pass ONLY the minimal context the agent needs (no full conversation history)
- Summarize agent output before passing to the next agent in a chain

Agents: `task-reader`, `code-scout`, `planner`, `diff-reader`, `test-gen`, `doc-updater`

### Permissions model

`.claude/settings.json` gates what Claude Code can do in this repo:

- **Allow**: Read, Glob, Grep, `git log/diff/status`
- **Deny**: `git push`, `git reset --hard`, `rm -rf`

When adding new commands that need shell access, update `settings.json`.

---

## VTI Context

**Công ty**: VTI Software — outsource phần mềm cho khách hàng Nhật Bản  
**Model**: Team dev VN ↔ Bridge Engineer (BE) ↔ Khách hàng JP  
**Ngôn ngữ**: Code comments = tiếng Anh; Tài liệu nội bộ = tiếng Việt; Giao tiếp khách JP = tiếng Nhật  
**Encoding**: UTF-8 (hỗ trợ ký tự Nhật)  
**Timezone**: JST (UTC+9) cho deadline và meeting với khách  
**Deliverables JP style**: 設計書 (design doc), 単体テスト仕様書 (unit test spec), 成果物 (deliverables)

### Roles đặc thù VTI

| Role | Mô tả |
|------|-------|
| **Bridge Engineer (BE)** | Cầu nối giữa team VN và khách JP. Nhận requirement JP → clarify → chuyển spec cho team VN → review output trước khi gửi khách |
| **PM** | Quản lý sprint, resource, timeline. Báo cáo khách JP qua BE |
| **BA** | Phân tích nghiệp vụ, viết spec tiếng Việt từ requirement JP đã được BE dịch/clarify |
| **Dev** | Implement theo spec. Code comment tiếng Anh |
| **QA** | Test theo spec. Viết test report theo format JP nếu cần |
| **Arch** | Review design, tạo ADR |
| **DevOps** | Deploy, incident. Chú ý timezone JST khi lên schedule |
| **SM** | Scrum facilitation |

---

## Nguyên tắc cốt lõi

1. **Human Gate**: Không bao giờ tự động thực hiện. Luôn trình bày kết quả → hỏi câu hỏi làm rõ → chờ confirm.
2. **Multiple Options**: Luôn đưa ra 2-3 phương án với trade-off rõ ràng. Không bao giờ chỉ đưa 1 giải pháp.
3. **Fresh Context**: Dev tasks dùng subagent (Agent tool) để giữ context sạch, tiết kiệm token.
4. **Two-tier Docs**: Task docs (ephemeral, per issue) + Baseline docs (living, cập nhật sau verify).
5. **Delta Specs**: Mỗi thay đổi là 1 proposal có cấu trúc, không phải monolith.
6. **Template-first**: Commands reference templates, không duplicate format inline.

---

## Cấu trúc thư mục

```
.claude/commands/    # Slash commands cho từng role
agents/              # Subagent definitions (spawned bởi orchestrator commands)
docs/
  tasks/             # Task docs (Type 1) — mỗi issue 1 folder
  screens/           # Screen baseline docs (Type 2)
  api/               # API baseline docs (Type 2)
  decisions/         # Architecture Decision Records (ADR)
  workflows/         # Process guides và sprint lifecycle
templates/           # Template skeleton — commands reference đến đây
bin/install.js       # Interactive npm installer (@clack/prompts)
setup.ps1 / setup.sh # Shell-based installer alternatives
```

---

## Skill Commands

| Role | Command | Chức năng |
|------|---------|-----------|
| BE | `/be:bridge` | Requirement JP → Clarify ambiguity → Spec cho team VN |
| PM / BA | `/pm:ideate` | Ý tưởng mờ → Concept rõ (trước /ba:spec) |
| BA | `/ba:spec` | Raw requirement → Structured spec |
| BA | `/ba:user-story` | Spec → User Stories + AC |
| PM | `/pm:breakdown` | Epic → Tasks với estimate, tạo GitHub Issues |
| PM | `/pm:status` | Sprint status report |
| Dev | `/dev:analyze` | Task → Implementation options (multi-agent) |
| Dev | `/dev:implement` | Implement theo analysis.md, file-by-file với gates |
| Dev | `/dev:pr` | Code changes → PR description |
| Dev | `/dev:debug` | Systematic debugging: reproduce → localize → fix |
| Arch | `/arch:review` | Review design decision |
| Arch | `/arch:adr` | Generate Architecture Decision Record |
| QA | `/qa:testplan` | Spec → Test plan |
| QA | `/qa:bug` | Standardized bug report |
| QA | `/qa:regression` | Regression test checklist trước release |
| DevOps | `/ops:deploy` | Deployment checklist + CI quality gate |
| DevOps | `/ops:incident` | Incident response + RCA |
| SM | `/sm:standup` | Daily standup summary |
| SM | `/sm:retro` | Sprint retrospective |
| All | `/sec:review` | Security review trước merge (3-tier: Always/Ask First/Never) |
| All | `/docs:update` | Update baseline docs sau verify |

---

## Gate Patterns

### AskUserQuestion Tool — bắt buộc cho multi-choice gates

**Mọi gate có multiple options PHẢI dùng `AskUserQuestion` tool** — không output plain text markdown. Điều này render native TUI trong Claude Code thay vì numbered list.

```
AskUserQuestion({
  questions: [{
    question: "Câu hỏi cụ thể?",
    header: "Label ngắn",   // max 12 chars, hiện trên tab
    multiSelect: false,      // true nếu cho chọn nhiều
    options: [
      { label: "Option A", description: "Trade-off / chi tiết" },
      { label: "Option B", description: "Trade-off / chi tiết" },
    ]
  }]
})
```

Rules:
- `header`: max 12 ký tự, viết tắt nếu cần (ví dụ: "Scope", "Shell", "Approach")
- Max 4 options per question, max 4 questions per call
- `description`: giải thích trade-off — không để trống
- Câu hỏi open-ended (không có options rõ ràng) → output plain text bình thường

### Full Human Gate (mặc định)
```
[Skill chạy] → [Trình bày kết quả + assumptions] → [AskUserQuestion] → [Chờ confirm] → [Tiếp tục]
```

### Ask First Gate (thay đổi nhạy cảm)
Dừng ngay và hỏi senior trước khi thực hiện:
- Thay đổi authentication / authorization
- Breaking changes trong API
- Database migration ảnh hưởng data
- Thay đổi shared infrastructure
- Lưu trữ sensitive/PII data mới

---

## Spawning Subagents

Commands có multi-agent pattern dùng **Agent tool** của Claude Code để spawn subagents:

```
Agent({
  description: "task-reader: parse issue",
  prompt: "[nội dung theo agents/task-reader.md input contract]"
})
```

Mỗi subagent nhận **chỉ context cần thiết** — không pass full conversation history.  
Output từ subagent được tóm tắt trước khi pass vào subagent tiếp theo.

Subagent definitions: `agents/` folder.

---

## Two-tier Documentation

**Type 1 — Task Docs** (`docs/tasks/TASK-XXX/`)
- `requirements.md` — parsed từ issue (template: `templates/task-doc-requirements.md`)
- `analysis.md` — options đã cân nhắc
- `test-plan.md` — test cases
- `verification.md` — test results, sign-off

**Type 2 — Baseline Docs** (cập nhật sau verify)
- `docs/screens/[feature]/screen.md` — (template: `templates/baseline-screen.md`)
- `docs/api/[domain]/[endpoint].md` — (template: `templates/baseline-api.md`)
- `docs/decisions/ADR-XXX.md` — (template: `templates/adr.md`)

---

## VTI Deliverable Standards

Khi cần gửi tài liệu cho khách JP, format theo:

| Deliverable JP | Maps to framework |
|---------------|-------------------|
| 基本設計書 (Basic Design) | `docs/screens/` + `docs/api/` |
| 詳細設計書 (Detail Design) | `docs/tasks/[TASK]/analysis.md` |
| 単体テスト仕様書 (UT Spec) | `docs/tasks/[TASK]/test-plan.md` |
| 単体テスト結果 (UT Result) | `docs/tasks/[TASK]/verification.md` |

BE dùng `/be:bridge` để review và format lại trước khi gửi khách.

---

## Customization per project

1. Cập nhật section "VTI Context" với project name, khách hàng, repo URL
2. Thêm GitHub token, Jira URL, Confluence space vào `.env` hoặc settings
3. Thêm domain-specific skills nếu cần (ví dụ: `/domain-check` cho business rules đặc thù)
4. Cập nhật estimate unit: story points, man-days (人日), hay hours

**Xem full workflow**: `docs/workflows/sprint-lifecycle.md`  
**Role guide (ai dùng skill nào)**: `docs/workflows/role-guide.md`
