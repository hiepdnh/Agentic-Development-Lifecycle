const fs = require('fs');
const path = require('path');

// Strip lang suffix from a filename like "spec.en.md" → { base: "spec", lang: "en", ext: "md" }
function parseSkillFilename(filename) {
  const m = filename.match(/^(.+?)(?:\.(en|ja))?\.(md|txt)$/);
  if (!m) return null;
  return { base: m[1], lang: m[2] || null, ext: m[3] };
}

function transformFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { frontmatter: '', body: source };

  const frontmatter = match[1];
  const body = source.slice(match[0].length);

  const lines = frontmatter.split('\n');
  const out = [];
  for (const line of lines) {
    if (line.startsWith('name:')) {
      // Agent Skills standard: name must be [a-z0-9-]; replace ':' with '-'
      const value = line.slice('name:'.length).trim();
      out.push(`name: ${value.replace(/:/g, '-')}`);
      continue;
    }
    out.push(line);
  }

  return {
    frontmatter: `---\n${out.join('\n').replace(/\n+$/, '')}\n---\n`,
    body,
  };
}

function transformBody(body) {
  let out = body;

  // Strip the redundant "# Skill: /role:command" header — frontmatter `name` already encodes it.
  out = out.replace(/^# Skill: \/[\w-]+:[\w-]+\s*\n/m, '');

  // Neutralise Claude-specific syntax for generic SKILL.md hosts (Codex, Aider, Gemini CLI...).
  out = out.replace(/AskUserQuestion\(/g, 'Ask the user (');
  out = out.replace(/\bAgent\(/g, 'Delegate to a sub-task agent (');

  return out;
}

function transformContent(source) {
  const { frontmatter, body } = transformFrontmatter(source);
  return frontmatter + transformBody(body);
}

// Build the destination skill folder name.
// LANG=all  → "ba-spec.en", "ba-spec.ja", "ba-spec" (VN base)
// LANG=en|ja|vi → "ba-spec" (suffix already stripped from filename by getLangDestName)
function deriveSkillDirName(relPathFromCommandsRoot, langStripped) {
  // relPathFromCommandsRoot looks like "ba/spec.md" or "ba/spec.en.md"
  const parsed = parseSkillFilename(path.basename(relPathFromCommandsRoot));
  if (!parsed) return null;
  const role = path.dirname(relPathFromCommandsRoot).split(path.sep).join('-');
  const base = parsed.base;
  const lang = parsed.lang;
  const dirRoot = role && role !== '.' ? `${role}-${base}` : base;
  if (langStripped || !lang) return dirRoot;
  return `${dirRoot}.${lang}`;
}

function copyAndTransform(srcDir, dstDir, opts = {}) {
  const { langFilter, getLangDestName, update, lang } = opts;
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  fs.mkdirSync(dstDir, { recursive: true });

  let copied = 0, skipped = 0, updated = 0, filtered = 0;

  function walk(currentSrc, relPath) {
    const entries = fs.readdirSync(currentSrc, { withFileTypes: true });
    const siblingNames = new Set(entries.filter((e) => !e.isDirectory()).map((e) => e.name));

    for (const entry of entries) {
      const s = path.join(currentSrc, entry.name);
      const rel = relPath ? path.join(relPath, entry.name) : entry.name;

      if (entry.isDirectory()) {
        walk(s, rel);
        continue;
      }

      if (langFilter && !langFilter(entry.name, siblingNames)) {
        filtered++;
        continue;
      }

      if (!entry.name.endsWith('.md')) {
        // Non-skill files are skipped — they aren't part of the SKILL.md spec.
        continue;
      }

      const destFilename = getLangDestName ? getLangDestName(entry.name) : entry.name;
      const relForDir = path.join(path.dirname(rel), destFilename);
      const langStripped = lang && lang !== 'all';
      const dirName = deriveSkillDirName(relForDir, langStripped);
      if (!dirName) continue;

      const skillDir = path.join(dstDir, dirName);
      const skillFile = path.join(skillDir, 'SKILL.md');
      const exists = fs.existsSync(skillFile);
      if (exists && !update) { skipped++; continue; }

      fs.mkdirSync(skillDir, { recursive: true });
      const content = fs.readFileSync(s, 'utf8');
      fs.writeFileSync(skillFile, transformContent(content));
      if (exists) updated++; else copied++;
    }
  }

  walk(srcDir, '');
  return { copied, skipped, updated, filtered };
}

module.exports = { copyAndTransform, transformContent, transformFrontmatter, transformBody };
