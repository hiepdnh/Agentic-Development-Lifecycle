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

---

## Resolved

Entries đã fix chuyển sang bảng này để giữ lịch sử:

| ID | Fix đã thực hiện | Task | Ngày |
|----|-----------------|------|------|
| IB-001 | Thêm Risk Classifier vào dev:analyze | FRAMEWORK-001 | 2026-05-07 |
| IB-002 | Tạo validation-matrix.md | FRAMEWORK-001 | 2026-05-07 |
| IB-003 | Tạo file này | FRAMEWORK-001 | 2026-05-07 |
| IB-004 | Output Format Convention + HTML companion cho 5 skill nhóm A | claude/analyze-html-article-AR7iy | 2026-05-10 |
