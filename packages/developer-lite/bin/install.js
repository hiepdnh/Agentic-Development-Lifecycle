#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..');
const dst = process.cwd();
const YES = process.argv.includes('--yes') || process.argv.includes('-y');
const UPDATE = process.argv.includes('--update') || process.argv.includes('-u');

if (src === dst) {
  console.error('ERROR: Cannot install into the package source directory.');
  process.exit(1);
}

function copyDir(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0, skipped = 0, updated = 0;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      const r = copyDir(s, d);
      copied += r.copied; skipped += r.skipped; updated += r.updated;
    } else {
      const existed = fs.existsSync(d);
      if (existed && !UPDATE) { skipped++; continue; }
      fs.copyFileSync(s, d);
      existed ? updated++ : copied++;
    }
  }
  return { copied, skipped, updated };
}

console.log('\n  Developer Lite — Skill Pack for Claude Code\n');

if (!YES) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`Install developer-lite skills into: ${dst} ? (y/N) `, (answer) => {
    rl.close();
    if (!answer.match(/^y(es)?$/i)) { console.log('Cancelled.'); process.exit(0); }
    install();
  });
} else {
  install();
}

function install() {
  // Copy .claude/commands/
  const cmdSrc = path.join(src, '.claude', 'commands');
  const cmdDst = path.join(dst, '.claude', 'commands');
  const r1 = copyDir(cmdSrc, cmdDst);

  // Copy agents/ — subagent definitions referenced by /dev:pr, /dev:review, /docs:update
  const agentsSrc = path.join(src, 'agents');
  const agentsDst = path.join(dst, 'agents');
  const r2 = copyDir(agentsSrc, agentsDst);

  // Copy CLAUDE.md only if not exists (don't overwrite user's CLAUDE.md)
  const claudeSrc = path.join(src, 'CLAUDE.md');
  const claudeDst = path.join(dst, 'CLAUDE.md');
  let claudeStatus = 'skipped';
  if (!fs.existsSync(claudeDst)) {
    fs.copyFileSync(claudeSrc, claudeDst);
    claudeStatus = 'copied';
  } else if (UPDATE) {
    // Append a note instead of overwriting
    const note = '\n\n---\n<!-- developer-lite skills installed: /dev:analyze /dev:implement /dev:review /dev:pr /dev:debug /sec:review /arch:adr /docs:update -->\n';
    fs.appendFileSync(claudeDst, note);
    claudeStatus = 'appended note';
  }

  const total = r1.copied + r1.updated;
  const agentsTotal = r2.copied + r2.updated;
  console.log(`\n  ✓ Skills installed: ${total} files`);
  console.log(`  ✓ Agents installed: ${agentsTotal} files`);
  console.log(`  ✓ CLAUDE.md: ${claudeStatus}`);
  console.log('\n  Skills available:');
  console.log('    /dev:analyze   /dev:implement  /dev:review');
  console.log('    /dev:pr        /dev:debug       /sec:review');
  console.log('    /arch:adr      /docs:update');
  console.log('\n  Workflow:');
  console.log('    /dev:analyze → /dev:implement → /dev:review → /dev:pr\n');
}
