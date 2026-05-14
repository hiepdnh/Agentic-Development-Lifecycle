---
name: install
description: >
  Cài VTI SDLC framework vào project hiện tại (OpenCode port).
  Copy skills, agents, templates, workflows vào thư mục .opencode/.
  Trigger khi: user nói "cài framework", "cài đặt SDLC", "setup skills",
  "/install", hoặc cần bootstrap framework cho project mới.
---

# /install
**Role**: All
**Mục đích**: Cài VTI SDLC framework (OpenCode port) vào project hiện tại.

---

## Cách 1 — Cài tự động (recommended)

```bash
# Từ project target (không phải thư mục framework source)
npx github:hiepdnh/Agentic-Development-Lifecycle --yes

# Nếu đã clone framework repo, dùng installer
node /path/to/ClaudeSkill/bin/install.js --yes
```

## Cách 2 — Cài thủ công (dùng skill này)

---

## Input

Không cần argument. Skill tự detect:
- **Source**: thư mục chứa framework này (nơi file `/install.md` tọa lạc = `[SOURCE]/.opencode/skills/install/`)
- **Target**: working directory hiện tại của OpenCode session

---

## Hướng dẫn thực hiện

### Bước 0 — Gate xác nhận

<!-- Gate: Xác nhận cài đặt -->
question({
  questions: [{
    question: "Cài VTI SDLC Framework (OpenCode) vào project này?",
    header: "Confirm",
    options: [
      { label: "Cài đặt", description: "Copy skills vào .opencode/skills/" },
      { label: "Hủy", description: "Không cài đặt" },
    ]
  }]
})

### Bước 0b — Xác định paths

Dùng Glob/Read để tìm:
- Source root: thư mục cha 3 cấp của file này (`../../../` từ vị trí file này)
- Target root: `$PWD` của session hiện tại (từ working directory)

Kiểm tra:
- Nếu working directory = source directory → báo lỗi, không cài
- Nếu khác → hiển thị để user xác nhận:

```
Source : [SOURCE_PATH]
Target : [TARGET_PATH]
```

### Bước 1 — Copy `.opencode/skills/`

Dùng Glob để list tất cả file trong `[SOURCE]/.opencode/skills/**/*.md`.

Với mỗi file:
- Compute đường dẫn target: `[TARGET]/.opencode/skills/[relative_path]`
- Nếu target file đã tồn tại → báo `[SKIP]`, không ghi đè
- Nếu chưa tồn tại → dùng Read + Write để copy

Báo cáo từng file: `[OK]` hoặc `[SKIP]`.

### Bước 2 — Copy `agents/`

Glob `[SOURCE]/agents/*.md`. Copy từng file sang `[TARGET]/agents/`.
Skip nếu đã tồn tại.

### Bước 3 — Copy `templates/`

Glob TẤT CẢ file trong `[SOURCE]/templates/` (cả `.md` và `.html`). Copy từng file sang `[TARGET]/templates/`.
Skip nếu đã tồn tại.

### Bước 4 — Copy `docs/workflows/`

Glob `[SOURCE]/docs/workflows/*.md`. Copy sang `[TARGET]/docs/workflows/`.
Skip nếu đã tồn tại.

### Bước 4b — Copy framework doc files

Với mỗi file:
- `docs/risk-classifier.md`
- `docs/validation-matrix.md`

Read từ `[SOURCE]/docs/[FILE]`, Write sang `[TARGET]/docs/[FILE]`.
Skip nếu target đã tồn tại.

### Bước 4c — Copy `docs/improvement-backlog.md` (user-mutable)

CHỈ copy nếu `[TARGET]/docs/improvement-backlog.md` CHƯA tồn tại.
File này user tự cập nhật sau task — TUYỆT ĐỐI không ghi đè dù với lý do gì.

### Bước 4d — Copy `docs/analysis/`

Glob `[SOURCE]/docs/analysis/*.md`. Copy sang `[TARGET]/docs/analysis/`.
Skip nếu file đã tồn tại.

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

.opencode/skills/             [OK/SKIP mỗi file]
agents/                        [OK/SKIP]
templates/                     [OK/SKIP] (md + html)
docs/workflows/                [OK/SKIP]
docs/ (framework files)        [OK/SKIP] (risk-classifier, validation-matrix)
docs/improvement-backlog.md    [OK/SKIP]
docs/analysis/                 [OK/SKIP]
docs/ (empty dirs)             [OK/SKIP] (api, screens, tasks, decisions)
CLAUDE.md                      [OK/SKIP]

Bước tiếp theo:
1. Mở CLAUDE.md, cập nhật section "VTI Context" (project name, khách hàng, repo URL, tech stack)
2. Gõ / để xem skills có sẵn: pm:ideate  ba:spec  dev:analyze  qa:testplan ...
```

---

## Lưu ý

- Skill này KHÔNG dùng shell — chỉ dùng Glob, Read, Write tools của OpenCode
- Không ghi đè file đã tồn tại — luôn Skip và báo user merge thủ công
- `docs/improvement-backlog.md` là user-mutable — không bao giờ ghi đè dù user yêu cầu re-install
- Nếu working directory = source directory → báo lỗi, không cài
