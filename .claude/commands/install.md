---
name: install
description: >
  Cài VTI SDLC framework vào project hiện tại — copy commands, agents, templates, workflows.
  Không dùng shell, chỉ dùng Glob/Read/Write tools.
  Trigger khi: user nói "cài framework", "install skill pack", "setup VTI framework",
  "copy commands vào project", hoặc gõ /install.
---

# Skill: /install
**Mục đích**: Cài framework vào project hiện tại. Dùng file tools của Claude (không chạy shell) để tránh permission classifier block.

---

## Input

Không cần argument. Skill tự detect:
- **Source**: thư mục chứa framework này (nơi file `/install.md` tọa lạc = `[SOURCE]/.claude/commands/`)
- **Target**: working directory hiện tại của Claude Code session

---

## Hướng dẫn thực hiện

### Bước 0 — Xác định paths

Dùng Glob/Read để tìm:
- Source root: thư mục cha 2 cấp của file này (`../../` từ vị trí file này)
- Target root: `$PWD` của session hiện tại (từ working directory)

Hiển thị để user xác nhận:
```
Source : [SOURCE_PATH]
Target : [TARGET_PATH]
```

**Chờ confirm "y" trước khi tiếp tục.**

### Bước 1 — Copy `.claude/commands/`

Dùng Glob để list tất cả file trong `[SOURCE]/.claude/commands/**/*.md`.

Với mỗi file:
- Compute đường dẫn target: `[TARGET]/.claude/commands/[relative_path]`
- Nếu target file đã tồn tại → báo `[SKIP]`, không ghi đè
- Nếu chưa tồn tại → dùng Read + Write để copy

Báo cáo từng file: `[OK]` hoặc `[SKIP]`.

### Bước 2 — Copy `agents/`

Glob `[SOURCE]/agents/*.md`. Copy từng file sang `[TARGET]/agents/`.  
Skip nếu đã tồn tại.

### Bước 3 — Copy `templates/`

Glob `[SOURCE]/templates/*.md`. Copy từng file sang `[TARGET]/templates/`.  
Skip nếu đã tồn tại.

### Bước 4 — Copy `docs/workflows/`

Glob `[SOURCE]/docs/workflows/*.md`. Copy sang `[TARGET]/docs/workflows/`.  
Skip nếu đã tồn tại.

### Bước 5 — Tạo empty doc dirs

Kiểm tra và tạo (nếu chưa có) các file `.gitkeep` trong:
- `[TARGET]/docs/api/.gitkeep`
- `[TARGET]/docs/screens/.gitkeep`
- `[TARGET]/docs/tasks/.gitkeep`
- `[TARGET]/docs/decisions/.gitkeep`

Dùng Write tool với content rỗng.

### Bước 6 — Copy `CLAUDE.md`

- Nếu `[TARGET]/CLAUDE.md` đã tồn tại → báo `[SKIP] CLAUDE.md đã tồn tại — merge thủ công`, in path source để tham khảo
- Nếu chưa → Read + Write

---

## Báo cáo kết quả

```
## Kết quả cài đặt

.claude/commands/    [OK/SKIP mỗi file]
agents/              [OK/SKIP]
templates/           [OK/SKIP]
docs/workflows/      [OK/SKIP]
docs/ (empty dirs)   [OK/SKIP]
CLAUDE.md            [OK/SKIP]

Bước tiếp theo:
1. Mở CLAUDE.md, cập nhật section "VTI Context" (project name, khách hàng, repo URL, tech stack)
2. Gõ / để xem commands có sẵn: /pm:ideate  /ba:spec  /dev:analyze  /qa:testplan ...
```

---

## Lưu ý

- Skill này KHÔNG dùng PowerShell/Bash — chỉ dùng Glob, Read, Write tools của Claude Code
- Không ghi đè file đã tồn tại — luôn Skip và báo user merge thủ công
- Nếu working directory = source directory → báo lỗi, không cài
