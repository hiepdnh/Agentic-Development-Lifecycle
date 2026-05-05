# Role Guide — Ai dùng skill nào?

**Framework**: VTI SDLC Skill Framework  
**Last updated**: 2026-05-05

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
| `/dev:analyze` | Nhận issue, trước khi code | analysis.md |
| `/dev:implement` | Sau dev-analyze, phương án đã chọn | Code changes |
| `/dev:pr` | Sau implement, trước tạo PR | PR description |
| `/sec:review` | Sau implement, trước tạo PR | Security findings |

**Thứ tự bắt buộc**: dev-analyze → dev-implement → sec-review → dev-pr

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
/dev:analyze → /dev:implement → /sec:review → /dev:pr
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
- Subagent được dùng trong dev-analyze, sec-review, qa-regression — không cần lo về context
- Xem flow đầy đủ tại `docs/workflows/sprint-lifecycle.md`
