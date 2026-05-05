# Analysis: TASK-001-1

## Phương án đã chọn: A — Synchronous Flow + Fixed-Window Rate Limit

**Lý do**: Đủ dùng, ít moving parts, SMTP latency chấp nhận được cho forgot-password flow. Không over-engineer.

## Files sẽ thay đổi

| File | Loại | Ghi chú |
|------|------|---------|
| `src/routes/auth.routes.js` | modify | Thêm POST /api/auth/forgot-password |
| `src/controllers/auth.controller.js` | modify | Handler forgotPassword, luôn return 200 |
| `src/services/auth.service.js` | modify | Core logic orchestration |
| `src/models/user.model.js` | modify | Verify paranoid scope soft-delete |
| `src/services/email.service.js` | modify | Thêm sendPasswordResetEmail() |
| `src/config/redis.js` | modify | Verify Redis client export |
| `src/models/password_reset_token.model.js` | **create** | Model mới |
| `src/services/rate-limit.service.js` | **create** | Redis INCR+EXPIRE, key: ratelimit:forgot-password:{email} |
| `src/utils/token.util.js` | **create** | generateResetToken() + hashToken() |
| `src/migrations/..._create_password_reset_tokens.js` | **create** | DB migration |
| `.env` | modify | Thêm FRONTEND_URL, RESET_TOKEN_EXPIRES_MINUTES=30 |

## Quyết định kỹ thuật quan trọng

- Rate limit: `SET key 1 EX 86400 NX` + `INCR` (atomic hơn INCR+EXPIRE riêng lẻ)
- Token: `crypto.randomBytes(32).toString('hex')` → SHA-256 hash lưu DB
- Email không tồn tại: `setTimeout(50ms)` để equalize timing (chống user enumeration)
- Token cũ: DELETE WHERE user_id AND used_at IS NULL (không giữ audit trail — đơn giản)
- SMTP fail: log error + alert, không retry, vẫn trả 200

## Phương án đã cân nhắc và lý do không chọn

- **B (Fire-and-Forget)**: Silent SMTP failure không phù hợp security-critical flow
- **C (BullMQ)**: Over-engineered, thêm worker process infrastructure không cần thiết

## Câu hỏi mở còn lại

- [ ] FRONTEND_URL value cho production environment
