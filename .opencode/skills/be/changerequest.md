---
name: be:changerequest
description: >
  Quản lý 変更依頼 (Change Request) — phân tích impact, tạo approval trail,
  version control thay đổi spec. Dùng khi spec thay đổi giữa sprint hoặc sau sign-off.
  Trigger khi: user nói "khách JP yêu cầu thay đổi", "tạo change request", "変更依頼",
  "spec thay đổi giữa chừng", "CR mới từ JP", "change request", hoặc gõ /be:changerequest.
---
## Tóm tắt

Quản lý 変更依頼 (Change Request) — phân tích impact, tạo approval trail, version control thay đổi spec. Dùng khi spec thay đổi giữa sprint hoặc sau sign-off. Trigger khi: user nói "khách JP yêu cầu thay đổi", "tạo change request", "変更依頼", "spec thay đổi giữa chừng", "CR mới từ JP", "change request", hoặc gõ /be:changerequest.

## Quy trình

# /be:changerequest
**Role**: Bridge Engineer / PM  
**Mục đích**: Xử lý yêu cầu thay đổi từ khách JP một cách có kiểm soát — impact analysis rõ ràng, approval trail đầy đủ, không merge thay đổi ngầm vào spec.

---

## Context

Thay đổi spec sau sign-off là rủi ro cao nhất trong JP outsource:
- Khách JP hay yêu cầu thay đổi nhỏ qua email/chat mà không có formal CR
- Dev VN implement "cho nhanh" mà không có approval trail → sau này khách chất vấn
- Impact chưa được estimate → scope creep không kiểm soát được

**Nguyên tắc**: Mọi thay đổi sau sign-off đều phải có CR document trước khi dev touch code.

---

## Hướng dẫn thực hiện

### Bước 0 — Load glossary

Đọc `templates/jp-vn-en-glossary.md` trước khi xử lý thuật ngữ kỹ thuật.

### Bước 1 — Gate: Thu thập thông tin CR

<!-- Gate: Thu thập thông tin CR -->
question({
  questions: [{
    question: "Nguồn yêu cầu CR từ đâu?",
    header: "Nguồn",
    options: [
      { label: "Email từ JP", description: "Yêu cầu qua email" },
      { label: "Meeting", description: "Yêu cầu từ meeting" },
      { label: "Slack/Teams", description: "Yêu cầu từ chat" },
      { label: "Formal 変更依頼書", description: "Văn bản chính thức" }
    ]
  }, {
    question: "Loại thay đổi?",
    header: "Loại",
    options: [
      { label: "Thêm feature mới", description: "Yêu cầu chức năng mới" },
      { label: "Sửa spec hiện tại", description: "Thay đổi spec đã sign-off" },
      { label: "Bỏ scope", description: "Loại bỏ yêu cầu đã có" },
      { label: "Performance mới", description: "Yêu cầu performance bổ sung" },
      { label: "UI/UX adjustment", description: "Chỉnh sửa giao diện" }
    ]
  }, {
    question: "Urgency?",
    header: "Urgency",
    options: [
      { label: "Sprint hiện tại", description: "Cần làm ngay trong sprint này" },
      { label: "Sprint sau", description: "Có thể đợi sprint sau" },
      { label: "Flexible", description: "Chưa xác định thời gian" }
    ]
  }]
})

### Bước 2 — Phân tích Impact

Đọc:
- `docs/tasks/[TASK-ID]/requirements.md` — spec gốc đang bị thay đổi
- `docs/tasks/[TASK-ID]/analysis.md` — implementation đã plan hoặc đang làm
- `docs/decisions/ADR-*.md` — quyết định kỹ thuật liên quan

Phân tích theo 4 chiều:

```
## Impact Analysis: CR-[NUMBER]

### Scope Impact
- Files/modules bị ảnh hưởng: [list]
- ACs bị thay đổi / thêm / bỏ: [diff so với spec gốc]
- Test cases cần cập nhật: [list]

### Effort Impact
- Estimate thêm: [X man-hours / man-days]
- Có thể làm trong sprint hiện tại: [Yes / No / Partial]
- Nếu No: cần push sang sprint [N+1 / TBD]

### Risk Impact
- Risk mới: [list]
- Dependencies bị ảnh hưởng: [list]
- Regression risk: [Low / Medium / High]

### Schedule Impact
- Deadline hiện tại: [Date]
- Impact đến deadline: [None / Trễ X ngày / Cần thương lượng lại]
```

### Bước 3 — Gate: Xác nhận impact trước khi soạn CR

```
## Tôi đã phân tích impact của yêu cầu thay đổi.

[Hiển thị impact analysis từ Bước 2]
```

<!-- Gate: Xác nhận impact -->
question({
  questions: [{
    question: "Impact analysis có chính xác không?",
    header: "Accuracy",
    options: [
      { label: "Chính xác", description: "Impact analysis đúng" },
      { label: "Cần điều chỉnh", description: "Tôi sẽ mô tả điều cần sửa" }
    ]
  }, {
    question: "Ai là người approve CR phía team?",
    header: "VN Approver",
    options: [
      { label: "PM", description: "PM approve" },
      { label: "Tech Lead", description: "Tech Lead approves" },
      { label: "Cả hai", description: "Cả PM và Tech Lead" }
    ]
  }, {
    question: "Cần gửi estimate cho JP trước khi approve không?",
    header: "JP Estimate",
    options: [
      { label: "Có", description: "Gửi email estimate trước" },
      { label: "Không", description: "Tiếp tục tạo CR doc" }
    ]
  }]
})

### Bước 4 — Tạo Change Request Documents

#### 4a. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md` (tiếng Việt — nội bộ)

Tạo dùng template `templates/change-request.md`.

Điền đầy đủ:
- CR Number, Task gốc, Người tạo, Status
- Mô tả yêu cầu thay đổi từ khách JP (nguyên văn hoặc tóm tắt)
- Bảng so sánh Spec gốc vs Spec mới
- Impact Analysis theo 4 chiều: Scope / Effort / Risk / Schedule
- Approval table đủ 3 bên: PM + Tech Lead + Khách JP

#### 4b. `docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md` (tiếng Nhật — gửi khách JP)

Tạo dùng template `templates/change-request.ja.md`.

Đây là văn bản chính thức gửi khách JP. Đảm bảo:
- Tất cả sections bằng tiếng Nhật với kính ngữ (敬語)
- Số liệu effort bằng 人日 (man-days)
- Approval table có đủ bên JP confirm

### Bước 5 — Gate cuối

```
## Change Request CR-[NUMBER] đã soạn xong.

Files tạo ra:
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-vn.md (nội bộ — commit)
- docs/tasks/[TASK-ID]/cr/CR-[NUMBER]-jp.md (gửi JP — commit)

Checklist:
- [ ] Impact analysis đã được PM và Tech Lead review
- [ ] Estimate đã được confirm (không phải "TBD")
- [ ] CR-jp.md đã được dịch đúng thuật ngữ từ glossary
- [ ] Approval table có đủ 3 bên: PM + Tech Lead + Khách JP

Bước tiếp theo:
- [ ] Gửi CR-jp.md cho khách JP để confirm
- [ ] Sau khi khách JP approve: cập nhật requirements.md (ghi rõ "CR-[NUMBER] approved [date]")
- [ ] Tạo GitHub Issue mới hoặc cập nhật issue gốc
```

<!-- Gate cuối -->
question({
  questions: [{
    question: "CR documents đã hoàn tất. Confirm?",
    header: "Finalize",
    options: [
      { label: "Xác nhận", description: "CR docs hoàn tất, sẵn sàng gửi" },
      { label: "Cần chỉnh sửa", description: "Tôi sẽ mô tả điều cần sửa" }
    ]
  }]
})

---

## Quy tắc

- **KHÔNG** implement thay đổi trước khi CR được approve bởi cả PM và khách JP
- Mọi CR phải có số (CR-001, CR-002...) — track trong `docs/tasks/[TASK-ID]/cr/`
- Nếu CR thay đổi kiến trúc → trigger `/arch:adr` sau khi approve
- Nếu CR thêm security-sensitive feature → trigger `/sec:review` sau implement
