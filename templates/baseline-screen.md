# Screen: [Tên màn hình]

**Route/URL**: `/[path]`  
**Feature**: [Tên feature]  
**Last updated**: [YYYY-MM-DD]  
**Updated by task**: [PROJECT-XXX]

---

## Mô tả

[Mục đích của màn hình, dành cho actor nào]

## Điều kiện truy cập

- **Role yêu cầu**: [Admin / User / Guest / ...]
- **Authentication**: Required / Optional / None
- **Pre-condition**: [Điều kiện trước khi vào màn hình]

## Layout & Components

### [Section 1: e.g., Header]
| Component | Type | Required | Mô tả |
|-----------|------|----------|-------|
| [Field/Button] | Input/Button/Label | Yes/No | [...] |

### [Section 2: e.g., Form]
| Field | Type | Required | Validation | Default |
|-------|------|----------|-----------|---------|
| [field_name] | text/number/date/... | Yes/No | [rule] | [...] |

## Business Rules (màn hình này)

| ID | Rule |
|----|------|
| BR-001 | [Rule áp dụng cho màn hình này] |

## User Actions

| Action | Trigger | Result |
|--------|---------|--------|
| [Submit form] | Click [Button] | [Navigate to / Show message / ...] |
| [Cancel] | Click Cancel | [Navigate back] |

## Validation Messages

| Field | Condition | Message |
|-------|-----------|---------|
| [field] | [empty/invalid] | "[Error message]" |

## States

| State | Mô tả | Hiển thị |
|-------|-------|---------|
| Loading | Đang tải dữ liệu | Spinner |
| Empty | Không có data | [Empty state message] |
| Error | API error | [Error message] |
| Success | Thao tác thành công | [Success message/redirect] |

## API Calls

| Action | Method | Endpoint | Docs |
|--------|--------|----------|------|
| Load data | GET | `/api/[endpoint]` | `docs/api/[domain]/[endpoint].md` |
| Submit | POST | `/api/[endpoint]` | `docs/api/[domain]/[endpoint].md` |

## Ghi chú

[Behavior đặc biệt, edge case, hoặc workaround cần biết]
