# Role Guide — Ai dùng skill nào?

**Framework**: VTI SDLC Skill Framework  
**Last updated**: 2026-05-07

---

## PM (Project Manager)

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/pm:ideate` | Nhận yêu cầu mơ hồ từ stakeholder | One-pager + Not Doing list |
| `/pm:breakdown` | Sau khi có User Stories | GitHub Issues |

**Không dùng**: dev-*, sec-*, qa-*, arch-*

---

## BA (Business Analyst)

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/ba:spec` | Sau pm-ideate, trước pm-breakdown | requirements.md |
| `/ba:user-story` | Sau ba-spec | User Stories trong requirements.md |

**Không dùng**: dev-*, sec-*, arch-*

---

## Developer

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/dev:analyze` | Nhận issue, trước khi code | Risk classification + `analysis.md` (**dừng — review trước khi implement**) |
| `/dev:implement` | Sau dev-analyze, phương án đã chọn | Code + `verification.md` + harness delta (**dừng — user test rồi mới dev:pr**) |
| `/dev:debug` | Khi bị blocked hoặc phát hiện bug | Root cause + fix |
| `/dev:pr` | Sau implement + verify, trước tạo PR | PR description (tự đọc `verification.md`) |
| `/sec:review` | Sau implement, trước tạo PR | Security findings |

**Thứ tự bắt buộc**: `dev:analyze` → [review `analysis.md`] → `dev:implement` → [report test results] → `sec:review` → `dev:pr`

**Risk lanes** (xem `docs/risk-classifier.md`):
- **Tiny** → patch trực tiếp, bỏ qua `dev:analyze`
- **Normal** → quy trình đầy đủ như trên
- **High-risk** → dừng trước khi implement, cần senior confirm

---

## Tech Lead / Architect

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/arch:adr` | Khi có quyết định kiến trúc quan trọng | docs/decisions/ADR-NNN.md |
| `/sec:review` | Code review có auth/security changes | Security findings |

---

## QA Engineer

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/qa:testplan` | Sau spec, song song với dev | test-plan.md |
| `/docs:update` | Sau verify và merge | verification.md + updated baseline docs |
| `/qa:regression` | Trước mỗi release | regression-[sprint].md |

---

## Bridge Engineer (VTI)

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/be:bridge` | Nhận yêu cầu từ JP / Gửi deliverables cho JP | requirements.md (VN) + design-jp.md (JP) |

---

## Scrum Master / Team Lead

| Skill | Khi nào | Output |
|-------|---------|--------|
| `/pm:ideate` | Facilitate sprint planning | One-pager |
| `/arch:adr` | Document team decisions | ADR |

---

## Workflow nhanh theo tình huống

### "Nhận yêu cầu từ khách hàng Nhật"
```
/be:bridge → /ba:spec → /ba:user-story → /pm:breakdown
```

### "Nhận issue mới, cần code"
```
/dev:analyze → [review analysis.md] → /dev:implement → [report test results] → /sec:review → /dev:pr
```

### "Code xong, cần QA"
```
/qa:testplan → [execute manual] → /docs:update
```

### "Trước khi release"
```
/qa:regression → [sign-off] → deploy
```

### "Cần document quyết định kỹ thuật"
```
/arch:adr
```

---

## Ghi chú

- Mỗi skill có **gate** — luôn chờ confirm trước khi tiếp tục
- Multi-choice gates dùng `AskUserQuestion` tool (native TUI, không phải plain text)
- Subagent được dùng trong dev-analyze, dev-implement (verification), sec-review, qa-regression
- `dev:analyze` và `dev:implement` đều có **hard stop** — không tự động chạy bước tiếp theo
- **Risk Classifier** (`docs/risk-classifier.md`) — bước 0 bắt buộc trước khi bất kỳ dev task nào bắt đầu
- **Improvement Backlog** (`docs/improvement-backlog.md`) — agent ghi friction sau mỗi task; xem khi muốn cải tiến framework
- **Validation Matrix** (`docs/validation-matrix.md`) — chạy `bash tests/skill-triggering/run-all.sh` rồi update cột Status
- Xem flow đầy đủ tại `docs/workflows/sprint-lifecycle.md`
