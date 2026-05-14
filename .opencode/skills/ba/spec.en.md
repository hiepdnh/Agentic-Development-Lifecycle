---
name: ba:spec
description: >
  Transform raw requirements into structured business specification documents.
  Triggers when: user says "viết spec", "soạn đặc tả", "phân tích yêu cầu", "write spec",
  "tạo requirements doc", "business spec", or types /ba:spec.
---

# /ba:spec
**Role**: Business Analyst  
**Purpose**: Transform raw requirements into structured business specification documents.

---

## Execution Guide

### Step 1 — Read and analyze input

Receive input from the user (email, meeting notes, verbal description, Jira ticket...). Analyze to identify:
- Key stakeholders
- Problem statement
- Scope
- Related actors
- Known constraints

### Step 2 — Gate: Present initial understanding + Ask clarifying questions

Present in this format:

```
## I understand the requirement as follows:

**Problem to solve**: [...]
**Key stakeholders**: [...]
**Preliminary scope**: [...]
**Actors**: [...]
```

<!-- Gate: Clarify before drafting spec -->
question({
  questions: [{
    question: "Before I draft the spec, I need to clarify: Which business rules are unclear?",
    header: "Business rule",
    options: [
      { label: "Clear", description: "Business rules are sufficient, proceed with drafting spec" },
      { label: "Needs explanation", description: "I will describe the business rules in more detail" },
      { label: "Other", description: "Enter a custom question" }
    ]
  }, {
    question: "Any edge cases or exceptions to note?",
    header: "Edge case",
    options: [
      { label: "None", description: "No special edge cases" },
      { label: "Yes", description: "I will describe the edge case" }
    ]
  }, {
    question: "Are there integrations with other systems?",
    header: "Integration",
    options: [
      { label: "Yes", description: "There is integration — describe the system" },
      { label: "No", description: "No integration" }
    ]
  }]
})

### Step 3 — Draft the Specification Document

After receiving the answers, create `docs/tasks/[TASK-ID]/requirements.md` using the template `E:\AI Bootcamp\ClaudeSkill\templates\task-doc-requirements.md`.

**Frontmatter**: fill in `sessionId` (format `TASK-ID-YYYYMMDD-HHMM`), `createdAt`, `updatedAt`, `roundCount: 1`.

Fill in completely:
- Section 1-3: Context, objectives, scope
- Section 4-5: Actors + Business Rules (BR must have IDs for traceability)
- Section 6-7: Happy path + alternative flows
- Section 8: Acceptance Criteria — each AC must be testable (Given/When/Then if needed)
- Section 9: NFRs if there are performance/security requirements
- Section 10: User Stories — fill in skeleton only (ID + name + priority); detailed ACs will be expanded by `/ba:user-story`
- Section 11: Remaining open questions (do not answer if unsure)
- Section 12: Harness Delta — mark "No friction" or log a specific entry
- Section 13: Q&A History — add entry "Round 1" with all questions/answers from Step 2, including an `Impact` field specifying which section/BR/AC is affected by each answer

### Step 4 — Final Gate: Review and confirm

<!-- Final Gate: Review spec -->
question({
  questions: [{
    question: "Are there any business rules I missed?",
    header: "BR missing",
    options: [
      { label: "No, that's enough", description: "Business rules are complete" },
      { label: "Yes — add more", description: "I will describe the missing business rule" }
    ]
  }, {
    question: "Are the ACs specific enough for QA to test?",
    header: "AC quality",
    options: [
      { label: "Sufficient", description: "Acceptance Criteria are detailed enough" },
      { label: "Need more detail", description: "I will point out which ACs need more detail" }
    ]
  }, {
    question: "Are there any open questions to resolve before handing to Dev?",
    header: "Open Q",
    options: [
      { label: "No", description: "No open questions" },
      { label: "Yes", description: "I will state the questions that need resolving" }
    ]
  }]
})

If everything is fine, I will save the file and you can use `/ba:user-story` to create User Stories from this spec.

---

## Important Notes

- **Never** auto-generate a spec without going through the Clarification Gate.
- Always highlight **uncertainties** with `[?]` in the draft.
- If the input is too vague, ask for more details instead of assuming.

### Resume + Q&A History (append-only)

When re-opening an existing `requirements.md` for further clarification:

1. **Read the frontmatter** — check the current `sessionId` and `roundCount` to know how many rounds have been run.
2. **Read Section 13 (Q&A History)** before asking new questions — treat previous Q&A as **ground truth**, do not re-ask what has already been answered.
3. **After each new clarification round**:
   - Append a `### Round N — [timestamp JST]` block at the END of Section 13 (do NOT overwrite previous rounds)
   - Update `updatedAt` and increment `roundCount` in the frontmatter
   - Update relevant sections of the spec (BR/AC/scope) based on new answers
4. **Purpose**: The BE/JP client can check the `Q&A History` to understand **why** the spec was written a certain way ("なぜこの設計?"), rather than just seeing the final result.
