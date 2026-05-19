---
name: docs:update
description: >
  Cập nhật Baseline Docs (screen + API) sau khi task đã verify và merge. Bước cuối của mọi task.
  Trigger khi: user nói "cập nhật docs", "update baseline", "task done cần update doc",
  "sync docs sau merge", "update screen doc", "update API doc", hoặc gõ /docs:update.
---
## Tóm tắt

Cập nhật Baseline Docs (screen + API) sau khi task đã verify và merge. Bước cuối của mọi task. Trigger khi: user nói "cập nhật docs", "update baseline", "task done cần update doc", "sync docs sau merge", "update screen doc", "update API doc", hoặc gõ /docs:update.

## Quy trình

# /docs:update
**Role**: Developer / QA (sau verify)  
**Mục đích**: Cập nhật Baseline Docs (screen + API) sau khi task đã verify và merge. Đây là bước CUỐI CÙNG của mọi task.

---

## Quan trọng

Baseline Docs là **nguồn sự thật** cho team. Cập nhật sai = technical debt.  
Skill này luôn đề xuất thay đổi để human review, không tự động ghi đè.

---

## Hướng dẫn thực hiện

### Bước 1 — Spawn subagent: diff-reader

Spawn subagent để đọc:
- `git diff [base-branch]..HEAD -- docs/` — docs đã thay đổi chưa?
- `git diff [base-branch]..HEAD -- [src/]` — code thay đổi gì?
- `docs/tasks/[TASK-ID]/requirements.md` — spec gốc

```
task(
  description: "Map merged code changes to baseline docs that need updating",
  prompt: "Read git diff and spec, return docs impact per agents/diff-reader.md spec.\n\nGIT DIFF:\n[git diff base-branch..HEAD]\n\nSPEC PATH: docs/tasks/[TASK-ID]/requirements.md\n\nBASELINE DOCS TO CHECK: [list docs/screens/ and docs/api/ files related to this task]",
  subagent_type: "explorer"
)
```

Subagent trả về: danh sách thay đổi cần reflect vào docs.

### Bước 1b — Spawn subagent: doc-updater

Sau khi nhận output từ diff-reader, spawn doc-updater để tạo proposals:

```
task(
  description: "Propose specific content changes for each baseline doc",
  prompt: "Create update proposals per agents/doc-updater.md spec.\n\nDIFF READER OUTPUT:\n[JSON từ diff-reader]\n\nCURRENT DOC CONTENT:\n[Nội dung hiện tại của từng file trong docs_update_needed]\n\nCHANGES SUMMARY:\n[changes_summary từ diff-reader]",
  subagent_type: "oracle"
)
```

### Bước 2 — Gate: Xác nhận scope update

question({
  questions: [{
    question: "Task đã verify và merge. Xác nhận scope docs cần update?",
    header: "Scope",
    options: [
      { label: "Đủ rồi", description: "Scope phân tích đã đầy đủ" },
      { label: "Còn thiếu", description: "Docs bỏ sót cần thêm vào scope" },
    ]
  }]
})

### Bước 3 — Đề xuất nội dung update cụ thể

Với mỗi file cần update, hiển thị diff rõ ràng:

```
## Đề xuất update: docs/screens/[feature]/screen.md

### Thêm mới:
[Nội dung mới]

### Thay đổi:
~~[Nội dung cũ]~~ → [Nội dung mới]

### Xóa:
~~[Nội dung cần xóa vì không còn đúng]~~
```

### Bước 4 — Gate: Review từng file

question({
  questions: [{
    question: "Nội dung mới có chính xác không?",
    header: "Accuracy",
    options: [
      { label: "Chính xác", description: "Nội dung update đúng" },
      { label: "Sai", description: "Nội dung cần sửa lại" },
    ]
  }, {
    question: "Có thông tin nào khác cần update mà tôi bỏ sót?",
    header: "Missing",
    options: [
      { label: "Không", description: "Đã đầy đủ" },
      { label: "Có", description: "Còn thông tin cần thêm" },
    ]
  }]
})

### Bước 5 — Sau khi apply

Trước khi ghi bất kỳ file doc nào, lấy commit của HEAD hiện tại (phải là sau khi merge — nếu chưa merge thì đây là feature branch HEAD):

```bash
git log -1 --format="%h %s"   # short-sha + commit message
```

Dùng kết quả để điền vào các trường metadata của mỗi doc được cập nhật:
- `**Last updated**: [YYYY-MM-DD HH:mm JST]` — thời điểm chạy skill
- `**Updated by task**: [TASK-ID]`
- `**Commit**: \`[short-sha]\` — [commit message]`

Cập nhật `docs/tasks/[TASK-ID]/verification.md` sử dụng template `templates/verification.md`. Điền vào:
- **Verified by** + **Date** + **Status**
- Danh sách AC đã verify (AC-001, AC-002...)
- Danh sách docs đã update (screen.md, endpoint.md...)
- **Notes**: observations quan trọng cho người duy trì sau

```
Task [TASK-ID] đã hoàn tất đầy đủ:
✅ Code merged
✅ Baseline docs cập nhật
✅ Verification doc lưu

Task doc đầy đủ tại: docs/tasks/[TASK-ID]/
```

---

## Nguyên tắc cập nhật docs

- Docs mô tả **hành vi hiện tại**, không phải lịch sử
- Xóa thông tin cũ, không comment out
- Nếu behavior thay đổi lớn → xem xét tạo ADR (`/arch:adr`)
- Conflict giữa code và docs → code là nguồn sự thật, update docs theo code
