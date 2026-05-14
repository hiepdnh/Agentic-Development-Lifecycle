# VTI SDLC Skill Framework

<div align="right">
  <a href="README.md">🇬🇧 English</a> &nbsp;|&nbsp; <strong>🇻🇳 Tiếng Việt</strong>
</div>

<p align="center">
  <img src="assets/banner.png" alt="VTI SDLC Skill Framework" width="100%">
</p>

> **32 skills cho Claude Code & OpenCode** — phủ toàn bộ SDLC cho team phát triển phần mềm với AI.

---

## Đây là gì?

Một **bộ skill AI** cho team phát triển phần mềm. Cài vào bất kỳ project nào để có các skill theo role, có cấu trúc, phủ toàn bộ vòng đời sprint.

Hỗ trợ **cả Claude Code và OpenCode** — cùng bộ skill, khác runtime.

Xây dựng cho mô hình outsource của [VTI Software](https://vti.com.vn) (team dev VN → Bridge Engineer → khách hàng Nhật), nhưng phù hợp với bất kỳ team nào muốn AI hỗ trợ có cấu trúc.

---

## Cài đặt nhanh

### Claude Code

```bash
# macOS / Linux — chạy từ thư mục project của bạn
npx github:hiepdnh/Agentic-Development-Lifecycle --yes

# Hoặc dùng installer trực tiếp
node /path/to/ClaudeSkill/bin/install.js --yes
```

```powershell
# Windows
$tmp = "$env:TEMP\vti-install"; mkdir $tmp -Force; Set-Location $tmp
npx github:hiepdnh/Agentic-Development-Lifecycle --yes
```

Cập nhật bản cài đặt hiện tại:

```bash
npx github:hiepdnh/Agentic-Development-Lifecycle --update --yes
```

### OpenCode

```bash
# Cài vào project — target .opencode/skills/ theo mặc định
node /path/to/ClaudeSkill/bin/install.js --yes --opencode
```

```powershell
# Windows
node E:\AI Bootcamp\ClaudeSkill\bin\install.js --yes --opencode
```

**Cài gì**: thư mục skills + `agents/` + `templates/` + `docs/workflows/`

---

## Các Skill Command

### Phân tích Nghiệp vụ

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/pm:ideate` | Ý tưởng mơ hồ → concept rõ với problem statement + NOT Doing list | Rough idea → Concept doc |
| `/ba:spec` | Requirement thô → spec có cấu trúc | Requirements → `requirements.md` |
| `/ba:user-story` | Spec → User Stories với AC | Spec → User Stories |
| `/ba:reverse` | Reverse engineer legacy codebase → baseline docs | Codebase → `docs/baseline/` |
| `/be:bridge` | Dịch requirement JP, tạo tài liệu song ngữ JP-VN | JP req → VN spec + JP doc |
| `/be:changerequest` | 変更依頼 — impact analysis, approval trail, version control spec thay đổi | CR → Impact analysis + JP doc |
| `/be:glossary` | Duy trì glossary JP↔VN↔EN — thêm term, resolve conflict dịch thuật | Term mới → Glossary update |

### Quản lý Dự án

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/pm:breakdown` | Epic/Stories → Tasks với estimate + GitHub/GitLab Issues | Epic → Issues |
| `/pm:status` | Báo cáo trạng thái sprint cho stakeholder | Tasks → Status report |
| `/pm:dashboard` | Dashboard HTML tĩnh (kanban + health + backlog) | `docs/tasks/*/` → HTML |
| `/pm:kickoff` | Bootstrap greenfield project: tech stack → ADRs → docs structure → sprint 0 checklist | Requirement → Project scaffold |
| `/pm:release` | Tạo Release Notes / リリースノート từ merged PRs + closed issues | PRs + Issues → Release Notes |
| `/pm:handover` | Tạo gói bàn giao dự án (引き継ぎ) — codebase map + decisions + contact matrix | Project → Handover package |
| `/pm:maintain` | Workflow maintenance phase: triage → fix → monthly report (月次保守報告書) | Incident → Fix + Report |

### Phát triển

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/dev:analyze` | Task → 2-3 phương án implement với trade-off | Issue + codebase → `analysis.md` |
| `/dev:implement` | Implement file-by-file với human gate + verification + harness delta | `analysis.md` → Code → `verification.md` |
| `/dev:review` | Review toàn diện sau implement: code quality + architecture + security trong 1 lần | Diff + `analysis.md` → Review report → Approve / Request Changes |
| `/dev:pr` | Tạo PR description | Code diff → PR description |
| `/dev:debug` | Debug có cấu trúc: reproduce → localize → fix | Bug report → Fix |

### Kiến trúc

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/arch:review` | Review design decision | Design → Feedback |
| `/arch:adr` | Tạo Architecture Decision Record | Decision → `docs/decisions/ADR-NNN.md` |

### QA

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/qa:testplan` | Spec → Test plan | Spec → `test-plan.md` |
| `/qa:bug` | Bug report chuẩn hóa | Bug info → Bug report |
| `/qa:regression` | Checklist regression trước release | Release → Go/No-go checklist |

### DevOps

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/ops:deploy` | Deployment checklist + CI quality gate + rollback plan | Release → Checklist |
| `/ops:incident` | Triage incident + điều tra song song + RCA template | Incident → RCA |

### Bảo mật

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/sec:review` | Security review: Always check / Ask First / Never (OWASP Top 10) | Code → Security report |

### Tài liệu

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/docs:update` | Cập nhật baseline screen/API docs sau task verify | Verified task → Updated docs |
| `/docs:project` | Sync project-level docs: README, workflow guides, CLAUDE.md | Changes → Updated project docs |

### Scrum

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/sm:standup` | Tóm tắt daily standup | Updates → Standup report |
| `/sm:retro` | Sprint retrospective | Sprint → Retro report |

---

## Cách hoạt động

### Subagents (multi-agent pattern)

Task nặng spawn subagent nhẹ để giữ context sạch:

| Agent | Dùng bởi | Claude Code | OpenCode | Mục đích |
|-------|----------|-------------|----------|----------|
| `task-reader` | `/dev:analyze` | haiku | explorer | Parse issue → structured JSON |
| `code-scout` | `/dev:analyze` | haiku | explorer | Tìm files liên quan |
| `planner` | `/dev:analyze` | sonnet | oracle | Tổng hợp phương án |
| `diff-reader` | `/dev:pr`, `/docs:update` | haiku | explorer | Map diff → AC coverage |
| `review-reader` | `/dev:review` | haiku | explorer | Parse diff → code/arch/security signals |
| `test-gen` | `/qa:testplan` | sonnet | oracle | Tạo test cases |
| `doc-updater` | `/docs:update` | sonnet | oracle | Cập nhật baseline docs |
| `pr-resolver` | `/dev:pr` | sonnet | oracle | Phân tích review comments → fixes |

### Human Gates

Mọi skill đều có ít nhất 1 human gate — skill trình bày lựa chọn và **chờ quyết định của bạn** trước khi tiếp tục. Không tự động thực hiện.

- **Claude Code**: `AskUserQuestion` tool
- **OpenCode**: `question` tool

### Workflow điển hình

<p align="center">
  <img src="assets/workflow.png" alt="Sprint Workflow" width="100%">
</p>

### Sprint đầy đủ (end to end)

```
/pm:ideate → /ba:spec → /ba:user-story → /pm:breakdown

    ↓ (mỗi task)

/dev:analyze → [review analysis.md] → /dev:implement
    → /dev:review → /dev:pr
```

### Developer flow (một task)

```
/dev:analyze → [review analysis.md] → /dev:implement → /dev:review → /dev:pr
```

> **`/dev:analyze`** phân loại risk trước (tiny / normal / high-risk), sau đó dừng sau khi ghi `analysis.md`. Review xong mới trigger `/dev:implement` thủ công.  
> **`/dev:implement`** dừng sau khi ghi `verification.md` (diff review + kết quả self-test) và nhắc Harness Delta check. Sau đó trigger `/dev:review` — review 3 lens (code quality, architecture, security). Sau khi Approve mới trigger `/dev:pr`.

Xem chi tiết từng bước tại [`docs/workflows/sprint-lifecycle.md`](docs/workflows/sprint-lifecycle.md)  
Ai dùng skill nào: [`docs/workflows/role-guide.md`](docs/workflows/role-guide.md)

---

## Two-tier Documentation

```
docs/
  tasks/          ← Type 1: Per-task (ephemeral, gitignored trong framework source)
    TASK-001/
      requirements.md
      analysis.md
      test-plan.md
      verification.md
      audit.md        ← Append-only log mọi skill chạy + user input verbatim
  baseline/         ← Type 2: Baseline (living docs, cập nhật sau verify)
  screens/
  api/
  decisions/        ← ADRs
  workflows/        ← Hướng dẫn quy trình
```

**Type 1** (task docs): Tạo per issue, gitignored trong framework repo này. Project của bạn giữ lại.  
**Type 2** (baseline docs): Cập nhật sau mỗi task merge qua `/docs:update`.

---

## VTI Context

Tối ưu cho mô hình outsource VTI:

- **Bridge Engineer** — dịch requirement khách JP → spec cho team VN (`/be:bridge`)
- **BA** — viết spec tiếng Việt từ requirement đã clarify (`/ba:spec`)
- **Dev** — implement với AI guidance có cấu trúc, code comment tiếng Anh
- **QA** — test theo spec, tạo test report format Nhật nếu cần
- **Deliverables** — 設計書, 単体テスト仕様書, 成果物 format cho khách Nhật

---

## Cấu trúc dự án

```
.claude/commands/    # 32 Claude Code slash command files
.opencode/skills/    # 32 OpenCode skill files (auto-trigger)
agents/              # 8 subagent definitions
docs/
  workflows/         # Sprint lifecycle, role guide, flowchart
  decisions/         # ADR templates
templates/           # Skeleton templates
bin/install.js       # Installer tương tác (@clack/prompts) — hỗ trợ --opencode
setup.ps1            # PowerShell installer (Claude Code)
setup.sh             # Bash installer (Claude Code)
```

---

## Phát triển

Repo này là framework source. "Sản phẩm" là skill files cho cả hai nền tảng — `.claude/commands/` và `.opencode/skills/` (mỗi bên 32 files).

### Test skill triggering

**Claude Code:**
```bash
bash tests/skill-triggering/run-all.sh
bash tests/skill-triggering/run-all.sh --verbose
bash tests/skill-triggering/run-all.sh --filter dev-*
```
Yêu cầu: `claude` CLI đã auth + `jq` đã cài.

**OpenCode:**
```powershell
pwsh tests/skill-triggering/opencode-run-all.ps1
pwsh tests/skill-triggering/opencode-run-all.ps1 -Verbose
pwsh tests/skill-triggering/opencode-run-all.ps1 -Filter "dev-*"
```
Kiểm tra mapping prompt→skill file. Full trigger validation cần chạy trong OpenCode session.

---

## License

MIT — Tự do sử dụng và customize cho dự án của bạn.
