---
name: ops:deploy
description: >
  Create a complete deployment checklist, CI quality gate, and rollback plan before deploying.
  Trigger when: user says "prepare deploy", "deployment checklist", "release to production",
  "deploy staging", "deploy plan", "CI gate before release", or types /ops:deploy.
---
## Summary

Create a complete deployment checklist, CI quality gate, and rollback plan before deploying. Trigger when: user says "prepare deploy", "deployment checklist", "release to production", "deploy staging", "deploy plan", "CI gate before release", or types /ops:deploy.

## Workflow

# /ops:deploy
**Role**: DevOps / Developer  
**Purpose**: Checklist and guidance for deployment, ensuring no critical steps are missed.

---

## Execution Guide

### Step 1 — Gate: Gather deployment information

question({
  questions: [{
    question: "Which environment are you deploying to?",
    header: "Environment",
    options: [
      { label: "Staging", description: "Deploy to staging environment" },
      { label: "Production", description: "Deploy to production environment" },
      { label: "DR", description: "Deploy to disaster recovery environment" },
    ]
  }, {
    question: "Are there any database migrations?",
    header: "DB Migration",
    options: [
      { label: "Yes", description: "Need to run migration scripts" },
      { label: "No", description: "No database changes" },
    ]
  }, {
    question: "Are there any config/env var changes?",
    header: "Config",
    options: [
      { label: "Yes", description: "Need to update env vars / config" },
      { label: "No", description: "No config changes" },
    ]
  }]
})

### CI Quality Gate (must pass before deploying)

```
- [ ] Lint / format check
- [ ] Type check  
- [ ] Unit tests pass
- [ ] Build succeeds
- [ ] Integration tests pass
- [ ] Security scan: no new Critical/High CVEs
```

**Ask First**: If any check fails → do not deploy. Must fix first.

### Step 2 — Create Deployment Checklist

```markdown
# Deployment Checklist: [Release version/feature]

**Date**: [Date]  
**Environment**: [Staging/Production]  
**Deploy by**: [Name]  
**Reviewer**: [Name]

---

## Pre-deployment

### Code & Build
- [ ] PR has been merged and CI passes
- [ ] Build artifact has been verified on Staging
- [ ] Version tag has been created: `v[X.Y.Z]`

### Database
- [ ] Migration scripts have been reviewed
- [ ] Migration has run successfully on Staging
- [ ] Backup production database before deploying
- [ ] Does migration have a rollback script?

### Configuration
- [ ] New env vars have been added to production config
- [ ] Secrets/credentials have been updated (if any)
- [ ] Feature flags are set correctly

### Dependencies
- [ ] Service dependencies have been notified (if breaking change)
- [ ] Third-party API quota has been checked
- [ ] Infrastructure has been scaled up if needed

### Communication
- [ ] Stakeholders have been notified about the deployment
- [ ] Maintenance window has been announced (if needed)
- [ ] On-call engineer is ready

---

## Deployment Steps

1. [ ] [Step 1 — project-specific]
2. [ ] [Step 2]
3. [ ] Verify health check endpoint
4. [ ] Monitor error rate for 5 minutes after deploy

---

## Post-deployment Verification

- [ ] Smoke test: [Most important test case]
- [ ] API health check passes
- [ ] Error rate < [threshold]%
- [ ] Response time < [X]ms
- [ ] Logs show no unexpected ERROR

---

## Rollback Plan

**Trigger rollback when**: [Specific conditions]

**Rollback steps**:
1. [Rollback step 1]
2. [Rollback step 2]

**Estimated rollback time**: [X minutes]

---

## Sign-off

- [ ] Deploy engineer: [Name] — [Time]
- [ ] QA verify: [Name] — [Time]
```

### Step 3 — Final Gate

question({
  questions: [{
    question: "Has the database backup been confirmed?",
    header: "DB Backup",
    options: [
      { label: "Backed up", description: "Production database has been backed up" },
      { label: "Not yet", description: "Need to backup before deploying" },
      { label: "No DB", description: "Project does not use a database" },
    ]
  }, {
    question: "Is the rollback estimate within the deployment window?",
    header: "Rollback",
    options: [
      { label: "Sufficient", description: "Rollback time is within the window" },
      { label: "Insufficient", description: "Need to extend maintenance window" },
    ]
  }, {
    question: "Are there any dependency services that haven't been notified?",
    header: "Notify",
    options: [
      { label: "Notified", description: "All dependencies have been notified" },
      { label: "Missing", description: "Some services have not been notified" },
    ]
  }]
})

**Do not deploy until all questions above are answered.**
