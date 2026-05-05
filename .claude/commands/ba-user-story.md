# Skill: /ba-user-story
**Role**: Business Analyst  
**Mục đích**: Chuyển spec thành User Stories với Acceptance Criteria chuẩn, sẵn sàng để PM tạo issue.

---

## Hướng dẫn thực hiện

### Bước 1 — Đọc spec hiện có

Đọc `docs/tasks/[TASK-ID]/requirements.md` nếu có. Nếu chưa có, yêu cầu người dùng chạy `/ba-spec` trước.

### Bước 2 — Gate: Xác nhận scope

```
## Tôi sẽ tạo User Stories từ spec: [Tên feature]

Spec có [N] Use Cases và [M] Acceptance Criteria.

Trước khi bắt đầu, tôi cần hỏi:
1. Granularity mong muốn: Mỗi Use Case = 1 story, hay gộp/tách theo logic khác?
2. Story format: "As a [role], I want [action], so that [benefit]" hay format khác của team?
3. Có Epic nào đã tồn tại để link vào không?
```

**Chờ confirm.**

### Bước 3 — Tạo User Stories

Mỗi User Story theo format:

```markdown
## US-[ID]: [Tên ngắn gọn]

**Epic**: [Epic name nếu có]  
**Priority**: [High/Medium/Low]  
**Estimate**: [Story points hoặc giờ]  
**Dependencies**: [US-XXX nếu có]

### User Story
As a **[actor]**,  
I want to **[action]**,  
So that **[business value]**.

### Acceptance Criteria
- [ ] **AC-001**: Given [context], When [action], Then [expected result]
- [ ] **AC-002**: Given [context], When [action], Then [expected result]

### Out of scope
- [Điều không thuộc story này]

### Notes
- [Business rule liên quan: BR-XXX]
- [Màn hình liên quan nếu có]
```

### Bước 4 — Gate cuối: Review + Đề xuất thứ tự

```
## Đã tạo [N] User Stories:

| ID | Tên | Priority | Estimate | Dependencies |
|----|-----|----------|----------|--------------|
| US-001 | | | | |

**Đề xuất thứ tự implement** (dựa trên dependencies và value):
1. US-XXX — [lý do]
2. US-XXX — [lý do]

**Câu hỏi trước khi finalize**:
1. Estimate có hợp lý không? (US-XXX có vẻ phức tạp hơn estimate)
2. US-XXX có thể chia nhỏ hơn không để dễ demo hơn?
3. Có story nào nên defer sang sprint sau không?
```

---

## Output files

- Cập nhật `docs/tasks/[TASK-ID]/requirements.md` với User Stories section
- Sẵn sàng để PM dùng `/pm-breakdown` để tạo GitHub Issues
