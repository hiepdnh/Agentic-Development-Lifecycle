# Validation Matrix

Bảng tracking toàn cục — mỗi behavior quan trọng của framework phải có proof tương ứng.  
Cập nhật sau mỗi task có ảnh hưởng đến behavior đã liệt kê.

---

## Cách dùng

- **Status**: `✅ pass` | `❌ fail` | `⚠️ partial` | `🔲 untested`
- **Proof**: Link đến test log, lệnh đã chạy, hoặc mô tả cách verify
- Cập nhật khi: chạy `tests/skill-triggering/`, khi fix bug trong skill, hoặc sau mỗi framework release

---

## Skill Trigger Behaviors

Verify bằng `bash tests/skill-triggering/run-all.sh`.

| Behavior | Skill | Proof Type | Status | Notes |
|----------|-------|------------|--------|-------|
| "analyze task" → auto-trigger dev:analyze | dev:analyze | skill-triggering test | 🔲 untested | |
| "phân tích issue" → auto-trigger dev:analyze | dev:analyze | skill-triggering test | 🔲 untested | |
| "bắt đầu implement" → auto-trigger dev:implement | dev:implement | skill-triggering test | 🔲 untested | |
| "viết code cho task" → auto-trigger dev:implement | dev:implement | skill-triggering test | 🔲 untested | |
| "debug lỗi" → auto-trigger dev:debug | dev:debug | skill-triggering test | 🔲 untested | |
| "tạo PR" → auto-trigger dev:pr | dev:pr | skill-triggering test | 🔲 untested | |
| "raw requirement" → auto-trigger ba:spec | ba:spec | skill-triggering test | 🔲 untested | |
| "user story" → auto-trigger ba:user-story | ba:user-story | skill-triggering test | 🔲 untested | |
| "take-over codebase legacy" → auto-trigger ba:reverse | ba:reverse | skill-triggering test | 🔲 untested | |
| "security review" → auto-trigger sec:review | sec:review | skill-triggering test | 🔲 untested | |
| "cập nhật docs" → auto-trigger docs:update | docs:update | skill-triggering test | 🔲 untested | |
| "sprint status" → auto-trigger pm:status | pm:status | skill-triggering test | 🔲 untested | |
| "breakdown epic" → auto-trigger pm:breakdown | pm:breakdown | skill-triggering test | 🔲 untested | |
| "test plan" → auto-trigger qa:testplan | qa:testplan | skill-triggering test | 🔲 untested | |
| "bug report" → auto-trigger qa:bug | qa:bug | skill-triggering test | 🔲 untested | |
| "regression check" → auto-trigger qa:regression | qa:regression | skill-triggering test | 🔲 untested | |
| "deploy checklist" → auto-trigger ops:deploy | ops:deploy | skill-triggering test | 🔲 untested | |
| "incident response" → auto-trigger ops:incident | ops:incident | skill-triggering test | 🔲 untested | |
| "standup" → auto-trigger sm:standup | sm:standup | skill-triggering test | 🔲 untested | |
| "retro" → auto-trigger sm:retro | sm:retro | skill-triggering test | 🔲 untested | |
| "ADR" → auto-trigger arch:adr | arch:adr | skill-triggering test | 🔲 untested | |
| "bridge requirement" → auto-trigger be:bridge | be:bridge | skill-triggering test | 🔲 untested | |

---

## Process Gate Behaviors

Verify thủ công hoặc qua session review.

| Behavior | Skill | Proof Type | Status | Notes |
|----------|-------|------------|--------|-------|
| dev:analyze dừng tại analysis.md — không tự implement | dev:analyze | Manual session review | 🔲 untested | Hard stop added 8946a6b |
| dev:implement yêu cầu analysis.md tồn tại trước | dev:implement | Manual session review | 🔲 untested | |
| dev:implement gate sau mỗi file — không skip | dev:implement | Manual session review | 🔲 untested | |
| AskUserQuestion dùng cho multi-choice gates (không plain text) | Tất cả | Manual session review | 🔲 untested | |
| Risk Classifier chạy trước subagents trong dev:analyze | dev:analyze | Manual session review | 🔲 untested | FRAMEWORK-001 |
| Harness Delta được ghi sau mỗi task | dev:implement | Manual session review | 🔲 untested | FRAMEWORK-001 |

---

## Installer Behaviors

| Behavior | Proof Type | Status | Notes |
|----------|------------|--------|-------|
| `node bin/install.js` blocks khi src === dst | Manual test | 🔲 untested | |
| `--update` flag overwrites existing skill files | Manual test | 🔲 untested | |
| Fresh install không overwrite existing files | Manual test | 🔲 untested | |
| `npx github:hiepdnh/Agentic-Development-Lifecycle` chạy đúng | Manual test | 🔲 untested | |

---

## Chạy toàn bộ skill trigger tests

```bash
bash tests/skill-triggering/run-all.sh

# Sau khi chạy — cập nhật cột Status và Notes ở bảng trên
# Pass: ✅ pass | Fail: ❌ fail — ghi expected vs actual skill triggered
```
