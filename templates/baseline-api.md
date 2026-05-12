# API: [Method] [Endpoint]

**Endpoint**: `[METHOD] /api/v[N]/[path]`  
**Domain**: [Auth / User / Order / ...]  
**Last updated**: [YYYY-MM-DD HH:mm JST]  
**Updated by task**: [PROJECT-XXX]  
**Commit**: `[short-sha]` — [commit message]

---

## Mô tả

[Endpoint này làm gì, dùng cho mục đích gì]

## Authentication

- **Required**: Yes / No
- **Type**: Bearer Token / API Key / None
- **Permission**: [Role hoặc scope cần có]

## Request

### Headers

| Key | Required | Value |
|-----|----------|-------|
| `Authorization` | Yes | `Bearer {token}` |
| `Content-Type` | Yes | `application/json` |

### Path Parameters

| Param | Type | Required | Mô tả |
|-------|------|----------|-------|
| `{id}` | string/uuid | Yes | [...] |

### Query Parameters

| Param | Type | Required | Default | Mô tả |
|-------|------|----------|---------|-------|
| `page` | integer | No | 1 | [...] |

### Request Body

```json
{
  "field_name": "string",
  "another_field": 0
}
```

| Field | Type | Required | Validation | Mô tả |
|-------|------|----------|-----------|-------|
| `field_name` | string | Yes | max 255 chars | [...] |

## Response

### Success Response

**Status**: `200 OK` / `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "field": "value"
  },
  "message": "..."
}
```

| Field | Type | Mô tả |
|-------|------|-------|
| `data.id` | uuid | [...] |

### Error Responses

| Status | Code | Mô tả | Khi nào |
|--------|------|-------|---------|
| `400` | `VALIDATION_ERROR` | Input không hợp lệ | Field thiếu hoặc sai format |
| `401` | `UNAUTHORIZED` | Chưa authenticate | Token missing/expired |
| `403` | `FORBIDDEN` | Không có quyền | Role không đủ |
| `404` | `NOT_FOUND` | Resource không tồn tại | ID không hợp lệ |
| `409` | `CONFLICT` | Conflict | [Trường hợp cụ thể] |
| `500` | `INTERNAL_ERROR` | Server error | Unexpected |

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "...",
    "details": {}
  }
}
```

## Business Rules

| ID | Rule |
|----|------|
| BR-001 | [Rule áp dụng cho endpoint này] |

## Rate Limiting

- Limit: [N requests per minute] / None
- Header: `X-RateLimit-Remaining`

## Examples

### Ví dụ request thành công

```bash
curl -X POST https://api.example.com/api/v1/[endpoint] \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "value"
  }'
```

## Ghi chú

[Side effects, background jobs triggered, events emitted, caching behavior...]
