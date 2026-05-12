# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# SDLC Skill Framework — VTI Software

Framework hỗ trợ toàn bộ SDLC cho mọi role. Tối ưu cho VTI outsource model (team VN → BE → khách Nhật).

---

## Developing This Framework

This repo IS the framework source. The "product" is the `.claude/commands/` directory — 26 Markdown skill files that Claude Code loads as slash commands.

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

### Install via npx (end-user path)

```bash
# macOS/Linux — from the target project directory
npx github:hiepdnh/Agentic-Development-Lifecycle --yes

# Update existing install
npx github:hiepdnh/Agentic-Development-Lifecycle --update --yes
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
# All 26 skills
bash tests/skill-triggering/run-all.sh

# With flags
bash tests/skill-triggering/run-all.sh --verbose          # show full output per test
bash tests/skill-triggering/run-all.sh --filter dev-*     # run only dev-* prompts

# Single skill (max-turns defaults to 3)
bash tests/skill-triggering/run-test.sh tests/skill-triggering/prompts/ba-spec.txt
bash tests/skill-triggering/run-test.sh tests/skill-triggering/prompts/ba-spec.txt 5  # custom max-turns
```

**Prompt filename → expected skill**: the test harness derives the expected skill by replacing the **first** hyphen with a colon (`ba-spec.txt` → `ba:spec`, `sm-standup.txt` → `sm:standup`). New prompt files must follow this pattern.

Requires: `claude` CLI authenticated, `jq` installed. Raw logs in `tests/.results/<timestamp>/` (gitignored). See `tests/README.md` for debugging failures.

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

| Agent | Spawned by | Model | Purpose |
|-------|-----------|-------|--------|
| `task-reader` | `/dev:analyze` | haiku | Parse issue → structured JSON (no codebase access) |
| `code-scout` | `/dev:analyze` | haiku | Find relevant files for a task (read-only) |
| `planner` | `/dev:analyze` | sonnet | Synthesize task + code map → 2-3 implementation options |
| `diff-reader` | `/dev:pr`, `/docs:update` | haiku | Summarize git diff for PR description |
| `review-reader` | `/dev:review` | haiku | Parse diff → code/arch/security signals cho 3-lens review |
| `test-gen` | `/qa:testplan` | sonnet | Generate test cases from spec |
| `doc-updater` | `/docs:update` | sonnet | Update baseline docs after verification |

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
  tasks/             # Task docs (Type 1) — mỗi issue 1 folder, kèm audit.md
  baseline/          # Codebase reverse-engineering output (từ /ba:reverse)
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
|------|---------|----------|
| BE | `/be:bridge` | Requirement JP → Clarify ambiguity → Spec cho team VN |
| PM / BA | `/pm:ideate` | Ý tưởng mờ → Concept rõ (trước /ba:spec) |
| BA | `/ba:spec` | Raw requirement → Structured spec |
| BA | `/ba:user-story` | Spec → User Stories + AC |
| BA / Tech Lead | `/ba:reverse` | Reverse engineer codebase brownfield → baseline docs (take-over, audit) |
| PM | `/pm:breakdown` | Epic → Tasks với estimate, tạo GitHub Issues |
| PM | `/pm:status` | Sprint status report |
| PM | `/pm:dashboard` | Generate static HTML dashboard từ `docs/tasks/*/` — kanban + health table + backlog |
| Dev | `/dev:analyze` | Task → Implementation options (multi-agent) |
| Dev | `/dev:implement` | Implement theo analysis.md, file-by-file với gates |
| Dev | `/dev:review` | Review toàn diện: code quality + architecture + security trong 1 lần |
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
| All | `/docs:update` | Update baseline screen/API docs sau verify |
| All | `/docs:project` | Sync project-level docs: README, workflow guides, install scripts, CLAUDE.md |
| All | `/install` | Cài VTI SDLC framework vào project hiện tại — copy commands, agents, templates, workflows |

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

### Risk Classifier Gate — bước 0 của mọi task

Trước khi bắt đầu bất kỳ task nào, classify risk theo `docs/risk-classifier.md`:

```
Input type: [new-spec | spec-slice | change-request | maintenance | ...]
Risk checklist: [R-01 ✅ / ❌ ... R-10 ✅ / ❌]
Lane: tiny | normal | high-risk
```

- **Tiny** → patch trực tiếp, bỏ qua analysis.md
- **Normal** → chạy đủ dev:analyze → dev:implement → dev:review → dev:pr
- **High-risk** → dừng, hỏi senior trước khi tiếp tục

### Ask First Gate (thay đổi nhạy cảm)
Dừng ngay và hỏi senior trước khi thực hiện (xem đầy đủ tại `assets/ask-first-gates.md`):
- Thay đổi authentication / authorization
- Breaking changes trong API
- Database migration ảnh hưởng data
- Thay đổi shared infrastructure
- Lưu trữ sensitive/PII data mới

### Harness Delta — cuối mỗi task

Sau khi task hoàn tất, ghi lại friction vào `docs/improvement-backlog.md` nếu có:
- Gate không rõ → phải đoán
- Template thiếu field
- Cùng vấn đề lần thứ 2+

---

## Spawning Subagents

Commands có multi-agent pattern dùng **Agent tool** của Claude Code để spawn subagents:

```
Agent({
  description: "task-reader: parse issue",
  prompt: "[nội dung theo agents/task-reader.md input contract]",
  model: "haiku"   // đọc từ agent frontmatter model: field
})
```

Mỗi subagent nhận **chỉ context cần thiết** — không pass full conversation history.  
Output từ subagent được tóm tắt trước khi pass vào subagent tiếp theo.

Model được chỉ định per-agent để tối ưu token (xem frontmatter `model:` trong mỗi file `agents/*.md`):
- **haiku**: read-only/parse agents (task-reader, code-scout, diff-reader, review-reader)
- **sonnet**: reasoning/synthesis agents (planner, doc-updater, test-gen)

Subagent definitions: `agents/` folder.

---

## Two-tier Documentation

**Type 1 — Task Docs** (`docs/tasks/TASK-XXX/`) — **gitignored trong framework source repo**
- `requirements.md` — parsed từ issue (template: `templates/task-doc-requirements.md`)
- `analysis.md` — options đã cân nhắc
- `test-plan.md` — test cases
- `verification.md` — test results, sign-off
- `audit.md` — append-only log mọi skill chạy + user input verbatim (template: `templates/audit.md`)

**Type 2 — Baseline Docs** (cập nhật sau verify)
- `docs/baseline/codebase-overview.md` — codebase map từ `/ba:reverse` (brownfield only)
- `docs/screens/[feature]/screen.md` — (template: `templates/baseline-screen.md`)
- `docs/api/[domain]/[endpoint].md` — (template: `templates/baseline-api.md`)
- `docs/decisions/ADR-XXX.md` — (template: `templates/adr.md`)

---

## Output Format Convention

Tham khảo bài viết Thariq Shihipar — *"The Unreasonable Effectiveness of HTML"* ([phân tích nội bộ](docs/analysis/html-effectiveness-thariq.md)). Mỗi skill chọn format theo **consumer cuối cùng** của artifact, KHÔNG theo thói quen:

| Loại artifact | Consumer | Format | Lý do |
|---------------|----------|--------|-------|
| Storage / commit vào repo | Git, future devs | **Markdown** | Diffable, GitHub render |
| One-shot review/decision | Human đang quyết định | **HTML** | Click, sort, filter — nhanh hơn |
| JP deliverable (成果物) | Khách Nhật | **HTML** | Đẹp khi forward email/print |
| Chained vào agent kế tiếp | LLM | **Markdown/JSON** | Token rẻ, parse dễ |
| Platform render (GitHub/Slack) | Web platform | **Markdown** | Platform tự render |

**Quy tắc**: artifact nào có ý định *để tiếp tục làm việc* (sort, filter, tick checkbox, copy field) → HTML. Artifact để *đọc rồi commit* → Markdown.

### Skill format matrix

| Skill | Format chính | HTML companion (one-shot, không commit) |
|-------|-------------|------------------------------------------|
| `/dev:analyze` | MD (`analysis.md`) | `analysis-compare.html` — sort/filter phương án |
| `/qa:testplan` | MD (`test-plan.md`) | `test-plan.html` — checklist tick + localStorage |
| `/qa:regression` | HTML | `regression-checklist.html` — go/no-go decision |
| `/pm:status` | HTML | `sprint-status.html` — kanban + velocity |
| `/be:bridge` | MD + HTML | `deliverable.html` — 2 cột JP/VN, copy button |
| Còn lại (17 skill) | MD | (xem nhóm B trong `docs/analysis/html-effectiveness-thariq.md` để mở rộng khi cần) |

HTML artifact dùng template `templates/html-artifact.html` (interactive) hoặc `templates/html-bilingual.html` (JP-VN). File HTML one-shot KHÔNG commit — `.gitignore` loại trừ `docs/tasks/**/*.html`.

### Audit Log convention

Mọi skill thay đổi state của task (BA/Dev/QA/Arch...) PHẢI append entry vào `docs/tasks/[TASK-ID]/audit.md`:
- **User input verbatim** (không paraphrase)
- **Timestamp JST** ISO format
- **Skill name** + stage
- **Decision + artifact reference**

Khác biệt với Q&A History trong `requirements.md`: Q&A History chỉ ghi clarify Q&A của BA; audit log ghi MỌI skill chạy trong task. Dùng để defend quyết định khi khách JP chất vấn ("なぜこの設計?") sau N tháng.

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
