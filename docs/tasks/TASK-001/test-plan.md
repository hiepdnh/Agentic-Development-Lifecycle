# Test Plan: TASK-001-1 — Request Reset Password

**QA**: [QA Name]  
**Ngày**: 2026-05-05  
**Version**: 1.0  
**Môi trường**: Staging

---

## 1. Scope

### In scope
- AC-001: Email hợp lệ → nhận email trong 2 phút, link hoạt động
- AC-002: Email không tồn tại → vẫn trả message thành công
- AC-003: >10 request/ngày/email → rate limit
- BR-001: Token valid 30 phút
- BR-002: Token single-use
- BR-003: Request mới invalidate token cũ
- BR-004: Rate limit 10/ngày/email
- BR-006: Response luôn 200 OK

### Out of scope
- US-002 (set new password) — test plan riêng
- Email template design/rendering
- SMTP delivery guarantee (phụ thuộc provider)

---

## 2. Test Strategy

| Level | Approach | Tools |
|-------|----------|-------|
| Unit | Dev tự test logic service/util | Jest |
| Integration | API endpoint testing | Supertest / Postman |
| E2E | Manual — full flow từ form đến email | Browser + real email |
| Security | Timing attack, user enumeration | Manual + response time measurement |

---

## 3. Test Cases

### TC-001: Happy Path — Email hợp lệ nhận reset link
**Priority**: High  
**Pre-condition**: User với email `test@example.com` tồn tại trong DB, Staging email service active  
**Steps**:
1. POST `/api/auth/forgot-password` body: `{ "email": "test@example.com" }`
2. Kiểm tra response
3. Mở email inbox của `test@example.com`
4. Click reset link trong email

**Expected**:
- Response: HTTP 200, body chứa success message
- Email đến trong vòng 2 phút
- Reset link có format: `https://[staging-domain]/reset-password?token=[64-char-hex]`
- Link click được, không 404

---

### TC-002: Email không tồn tại trong hệ thống
**Priority**: High  
**Pre-condition**: Email `notexist@example.com` KHÔNG có trong DB  
**Steps**:
1. POST `/api/auth/forgot-password` body: `{ "email": "notexist@example.com" }`
2. Kiểm tra response
3. Kiểm tra inbox `notexist@example.com`

**Expected**:
- Response: HTTP 200, **message giống hệt** TC-001 (không leak thông tin)
- Không có email nào được gửi
- Không có token nào được tạo trong DB

---

### TC-003: Rate Limit — Vượt 10 request/ngày
**Priority**: High  
**Pre-condition**: Redis đang chạy, email `ratelimit@example.com` chưa request hôm nay  
**Steps**:
1. Gửi POST request 10 lần với email `ratelimit@example.com`
2. Gửi request lần thứ 11

**Expected**:
- Requests 1-10: HTTP 200, success message
- Request 11: HTTP 429, message "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 24 giờ"
- Response header: `Retry-After` present
- Không có email nào được gửi cho request 11

---

### TC-004: Rate Limit Reset Sau Midnight UTC
**Priority**: Medium  
**Pre-condition**: Email đã đạt rate limit (10 req hôm nay)  
**Steps**:
1. Simulate ngày mới (hoặc xóa Redis key thủ công để test logic)
2. Gửi POST request với email đó

**Expected**: HTTP 200, request được xử lý bình thường

---

### TC-005: Token Cũ Bị Invalidate Khi Request Mới
**Priority**: High  
**Pre-condition**: User đã có token active trong DB  
**Steps**:
1. POST forgot-password lần 1 → lấy token T1 từ email
2. POST forgot-password lần 2 → lấy token T2 từ email
3. Thử dùng T1 (GET reset-password?token=T1)

**Expected**:
- Token T2 được tạo thành công
- Token T1 trong DB có `used_at` không null (hoặc bị xóa)
- Dùng T1: response báo link không hợp lệ

---

### TC-006: Timing Attack — Response Time Consistent
**Priority**: Medium  
**Steps**:
1. Gửi 20 request với email tồn tại, đo response time
2. Gửi 20 request với email không tồn tại, đo response time

**Expected**:
- Response time của 2 nhóm **không có sự khác biệt có ý nghĩa thống kê** (< 20ms delta trung bình)
- Không thể dùng timing để detect email có tồn tại hay không

---

### TC-007: Email Case Insensitivity
**Priority**: Medium  
**Steps**:
1. POST với `Test@Example.COM`
2. POST với `test@example.com` (cùng account)
3. Đếm số email nhận được

**Expected**:
- Cả 2 request đều xử lý cho cùng 1 account
- Rate limit counter tăng cho cùng 1 key (không bypass bằng casing)
- Chỉ 1 active token tại 1 thời điểm

---

### TC-008: Email Format Validation
**Priority**: Low  
**Steps**:
1. POST với `notanemail`
2. POST với `@nodomain.com`
3. POST với `` (empty string)

**Expected**: HTTP 400, validation error message, không gửi email

---

### TC-009: Token Entropy Check
**Priority**: Medium  
**Steps**:
1. Request reset 5 lần, lấy 5 tokens từ email
2. Kiểm tra length và format

**Expected**:
- Mỗi token: 64 ký tự hex (32 bytes = 64 hex chars)
- Không có 2 token nào giống nhau
- Không predictable pattern

---

## 4. Test Data

| Data | Mô tả | Cách tạo |
|------|-------|----------|
| `test@example.com` | User tồn tại, email verified | Seed script |
| `notexist@example.com` | Email không trong DB | Không cần tạo |
| `ratelimit@example.com` | User để test rate limit | Seed script |
| `Test@Example.COM` | Test case normalization | Không cần tạo riêng |
| Redis state | Rate limit counters | Xóa bằng `redis-cli DEL ratelimit:forgot-password:*` trước mỗi test run |

---

## 5. Regression Checklist

- [ ] Đăng nhập bình thường (POST /auth/login) vẫn hoạt động
- [ ] Đăng ký user mới vẫn hoạt động
- [ ] Các endpoint auth khác không bị ảnh hưởng bởi rate limiter mới
- [ ] DB migration không làm ảnh hưởng bảng `users` hiện có

---

## 6. Exit Criteria

- [ ] TC-001, TC-002, TC-003, TC-005 (High priority) tất cả pass
- [ ] Không có bug Critical hoặc High chưa fix
- [ ] TC-006 (timing) pass — delta < 20ms
- [ ] Regression checklist clean
- [ ] Security notes từ sec-review đã được verify bởi Ops (log policy, nodemailer config)
