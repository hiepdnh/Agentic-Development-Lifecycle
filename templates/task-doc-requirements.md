---
sessionId: [TASK-ID-YYYYMMDD-HHMM]
createdAt: [YYYY-MM-DD HH:mm JST]
updatedAt: [YYYY-MM-DD HH:mm JST]
commitSha: [sha]
roundCount: 0
---

# [Tên Feature/Task]

**Task ID**: [PROJECT-XXX]  
**Ngày tạo**: [YYYY-MM-DD]  
**BA**: [Name]  
**Trạng thái**: Draft / Review / Approved  
**Lane**: tiny | normal | high-risk — _(xem `docs/risk-classifier.md`)_

---

## 1. Bối cảnh & Vấn đề

[Mô tả vấn đề kinh doanh cần giải quyết. Tại sao cần làm?]

## 2. Mục tiêu

- [Mục tiêu 1]
- [Mục tiêu 2]

## 3. Phạm vi

### Trong phạm vi (In scope)
- [...]

### Ngoài phạm vi (Out of scope)
- [...]

## 4. Actors & Use Cases

| Actor | Use Case | Mô tả |
|-------|----------|-------|
| | | |

## 5. Business Rules

| ID | Rule | Ghi chú |
|----|------|---------|
| BR-001 | | |

## 6. Luồng nghiệp vụ chính (Happy Path)

1. [Bước 1]
2. [Bước 2]

## 7. Luồng thay thế & Exception

| Trường hợp | Xử lý |
|-----------|-------|
| | |

## 8. Acceptance Criteria

- [ ] AC-001: [Điều kiện nghiệm thu]
- [ ] AC-002: [Điều kiện nghiệm thu]

## 9. Non-functional Requirements

- **Performance**: [nếu có]
- **Security**: [nếu có]
- **Compatibility**: [nếu có]

## 10. User Stories

| ID | Tên | Priority | Estimate |
|----|-----|----------|----------|
| US-001 | | | |

## 11. Câu hỏi mở (Open Questions)

| ID | Câu hỏi | Người trả lời | Deadline | Status |
|----|---------|---------------|----------|--------|
| Q-001 | | | | Open |

## 12. Harness Delta

_Ghi lại mọi cập nhật vào framework gây ra bởi task này — template thiếu field, gate không rõ, friction lặp lại._

- [ ] Không có friction phát hiện trong task này
- [ ] [Mô tả friction nếu có → thêm vào `docs/improvement-backlog.md`]

## 13. Q&A History

_Append-only — mỗi vòng clarify thêm entry mới ở cuối, KHÔNG overwrite. Giữ context để BE/khách JP audit được lý do quyết định ("なぜこの設計?")._

### Round 1 — [YYYY-MM-DD HH:mm JST]

**Q1**: [Câu hỏi]  
**Options**: A: [...] / B: [...] / C: [...]  
**Suggested**: [A/B/C]  
**Answer**: [Lựa chọn của user]  
**Impact**: [Section nào của spec được cập nhật do answer này — vd: BR-002, AC-003]

**Q2**: ...

<!-- Round 2 sẽ được append xuống dưới khi có vòng clarify tiếp theo -->

