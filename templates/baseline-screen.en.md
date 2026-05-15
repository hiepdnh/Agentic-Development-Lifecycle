<!-- lang: en -->
# Screen: [Screen name]

**Route/URL**: `/[path]`  
**Feature**: [Feature name]  
**Last updated**: [YYYY-MM-DD HH:mm JST]  
**Updated by task**: [PROJECT-XXX]  
**Commit**: `[short-sha]` — [commit message]

---

## Description

[Purpose of the screen and which actor it is intended for]

## Access Conditions

- **Role required**: [Admin / User / Guest / ...]
- **Authentication**: Required / Optional / None
- **Pre-condition**: [Condition that must be met before entering the screen]

## Layout & Components

### [Section 1: e.g., Header]

| Component | Type | Required | Description |
|-----------|------|----------|-------------|
| [Field/Button] | Input/Button/Label | Yes/No | [...] |

### [Section 2: e.g., Form]

| Field | Type | Required | Validation | Default |
|-------|------|----------|-----------|---------|
| [field_name] | text/number/date/... | Yes/No | [rule] | [...] |

## Business Rules

| ID | Rule |
|----|------|
| BR-001 | [Rule applied to this screen] |

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

| State | Description | Display |
|-------|-------------|---------|
| Loading | Fetching data | Spinner |
| Empty | No data available | [Empty state message] |
| Error | API error | [Error message] |
| Success | Operation completed | [Success message/redirect] |

## API Calls

| Action | Method | Endpoint | Docs |
|--------|--------|----------|------|
| Load data | GET | `/api/[endpoint]` | `docs/api/[domain]/[endpoint].md` |
| Submit | POST | `/api/[endpoint]` | `docs/api/[domain]/[endpoint].md` |

## Notes

[Special behavior, edge cases, or workarounds to be aware of]
