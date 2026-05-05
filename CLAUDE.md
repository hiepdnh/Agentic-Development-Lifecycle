# SDLC Skill Framework — VTI Software

Framework hỗ trợ toàn bộ SDLC cho mọi role. Tối ưu cho VTI outsource model (team VN → BE → khách Nhật).

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

### Full Human Gate (mặc định)
```
[Skill chạy] → [Trình bày kết quả + assumptions] → [Hỏi 1-2 câu targeted] → [Chờ confirm] → [Tiếp tục]
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
