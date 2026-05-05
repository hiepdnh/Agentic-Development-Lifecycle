# Skill: /ops-deploy
**Role**: DevOps / Developer  
**Mục đích**: Checklist và hướng dẫn deployment, đảm bảo không bỏ sót bước quan trọng.

---

## Hướng dẫn thực hiện

### Bước 1 — Gate: Thu thập thông tin deployment

```
## Tôi sẽ tạo deployment checklist.

Cho tôi biết:
1. Deploy lên môi trường nào? (Staging / Production / DR)
2. Có database migration không?
3. Có config/env var thay đổi không?
4. Có service dependency nào thay đổi (API contract, message format...)?
5. Deployment window: khi nào? Có maintenance window không?
6. Rollback plan nếu xảy ra sự cố?
```

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

```
Deployment checklist đã chuẩn bị xong.

Trước khi bắt đầu deploy:
1. Database backup đã được confirm chưa?
2. Rollback plan — estimate [X phút], có đủ không với deployment window?
3. Có bất kỳ dependency service nào chưa được notify không?
```

**Không deploy cho đến khi tất cả câu hỏi trên được trả lời.**
