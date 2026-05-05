# Skill: /sec-review
**Role**: Developer / Tech Lead / Security  
**Mục đích**: Security review có cấu trúc trước khi merge. Ba tier rõ ràng: Always / Ask First / Never.

---

## Ba Tier Quyết định

### ✅ ALWAYS DO (tự động, không cần hỏi)
- Hash passwords với bcrypt/argon2 (không MD5/SHA1)
- Validate và sanitize tất cả input từ user
- Dùng parameterized queries (không string concatenation cho SQL)
- HTTPS cho tất cả external calls
- Không log sensitive data (password, token, PII)
- Dependency versions up-to-date (check CVE)

### ⚠️ ASK FIRST (dừng lại, hỏi human trước)
- Thay đổi authentication logic
- Thêm hoặc sửa authorization/permission checks
- Lưu trữ sensitive data mới (PII, payment info, health data)
- Thay đổi CORS configuration
- Thêm new external API integration
- Thay đổi cryptographic implementation
- Database schema thay đổi ảnh hưởng đến access control

### ❌ NEVER DO
- Implement custom encryption (dùng standard libraries)
- Hardcode credentials trong code
- Disable SSL verification
- Log full request/response với sensitive headers
- eval() với user input
- Expose stack traces cho user

---

## Hướng dẫn thực hiện

### Bước 1 — Scan changes

Spawn subagent đọc code diff:

> "Đọc git diff và tìm: authentication logic, authorization checks, data storage, external API calls, input validation, cryptography usage. Trả về file:line cho mỗi điểm tìm thấy."

### Bước 2 — Phân loại và Gate

Phân loại mỗi finding vào 3 tier:

```
## Security Review: [PR/Feature name]

### ⚠️ Ask First — Cần Senior Review

| Finding | File | Vấn đề / Câu hỏi |
|---------|------|------------------|
| [Auth change] | [file:line] | [Cần confirm: logic mới có cover case X không?] |

**Dừng lại — cần senior confirm những điểm trên trước khi proceed.**

### 🔴 Issues cần fix ngay

| Severity | File | Vấn đề | Fix |
|----------|------|--------|-----|
| Critical | [file:line] | [SQL injection risk] | [Parameterized query] |
| High | [file:line] | [...] | [...] |

### 🟡 Improvements nên làm

| File | Đề xuất |
|------|---------|
| [file:line] | [...] |

### ✅ Security checks OK

- [ ] Input validation: OK
- [ ] SQL injection: OK
- [ ] Auth logic: [Pending review / OK]
- [ ] Sensitive data logging: OK
- [ ] Dependencies: OK / [X CVEs cần update]
```

### Bước 3 — Gate cuối

```
Security review xong.

[Nếu có "Ask First" items]:
Trước khi merge, cần confirm với senior:
1. [Câu hỏi cụ thể về auth change]
2. [Câu hỏi về data storage]

[Nếu có Critical/High issues]:
Cần fix [N] issues trước khi merge.

[Nếu clean]:
Không có security concern. OK to merge từ góc độ security.
```

---

## OWASP Top 10 Checklist (quick reference)

- [ ] Injection (SQL, NoSQL, Command)
- [ ] Broken Authentication
- [ ] Sensitive Data Exposure
- [ ] XML External Entities (nếu dùng XML)
- [ ] Broken Access Control
- [ ] Security Misconfiguration
- [ ] Cross-Site Scripting (XSS) — nếu có frontend
- [ ] Insecure Deserialization
- [ ] Using Components with Known Vulnerabilities
- [ ] Insufficient Logging & Monitoring
