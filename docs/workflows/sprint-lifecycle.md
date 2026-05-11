# Sprint Lifecycle — End-to-End Guide

**Framework**: VTI SDLC Skill Framework  
**Last updated**: 2026-05-07

> 📊 Xem quan hệ giữa các skills dưới dạng sơ đồ: [`skill-flowchart.md`](skill-flowchart.md)

---

## Tổng quan

```
PM Ideate → BA Spec → BA Stories → PM Breakdown
    → Dev Analyze → [Tech Lead confirm nếu high-risk]
    → Dev Implement → [report test results] → [review verification.md]
    → Arch Review (nếu có design decision) → Sec Review → Dev PR
    → QA Test Plan → QA Verify → Docs Update
```

Mỗi bước có **gate** — không tự động chuyển sang bước tiếp theo.  
Multi-choice gates dùng `AskUserQuestion` tool để render native TUI.

---

## Giai đoạn 1: Discovery

### 1.0 BA Reverse `/ba:reverse` (chỉ brownfield)
**Người dùng**: BA / Tech Lead  
**Khi nào**: Take-over codebase legacy từ vendor cũ HOẶC inherit project không có docs  
**Bỏ qua nếu**: Greenfield project (xây từ đầu)  
**Input**: Codebase đã clone về local  
**Output**: `docs/baseline/codebase-overview.md`  
**Gate**: User confirm scope (full take-over / estimate / refactor audit) + depth (overview / standard / deep)

Sau bước này, các skill downstream (`/ba:spec`, `/be:bridge`) sẽ có context về tech stack & technical debt.

### 1.1 PM Ideate `/pm:ideate`
**Người dùng**: PM / BA  
**Input**: Ý tưởng thô từ stakeholder  
**Output**: One-pager + Not Doing list  
**Gate**: PM confirm hướng đi trước khi viết spec

### 1.2 BA Spec `/ba:spec`
**Người dùng**: BA  
**Input**: One-pager từ pm-ideate  
**Output**: `docs/tasks/[TASK-ID]/requirements.md`  
**Gate**:
1. BA confirm hiểu đúng vấn đề
2. Clarify questions trả lời xong
3. BA + PM review AC trước khi đưa dev

### 1.3 BA User Stories `/ba:user-story`
**Người dùng**: BA  
**Input**: requirements.md  
**Output**: User Stories với AC trong requirements.md  
**Gate**: BA review granularity + estimate

---

## Giai đoạn 2: Planning

### 2.1 PM Breakdown `/pm:breakdown`
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

### 3.1 Dev Analyze `/dev:analyze`
**Người dùng**: Dev  
**Input**: GitHub Issue + Brain Dump context block  
**Output**: `docs/tasks/[TASK-ID]/analysis.md` + `analysis-compare.html` (bảng so sánh phương án có sort/filter — one-shot, không commit)  
**Multi-agent**: task-reader → code-scout → planner  
**Gates**:
0. **Risk Classification** — classify task vào tiny / normal / high-risk theo `docs/risk-classifier.md` trước khi spawn subagents
1. Confirm task understanding
2. Confirm code map
3. **Human chọn phương án** (không tự chọn)

### 3.1b Tech Lead Gate (high-risk tasks only)
**Người dùng**: Tech Lead / Senior Dev  
**Khi nào**: Khi `/dev:analyze` phân loại task là **high-risk**  
**Bỏ qua nếu**: Task là tiny hoặc normal  
**Action**: Review `analysis.md`, confirm hoặc yêu cầu điều chỉnh phương án trước khi dev implement  
**Gate cứng** — framework không cho phép tiếp tục implement khi chưa có senior confirm

### 3.2 Dev Implement `/dev:implement`
**Người dùng**: Dev  
**Input**: `analysis.md`  
**Output**: Code changes + `docs/tasks/[TASK-ID]/verification.md`  
**Gates**:
1. Confirm implementation plan + file order
2. Confirm sau mỗi file (không tự nhảy sang file tiếp theo)
3. Bước 4 — Dev self-check
4. Bước 5 — Verification Gate: diff review → AI generates self-test steps → user reports results → saves `verification.md`
5. **Harness Delta Check** — agent tự hỏi có friction nào không, ghi vào `docs/improvement-backlog.md` nếu có

**Hard stop sau Bước 5** — user phải tự trigger `/dev:pr`.

### 3.3 Architecture Review `/arch:review` (tuỳ chọn)
**Người dùng**: Tech Lead / Architect  
**Khi nào**: Khi implementation tạo ra design decision mới (pattern mới, thay đổi cấu trúc DB, API contract mới)  
**Bỏ qua nếu**: Không có design decision mới — chỉ implement theo spec đã có  
**Input**: Code diff + `analysis.md`  
**Output**: Architecture findings  
**Gate**: Block PR nếu có finding Critical chưa được address

Nếu có quyết định kiến trúc quan trọng cần document → tạo ADR bằng `/arch:adr` sau bước này.

### 3.4 Security Review `/sec:review`
**Người dùng**: Dev / Tech Lead  
**Input**: Code diff  
**Output**: Security findings  
**Gate**: Block PR nếu có Critical/High issues chưa fix

---

## Giai đoạn 4: Review & Merge

### 4.1 Dev PR `/dev:pr`
**Người dùng**: Dev  
**Input**: Code diff + `analysis.md` + `verification.md` (nếu có)  
**Output**: PR description (Testing section tự động populate từ `verification.md`)  
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

### 5.1 QA Test Plan `/qa:testplan`
**Người dùng**: QA  
**Input**: requirements.md  
**Output**: `docs/tasks/[TASK-ID]/test-plan.md` + `test-plan.html` (interactive checklist, lưu trạng thái tick qua localStorage — one-shot, không commit)  
**Gate**: QA + BA confirm scope + exit criteria

### 5.2 QA Execute (manual)
- Chạy test cases theo test-plan.md
- Log bugs vào GitHub Issues

### 5.3 QA Verify + Docs Update `/docs:update`
**Người dùng**: QA / Dev  
**Input**: Code + test results  
**Output**:
- `docs/tasks/[TASK-ID]/verification.md`
- Updated baseline docs (screen + API)
**Gate**: Confirm doc changes trước khi apply

---

## Giai đoạn 6: Release

### 6.1 Regression `/qa:regression`
**Người dùng**: QA  
**Input**: Release scope (TASK-IDs)  
**Output**: `docs/tasks/regression-[sprint].html` (format chính — go/no-go badge tự cập nhật theo trạng thái test, in PDF được nếu khách JP cần evidence). Markdown chỉ tạo khi cần commit lịch sử regression.  
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
| Dev Analyze | `docs/tasks/[ID]/analysis.md` (bao gồm Risk Classification block) |
| Dev Implement | Source code + `docs/tasks/[ID]/verification.md` |
| Harness Delta | Entry mới trong `docs/improvement-backlog.md` (nếu có friction) |
| Arch Review | Architecture findings (inline) + `docs/decisions/ADR-NNN.md` (nếu có quyết định cần document) |
| Security | Security findings (inline) |
| Dev PR | PR description |
| QA | `docs/tasks/[ID]/test-plan.md` |
| QA Verify | QA sign-off trong `verification.md` |
| Docs Update | `docs/api/...` `docs/screens/...` |
| Release | `docs/tasks/regression-[sprint].html` (one-shot, không commit) |
| HTML companions | `analysis-compare.html`, `test-plan.html`, `regression-checklist.html`, `sprint-status.html`, `deliverable.html` — tất cả one-shot, ignore khỏi git (xem `.gitignore`) |

---

## Bridge Engineer Workflow (VTI JP Outsource)

Trước giai đoạn 1, khi nhận yêu cầu từ JP:

```
JP Request → /be:bridge → requirements.md (VN) + design-jp.md (JP)
   → Confirm với JP → vào giai đoạn Discovery bình thường
```

Sau giai đoạn 5, trước khi gửi JP:

```
QA Pass → /be:bridge tạo 単体テスト仕様書 + deliverable.html (song ngữ 2 cột, copy/print A4) → Gửi kèm deliverables cho JP
```

PM dùng `/pm:status` với option HTML dashboard (kanban + velocity) khi cần báo cáo định kỳ cho khách JP — file HTML forward email đẹp hơn Markdown.

---

## Quick Reference: Ai dùng skill nào?

Xem `docs/workflows/role-guide.md`
