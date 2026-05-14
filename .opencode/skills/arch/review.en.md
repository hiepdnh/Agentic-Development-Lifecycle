---
name: arch:review
description: >
  Review design decisions, detect architectural issues, propose improvements.
  Trigger when: user says "review design", "check architecture", "architecture review",
  "review technical decision", "is this design okay", or types /arch:review.
---

# /arch:review
**Role**: Tech Lead / Architect  
**Purpose**: Review design decisions, detect architectural issues, propose improvements.

---

## Execution Guide

### Step 1 — Receive input

Input can be:
- Description of the design decision to review
- Code snippet / diagram
- PR link
- Spec document

### Step 2 — Gate: Confirm review scope

question({
  questions: [{
    question: "Which aspect should the review focus on?",
    header: "Focus",
    options: [
      { label: "Scalability", description: "Check the design's ability to scale" },
      { label: "Security", description: "Detect security vulnerabilities" },
      { label: "Maintainability", description: "Is the code easy to maintain" },
      { label: "Performance", description: "Find bottlenecks" },
      { label: "All", description: "Comprehensive review of all aspects" },
    ]
  }, {
    question: "Are there any related ADRs?",
    header: "ADR",
    options: [
      { label: "Yes", description: "ADRs exist, I will read them" },
      { label: "No", description: "No ADR exists for this design" },
    ]
  }]
})

### Step 3 — Analyze and Review

Evaluate through these lenses:

**1. Correctness** — Is the logic correct?
**2. Scalability** — Can it handle increased load?
**3. Maintainability** — Can future team members understand and modify it?
**4. Security** — Are there attack surfaces?
**5. Performance** — Where are the bottlenecks?
**6. Coupling** — Is it too dependent on other modules?
**7. Testability** — Is it easy to test?

### Step 4 — Present Results

```
## Architecture Review: [Name]

### 🟢 Strengths
- [Strength 1]
- [Strength 2]

### 🔴 Critical Issues (must fix before merge)
| ID | Issue | Impact | Suggested Fix |
|----|-------|--------|---------------|
| | | | |

### 🟡 Should Improve (non-blocking)
| ID | Issue | Suggestion |
|----|-------|------------|
| | | |

### 💡 Long-term Suggestions
- [Improvements to consider later]

### Questions to Clarify

| # | Question | Options |
|---|----------|---------|
| 1 | [Design decision without clear rationale] | _(fill in)_ |
| 2 | [Undocumented trade-off] | _(fill in)_ |
```

### Step 5 — Gate: Discussion

question({
  questions: [{
    question: "After review — are the suggestions feasible within the current timeline?",
    header: "Discussion",
    options: [
      { label: "Will do", description: "Suggestions are feasible, will implement" },
      { label: "Not feasible", description: "Not feasible within the current timeline" },
      { label: "Needs discussion", description: "Needs further discussion before deciding" },
    ]
  }]
})
