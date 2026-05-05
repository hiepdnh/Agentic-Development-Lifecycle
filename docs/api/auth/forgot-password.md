# API: POST /api/auth/forgot-password

**Endpoint**: `POST /api/v1/auth/forgot-password`  
**Domain**: Auth  
**Last updated**: 2026-05-05  
**Updated by task**: TASK-001-1

---

## Mô tả

Khởi tạo luồng reset mật khẩu. Tạo secure token, lưu DB, gửi reset link qua email.
Response luôn 200 OK bất kể email có tồn tại hay không (chống user enumeration).

## Authentication

- **Required**: No
- **Type**: None (public endpoint)

## Request

### Headers

| Key | Required | Value |
|-----|----------|-------|
| `Content-Type` | Yes | `application/json` |

### Request Body

```json
{
  "email": "user@example.com"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `email` | string | Yes | Valid email format, max 255 chars |

**Note**: Email được normalize (toLowerCase + trim) trước khi xử lý.

## Response

### Success Response

**Status**: `200 OK` — luôn trả về 200 dù email tồn tại hay không.

```json
{
  "success": true,
  "message": "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn reset mật khẩu."
}
```

### Error Responses

| Status | Code | Khi nào |
|--------|------|---------|
| `400` | `VALIDATION_ERROR` | Email sai format hoặc bỏ trống |
| `429` | `RATE_LIMIT_EXCEEDED` | Vượt 10 request/ngày/email |

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 24 giờ."
  }
}
```

**Headers khi 429**:
```
Retry-After: 86400
```

## Business Rules

| ID | Rule |
|----|------|
| BR-003 | Request mới invalidate token cũ chưa dùng của cùng email |
| BR-004 | Rate limit: 10 request/ngày/email (UTC calendar day) |
| BR-006 | Response luôn 200 OK, không tiết lộ email có tồn tại hay không |

## Token Behavior

- Token: `crypto.randomBytes(32)` → 64-char hex string
- Chỉ SHA-256 hash được lưu DB, raw token chỉ gửi qua email
- Token valid 30 phút kể từ lúc tạo (xem `POST /api/v1/auth/reset-password`)
- Token single-use

## Rate Limiting

- **Limit**: 10 requests/email/ngày (UTC calendar day, reset lúc 00:00 UTC)
- **Key**: `ratelimit:forgot-password:{normalized_email}`
- **Storage**: Redis (persistent)
- **Header**: `Retry-After: 86400` khi exceeded

## Security Notes

- Endpoint unauthenticated by design
- Response timing equalized (dummy work ~50ms) khi email không tồn tại — chống timing attack
- Reset link trong email: `HTTPS` only, token trong query param
- Server access logs sẽ chứa token trong URL — cần log rotation policy

## Example

```bash
curl -X POST https://api.example.com/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```
