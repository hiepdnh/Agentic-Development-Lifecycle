# Reset Password via Email Token

**Task ID**: TASK-001  
**Ngày tạo**: 2026-05-05  
**BA**: [BA Name]  
**Trạng thái**: Draft

---

## 1. Bối cảnh & Vấn đề

Users quên mật khẩu hiện tại phải liên hệ admin để reset thủ công. Điều này tạo bottleneck cho admin và friction cao cho user. Cần cơ chế tự phục vụ an toàn.

## 2. Mục tiêu

- Cho phép user tự reset mật khẩu qua email mà không cần admin
- Giảm admin reset requests xuống < 5% trong 30 ngày sau launch
- Đảm bảo quy trình bảo mật (token single-use, time-limited)

## 3. Phạm vi

### Trong phạm vi
- Màn hình "Quên mật khẩu" — nhập email request reset
- Gửi email chứa reset link với token
- Màn hình nhập mật khẩu mới (từ link email)
- Invalidate token sau khi dùng hoặc hết hạn
- Rate limiting: tối đa 10 request/email/ngày

### Ngoài phạm vi
- SMS OTP reset
- "Đổi mật khẩu" khi đã đăng nhập (feature riêng)
- Admin bulk reset hàng loạt
- Account recovery khi mất access email
- Social login / SSO

## 4. Actors & Use Cases

| Actor | Use Case | Mô tả |
|-------|----------|-------|
| User (unauthenticated) | Request reset | Nhập email để nhận link reset |
| User (unauthenticated) | Set new password | Click link, nhập mật khẩu mới |
| Email Service | Send reset email | Gửi email chứa token link |
| System | Manage tokens | Tạo, validate, invalidate tokens |

## 5. Business Rules

| ID | Rule | Ghi chú |
|----|------|---------|
| BR-001 | Token valid 30 phút kể từ lúc tạo | Sau 30 phút → link báo expired |
| BR-002 | Token single-use — dùng 1 lần là invalidate | Kể cả khi vẫn trong 30 phút |
| BR-003 | Request mới invalidate token cũ chưa dùng | Chỉ 1 active token tại 1 thời điểm |
| BR-004 | Rate limit: tối đa 10 request/email/ngày | Reset counter lúc 00:00 |
| BR-005 | Mật khẩu mới phải thỏa password policy hiện tại | Giữ nguyên rule đang dùng |
| BR-006 | Response luôn là "Nếu email tồn tại, bạn sẽ nhận được email" | Không reveal email có trong hệ thống hay không |

## 6. Luồng nghiệp vụ chính (Happy Path)

1. User vào màn hình Login → click "Quên mật khẩu"
2. System hiển thị màn hình nhập email
3. User nhập email → submit
4. System tạo secure token, lưu DB với expiry 30 phút
5. System gửi email chứa link: `https://[domain]/reset-password?token=[TOKEN]`
6. System hiển thị: *"Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn reset mật khẩu."*
7. User mở email → click link
8. System validate token (tồn tại + chưa dùng + chưa hết hạn)
9. System hiển thị form nhập mật khẩu mới
10. User nhập mật khẩu mới + confirm → submit
11. System validate password policy → update password → invalidate token
12. System hiển thị: *"Mật khẩu đã được đổi thành công"* → redirect Login

## 7. Luồng thay thế & Exception

| Trường hợp | Xử lý |
|-----------|-------|
| Email không tồn tại trong hệ thống | Vẫn hiển thị message thành công (BR-006) |
| Vượt rate limit (> 10 lần/ngày) | Hiển thị: *"Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 24 giờ."* |
| Token hết hạn (> 30 phút) | Hiển thị: *"Link đã hết hạn. Vui lòng yêu cầu reset lại."* + nút "Gửi lại" |
| Token đã dùng rồi | Hiển thị: *"Link không hợp lệ hoặc đã được sử dụng."* |
| Token không tồn tại | Hiển thị: *"Link không hợp lệ."* |
| Mật khẩu mới không đúng policy | Hiển thị lỗi inline tại field, không clear form |
| Confirm password không khớp | Hiển thị lỗi inline: *"Mật khẩu xác nhận không khớp"* |
| Email service fail | Log lỗi, hiển thị: *"Không thể gửi email, vui lòng thử lại sau"* |

## 8. Acceptance Criteria

- [ ] AC-001: User nhập email hợp lệ → nhận email trong vòng 2 phút, email chứa link reset hoạt động
- [ ] AC-002: Link reset expire sau đúng 30 phút — click sau 30 phút → hiển thị thông báo hết hạn
- [ ] AC-003: Token chỉ dùng được 1 lần — dùng xong click lại → báo link không hợp lệ
- [ ] AC-004: Request thứ 2 invalidate token cũ — link cũ không còn dùng được
- [ ] AC-005: Nhập email không tồn tại → vẫn hiển thị message thành công (không leak thông tin)
- [ ] AC-006: Sau 10 request trong ngày → báo rate limit, không gửi thêm email
- [ ] AC-007: Mật khẩu mới không đúng policy → hiển thị lỗi cụ thể, không submit
- [ ] AC-008: Reset thành công → login được với mật khẩu mới, không login được với mật khẩu cũ

## 9. Non-functional Requirements

- **Security**: Token phải là cryptographically secure random (min 32 bytes), không predictable
- **Security**: Link reset chỉ dùng được qua HTTPS
- **Performance**: Email gửi đi trong < 2 phút trong điều kiện bình thường
- **Availability**: Rate limit state phải persistent (không reset khi server restart)

## 11. User Stories

| ID | Tên | Priority | Estimate | Dependencies |
|----|-----|----------|----------|--------------|
| US-001 | Yêu cầu reset mật khẩu | High | 3 points | - |
| US-002 | Đặt mật khẩu mới từ link email | High | 3 points | US-001 |

## 10. Câu hỏi mở

| ID | Câu hỏi | Người trả lời | Deadline | Status |
|----|---------|---------------|----------|--------|
| Q-001 | Email template design — ai làm? BA/Designer? | PM | - | Open |
| Q-002 | Rate limit 10/ngày — đếm theo IP hay email? | Tech Lead | - | Resolved: theo email |
