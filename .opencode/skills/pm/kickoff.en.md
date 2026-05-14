---
name: pm:kickoff
description: >
  Bootstrap a new greenfield project: choose tech stack, create folder structure,
  customize AGENTS.md, initialize docs structure and sprint 0 checklist.
  Triggers when: user says "start new project", "kickoff project", "greenfield project",
  "setup project from scratch", "new project for JP client", "initialize new framework", or types /pm:kickoff.
---

# /pm:kickoff
**Role**: PM / Tech Lead / Bridge Engineer
**Purpose**: Bootstrap a greenfield project — from idea to structured project with docs and team ready for sprint 1.

---

## VTI Context

Greenfield project differs from brownfield:
- No `ba:reverse` — no existing codebase to read
- Need to decide tech stack upfront — affects everything downstream
- Japanese clients typically expect 基本設計書 before coding begins
- Sprint 0 = environment setup + architecture decisions + initial docs

---

## Execution Guide

### Step 1 — Gate: Collect project information

```
question({
  questions: [{
    question: "What type of project?",
    header: "Type",
    options: [
      { label: "Web app", description: "Web application" },
      { label: "Mobile app", description: "Mobile application" },
      { label: "API", description: "API service" },
      { label: "Microservice", description: "Microservice architecture" },
      { label: "Library", description: "Library / Package" },
    ]
  }, {
    question: "Who is the client?",
    header: "Client",
    options: [
      { label: "JP outsource", description: "Japanese outsource client" },
      { label: "Internal VTI", description: "Internal VTI project" },
    ]
  }, {
    question: "Timeline: First deadline? (YYYY-MM-DD JST)",
    header: "Timeline",
    options: [
      { label: "Enter date", description: "Provide a specific date" },
    ]
  }, {
    question: "Team size?",
    header: "Team",
    options: [
      { label: "Enter count", description: "Number of dev / QA / BE" },
    ]
  }]
})
```

### Step 2 — Analyze requirements and propose tech stack

Based on input from Step 1 and project context, propose:

```
## Proposed Tech Stack: [Project name]

### Option A: [Stack name] — [Key trade-off]
| Layer | Technology | Reason |
|-------|-----------|-------|
| Frontend | [...] | [...] |
| Backend | [...] | [...] |
| Database | [...] | [...] |
| Cache | [...] | [...] |
| CI/CD | [...] | [...] |
| Hosting | [...] | [...] |

**Best when**: [...]
**Trade-off**: [...]

### Option B: [Stack name] — [Key trade-off]
[Similar]

### Option C: [Stack name] — [Key trade-off]
[Similar]
```

```
question({
  questions: [{
    question: "Confirm tech stack for the project?",
    header: "Tech stack",
    options: [
      { label: "Option A", description: "Choose Option A" },
      { label: "Option B", description: "Choose Option B" },
      { label: "Option C", description: "Choose Option C" },
      { label: "Custom", description: "Combine or adjust" },
    ]
  }]
})
```

### Step 3 — Gate: Architecture decisions

After selecting tech stack, confirm initial architecture decisions:

```
## Architecture Decisions to confirm

| # | Decision | Option A | Option B | Recommend |
|---|---------|---------|---------|----------|
| 1 | Auth strategy | JWT stateless | Session-based | JWT (scales better) |
| 2 | API style | REST | GraphQL | REST (JP clients more familiar) |
| 3 | DB schema | Monolithic | Multi-tenant | [project-specific] |
| 4 | Deployment | Monorepo | Multi-repo | Monorepo (small team) |
| 5 | Logging | Structured JSON | Plain text | Structured JSON |

Each decision will be recorded in an ADR afterward.
```

```
question({
  questions: [{
    question: "Confirm the architecture decisions above? Any adjustments?",
    header: "Arch decisions",
    options: [
      { label: "Agree", description: "All decisions as recommended" },
      { label: "Adjust", description: "Some decisions need changes" },
    ]
  }]
})
```

### Step 4 — Create Project Structure

Create the following files (use Write tool):

#### 4a. Update/create `AGENTS.md` for the specific project

Add a "Project Context" section to AGENTS.md:

```markdown
## Project Context

**Project name**: [Name]
**Client**: [JP client name]
**Bridge Engineer**: [Name]
**PM VTI**: [Name]
**Repo**: [URL]
**Staging**: [URL]
**Production**: [URL]

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| [...] | [...] | [...] |

### Conventions for this project

- [Naming convention]
- [Branch naming: feature/TASK-XXX-slug]
- [Commit message format]
- [Code review policy]

### ENV Variables (required)

| Variable | Purpose | Source |
|----------|---------|--------|
| DATABASE_URL | DB connection | 1Password / team lead |
| [...] | [...] | [...] |
```

#### 4b. Create docs structure

```
docs/
  tasks/          (gitignored in framework source, tracked in project)
  baseline/
    codebase-overview.md  (empty — fill after sprint 1-2)
  decisions/
    ADR-001.md    (Tech Stack decision)
    ADR-002.md    (Auth strategy)
    ...
  screens/        (fill when design is ready)
  api/            (fill when API spec is ready)
  reports/        (release notes, sprint status)
  handover/       (fill when needed)
  workflows/
    sprint-lifecycle.md  (copy from framework)
    role-guide.md        (copy from framework)
```

#### 4c. Create ADRs for decisions from Step 3

For each confirmed decision, call `/arch:adr` or create directly:

```markdown
# ADR-001: [Decision name]

**Date**: [YYYY-MM-DD]
**Status**: Accepted
**Decision makers**: [Tech Lead + PM]

## Context
[Why this decision was needed]

## Decision
[Which option was chosen and why]

## Consequences
[What must be done next as a result of this decision]
```

### Step 5 — Sprint 0 Checklist

```
## Sprint 0 Checklist: [Project name]

### Environment Setup
- [ ] Repo created and team added
- [ ] Branch protection rules (main, develop)
- [ ] CI/CD pipeline runs (lint + test + build)
- [ ] Staging environment up
- [ ] ENV variables documented (not values — sources)
- [ ] Database schema initialized

### Documentation
- [ ] AGENTS.md customized for the project
- [ ] ADRs for tech stack decisions written
- [ ] JP-VN-EN glossary seeded with project-specific terms
- [ ] 基本設計書 draft sent to JP (if JP client)

### Process
- [ ] GitHub Issues template set up
- [ ] Sprint board created
- [ ] Team onboarding doc (README or AGENTS.md)
- [ ] Contact matrix (JP client + BE + PM VN + dev team)

### Technical
- [ ] Linting rules configured
- [ ] Test framework set up (at least 1 test runs)
- [ ] Logging format agreed upon
- [ ] Error handling pattern agreed upon
```

### Step 6 — Final Gate

```
## Project Kickoff complete: [Project name]

Created:
- AGENTS.md customized
- ADR-001 through ADR-[N] for confirmed decisions
- docs/ structure with appropriate folders
- Sprint 0 checklist
```

```
question({
  questions: [{
    question: "Any adjustments needed for the tech stack?",
    header: "Adjust?",
    options: [
      { label: "No", description: "Tech stack is good" },
      { label: "Yes", description: "Tech stack needs changes" },
    ]
  }, {
    question: "Need to create 基本設計書 for JP client before coding?",
    header: "JP doc",
    options: [
      { label: "Yes", description: "Run /be:bridge next" },
      { label: "No need", description: "Skip this step" },
    ]
  }, {
    question: "When does Sprint 1 start? (YYYY-MM-DD)",
    header: "Sprint 1",
    options: [
      { label: "Enter date", description: "Provide sprint 1 start date" },
    ]
  }]
})
```

```
Next steps:
- [ ] Team walk-through of AGENTS.md
- [ ] If JP client: /be:bridge to create 基本設計書
- [ ] Sprint 1: /pm:breakdown to create tasks from requirements
```

---

## Rules

- Tech stack decisions must have an ADR — no implicit decisions
- ENV variables: NEVER commit actual values — only document names and sources
- If JP client: 基本設計書 must be completed and confirmed by JP before sprint 1
- AGENTS.md project section must be updated when team/tech changes occur
