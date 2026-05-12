# Improvement Backlog

Log các friction và gap phát hiện khi dùng framework. Agent **bắt buộc** thêm entry vào đây thay vì tự suy luận lại nhiều lần.

---

## Khi nào thêm entry

Thêm entry khi gặp bất kỳ tình huống nào sau:

- Phải manually reason về điều gì đó đáng lẽ đã có rule/template
- Gate không đủ rõ → phải đoán hành vi
- Template thiếu field quan trọng → phải tự bổ sung
- Cùng một vấn đề xuất hiện lần thứ 2+ trong các tasks khác nhau
- Skill trigger không đúng với intent thực tế của user
- Subagent output không đủ để bước tiếp theo xử lý

---

## Cách thêm entry

Dán vào bảng bên dưới. Không cần confirm với human — thêm trực tiếp.

Format:
```
| IB-XXX | [skill/context phát hiện] | [mô tả friction cụ thể] | [proposed fix ngắn gọn] | open |
```

---

## Backlog

| ID | Phát hiện từ | Friction | Proposed Fix | Status |
|----|-------------|----------|--------------|--------|
| IB-001 | dev:analyze | Không có bước classify risk trước khi spawn subagents — dễ miss high-risk task | Thêm Risk Classifier bước 0 vào dev:analyze | ✅ done |
| IB-002 | dev:implement | verification.md per-task không cho thấy toàn cảnh coverage | Tạo validation-matrix.md global | ✅ done |
| IB-003 | Tổng quát | Không có cơ chế để agent log gaps — mỗi session phải reason lại từ đầu | Tạo improvement-backlog.md này | ✅ done |
| IB-004 | Tổng quát (post bài viết Thariq) | Skill output mặc định Markdown kể cả khi artifact để review tương tác — bỏ lỡ giá trị HTML cho sort/filter/checklist | Thêm Output Format Convention vào CLAUDE.md, tạo `templates/html-artifact.html` + `templates/html-bilingual.html`, nâng cấp 5 skill nhóm A (dev:analyze, qa:testplan, qa:regression, pm:status, be:bridge) | ✅ done |
| IB-005 | Tổng quát (học từ AIDLC repo) | Không có observability layer — PM/BE/SM phải đào từng `docs/tasks/[ID]/*.md` để biết sprint health | Tạo `bin/dashboard.js` generator + `templates/dashboard.html` + `/pm:dashboard` slash command | ✅ done |
| IB-006 | Dashboard v1 | Dashboard v1 chỉ có kanban + 2 table đơn giản, thiếu git activity/skill heatmap/validation chart/watch mode | Rebuild v2: ckm-design-system tokens, 6 new parsers (git/audit/validation/skills/growth), SVG charts, watch mode | ✅ done |
| IB-007 | Competitive research (G-01) | Không có knowledge transfer / handover flow — JP client hỏi "dev nghỉ thì sao?" | Tạo /pm:handover skill + 引き継ぎ書 template (VN + JP) | ✅ done |
| IB-008 | Competitive research (G-02) | Không có maintenance mode workflow — sprint lifecycle quá heavy cho sustain phase | Tạo /pm:maintain skill với triage matrix + 月次保守報告書 | ✅ done |
| IB-009 | Competitive research (G-03) | Không có formal 変更管理 — spec thay đổi giữa sprint không có approval trail | Tạo /be:changerequest skill + CR document template (VN + JP) | ✅ done |
| IB-010 | Competitive research (G-04) | Không có release notes skill — JP clients muốn リリースノート chính thức | Tạo /pm:release skill với HTML + Markdown output | ✅ done |
| IB-011 | Competitive research (G-05) | Glossary template có nhưng không có skill cập nhật — term mới bị bỏ qua | Tạo /be:glossary skill | ✅ done |
| IB-012 | Competitive research (G-06) | ba:reverse chỉ brownfield — không có greenfield kickoff flow | Tạo /pm:kickoff skill với tech stack ADRs + Sprint 0 checklist | ✅ done |
| IB-013 | Competitive research (G-07) | Không có PR comment resolver — dev phải manually address từng comment | Tạo agents/pr-resolver.md + wire vào /dev:pr opt-in gate | ✅ done |
| IB-014 | Competitive research (G-08) | dev:implement không enforce test-first — TDD lane không có | Thêm TDD lane opt-in (Bước 1b) vào /dev:implement | ✅ done |
| IB-015 | Competitive research (G-09) | dev:review bỏ qua performance lens — N+1, caching, scalability không được check | Thêm Lens 3 Performance vào /dev:review | ✅ done |

---

## Resolved

Entries đã fix chuyển sang bảng này để giữ lịch sử:

| ID | Fix đã thực hiện | Task | Ngày |
|----|-----------------|------|------|
| IB-001 | Thêm Risk Classifier vào dev:analyze | FRAMEWORK-001 | 2026-05-07 |
| IB-002 | Tạo validation-matrix.md | FRAMEWORK-001 | 2026-05-07 |
| IB-003 | Tạo file này | FRAMEWORK-001 | 2026-05-07 |
| IB-004 | Output Format Convention + HTML companion cho 5 skill nhóm A | claude/analyze-html-article-AR7iy | 2026-05-10 |
