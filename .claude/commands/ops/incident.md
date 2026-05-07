---
name: ops:incident
description: >
  Hướng dẫn triage incident, điều tra song song 3 hướng, tạo RCA template với 5 Whys.
  Trigger khi: user nói "có incident", "hệ thống bị lỗi production", "triage sự cố",
  "viết RCA", "root cause analysis", "on-call incident", hoặc gõ /ops:incident.
---

# Skill: /ops:incident
**Role**: DevOps / On-call Engineer  
**Mục đích**: Hướng dẫn triage incident, tạo RCA template, document bài học.

---

## Hướng dẫn thực hiện

### Bước 1 — Triage nhanh (KHÔNG dừng để hỏi, chạy ngay)

Khi incident xảy ra, triage theo thứ tự:

```
## INCIDENT TRIAGE

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | IMPACT: Bao nhiêu user/service bị ảnh hưởng? | _(điền vào)_ |
| 2 | SEVERITY | A: P1 — down hoàn toàn / B: P2 — degraded / C: P3 — minor / D: Khác: ___ |
| 3 | STARTED: Lúc nào bắt đầu? | _(điền thời gian)_ |
| 4 | SYMPTOMS: Biểu hiện cụ thể? | _(điền vào)_ |
```

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

Sau khi incident resolved, tạo `docs/decisions/INC-[XXX]-RCA.md`:

```markdown
# Root Cause Analysis: INC-[XXX]

**Severity**: P[N]  
**Duration**: [Start] → [End] ([X phút/giờ])  
**Impact**: [Số user, revenue, SLA breach...]  
**Incident Commander**: [Name]  
**Date RCA completed**: [Date]

---

## Timeline

| Time | Event | Actor |
|------|-------|-------|
| HH:MM | Incident detected | [Monitor/User report] |
| HH:MM | On-call paged | [System] |
| HH:MM | Investigation started | [Name] |
| HH:MM | Root cause identified | [Name] |
| HH:MM | Fix deployed | [Name] |
| HH:MM | Incident resolved | [Name] |

## 5 Whys

**Symptom**: [Biểu hiện]

1. **Why?** → [Answer 1]
2. **Why?** → [Answer 2]
3. **Why?** → [Answer 3]
4. **Why?** → [Answer 4]
5. **Why?** → **Root Cause**: [Root cause]

## Root Cause

[Mô tả root cause rõ ràng, không blame người]

## Contributing Factors

- [Factor 1]
- [Factor 2]

## Impact Analysis

- Users affected: [N]
- Services affected: [list]
- Data integrity: [OK / At risk / Compromised]
- SLA breach: [Yes/No]

## Fix Applied

[Mô tả fix tạm thời và fix lâu dài]

## Action Items (Bài học & Cải tiến)

| ID | Action | Owner | Deadline | Priority |
|----|--------|-------|----------|----------|
| AI-001 | [Prevent recurrence] | [Name] | [Date] | High |
| AI-002 | [Improve detection] | [Name] | [Date] | Medium |
| AI-003 | [Improve response] | [Name] | [Date] | Medium |

## Điều làm tốt

- [Phản ứng nhanh ở điểm X]
- [Communication tốt]

## Điều cần cải thiện

- [Alert quá chậm]
- [Runbook chưa cập nhật]
```

### Bước 4 — Gate cuối RCA

```
RCA draft hoàn thành.

Câu hỏi quan trọng:

| # | Câu hỏi | Lựa chọn |
|---|---------|---------|
| 1 | "5 Whys" — root cause [X] có đúng không? | A: Đúng / B: Còn layer sâu hơn — layer đó là: ___ / C: Khác: ___ |
| 2 | Action Items — AI-001 có realistic trong deadline không? | A: Có / B: Không — cần adjust: ___ / C: Khác: ___ |
| 3 | Có contributing factor nào bị bỏ sót không? | A: Không / B: Có — factor: ___ / C: Khác: ___ |
| 4 | Ai cần review RCA này trước khi share rộng? | _(điền tên)_ |
```
