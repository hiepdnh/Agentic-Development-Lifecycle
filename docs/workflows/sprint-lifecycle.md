# Sprint Lifecycle — End-to-End Guide

**Framework**: VTI SDLC Skill Framework  
**Last updated**: 2026-05-05

---

## Tổng quan

```
PM Ideate → BA Spec → BA Stories → PM Breakdown → Dev Analyze → Dev Implement
     → Sec Review → Dev PR → QA Test Plan → QA Verify → Docs Update
```

Mỗi bước có **gate** — không tự động chuyển sang bước tiếp theo.

---

## Giai đoạn 1: Discovery

### 1.1 PM Ideate `/pm-ideate`
**Người dùng**: PM / BA  
**Input**: Ý tưởng thô từ stakeholder  
**Output**: One-pager + Not Doing list  
**Gate**: PM confirm hướng đi trước khi viết spec

### 1.2 BA Spec `/ba-spec`
**Người dùng**: BA  
**Input**: One-pager từ pm-ideate  
**Output**: `docs/tasks/[TASK-ID]/requirements.md`  
**Gate**:
1. BA confirm hiểu đúng vấn đề
2. Clarify questions trả lời xong
3. BA + PM review AC trước khi đưa dev

### 1.3 BA User Stories `/ba-user-story`
**Người dùng**: BA  
**Input**: requirements.md  
**Output**: User Stories với AC trong requirements.md  
**Gate**: BA review granularity + estimate

---

## Giai đoạn 2: Planning

### 2.1 PM Breakdown `/pm-breakdown`
**Người dùng**: PM  
**Input**: User Stories  
**Output**: GitHub Issues (tạo bằng `gh issue create`)  
**Gate**: PM confirm priority + assignment trước khi tạo issue

### 2.2 Sprint Planning (manual)
- PM assign issues cho dev
- Dev estimate lại nếu cần
- Sprint board cập nhật

---

## Giai đoạn 3: Development

### 3.1 Dev Analyze `/dev-analyze`
**Người dùng**: Dev  
**Input**: GitHub Issue + Brain Dump context block  
**Output**: `docs/tasks/[TASK-ID]/analysis.md`  
**Multi-agent**: task-reader → code-scout → planner  
**Gates**:
1. Confirm task understanding
2. Confirm code map
3. **Human chọn phương án** (không tự chọn)

### 3.2 Dev Implement `/dev-implement`
**Người dùng**: Dev  
**Input**: analysis.md  
**Output**: Code changes  
**Gates**:
1. Confirm implementation plan + file order
2. Confirm sau mỗi file (không tự nhảy sang file tiếp theo)
3. Post-implementation checklist

### 3.3 Security Review `/sec-review`
**Người dùng**: Dev / Tech Lead  
**Input**: Code diff  
**Output**: Security findings  
**Gate**: Block PR nếu có Critical/High issues chưa fix

---

## Giai đoạn 4: Review & Merge

### 4.1 Dev PR `/dev-pr`
**Người dùng**: Dev  
**Input**: Code diff + analysis.md  
**Output**: PR description  
**Gate**:
1. Confirm AC coverage
2. Confirm reviewer list

### 4.2 Code Review (manual)
- Reviewer dùng `/ultrareview` nếu cần AI assist
- Tối thiểu 1 approve
- Address comments

### 4.3 Merge
- Squash hoặc merge commit (theo convention dự án)
- Delete branch sau merge

---

## Giai đoạn 5: QA

### 5.1 QA Test Plan `/qa-testplan`
**Người dùng**: QA  
**Input**: requirements.md  
**Output**: `docs/tasks/[TASK-ID]/test-plan.md`  
**Gate**: QA + BA confirm scope + exit criteria

### 5.2 QA Execute (manual)
- Chạy test cases theo test-plan.md
- Log bugs vào GitHub Issues

### 5.3 QA Verify + Docs Update `/docs-update`
**Người dùng**: QA / Dev  
**Input**: Code + test results  
**Output**:
- `docs/tasks/[TASK-ID]/verification.md`
- Updated baseline docs (screen + API)
**Gate**: Confirm doc changes trước khi apply

---

## Giai đoạn 6: Release

### 6.1 Regression `/qa-regression`
**Người dùng**: QA  
**Input**: Release scope (TASK-IDs)  
**Output**: `docs/tasks/regression-[sprint].md`  
**Gate**: QA Lead sign-off trước khi deploy

### 6.2 Deploy (manual)
- Deploy lên Staging → PM/BA demo
- Deploy lên Production sau sign-off

### 6.3 Sprint Retrospective (manual)
- Team review: what went well / blockers
- Update CLAUDE.md nếu có workflow change

---

## Deliverables theo giai đoạn

| Giai đoạn | File tạo ra |
|-----------|-------------|
| Discovery | `docs/tasks/[ID]/requirements.md` |
| Planning | GitHub Issues |
| Dev Analyze | `docs/tasks/[ID]/analysis.md` |
| Dev Implement | Source code + tests |
| Security | Security findings (inline) |
| Dev PR | PR description |
| QA | `docs/tasks/[ID]/test-plan.md` |
| QA Verify | `docs/tasks/[ID]/verification.md` |
| Docs Update | `docs/api/...` `docs/screens/...` |
| Release | `docs/tasks/regression-[sprint].md` |

---

## Bridge Engineer Workflow (VTI JP Outsource)

Trước giai đoạn 1, khi nhận yêu cầu từ JP:

```
JP Request → /be-bridge → requirements.md (VN) + design-jp.md (JP)
   → Confirm với JP → vào giai đoạn Discovery bình thường
```

Sau giai đoạn 5, trước khi gửi JP:

```
QA Pass → /be-bridge tạo 単体テスト仕様書 → Gửi kèm deliverables cho JP
```

---

## Quick Reference: Ai dùng skill nào?

Xem `docs/workflows/role-guide.md`
