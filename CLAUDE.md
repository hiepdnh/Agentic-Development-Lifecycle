# SDLC Skill Framework

Framework hỗ trợ toàn bộ SDLC cho mọi role. Tích hợp với GitHub, Jira, Confluence.

## Nguyên tắc cốt lõi

1. **Human Gate**: Không bao giờ tự động thực hiện. Luôn trình bày kết quả → hỏi câu hỏi làm rõ → chờ confirm.
2. **Multiple Options**: Luôn đưa ra 2-3 phương án với trade-off rõ ràng. Không bao giờ chỉ đưa 1 giải pháp.
3. **Fresh Context**: Dev tasks dùng subagent để giữ context sạch, tiết kiệm token.
4. **Two-tier Docs**: Task docs (ephemeral, per issue) + Baseline docs (living, được cập nhật sau verify).
5. **Delta Specs**: Mỗi thay đổi là 1 proposal có cấu trúc, không phải monolith.

## Cấu trúc thư mục

```
.claude/commands/    # Slash commands cho từng role
docs/
  tasks/             # Task docs (Type 1) - mỗi issue 1 folder
  screens/           # Screen baseline docs (Type 2)
  api/               # API baseline docs (Type 2)
  decisions/         # Architecture Decision Records (ADR)
templates/           # Template tái sử dụng
agents/              # Multi-agent orchestrator instructions
```

## Skill Commands

| Role | Command | Chức năng |
|------|---------|-----------|
| PM / BA | `/pm-ideate` | Ý tưởng mờ → Concept rõ (trước /ba-spec) |
| BA | `/ba-spec` | Raw requirement → Structured spec |
| BA | `/ba-user-story` | Spec → User Stories + AC |
| PM | `/pm-breakdown` | Epic → Tasks với estimate |
| PM | `/pm-status` | Sprint status report |
| Dev | `/dev-analyze` | Task → Implementation options (multi-agent) |
| Dev | `/dev-pr` | Code changes → PR description |
| Dev | `/dev-debug` | Systematic debugging: reproduce → localize → fix |
| Arch | `/arch-review` | Review design decision |
| Arch | `/arch-adr` | Generate Architecture Decision Record |
| QA | `/qa-testplan` | Spec → Test plan |
| QA | `/qa-bug` | Standardized bug report |
| DevOps | `/ops-deploy` | Deployment checklist + CI quality gate |
| DevOps | `/ops-incident` | Incident response + RCA |
| SM | `/sm-standup` | Daily standup summary |
| SM | `/sm-retro` | Sprint retrospective |
| All | `/sec-review` | Security review trước merge (3-tier: Always/Ask First/Never) |
| All | `/docs-update` | Update baseline docs sau verify |

## Gate Patterns

### Full Human Gate (mặc định)

```
[Skill chạy → Kết quả]
         ↓
[Trình bày: Tôi hiểu như sau... / Các phương án là...]
         ↓
[Hỏi ngược 1-2 câu targeted để làm rõ]
         ↓
[Chờ human confirm/trả lời]
         ↓
[Tiếp tục bước tiếp]
```

### Ask First Gate (cho thay đổi nhạy cảm)

Dừng lại và hỏi senior trước khi thực hiện — không cần full gate — khi:
- Thay đổi authentication / authorization
- Breaking changes trong API
- Database migration ảnh hưởng data
- Thay đổi shared infrastructure
- Lưu trữ sensitive/PII data mới

## Human Gate Pattern

```
[Skill chạy → Kết quả]
         ↓
[Trình bày: Tôi hiểu như sau... / Tôi tìm thấy... / Các phương án là...]
         ↓
[Hỏi ngược 1-2 câu targeted để làm rõ]
         ↓
[Chờ human confirm/trả lời]
         ↓
[Tiếp tục bước tiếp]
```

## Two-tier Documentation

**Type 1 — Task Docs** (`docs/tasks/TASK-XXX/`)
- `requirements.md` — parsed từ issue
- `analysis.md` — options đã cân nhắc
- `decisions.md` — lý do chọn solution
- `verification.md` — test results, sign-off

**Type 2 — Baseline Docs** (cập nhật sau mỗi task verify xong)
- `docs/screens/[feature]/screen.md` — UI, fields, validations, business rules
- `docs/api/[domain]/[endpoint].md` — endpoint, request, response, errors
- `docs/decisions/ADR-XXX.md` — architecture decisions

## Customization per project

Copy framework này vào project, sau đó:
1. Cập nhật `CLAUDE.md` với project context cụ thể
2. Thêm tool integration config (GitHub token, Jira URL...)
3. Tùy chỉnh templates cho phù hợp với team conventions
4. Thêm domain-specific skills nếu cần
