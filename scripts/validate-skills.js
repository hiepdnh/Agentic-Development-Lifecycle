#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOTS = [
  { dir: '.claude/commands', label: 'Claude Code' },
  { dir: '.opencode/skills', label: 'OpenCode' },
];

const errors = [];

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function parseFrontmatter(content) {
  const stripped = content.replace(/^﻿/, '');
  const m = stripped.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fields = {};
  const yaml = m[1];
  const nameMatch = yaml.match(/^name:\s*(.+?)$/m);
  if (nameMatch) fields.name = nameMatch[1].trim();
  const descMatch = yaml.match(/^description:\s*([\s\S]+?)(?=\n[a-z]+:|$)/m);
  if (descMatch) fields.description = descMatch[1].trim();
  return fields;
}

function expectedName(rootDir, filePath) {
  const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');
  const stem = rel.replace(/\.(en|ja)\.md$/, '').replace(/\.md$/, '');
  if (!stem.includes('/')) return stem;
  const [parent, leaf] = stem.split('/');
  if (parent === leaf) return leaf;
  return `${parent}:${leaf}`;
}

function baseStem(filePath) {
  return filePath.replace(/\.(en|ja)\.md$/, '.md');
}

// Progressive disclosure: every skill body must surface a Summary + Workflow
// pair so SKILL.md-aware hosts can load only the summary until invocation.
const PROGRESSIVE_HEADINGS = {
  vi: { summary: '## Tóm tắt', workflow: '## Quy trình' },
  en: { summary: '## Summary', workflow: '## Workflow' },
  ja: { summary: '## 概要', workflow: '## ワークフロー' },
};

function langOf(filePath) {
  if (/\.ja\.md$/.test(filePath)) return 'ja';
  if (/\.en\.md$/.test(filePath)) return 'en';
  return 'vi';
}

for (const { dir, label } of ROOTS) {
  const files = walk(dir);
  if (files.length === 0) {
    errors.push(`[${label}] no .md files found in ${dir}`);
    continue;
  }

  const stems = new Set();
  for (const file of files) stems.add(baseStem(file));

  for (const stem of stems) {
    const enFile = stem.replace(/\.md$/, '.en.md');
    const jaFile = stem.replace(/\.md$/, '.ja.md');
    if (!fs.existsSync(stem)) errors.push(`[${label}] missing VN base: ${stem}`);
    if (!fs.existsSync(enFile)) errors.push(`[${label}] missing EN variant: ${enFile}`);
    if (!fs.existsSync(jaFile)) errors.push(`[${label}] missing JA variant: ${jaFile}`);
  }

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const fm = parseFrontmatter(content);
    if (!fm) {
      errors.push(`[${label}] missing frontmatter: ${file}`);
      continue;
    }
    if (!fm.name) errors.push(`[${label}] missing 'name:' field: ${file}`);
    if (!fm.description) errors.push(`[${label}] missing 'description:' field: ${file}`);

    const expected = expectedName(dir, file);
    if (fm.name && fm.name !== expected) {
      errors.push(`[${label}] name mismatch: ${file} declares '${fm.name}' but path implies '${expected}'`);
    }

    // Progressive disclosure check — skip top-level "install" + "update-config"
    // utility files that are not user-facing role skills.
    const isUtility = /\b(install|update-config)\.(?:en|ja)?\.?md$/.test(file) && !file.includes(path.sep + 'install' + path.sep);
    if (!isUtility) {
      const h = PROGRESSIVE_HEADINGS[langOf(file)];
      const body = content.replace(/^---\n[\s\S]*?\n---\n/, '');
      if (!body.includes(h.summary)) {
        errors.push(`[${label}] missing '${h.summary}' heading: ${file}`);
      }
      if (!body.includes(h.workflow)) {
        errors.push(`[${label}] missing '${h.workflow}' heading: ${file}`);
      }
    }
  }

  console.log(`[${label}] ${files.length} files, ${stems.size} skills validated`);
}

if (errors.length) {
  console.error('\nVALIDATION FAILED:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\nAll skill files valid.');
