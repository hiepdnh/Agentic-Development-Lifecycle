---
name: ops:deploy
description: >
  Tạo deployment checklist đầy đủ, CI quality gate, và rollback plan trước khi deploy.
  Trigger khi: user nói "chuẩn bị deploy", "deployment checklist", "release lên production",
  "deploy staging", "deploy plan", "CI gate trước release", hoặc gõ /ops:deploy.
---

# /ops:deploy
**Role**: DevOps / Developer  
**Mục đích**: Checklist và hướng dẫn deployment, đảm bảo không bỏ sót bước quan trọng.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập thông tin deployment

question({
  questions: [{
    question: "Deploy lên môi trường nào?",
    header: "Environment",
    options: [
      { label: "Staging", description: "Deploy lên môi trường staging" },
      { label: "Production", description: "Deploy lên môi trường production" },
      { label: "DR", description: "Deploy lên môi trường disaster recovery" },
    ]
  }, {
    question: "Có database migration không?",
    header: "DB Migration",
    options: [
      { label: "Có", description: "Cần chạy migration scripts" },
      { label: "Không", description: "Không có thay đổi database" },
    ]
  }, {
    question: "Có config/env var thay đổi không?",
    header: "Config",
    options: [
      { label: "Có", description: "Cần update env vars / config" },
      { label: "Không", description: "Không có thay đổi config" },
    ]
  }]
})

### CI Quality Gate (phải pass trước khi deploy)

```
- [ ] Lint / format check
- [ ] Type check  
- [ ] Unit tests pass
- [ ] Build thành công
- [ ] Integration tests pass
- [ ] Security scan: không có Critical/High CVE mới
```

**Ask First**: Nếu bất kỳ check nào fail → không deploy. Phải fix trước.

### Bước 2 — Tạo Deployment Checklist

```markdown
# Deployment Checklist: [Release version/feature]

**Date**: [Date]  
**Environment**: [Staging/Production]  
**Deploy by**: [Name]  
**Reviewer**: [Name]

---

## Pre-deployment

### Code & Build
- [ ] PR đã được merge và CI pass
- [ ] Build artifact đã được verify trên Staging
- [ ] Version tag đã được tạo: `v[X.Y.Z]`

### Database
- [ ] Migration scripts đã được review
- [ ] Migration đã chạy thành công trên Staging
- [ ] Backup database production trước khi deploy
- [ ] Migration có rollback script chưa?

### Configuration
- [ ] Env vars mới đã được add vào production config
- [ ] Secret/credential đã được update (nếu có)
- [ ] Feature flags đã được set đúng

### Dependencies
- [ ] Service dependencies đã được notify (nếu breaking change)
- [ ] Third-party API quota đã được check
- [ ] Infrastructure đã scale up nếu cần

### Communication
- [ ] Stakeholder đã được thông báo về deployment
- [ ] Maintenance window đã được announce (nếu cần)
- [ ] On-call engineer đã sẵn sàng

---

## Deployment Steps

1. [ ] [Bước 1 — cụ thể theo project]
2. [ ] [Bước 2]
3. [ ] Verify health check endpoint
4. [ ] Monitor error rate 5 phút sau deploy

---

## Post-deployment Verification

- [ ] Smoke test: [Test case quan trọng nhất]
- [ ] API health check pass
- [ ] Error rate < [threshold]%
- [ ] Response time < [X]ms
- [ ] Logs không có ERROR unexpected

---

## Rollback Plan

**Trigger rollback khi**: [Điều kiện cụ thể]

**Bước rollback**:
1. [Bước rollback 1]
2. [Bước rollback 2]

**Ước tính thời gian rollback**: [X phút]

---

## Sign-off

- [ ] Deploy engineer: [Name] — [Time]
- [ ] QA verify: [Name] — [Time]
```

### Bước 3 — Gate cuối

question({
  questions: [{
    question: "Database backup đã được confirm chưa?",
    header: "DB Backup",
    options: [
      { label: "Đã backup", description: "Production database đã được backup" },
      { label: "Chưa backup", description: "Cần backup trước khi deploy" },
      { label: "Không có DB", description: "Project không sử dụng database" },
    ]
  }, {
    question: "Rollback estimate có đủ trong deployment window không?",
    header: "Rollback",
    options: [
      { label: "Đủ", description: "Rollback time nằm trong window" },
      { label: "Không đủ", description: "Cần extend maintenance window" },
    ]
  }, {
    question: "Có dependency service nào chưa được notify không?",
    header: "Notify",
    options: [
      { label: "Đã notify", description: "Tất cả dependencies đã được thông báo" },
      { label: "Còn thiếu", description: "Còn service chưa được notify" },
    ]
  }]
})

**Không deploy cho đến khi tất cả câu hỏi trên được trả lời.**
