# Skill: /arch-adr
**Role**: Tech Lead / Architect  
**Mục đích**: Tạo Architecture Decision Record để document quyết định kiến trúc quan trọng.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập context

```
## Tôi sẽ tạo ADR cho quyết định: [tên]

Để soạn ADR đầy đủ, cho tôi biết:
1. Vấn đề/context dẫn đến quyết định này là gì?
2. Những phương án nào đã được cân nhắc?
3. Tại sao chọn phương án hiện tại?
4. Ai là người ra quyết định? (Để record)
```

### Bước 2 — Tạo ADR

Tạo file `docs/decisions/ADR-[NNN]-[slug].md`:

```markdown
# ADR-[NNN]: [Tiêu đề ngắn gọn]

**Ngày**: [Date]  
**Trạng thái**: Proposed / Accepted / Deprecated / Superseded  
**Người quyết định**: [Names]  
**Supersedes**: ADR-[XXX] (nếu có)

## Context

[Mô tả tình huống và vấn đề cần giải quyết.
Những force/constraint nào ảnh hưởng đến quyết định?]

## Quyết định

[Mô tả quyết định đã chọn, rõ ràng và dứt khoát.]

## Các phương án đã cân nhắc

### Phương án 1: [Tên]
- **Mô tả**: [...]
- **Ưu**: [...]
- **Nhược**: [...]

### Phương án 2: [Tên]
- **Mô tả**: [...]
- **Ưu**: [...]
- **Nhược**: [...]

### Phương án 3 (đã chọn): [Tên]
- **Mô tả**: [...]
- **Ưu**: [...]
- **Nhược**: [...]
- **Lý do chọn**: [...]

## Hệ quả

### Tích cực
- [Lợi ích 1]
- [Lợi ích 2]

### Tiêu cực / Trade-offs
- [Cost/risk 1]
- [Cost/risk 2]

### Trung tính
- [Side effect không tốt không xấu]

## Điều kiện để revisit

[Khi nào quyết định này nên được xem xét lại?
Ví dụ: "Khi user base vượt 1M" hoặc "Khi team > 10 devs"]

## Tài liệu liên quan
- [Link spec, PR, meeting notes...]
```

### Bước 3 — Gate cuối

```
ADR-[NNN] đã soạn xong.

Câu hỏi trước khi finalize:
1. "Hệ quả tiêu cực" có đủ honest không? Có gì tôi đang understate?
2. "Điều kiện để revisit" có realistic không?
3. Có team member nào khác cần review ADR này trước khi accept?

Sau khi confirm, tôi sẽ update trạng thái sang "Accepted".
```
