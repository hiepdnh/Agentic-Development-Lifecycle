---
name: dev:implement
description: >
  Implement code sau khi phương án đã chọn từ /dev:analyze. File-by-file với gate sau mỗi file.
  Trigger khi: user nói "bắt đầu implement", "code theo plan đã chọn", "viết code cho task",
  "start implementation", "implement feature", hoặc gõ /dev:implement.
---

# Skill: /dev:implement
**Role**: Developer  
**Mục đích**: Implement code sau khi phương án đã chọn từ /dev:analyze. File-by-file với gate sau mỗi file.

---

## Quan trọng: Chạy /dev:analyze trước

Skill này yêu cầu `docs/tasks/[TASK-ID]/analysis.md` đã tồn tại.
Nếu chưa có → chạy `/dev:analyze` trước.

---

## Cách spawn subagent

Dùng **Agent tool** để spawn subagent. Mỗi subagent nhận context tối thiểu cần thiết — không pass full conversation history.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc analysis doc

Đọc `docs/tasks/[TASK-ID]/analysis.md`:
- Phương án đã chọn
- Danh sách files cần thay đổi
- Quyết định kỹ thuật đã confirm

### Bước 2 — Gate: Xác nhận implementation plan

```
## Tôi sẽ implement [TASK-ID] theo Phương án [X].

**Files cần thay đổi** (theo thứ tự):
1. `[file 1]` — [create/modify/delete] — [lý do]
2. `[file 2]` — [create/modify/delete] — [lý do]

**Thứ tự implement**: [giải thích tại sao thứ tự này — dependencies]

**Setup trước khi code**:
- Branch: `feature/[TASK-ID]-[slug]`
- DB migration cần tạo: [yes/no]
- ENV variables mới: [list hoặc "none"]

Bắt đầu với `[file 1]`?
```

**Chờ confirm.**

### Bước 3 — Implement từng file

Với **mỗi file**, theo thứ tự:

1. Đọc file hiện tại (nếu modify)
2. Implement thay đổi
3. Report ngắn

**Template báo cáo sau mỗi file**:

```
## File [N/Total]: `[path]` ✅

**Thay đổi**:
- [Mô tả thay đổi 1]
- [Mô tả thay đổi 2]

**Tests**: [Viết inline / Cần viết riêng / N/A]

Tiếp tục `[file tiếp theo]`?
```

**Chờ confirm trước khi sang file tiếp theo.**

Nếu gặp code không như expected (missing dependency, unexpected state, conflict với existing code):

```
## ⚠️ Blocked tại `[path]`

**Vấn đề**: [Mô tả cụ thể]
**Options**:
A. [Hướng giải quyết A]
B. [Hướng giải quyết B]

Chọn hướng nào?
```

**Không tự quyết định — luôn hỏi khi blocked.**

### Bước 4 — Gate: Post-implementation checklist

Sau khi tất cả files xong:

```
## Implementation hoàn tất — [TASK-ID]

**Files đã thay đổi**: [N files]
**Migration cần chạy**: [yes/no — lệnh nếu yes]
**ENV cần thêm**: [list hoặc "none"]

**Self-check**:
- [ ] Không hardcode values (URL, credentials, magic numbers)
- [ ] Error cases được handle
- [ ] Input validated tại system boundary (API endpoint / form)
- [ ] Không log sensitive data (password, token, PII)
- [ ] DB migration reversible (nếu có)

**Bước tiếp theo**:
1. Chạy tests: `[test command]`
2. `/sec:review [TASK-ID]` — bắt buộc trước khi tạo PR
3. `/dev:pr [TASK-ID]` — tạo PR description
```

---

## Quy tắc

- Implement từng file một — không jump ahead
- Không refactor code ngoài scope task
- Không thêm feature ngoài AC đã định nghĩa
- Migration có thể mất data → **luôn hỏi confirm** trước khi tạo
- Nếu phát hiện bất kỳ thay đổi nhạy cảm nào → dừng, xem `assets/ask-first-gates.md`
- Nếu phát hiện bug không liên quan → note lại, tạo issue riêng, không fix ngay
