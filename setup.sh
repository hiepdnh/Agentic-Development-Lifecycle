#!/bin/bash
# VTI SDLC Skill Framework — Setup Script (macOS / Linux)
# Usage: ./setup.sh [target-path]
# Usage: ./setup.sh             (install to current directory)

set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${1:-$(pwd)}"

echo ""
echo "VTI SDLC Skill Framework — Setup"
echo "================================="
echo "Source : $SOURCE_DIR"
echo "Target : $TARGET_DIR"
echo ""

# Validate
if [ ! -d "$TARGET_DIR" ]; then
    echo "ERROR: Target path does not exist: $TARGET_DIR"
    exit 1
fi

if [ "$SOURCE_DIR" = "$TARGET_DIR" ]; then
    echo "ERROR: Source and target are the same directory."
    exit 1
fi

read -p "Install framework into '$TARGET_DIR'? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""

copy_dir() {
    local src="$1"
    local dst="$2"
    local label="$3"
    if [ -d "$dst" ]; then
        echo "  [SKIP] $label already exists — manual merge recommended"
    else
        cp -r "$src" "$dst"
        echo "  [OK]   $label"
    fi
}

# 1. .claude/commands
echo "Copying skill commands..."
mkdir -p "$TARGET_DIR/.claude"
copy_dir "$SOURCE_DIR/.claude/commands" "$TARGET_DIR/.claude/commands" ".claude/commands/"

# 2. agents
echo "Copying agent definitions..."
copy_dir "$SOURCE_DIR/agents" "$TARGET_DIR/agents" "agents/"

# 3. templates
echo "Copying templates..."
copy_dir "$SOURCE_DIR/templates" "$TARGET_DIR/templates" "templates/"

# 4. docs/workflows
echo "Copying workflow docs..."
mkdir -p "$TARGET_DIR/docs"
copy_dir "$SOURCE_DIR/docs/workflows" "$TARGET_DIR/docs/workflows" "docs/workflows/"

# 5. Create empty doc dirs
echo "Creating doc directories..."
for dir in api screens tasks decisions; do
    dir_path="$TARGET_DIR/docs/$dir"
    if [ ! -d "$dir_path" ]; then
        mkdir -p "$dir_path"
        touch "$dir_path/.gitkeep"
        echo "  [OK]   docs/$dir/"
    else
        echo "  [SKIP] docs/$dir/ already exists"
    fi
done

# 6. CLAUDE.md
echo "Copying CLAUDE.md..."
if [ -f "$TARGET_DIR/CLAUDE.md" ]; then
    echo "  [SKIP] CLAUDE.md already exists — merge manually"
    echo "         Reference: $SOURCE_DIR/CLAUDE.md"
else
    cp "$SOURCE_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
    echo "  [OK]   CLAUDE.md"
fi

echo ""
echo "Done!"
echo ""
echo "Next steps:"
echo "  1. Open CLAUDE.md and update the VTI Context section:"
echo "       - Company/project name, customer, repo URL, tech stack"
echo ""
echo "  2. Open your project in Claude Code:"
echo "       claude ."
echo ""
echo "  3. Type / to see available commands:"
echo "       /pm:ideate   /ba:spec   /dev:analyze   /qa:testplan ..."
echo ""
echo "  Docs: https://github.com/hiepdnh/Agentic-Development-Lifecycle"
