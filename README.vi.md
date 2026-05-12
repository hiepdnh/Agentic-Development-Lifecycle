# VTI SDLC Skill Framework

<div align="right">
  <a href="README.md">🇬🇧 English</a> &nbsp;|&nbsp; <strong>🇻🇳 Tiếng Việt</strong>
</div>

<p align="center">
  <img src="assets/banner.png" alt="VTI SDLC Skill Framework" width="100%">
</p>

> **26 slash commands** phủ toàn bộ SDLC — dành cho team phát triển phần mềm với AI.

---

## Đây là gì?

Một **bộ skill cho Claude Code** dành cho team phát triển phần mềm. Cài vào bất kỳ project nào để có các lệnh AI theo role, có cấu trúc, phủ toàn bộ vòng đời sprint.

Xây dựng cho mô hình outsource của [VTI Software](https://vti.com.vn) (team dev VN → Bridge Engineer → khách hàng Nhật), nhưng phù hợp với bất kỳ team nào muốn AI hỗ trợ có cấu trúc.

---

## Cài đặt nhanh

```bash
# macOS / Linux — chạy từ thư mục project của bạn
npx github:hiepdnh/Agentic-Development-Lifecycle --yes
```

```powershell
# Windows
$tmp = "$env:TEMP\vti-install"; mkdir $tmp -Force; Set-Location $tmp
npx github:hiepdnh/Agentic-Development-Lifecycle --yes
```

Hoặc cập nhật bản cài đặt hiện tại:

```bash
npx github:hiepdnh/Agentic-Development-Lifecycle --update --yes
```

**Cài gì**: `.claude/commands/` (26 skill files) + `agents/` (7 subagent definitions) + `templates/` + `docs/workflows/`

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

### Quản lý Dự án

| Command | Chức năng | Input → Output |
|---------|-----------|----------------|
| `/pm:breakdown` | Epic/Stories → Tasks với estimate + GitHub/GitLab Issues | Epic → Issues |
| `/pm:status` | Báo cáo trạng thái sprint cho stakeholder | Tasks → Status report |
| `/pm:dashboard` | Dashboard HTML tĩnh (kanban + health + backlog) | `docs/tasks/*/` → HTML |

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

| Agent | Dùng bởi | Model | Mục đích |
|-------|----------|-------|----------|
| `task-reader` | `/dev:analyze` | haiku | Parse issue → structured JSON |
| `code-scout` | `/dev:analyze` | haiku | Tìm files liên quan |
| `planner` | `/dev:analyze` | sonnet | Tổng hợp phương án |
| `diff-reader` | `/dev:pr`, `/docs:update` | haiku | Map diff → AC coverage |
| `review-reader` | `/dev:review` | haiku | Parse diff → code/arch/security signals |
| `test-gen` | `/qa:testplan` | sonnet | Tạo test cases |
| `doc-updater` | `/docs:update` | sonnet | Cập nhật baseline docs |

### Human Gates

Mọi command đều có ít nhất 1 `AskUserQuestion` gate — Claude trình bày lựa chọn và **chờ quyết định của bạn** trước khi tiếp tục. Không tự động thực hiện.

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
.claude/commands/    # 26 slash command files
agents/              # 7 subagent definitions
docs/
  workflows/         # Sprint lifecycle, role guide, flowchart
  decisions/         # ADR templates
templates/           # Skeleton templates
bin/install.js       # Installer tương tác (@clack/prompts)
setup.ps1            # PowerShell installer
setup.sh             # Bash installer
```

---

## Phát triển

Repo này là framework source. “Sản phẩm” là `.claude/commands/` — 26 Markdown skill files.

### Test skill triggering

```bash
# Chạy toàn bộ 26 skill trigger tests
bash tests/skill-triggering/run-all.sh

# Verbose output
bash tests/skill-triggering/run-all.sh --verbose

# Lọc theo prefix
bash tests/skill-triggering/run-all.sh --filter dev-*
```

Yêu cầu: `claude` CLI đã auth + `jq` đã cài.

---

## License

MIT — Tự do sử dụng và customize cho dự án của bạn.
