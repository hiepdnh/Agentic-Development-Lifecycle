---
name: ba:user-story
description: >
  Convert specs into User Stories with standard Acceptance Criteria, ready for PM to create issues.
  Triggers when: user says "tạo user stories", "viết user story", "breakdown spec thành stories",
  "create user stories", "AC cho stories", or types /ba:user-story.
---

# /ba:user-story
**Role**: Business Analyst  
**Purpose**: Convert specs into User Stories with standard Acceptance Criteria, ready for PM to create issues.

---

## Execution Guide

### Step 1 — Read the existing spec

Read `docs/tasks/[TASK-ID]/requirements.md` if it exists. If not, ask the user to run `/ba:spec` first.

### Step 2 — Gate: Confirm scope

```
## I will create User Stories from the spec: [Feature name]

The spec has [N] Use Cases and [M] Acceptance Criteria.
```

<!-- Gate: Confirm story creation scope -->
question({
  questions: [{
    question: "Desired granularity?",
    header: "Granularity",
    options: [
      { label: "1 Use Case = 1 story", description: "One-to-one mapping with use cases" },
      { label: "Group by feature", description: "Group multiple use cases into 1 story" },
      { label: "Finer than Use Case", description: "More detailed than individual use cases" }
    ]
  }, {
    question: "Story format?",
    header: "Format",
    options: [
      { label: "As a..., I want..., so that...", description: "Standard user story format" },
      { label: "Other format", description: "I will describe the desired format" }
    ]
  }, {
    question: "Is there an existing Epic to link to?",
    header: "Epic",
    options: [
      { label: "Yes", description: "There is an existing Epic — I will provide the name/link" },
      { label: "No", description: "No Epic exists" }
    ]
  }]
})

### Step 3 — Create User Stories

Each User Story follows this format:

```markdown
## US-[ID]: [Short name]

**Epic**: [Epic name if any]  
**Priority**: [High/Medium/Low]  
**Estimate**: [Story points or hours]  
**Dependencies**: [US-XXX if any]

### User Story
As a **[actor]**,  
I want to **[action]**,  
So that **[business value]**.

### Acceptance Criteria
- [ ] **AC-001**: Given [context], When [action], Then [expected result]
- [ ] **AC-002**: Given [context], When [action], Then [expected result]

### Out of scope
- [Items not in this story]

### Notes
- [Related business rule: BR-XXX]
- [Related screens if any]
```

### Step 4 — Final Gate: Review + Suggest priority order

```
## Created [N] User Stories:

| ID | Name | Priority | Estimate | Dependencies |
|----|------|----------|----------|--------------|
| US-001 | | | | |

**Suggested implementation order** (based on dependencies and value):
1. US-XXX — [reason]
2. US-XXX — [reason]
```

<!-- Final Gate: Review stories -->
question({
  questions: [{
    question: "Are the estimates reasonable?",
    header: "Estimate",
    options: [
      { label: "Reasonable", description: "Estimates are appropriate" },
      { label: "Too high", description: "I will point out which story needs a lower estimate" },
      { label: "Too low", description: "I will point out which story needs a higher estimate" }
    ]
  }, {
    question: "Any stories that could be split further for easier demo?",
    header: "Split",
    options: [
      { label: "No need", description: "Stories are small enough" },
      { label: "Yes", description: "I will point out which story needs splitting" }
    ]
  }, {
    question: "Any stories that should be deferred to a later sprint?",
    header: "Defer",
    options: [
      { label: "No", description: "All stories are for this sprint" },
      { label: "Yes", description: "I will point out which story needs deferring" }
    ]
  }]
})

---

## Output files

- Update `docs/tasks/[TASK-ID]/requirements.md` with the User Stories section
- Ready for PM to use `/pm:breakdown` to create GitHub Issues
