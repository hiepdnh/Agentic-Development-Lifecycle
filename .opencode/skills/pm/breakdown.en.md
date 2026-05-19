---
name: pm:breakdown
description: >
  Break down Epics/User Stories into concrete Tasks with estimates, create standard GitHub/GitLab Issues.
  Triggers when: user says "breakdown epic", "create tasks from story", "break down feature",
  "create github issues", "create gitlab issues", "sprint planning", "estimate tasks", or types /pm:breakdown.
---
## Summary

Break down Epics/User Stories into concrete Tasks with estimates, create standard GitHub/GitLab Issues. Triggers when: user says "breakdown epic", "create tasks from story", "break down feature", "create github issues", "create gitlab issues", "sprint planning", "estimate tasks", or types /pm:breakdown.

## Workflow

# /pm:breakdown
**Role**: Project Manager
**Purpose**: Break down Epics/User Stories into concrete Tasks, create GitHub/GitLab Issues with standard templates.

---

## Execution Guide

### Step 1 — Read input

Accept: Epic description, User Stories, or direct request from PM.
Read `docs/tasks/[TASK-ID]/requirements.md` if available.

### Step 2 — Gate: Clarify before breakdown

```
question({
  questions: [{
    question: "Which platform do you use for issues?",
    header: "Platform",
    options: [
      { label: "GitHub (gh CLI)", description: "Use gh issue create" },
      { label: "GitLab (glab CLI)", description: "Use glab issue create" },
      { label: "Generate markdown only", description: "Do not auto-create issues" },
    ]
  }, {
    question: "How many devs this sprint and what capacity (man-days or story points)?",
    header: "Capacity",
    options: [
      { label: "Enter", description: "Provide dev count and capacity" },
    ]
  }, {
    question: "Is there a specific milestone/deadline?",
    header: "Milestone",
    options: [
      { label: "Yes", description: "Have a specific milestone/deadline" },
      { label: "No", description: "No milestone yet" },
    ]
  }, {
    question: "What label convention is the team using? (e.g., backend, flutter, P0, testing)",
    header: "Labels",
    options: [
      { label: "Enter", description: "Provide list of labels" },
    ]
  }]
})
```

### Step 3 — Propose task breakdown (2-3 options)

```
## I have [N] breakdown options:

### Option A: [Name] — [Key advantage]
[Task list with estimates]
- Pros: [...]
- Cons: [...]

### Option B: [Name] — [Key advantage]
[Task list with estimates]
- Pros: [...]
- Cons: [...]

**My recommendation**: Option [X] because [reason].
Which option would you like, or a combination?
```

### Step 4 — Create GitHub Issue format

After PM confirms, create issue content using template `templates/github-issue.en.md`.

Fill in all fields:
- **TASK-ID** and task name from the breakdown
- **Type**: Feature / Bug / Tech Debt / Refactor
- **Priority**: High / Medium / Low (decided in Step 3)
- **Estimate**: from confirmed estimate
- **Sprint**: current Sprint N
- **Acceptance Criteria**: from the task's requirements.md
- **Technical Notes**: important technical notes for the dev
- **Labels**: according to the team convention chosen in Step 2

### Step 5 — Final gate before creating

```
question({
  questions: [{
    question: "List of [N] issues prepared — which ones need priority or estimate adjustment?",
    header: "Review",
    options: [
      { label: "All OK", description: "No adjustments needed" },
      { label: "Need adjustments", description: "Some issues need priority/estimate changes" },
    ]
  }, {
    question: "Dependencies: do any issues depend on each other?",
    header: "Deps",
    options: [
      { label: "No", description: "No dependencies" },
      { label: "Yes", description: "There are dependencies between issues" },
    ]
  }, {
    question: "Confirm creating the issues?",
    header: "Confirm",
    options: [
      { label: "Create all", description: "Create all issues" },
      { label: "Select individually", description: "Create issues one by one" },
    ]
  }]
})
```

---

### Step 6 — Create issues on platform

#### If using GitLab (`glab` CLI)

Check if `glab` is authenticated:
```bash
glab auth status
```

Create each issue using the template (run sequentially, not batch):
```bash
glab issue create \
  --title "[TASK-ID] Task name" \
  --description "$(cat <<'EOF'
## Description
[Task description]

## Links
- Spec: docs/tasks/[TASK-ID]/requirements.md

## Acceptance Criteria
- [ ] AC-001: ...
- [ ] AC-002: ...

## Definition of Done
- [ ] Code complete + unit tests pass
- [ ] Code review approved
- [ ] Demo to BA/PM
EOF
)" \
  --label "P0,backend,flutter" \
  --assignee "username" \
  --milestone "Sprint N"
```

After each issue is created successfully, print the issue URL to confirm:
```
✅ Issue created successfully: https://gitlab.com/[org]/[repo]/-/issues/[number]
```

If `glab` is not installed or not authenticated, provide instructions:
```bash
# Install glab
brew install glab          # macOS
# or: https://gitlab.com/gitlab-org/cli#installation

# Auth
glab auth login
```

#### If using GitHub (`gh` CLI or MCP)

Use `gh issue create`:
```bash
gh issue create \
  --title "[TASK-ID] Task name" \
  --body "$(cat issue-body.md)" \
  --label "P0,backend" \
  --assignee "username" \
  --milestone "Sprint N"
```

Or use the GitHub MCP tool `mcp__github__issue_write` if available in the session.

#### If choosing to generate markdown only

Output file `docs/tasks/sprint-[N]-issues.md` containing all issue content, ready for manual pasting.

---

## Note

- Each issue must be self-contained: a dev should understand it immediately without asking follow-ups.
- Links to docs should always use relative paths within the repo.
- Task ID format: `[PROJECT-XXX]` — customize per team convention.
- `glab` needs to be authenticated with a token that has `api` scope on the GitLab project.
- For GitLab self-hosted: set `GITLAB_HOST` or use `glab auth login --hostname gitlab.your-company.com`.
