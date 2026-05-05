#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const src = path.resolve(__dirname, '..');
const dst = process.cwd();

const YES = process.argv.includes('--yes') || process.argv.includes('-y');

const c = {
  cyan:   (s) => `\x1b[36m${s}\x1b[0m`,
  green:  (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red:    (s) => `\x1b[31m${s}\x1b[0m`,
  gray:   (s) => `\x1b[90m${s}\x1b[0m`,
};

console.log('');
console.log(c.cyan('VTI SDLC Skill Framework — Setup'));
console.log(c.cyan('================================='));
console.log(`Source : ${src}`);
console.log(`Target : ${dst}`);
console.log('');

if (src === dst) {
  console.log(c.red('ERROR: Source and target are the same directory.'));
  process.exit(1);
}

function copyDir(srcDir, dstDir, label) {
  if (!fs.existsSync(srcDir)) return;
  if (fs.existsSync(dstDir)) {
    console.log(c.yellow(`  [SKIP] ${label} already exists — manual merge recommended`));
    return;
  }
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d, label + '/' + entry.name);
    } else {
      fs.copyFileSync(s, d);
    }
  }
  console.log(c.green(`  [OK]   ${label}`));
}

function touchGitkeep(dir) {
  const rel = path.relative(dst, dir);
  if (fs.existsSync(dir)) {
    console.log(c.yellow(`  [SKIP] ${rel}/ already exists`));
  } else {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, '.gitkeep'), '');
    console.log(c.green(`  [OK]   ${rel}/`));
  }
}

function run() {
  // 1. .claude/commands
  console.log('Copying skill commands...');
  const claudeDst = path.join(dst, '.claude');
  fs.mkdirSync(claudeDst, { recursive: true });
  copyDir(path.join(src, '.claude', 'commands'), path.join(claudeDst, 'commands'), '.claude/commands/');

  // 2. agents
  console.log('Copying agent definitions...');
  copyDir(path.join(src, 'agents'), path.join(dst, 'agents'), 'agents/');

  // 3. templates
  console.log('Copying templates...');
  copyDir(path.join(src, 'templates'), path.join(dst, 'templates'), 'templates/');

  // 4. docs/workflows
  console.log('Copying workflow docs...');
  const docsDst = path.join(dst, 'docs');
  fs.mkdirSync(docsDst, { recursive: true });
  copyDir(path.join(src, 'docs', 'workflows'), path.join(docsDst, 'workflows'), 'docs/workflows/');

  // 5. empty doc dirs
  console.log('Creating doc directories...');
  for (const d of ['api', 'screens', 'tasks', 'decisions']) {
    touchGitkeep(path.join(docsDst, d));
  }

  // 6. CLAUDE.md
  console.log('Copying CLAUDE.md...');
  const claudeMdDst = path.join(dst, 'CLAUDE.md');
  if (fs.existsSync(claudeMdDst)) {
    console.log(c.yellow(`  [SKIP] CLAUDE.md already exists — merge manually`));
    console.log(c.gray(`         Reference: ${path.join(src, 'CLAUDE.md')}`));
  } else {
    fs.copyFileSync(path.join(src, 'CLAUDE.md'), claudeMdDst);
    console.log(c.green('  [OK]   CLAUDE.md'));
  }

  console.log('');
  console.log(c.green('Done!'));
  console.log('');
  console.log(c.cyan('Next steps:'));
  console.log('  1. Open CLAUDE.md and update the VTI Context section:');
  console.log('       - Company/project name, customer name, repo URL, tech stack');
  console.log('');
  console.log('  2. Open your project in Claude Code:');
  console.log('       claude .');
  console.log('');
  console.log('  3. Type / to see available commands:');
  console.log('       /pm:ideate   /ba:spec   /dev:analyze   /qa:testplan ...');
  console.log('');
  console.log('  Docs: https://github.com/hiep18101997/Agentic-Development-Lifecycle');
}

if (YES) {
  run();
} else {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`Install framework into '${dst}'? [y/N] `, (answer) => {
    rl.close();
    if (/^y$/i.test(answer.trim())) {
      run();
    } else {
      console.log(c.yellow('Cancelled.'));
      process.exit(0);
    }
  });
}
