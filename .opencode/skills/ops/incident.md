---
name: ops:incident
description: >
  Hướng dẫn triage incident, điều tra song song 3 hướng, tạo RCA template với 5 Whys.
  Trigger khi: user nói "có incident", "hệ thống bị lỗi production", "triage sự cố",
  "viết RCA", "root cause analysis", "on-call incident", hoặc gõ /ops:incident.
---

# /ops:incident
**Role**: DevOps / On-call Engineer  
**Mục đích**: Hướng dẫn triage incident, tạo RCA template, document bài học.

---

## Hướng dẫn thực hiện

### Bước 1 — Triage nhanh (KHÔNG dừng để hỏi, chạy ngay)

Khi incident xảy ra, triage theo thứ tự:

question({
  questions: [{
    question: "INCIDENT TRIAGE — Xác nhận thông tin incident:",
    header: "Triage",
    options: [
      { label: "P1 — Down", description: "Hệ thống down hoàn toàn, ảnh hưởng nhiều user" },
      { label: "P2 — Degraded", description: "Hệ thống degraded, một phần user bị ảnh hưởng" },
      { label: "P3 — Minor", description: "Lỗi nhỏ, không ảnh hưởng user" },
    ]
  }]
})

### Bước 2 — Hỗ trợ Investigation

Dựa trên symptoms, đề xuất **3 hướng điều tra song song**:

```
## Incident [INC-XXX] — P[N]

**Impact**: [Mô tả]
**Started**: [Time]

### 3 hướng điều tra ưu tiên:

**Hướng A**: [Giả thuyết 1] — Check: [command/dashboard cụ thể]
**Hướng B**: [Giả thuyết 2] — Check: [...]
**Hướng C**: [Giả thuyết 3] — Check: [...]

Tôi suggest bắt đầu với Hướng A vì [lý do].
Ai sẽ check Hướng nào?
```

### Bước 3 — Tạo RCA Template

Sau khi incident được resolve, tạo `docs/reports/INC-[XXX]-RCA.md` dùng template `templates/incident-report.md`.

Điền vào:
- **Frontmatter**: incidentId, severity (P1-P4), startTime/endTime/durationMinutes, incidentCommander
- **Tóm tắt**: 2-3 câu — chuyện gì xảy ra, khi nào, ảnh hưởng user
- **Ảnh hưởng**: số user bị ảnh hưởng, tính năng bị ảnh hưởng, SLA impact, có notify khách JP không
- **Timeline**: timestamps thực tế từ incident; bao gồm detect → ack → tìm root cause → fix → resolved
- **Root Cause**: trigger event + phân tích 5 Whys + contributing factors
- **Điều tốt / Cần cải thiện**: blameless — focus vào hệ thống, không phải con người
- **Action Items**: tối thiểu AI-001 (prevent recurrence), AI-002 (improve detection), AI-003 (update runbook)
- **Tài liệu hỗ trợ**: link đến logs, dashboards, PR liên quan

### Bước 4 — Gate cuối RCA

question({
  questions: [{
    question: "RCA draft hoàn thành. Xác nhận root cause và action items?",
    header: "RCA Review",
    options: [
      { label: "OK", description: "Root cause đúng, action items realistic" },
      { label: "Sửa root cause", description: "Còn layer sâu hơn cần phân tích" },
      { label: "Sửa action items", description: "AI cần adjust deadline hoặc owner" },
    ]
  }]
})
