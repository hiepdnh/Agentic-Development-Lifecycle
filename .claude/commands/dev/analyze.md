# Skill: /dev:analyze
**Role**: Developer  
**Mục đích**: Phân tích task/issue và đề xuất các phương án thi công. Dùng multi-agent để giữ context sạch.

---

## Brain Dump Pattern (input contract)

Trước khi chạy skill này, dev nên cung cấp context block sau để giảm hallucination:

```
Tech stack: [language, framework, DB, infra]
Relevant files: [file paths đã biết liên quan]
Constraints: [performance, security, backward compat, deadline]
Known gotchas: [vấn đề đã biết trong codebase]
Issue/Task: [link hoặc paste nội dung]
```

Nếu không có đủ context → skill sẽ hỏi trước khi tiếp tục.

---

## Kiến trúc Multi-Agent

Skill này orchestrate các subagent để giữ context sạch:

```
dev-analyze (orchestrator)
├── [Subagent 1] task-reader    → parse issue → structured understanding
├── [Subagent 2] code-scout     → tìm code liên quan (read-only)
└── [Subagent 3] planner        → tổng hợp → đề xuất phương án
```

Mỗi subagent nhận **chỉ context cần thiết**, trả về kết quả nén.

## Cách spawn subagent

Dùng **Agent tool** để spawn mỗi subagent. Prompt phải self-contained — không pass full conversation history.

Ví dụ spawn task-reader:
```
Agent(
  description: "Parse GitHub issue into structured JSON",
  prompt: "Read this issue and return structured JSON per agents/task-reader.md spec.\n\nISSUE CONTENT:\n[paste issue content here]"
)
```

Ví dụ spawn code-scout:
```
Agent(
  description: "Find relevant files for auth task",
  prompt: "Find files relevant to this task. Return JSON per agents/code-scout.md spec.\n\nTASK SUMMARY: [summary]\nTECH STACK: [stack]\nAFFECTED AREAS: [areas]"
)
```

---

## Hướng dẫn thực hiện

### Bước 1 — Spawn Subagent: task-reader

Spawn subagent với nhiệm vụ:
> "Đọc issue/task sau và trả về JSON structured:
> - task_id, title, type (feature/bug/refactor)
> - business_goal (tại sao cần làm)
> - acceptance_criteria (list)
> - technical_hints (nếu có trong issue)
> - unknowns (những gì chưa rõ)
> 
> Issue content: [paste nội dung issue]"

Subagent CHỈ nhận nội dung issue, không nhận codebase context.

### Bước 2 — Gate 1: Xác nhận hiểu task

```
## Tôi đọc task [TASK-ID] và hiểu như sau:

**Mục tiêu**: [business goal]
**Loại**: [Feature/Bug/Refactor]
**Acceptance Criteria**:
  - AC-001: [...]
  - AC-002: [...]

**Những điều chưa rõ**:
  - [?] [Điểm chưa rõ 1]
  - [?] [Điểm chưa rõ 2]

Trước khi tôi scan codebase, hãy xác nhận:
1. Tôi hiểu đúng mục tiêu chưa?
2. Có constraint nào (performance, security, backward compatibility) không đề cập trong issue?
3. Có màn hình/API doc nào tôi nên đọc trước không?
```

**Chờ confirm.**

### Bước 3 — Spawn Subagent: code-scout

Sau khi nhận confirm, spawn subagent với nhiệm vụ:
> "Tìm trong codebase các file/module liên quan đến: [task summary].
> Trả về:
> - file_path:line_number cho mỗi điểm liên quan
> - Mô tả ngắn tại sao file đó liên quan
> - Patterns/conventions hiện tại cần theo
> 
> CHỈ đọc, không sửa gì cả."

Subagent nhận task summary + file patterns để tìm kiếm, không nhận full conversation history.

### Bước 4 — Gate 2: Xác nhận code map

```
## Tôi tìm thấy các file liên quan:

| File | Line | Tại sao liên quan |
|------|------|-------------------|
| [path] | [N] | [...] |

**Conventions hiện tại**:
- [Pattern 1]
- [Pattern 2]

Câu hỏi:
1. Có file quan trọng nào tôi bỏ sót không?
2. Có module nào tôi nên TRÁNH chạm vào trong task này?
```

**Chờ confirm.**

### Bước 5 — Spawn Subagent: planner

Spawn subagent với:
> "Dựa trên:
> - Task: [summary]
> - AC: [list]
> - Relevant files: [file map]
> - Constraints: [từ Gate 1]
> 
> Đề xuất 2-3 phương án implement với trade-off.
> Mỗi phương án gồm: tên, mô tả, files cần thay đổi, estimate, ưu/nhược."

### Bước 6 — Gate 3: Trình bày phương án (QUAN TRỌNG NHẤT)

```
## Tôi có [N] phương án thi công:

### Phương án A: [Tên] — [Từ khóa đặc trưng]
**Mô tả**: [...]
**Files cần thay đổi**:
  - `[file]` — [lý do]
**Estimate**: [X giờ]
**Ưu**: [...]
**Nhược**: [...]
**Risk**: [...]

### Phương án B: [Tên]
[tương tự]

### Phương án C: [Tên] (nếu có)
[tương tự]

---
**Đề xuất của tôi**: Phương án [X] vì [lý do cụ thể].

Trước khi bạn chọn, tôi cần hỏi thêm:
1. [Câu hỏi về constraint ảnh hưởng đến lựa chọn]
2. [Câu hỏi về priority: speed vs maintainability]

Bạn muốn chọn phương án nào?
```

**Chờ human chọn phương án.**

### Bước 7 — Tạo Task Doc

Sau khi human chọn, tạo `docs/tasks/[TASK-ID]/analysis.md`:

```markdown
# Analysis: [TASK-ID]

## Phương án đã chọn: [Tên]
**Lý do**: [từ discussion]

## Files sẽ thay đổi
| File | Loại thay đổi | Ghi chú |
|------|--------------|---------|
| | | |

## Những phương án đã cân nhắc và lý do không chọn
- Phương án A: [lý do không chọn]
- Phương án B: [lý do không chọn]

## Câu hỏi mở còn lại
- [ ] [Question nếu có]
```

```
## Phân tích hoàn tất.

Bước tiếp theo: Bắt đầu implement.
Tôi sẽ làm việc theo từng file một và báo cáo sau mỗi file.
Bạn có muốn tôi bắt đầu ngay không?
```

---

## Lưu ý cho orchestrator

- Mỗi subagent nhận context tối thiểu cần thiết
- Không pass full conversation history vào subagent
- Kết quả từ subagent được tóm tắt trước khi dùng cho subagent tiếp theo
- Nếu subagent trả về quá nhiều file (>20), yêu cầu lọc thêm
