const fs = require('fs');
const path = require('path');

function transformContent(source) {
  let body = source;

  body = transformFrontmatter(body);

  body = body.replace(/^# Skill: \/([\w-]+):([\w-]+)/m, '# /$1:$2');

  body = body.replace(/AskUserQuestion\(/g, 'Ask the user (');

  body = body.replace(/\bAgent\(/g, 'Sub-task Agent(');

  body = body.replace(/E:\\AI Bootcamp\\ClaudeSkill\\/g, '');

  return body;
}

function transformFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return source;

  const frontmatter = match[1];
  const rest = source.slice(match[0].length);

  const lines = frontmatter.split('\n');
  const out = [];
  let skippingName = false;

  for (const line of lines) {
    if (line.startsWith('name:')) {
      skippingName = false;
      continue;
    }
    if (skippingName && /^\s/.test(line)) continue;
    skippingName = false;

    if (line.startsWith('description:')) {
      out.push(line);
      continue;
    }
    out.push(line);
  }

  const hasGlobs = out.some((l) => l.startsWith('globs:'));
  const hasAlwaysApply = out.some((l) => l.startsWith('alwaysApply:'));
  if (!hasGlobs) out.push('globs: []');
  if (!hasAlwaysApply) out.push('alwaysApply: false');

  return `---\n${out.join('\n').replace(/\n+$/, '')}\n---\n${rest}`;
}

function copyAndTransform(srcDir, dstDir, opts = {}) {
  const { langFilter, update } = opts;
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0, skipped = 0, updated = 0, filtered = 0;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    if (entry.isDirectory()) {
      const sub = copyAndTransform(s, path.join(dstDir, entry.name), opts);
      copied += sub.copied;
      skipped += sub.skipped;
      updated += sub.updated;
      filtered += sub.filtered;
      continue;
    }

    if (langFilter && !langFilter(entry.name)) {
      filtered++;
      continue;
    }

    if (!entry.name.endsWith('.md')) {
      const d = path.join(dstDir, entry.name);
      if (fs.existsSync(d) && !update) { skipped++; continue; }
      fs.copyFileSync(s, d);
      if (fs.existsSync(d) && update) updated++; else copied++;
      continue;
    }

    const dstName = entry.name.replace(/\.md$/, '.mdc');
    const d = path.join(dstDir, dstName);
    const exists = fs.existsSync(d);
    if (exists && !update) { skipped++; continue; }

    const content = fs.readFileSync(s, 'utf8');
    const transformed = transformContent(content);
    fs.writeFileSync(d, transformed);
    if (exists) updated++; else copied++;
  }

  return { copied, skipped, updated, filtered };
}

module.exports = { copyAndTransform, transformContent };
