<!-- lang: en -->
# API: [Method] [Endpoint]

**Endpoint**: `[METHOD] /api/v[N]/[path]`  
**Domain**: [Auth / User / Order / ...]  
**Last updated**: [YYYY-MM-DD HH:mm JST]  
**Updated by task**: [PROJECT-XXX]  
**Commit**: `[short-sha]` — [commit message]

---

## Description

[What this endpoint does and what purpose it serves]

## Authentication

- **Required**: Yes / No
- **Type**: Bearer Token / API Key / None
- **Permission**: [Role or scope required]

## Request

### Headers

| Key | Required | Value |
|-----|----------|-------|
| `Authorization` | Yes | `Bearer {token}` |
| `Content-Type` | Yes | `application/json` |

### Path Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `{id}` | string/uuid | Yes | [...] |

### Query Parameters

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `page` | integer | No | 1 | [...] |

### Request Body

```json
{
  "field_name": "string",
  "another_field": 0
}
```

| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
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

| Field | Type | Description |
|-------|------|-------------|
| `data.id` | uuid | [...] |

### Error Responses

| Status | Code | Description | When |
|--------|------|-------------|------|
| `400` | `VALIDATION_ERROR` | Invalid input | Missing or malformed field |
| `401` | `UNAUTHORIZED` | Not authenticated | Token missing or expired |
| `403` | `FORBIDDEN` | Insufficient permissions | Role does not have access |
| `404` | `NOT_FOUND` | Resource not found | Invalid ID |
| `409` | `CONFLICT` | Conflict | [Specific case] |
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
| BR-001 | [Rule applied to this endpoint] |

## Rate Limiting

- Limit: [N requests per minute] / None
- Header: `X-RateLimit-Remaining`

## Examples

### Example: Successful Request

```bash
curl -X POST https://api.example.com/api/v1/[endpoint] \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "value"
  }'
```

## Notes

[Side effects, background jobs triggered, events emitted, caching behavior...]
