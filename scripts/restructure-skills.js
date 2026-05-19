#!/usr/bin/env node
/**
 * Restructure every skill file in .claude/commands/ and .opencode/skills/ to
 * surface a `## Summary` section (sourced from the existing `description:`
 * frontmatter) followed by the original body under `## Workflow`.
 *
 * Progressive-disclosure-aware hosts read the Summary eagerly and load the
 * Workflow only when the skill is triggered. Existing hosts (Claude Code,
 * OpenCode, Cursor, Antigravity) are unaffected — they ignore H2 structure
 * and load the whole body once triggered anyway.
 *
 * Idempotent: skips files that already have `## Summary` at the top of body.
 */
const fs = require('fs');
const path = require('path');

const ROOTS = [
  path.resolve(__dirname, '..', '.claude', 'commands'),
  path.resolve(__dirname, '..', '.opencode', 'skills'),
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function extractDescription(frontmatter) {
  // YAML block-scalar: `description: >\n  line\n  line`
  const m = frontmatter.match(/^description:\s*>?\s*\n((?:[ \t]+.+\n?)+)/m);
  if (m) {
    return m[1]
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ')
      .trim();
  }
  // Single-line: `description: ...`
  const m2 = frontmatter.match(/^description:\s*(.+)$/m);
  return m2 ? m2[1].trim() : null;
}

function restructure(content) {
  // Some files were saved with a UTF-8 BOM — strip it before matching.
  const bom = content.startsWith('﻿') ? '﻿' : '';
  const src = bom ? content.slice(1) : content;
  const fmMatch = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return { changed: false, content };

  const frontmatter = fmMatch[1];
  const body = src.slice(fmMatch[0].length);

  // Already restructured? Skip.
  // Allow optional Skill heading + blank lines before ## Summary.
  const alreadyRestructured = /^(?:[^\n]*\n)*?##\s+(Summary|概要|Tóm tắt)\b/m.test(body.slice(0, 600));
  if (alreadyRestructured) return { changed: false, content };

  const description = extractDescription(frontmatter);
  if (!description) return { changed: false, content };

  // Pick H2 heading language based on filename hint or content.
  // We attach this to the path via a flag set by the caller.
  return {
    changed: true,
    description,
    bom,
    frontmatter: fmMatch[0],
    body,
  };
}

function langFromPath(p) {
  if (/\.ja\.md$/.test(p)) return 'ja';
  if (/\.en\.md$/.test(p)) return 'en';
  return 'vi';
}

const HEADINGS = {
  vi: { summary: '## Tóm tắt', workflow: '## Quy trình' },
  en: { summary: '## Summary', workflow: '## Workflow' },
  ja: { summary: '## 概要', workflow: '## ワークフロー' },
};

function apply(file) {
  const original = fs.readFileSync(file, 'utf8');
  const r = restructure(original);
  if (!r.changed) return false;

  const lang = langFromPath(file);
  const h = HEADINGS[lang];

  const summaryBlock = `${h.summary}\n\n${r.description}\n\n${h.workflow}\n\n`;
  const next = (r.bom || '') + r.frontmatter + summaryBlock + r.body.replace(/^\n+/, '');
  fs.writeFileSync(file, next);
  return true;
}

function main() {
  let total = 0, changed = 0;
  for (const root of ROOTS) {
    for (const f of walk(root)) {
      total++;
      if (apply(f)) changed++;
    }
  }
  console.log(`Scanned ${total} files — restructured ${changed} (skipped ${total - changed} already-restructured/no-description).`);
}

if (require.main === module) main();
module.exports = { restructure, extractDescription };
