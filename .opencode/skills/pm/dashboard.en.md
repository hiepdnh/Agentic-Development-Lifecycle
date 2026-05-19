---
name: pm:dashboard
description: >
  Generate a static HTML dashboard showing sprint kanban, task health, and improvement backlog.
  Triggers when: user says "create dashboard", "view sprint progress", "sprint overview",
  "show dashboard", "generate dashboard", or types /pm:dashboard.
---
## Summary

Generate a static HTML dashboard showing sprint kanban, task health, and improvement backlog. Triggers when: user says "create dashboard", "view sprint progress", "sprint overview", "show dashboard", "generate dashboard", or types /pm:dashboard.

## Workflow

# /pm:dashboard
**Role**: Project Manager / All roles
**Purpose**: Generate `docs/dashboard.html` — kanban view + health table + improvement backlog — reading from existing `docs/tasks/*/`. Open in browser, no server required.

---

## Execution Guide

### Step 1 — Run the generator

```bash
node bin/dashboard.js
```

Default output: `docs/dashboard.html`

Custom path:
```bash
node bin/dashboard.js --out /tmp/sprint-review.html
```

### Step 2 — Open dashboard

Open the generated file in browser:
- Windows: `start docs/dashboard.html`
- Mac: `open docs/dashboard.html`
- Linux: `xdg-open docs/dashboard.html`

### Step 3 — Results Report

```
Dashboard created: docs/dashboard.html

Contents:
- [N] tasks in docs/tasks/
- Kanban: Discovery → Planning → Dev → Review → QA/Done
- Sprint health table (sortable/filterable)
- [N] improvement backlog items

Open the file in your browser to view. Re-run `node bin/dashboard.js` anytime to refresh.
```

### Step 4 — Final Gate

```
question({
  questions: [{
    question: "The dashboard has been created. What would you like to do next?",
    header: "Next step",
    options: [
      { label: "Open dashboard", description: "Open the dashboard file in browser" },
      { label: "Edit", description: "Adjust the dashboard before using" },
      { label: "Done", description: "Dashboard is complete, nothing more needed" },
    ]
  }]
})
```

---

## Notes

- The dashboard is a **static snapshot** — must re-run to update when task state changes
- Status is derived from file presence in `docs/tasks/[ID]/`:
  - `requirements.md` only → Discovery
  - `+ analysis.md` → Planning
  - `+ verification.md` → Dev / Pending PR
  - `+ pr.md` → In Review
  - `+ test-plan.md` → QA / Done
- Risk lane parsed from `Lane: tiny|normal|high-risk` in `analysis.md`
- `docs/dashboard.html` can be committed (useful snapshot) or gitignored (team preference)
- Dashboard sections: Stats KPIs · Kanban · Activity timeline (audit + git) · Validation health doughnut · Skill heatmap · Growth counters · Sprint health table · Improvement backlog
- `npm run dashboard:watch` — auto-regen when files change; manual browser reload (F5)
