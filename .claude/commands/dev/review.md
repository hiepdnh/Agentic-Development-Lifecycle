---
name: dev:review
description: >
  Review toàn diện code sau implement: code quality, architecture, security trong 1 lần chạy.
  Thay thế việc phải chạy /arch:review + /sec:review riêng lẻ sau dev:implement.
  Trigger khi: user nói "review code", "review trước merge", "check code xem ổn không",
  "code review", "review implementation", "kiểm tra code", hoặc gõ /dev:review.
---

# Skill: /dev:review
**Role**: Developer / Tech Lead  
**Mục đích**: Review toàn diện sau `dev:implement` — code quality, architecture, security — trong 1 lần chạy. Kết quả là quyết định Approve / Request Changes trước khi chạy `/dev:pr`.

---

## Hướng dẫn thực hiện

### Bước 1 — Thu thập context

Đọc song song:
- `git diff HEAD~1` hoặc diff của PR
- `docs/tasks/[TASK-ID]/analysis.md` — phương án đã chọn, để biết intent
- `docs/tasks/[TASK-ID]/verification.md` — self-test dev đã làm, tránh kiểm tra lại

Nếu không có analysis.md → hỏi dev mô tả ngắn về thay đổi.

---

### Bước 2 — Gate: Xác nhận scope

Dùng `AskUserQuestion` tool:

- **Focus**: All (mặc định) / Code only / Architecture only / Security only
- **Constraint**: Deadline gấp? Known tech debt cần bỏ qua? Framework đặc thù?

**Chờ confirm.**

---

### Bước 3 — Review theo 3 lens

Chạy 3 lens đồng thời trên cùng diff:

#### Lens 1 — Code Quality

| Điểm kiểm tra | Tìm gì |
|--------------|--------|
| Logic correctness | Bug hiển nhiên, off-by-one, null pointer, race condition |
| Naming | Variable/function tên mờ, viết tắt khó hiểu, không nhất quán với codebase |
| Test coverage | Thiếu happy path, edge case, error case quan trọng |
| Duplication | Vi phạm DRY — copy-paste logic có thể extract |
| Performance | N+1 query, unbounded loop, memory leak, blocking I/O |
| Error handling | Exception bị nuốt, error message expose internals |

#### Lens 2 — Architecture

Đánh giá theo 6 chiều:

| Chiều | Câu hỏi |
|-------|--------|
| Correctness | Logic có đúng với spec không? |
| Scalability | Chịu được load tăng 10x không? Bottleneck ở đâu? |
| Maintainability | Dev mới có hiểu và sửa được trong 6 tháng không? |
| Coupling | Phụ thuộc module khác quá nhiều? Circular dependency? |
| Testability | Có thể unit test mà không cần mock quá nhiều không? |
| Design decision | Có pattern/approach mới chưa có trong codebase → cần ADR không? |

#### Lens 3 — Security (OWASP Top 10)

**Always check** (mọi PR):
- Input validation và sanitize
- Parameterized queries (không string concat vào SQL)
- HTTPS cho external calls
- Không log sensitive data (password, token, PII)
- Dependency CVEs (`npm audit` / `pip audit` / `gradle audit`)

**Ask First** (dừng lại nếu phát hiện):
- Thay đổi authentication / authorization logic
- Thêm/sửa permission hoặc role checks
- Breaking changes trong public API
- Lưu trữ PII hoặc sensitive data mới
- Thay đổi CORS configuration
- Thay đổi cryptographic implementation
- Database migration có thể mất data

**Never** (flag ngay là Critical):
- Custom encryption (dùng standard libraries)
- Hardcoded credentials trong code
- Disable SSL verification
- `eval()` với user input
- Expose stack traces cho user

**Quick grep**:
```bash
# SQL injection candidates
grep -rn "query\|execute\|raw" src/ | grep "\${"

# Sensitive logging
grep -rn "console.log\|logger" src/ | grep -i "password\|token\|secret"

# Missing auth trên routes
grep -rn "router\.\(get\|post\|put\|delete\)" src/routes/ | grep -v "auth\|protect\|verify"

# JWT issues
grep -rn "jwt.verify\|jwt.decode" src/
```

---

### Bước 4 — Trình bày kết quả

```
## Review Report: [Tên task / PR]

### 🔴 Blocking — Phải fix trước merge

| # | Lens | File | Vấn đề | Fix đề xuất |
|---|------|------|--------|------------|
| 1 | Security | auth/login.js:42 | SQL injection | Dùng parameterized query |
| 2 | Code | user.service.js:87 | Null pointer khi user không tồn tại | Add null check |

### ⚠️ Ask First — Cần senior confirm

| # | Vấn đề | Câu hỏi cụ thể |
|---|--------|---------------|
| 1 | Auth logic thay đổi | Flow mới có cover case token expired không? |

### 🟡 Non-blocking — Nên làm, không block merge

| # | Lens | File | Đề xuất |
|---|------|------|---------|
| 1 | Code | user.repo.js:23 | Biến `x` → `userId` cho rõ |
| 2 | Arch | order.service.js | N+1 query — cân nhắc batch load sau |

### 💡 Dài hạn (backlog)
- [Cải tiến kiến trúc có thể làm sau khi có time]

### ✅ Tổng hợp

| Lens | Kết quả |
|------|--------|
| Code Quality | ✅ OK / 🔴 [N] blocking / 🟡 [N] non-blocking |
| Architecture | ✅ OK / 🔴 [N] blocking — ADR cần tạo: [có / không] |
| Security (Always) | ✅ OK / 🔴 [N] issues |
| Security (Ask First) | ✅ Không có / ⚠️ [N] items cần confirm |
| Dependencies (CVEs) | ✅ OK / 🔴 [N] critical alerts |
```

---

### Bước 5 — Gate: Decision

Dùng `AskUserQuestion` tool:

- **Verdict**:
  - `Approve` — không có blocking issue, tiếp tục `/dev:pr`
  - `Approve with minor fixes` — non-blocking issues, dev tự fix trước khi merge
  - `Request Changes` — có blocking issues, dev fix rồi chạy lại `/dev:review`

- **ADR**: Nếu Lens 2 phát hiện design decision mới → hỏi có cần tạo `/arch:adr` không

**Chờ confirm.**

---

### Bước 6 — Kết luận

**Nếu Approve / Approve with minor fixes:**
```
Review hoàn tất. Verdict: [Approve / Approve with minor fixes]

[Danh sách non-blocking items nếu có — dev tự judge trước merge]

Bước tiếp: /dev:pr
```

**Nếu Request Changes:**
```
Review hoàn tất. Verdict: Request Changes

Cần fix trước khi merge:
1. [Blocking issue 1 — file:line — fix cụ thể]
2. [Blocking issue 2 — file:line — fix cụ thể]

Sau khi fix xong, chạy lại /dev:review.
```
