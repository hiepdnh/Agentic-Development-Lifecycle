# Screen: Forgot Password

**Route/URL**: `/forgot-password`  
**Feature**: Authentication — Reset Password  
**Last updated**: 2026-05-05  
**Updated by task**: TASK-001-1

---

## Mô tả

Màn hình cho phép user khởi tạo luồng reset mật khẩu bằng cách nhập email.
Truy cập từ màn hình Login qua link "Quên mật khẩu".

## Điều kiện truy cập

- **Authentication**: None (public)
- **Pre-condition**: User chưa đăng nhập

## Layout & Components

### Header
| Component | Mô tả |
|-----------|-------|
| Logo | Link về trang chủ |
| Tiêu đề | "Quên mật khẩu" |
| Mô tả phụ | "Nhập email để nhận hướng dẫn đặt lại mật khẩu" |

### Form
| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| `email` | email input | Yes | Valid email format |

### Actions
| Component | Type | Mô tả |
|-----------|------|-------|
| Submit button | Button | "Gửi yêu cầu" — trigger API call |
| Back link | Link | "Quay lại đăng nhập" → `/login` |

## User Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Submit email hợp lệ | Click "Gửi yêu cầu" | Hiện success state |
| Submit email sai format | Click submit | Inline validation error |
| Click "Quay lại đăng nhập" | Click link | Navigate `/login` |

## States

| State | Hiển thị |
|-------|---------|
| Default | Form trống, button active |
| Loading | Button disabled + spinner, form disabled |
| Success | Ẩn form, hiện message: *"Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn reset mật khẩu. Vui lòng kiểm tra inbox."* + link "Quay lại đăng nhập" |
| Rate Limited | Hiện error: *"Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 24 giờ."* |
| Validation Error | Inline error dưới field email |

## Validation Messages

| Field | Condition | Message |
|-------|-----------|---------|
| `email` | Empty | "Vui lòng nhập email" |
| `email` | Invalid format | "Email không hợp lệ" |

## API Calls

| Action | Method | Endpoint | Docs |
|--------|--------|----------|------|
| Submit form | POST | `/api/v1/auth/forgot-password` | `docs/api/auth/forgot-password.md` |

## Ghi chú

- Success state hiển thị message giống nhau dù email tồn tại hay không (security)
- Form bị disable trong loading state để tránh double-submit
- Sau khi success, user phải click link để quay lại login (không auto-redirect)
