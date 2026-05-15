---
name: pm:handover
description: >
  Create a comprehensive project handover package (引き継ぎ): codebase map, decision log,
  glossary, open issues, contact matrix. Use when a dev leaves the team, project is transferred,
  or a JP outsource contract ends.
  Triggers when: user says "handover project", "create handover docs", "引き継ぎ",
  "dev leaving needs handover", "project transfer", "project handoff", or types /pm:handover.
---

# /pm:handover
**Role**: PM / Bridge Engineer / Tech Lead
**Purpose**: Create a comprehensive project handover package — sufficient for a new person to take over without needing to ask the old team.

---

## Project Context

Handover in the JP outsource model has 2 scenarios:
- **Dev leaves mid-project**: handover to a new dev within the same VN team
- **Contract ends**: handover back to the JP client or a new vendor

JP handover docs (引き継ぎ書) must be clear enough for the JP client to understand without needing a phone call.

---

## Execution Guide

### Step 0 — Load glossary

Read `templates/jp-vn-en-glossary.md` before writing any technical terms.

### Step 1 — Gate: Determine handover type

```
question({
  questions: [{
    question: "Handover type?",
    header: "Type",
    options: [
      { label: "Internal", description: "Dev to dev within VN team" },
      { label: "Client handover", description: "Handover back to JP client" },
      { label: "Vendor handover", description: "Transfer to new vendor" },
    ]
  }, {
    question: "Scope?",
    header: "Scope",
    options: [
      { label: "Full project", description: "Entire project" },
      { label: "One module", description: "Specific module" },
      { label: "One role", description: "Specific role (dev / QA / BE)" },
    ]
  }, {
    question: "Deadline: when must it be completed? (YYYY-MM-DD)",
    header: "Deadline",
    options: [
      { label: "Enter date", description: "Provide a specific date" },
    ]
  }]
})
```

### Step 2 — Collect project information

Read from available sources in parallel:

```
Sources to read:
- docs/baseline/codebase-overview.md (if available)
- docs/decisions/ADR-*.md — all ADRs
- docs/tasks/*/requirements.md — open/in-progress tasks
- docs/workflows/sprint-lifecycle.md
- templates/jp-vn-en-glossary.md
- git log --oneline -50 (recent history)
- git branch -a (active branches)
```

If `codebase-overview.md` is missing → suggest running `/ba:reverse` first.

### Step 3 — Create Handover Package

#### 3a. `docs/handover/[DATE]-handover.md` (internal — for VN team)

Create using template `templates/handover.en.md`.

Fill in all 7 sections:
1. **System Overview**: purpose, main features, users; tech stack; environment table (Production/Staging/Dev URLs)
2. **Current Status**: version, known issues/tech debt table (from `docs/improvement-backlog.md`), in-progress tasks
3. **Key Contacts**: complete contact matrix for all roles; note credentials stored separately
4. **Systems and Tools**: all tools new person needs access to — platform, account type, access notes
5. **Recurring Work Schedule**: all recurring tasks by frequency (daily/weekly/monthly) with JST times
6. **Operational Notes**: gotchas list, common incidents + resolution, rollback procedure
7. **Additional Documentation**: table of paths for all important documents

#### 3b. `docs/handover/[DATE]-引き継ぎ書.md` (Japanese — when handing over to JP client)

Create using template `templates/handover.ja.md`.

This is the formal document sent to the JP client. Use `templates/html-bilingual.html` if an HTML version is needed for email.
Ensure:
- All section headings in Japanese (template already has them)
- Use keigo (敬語) in all descriptive sections
- Credentials: write WHERE to get them, not the values inline
- Use JST for all times

### Step 4 — Completion Checklist

```
## Handover Package prepared.

Checklist:
- [ ] All ENV variables listed (no empty sections)
- [ ] Contact matrix complete — especially JP side contacts
- [ ] Open tasks and blockers clearly documented
- [ ] Setup instructions tested (newcomer can follow without asking)
- [ ] Known issues documented with severity and mitigation
- [ ] Credentials: documented sources, NOT actual values

Files created:
- docs/handover/[DATE]-handover.md (VN — commit)
- docs/handover/[DATE]-引き継ぎ書.md (JP — commit, if client handover)
```

```
question({
  questions: [{
    question: "Confirm to finalize the handover package?",
    header: "Confirm",
    options: [
      { label: "Finalize", description: "Complete and save the handover package" },
      { label: "Need editing", description: "Need adjustments before finalizing" },
    ]
  }]
})
```

### Step 5 — Conclusion

```
Handover package complete.

Suggested next steps:
- Schedule a handover meeting — the handing-over person walks through the docs
- The receiver shadows 1-2 sprints before fully owning
- After the handover meeting: update docs based on Q&A
```

---

## Rules

- Do not assume the receiver already knows the context — explain everything as if starting fresh
- Credentials: NEVER write directly into the document
- JP deliverable: use honorific language (敬語) in Japanese documents
- After merging, update `docs/workflows/role-guide.md` if the contact matrix changes
