#!/usr/bin/env node

const { intro, outro, confirm, spinner, log, cancel, isCancel, note } = require('@clack/prompts');
const pc = require('picocolors');
const fs = require('fs');
const path = require('path');

const BANNER = [
  ' ██╗   ██╗████████╗██╗    █████╗ ██████╗ ██╗      ██████╗ ',
  ' ██║   ██║╚══██╔══╝██║   ██╔══██╗██╔══██╗██║     ██╔════╝ ',
  ' ██║   ██║   ██║   ██║   ███████║██║  ██║██║     ██║      ',
  ' ╚██╗ ██╔╝   ██║   ██║   ██╔══██║██║  ██║██║     ██║      ',
  '  ╚████╔╝    ██║   ██║   ██║  ██║██████╔╝███████╗╚██████╗ ',
  '   ╚═══╝     ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝',
  '',
  '  Agentic Development LifeCycle',
].join('\n');

const src = path.resolve(__dirname, '..');
const dst = process.cwd();
const YES = process.argv.includes('--yes') || process.argv.includes('-y');
const UPDATE = process.argv.includes('--update') || process.argv.includes('-u');

function copyDir(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0, skipped = 0, updated = 0;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      const sub = copyDir(s, d);
      copied += sub.copied;
      skipped += sub.skipped;
      updated += sub.updated;
    } else if (fs.existsSync(d)) {
      if (UPDATE) {
        fs.copyFileSync(s, d);
        updated++;
      } else {
        skipped++;
      }
    } else {
      fs.copyFileSync(s, d);
      copied++;
    }
  }
  return { copied, skipped, updated };
}

function resultMsg(label, { copied, skipped, updated }) {
  const parts = [];
  if (copied > 0) parts.push(`${copied} added`);
  if (updated > 0) parts.push(`${updated} updated`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  const icon = (copied === 0 && updated === 0) ? pc.yellow('○') : pc.green('◆');
  return `${icon} ${label}${parts.length ? pc.dim(` — ${parts.join(', ')}`) : ''}`;
}

async function main() {
  console.log(pc.cyan(BANNER));
  console.log();

  intro(pc.bgCyan(pc.black(UPDATE ? ' VTI SDLC Skill Framework — Update ' : ' VTI SDLC Skill Framework — Setup ')));

  if (src === dst) {
    cancel('Source and target are the same directory.');
    process.exit(1);
  }

  log.info(`Target: ${pc.green(dst)}`);

  if (!YES) {
    const action = UPDATE ? 'Update' : 'Install';
    const ok = await confirm({
      message: `${action} framework into ${pc.bold(path.basename(dst))}?`,
    });
    if (isCancel(ok) || !ok) {
      cancel(`${action} cancelled.`);
      process.exit(0);
    }
  }

  console.log();

  const s = spinner();

  // 1. .claude/commands
  s.start('Copying skill commands...');
  const claudeDst = path.join(dst, '.claude');
  fs.mkdirSync(claudeDst, { recursive: true });
  const cmdResult = copyDir(path.join(src, '.claude', 'commands'), path.join(claudeDst, 'commands'));
  s.stop(resultMsg('.claude/commands/', cmdResult));

  // 2. agents
  s.start('Copying agent definitions...');
  const agentsResult = copyDir(path.join(src, 'agents'), path.join(dst, 'agents'));
  s.stop(resultMsg('agents/', agentsResult));

  // 3. templates
  s.start('Copying templates...');
  const templatesResult = copyDir(path.join(src, 'templates'), path.join(dst, 'templates'));
  s.stop(resultMsg('templates/', templatesResult));

  // 4. docs/workflows
  s.start('Copying workflow docs...');
  const docsDst = path.join(dst, 'docs');
  fs.mkdirSync(docsDst, { recursive: true });
  const workflowsResult = copyDir(path.join(src, 'docs', 'workflows'), path.join(docsDst, 'workflows'));
  s.stop(resultMsg('docs/workflows/', workflowsResult));

  // 4b. docs root framework files (always overwrite on --update)
  s.start('Copying framework doc files...');
  const docRootFiles = ['risk-classifier.md', 'validation-matrix.md'];
  let docRootCopied = 0, docRootUpdated = 0;
  for (const file of docRootFiles) {
    const srcFile = path.join(src, 'docs', file);
    const dstFile = path.join(docsDst, file);
    if (!fs.existsSync(srcFile)) continue;
    if (fs.existsSync(dstFile)) {
      if (UPDATE) { fs.copyFileSync(srcFile, dstFile); docRootUpdated++; }
    } else {
      fs.copyFileSync(srcFile, dstFile);
      docRootCopied++;
    }
  }
  s.stop(resultMsg('docs/ framework files', { copied: docRootCopied, skipped: docRootFiles.length - docRootCopied - docRootUpdated, updated: docRootUpdated }));

  // 4d. docs/analysis (framework content — skip-if-exists, overwrite on --update)
  s.start('Copying analysis docs...');
  const analysisResult = copyDir(path.join(src, 'docs', 'analysis'), path.join(docsDst, 'analysis'));
  s.stop(resultMsg('docs/analysis/', analysisResult));

  // 4c. improvement-backlog.md — only if missing (user-mutable, never overwrite)
  const backlogSrc = path.join(src, 'docs', 'improvement-backlog.md');
  const backlogDst = path.join(docsDst, 'improvement-backlog.md');
  if (fs.existsSync(backlogSrc) && !fs.existsSync(backlogDst)) {
    fs.copyFileSync(backlogSrc, backlogDst);
    log.info(`${pc.green('◆')} docs/improvement-backlog.md ${pc.dim('— created')}`);
  }

  // 5. empty doc dirs
  s.start('Creating doc directories...');
  const docDirs = ['api', 'screens', 'tasks', 'decisions'];
  let docCreated = 0;
  for (const dir of docDirs) {
    const dirPath = path.join(docsDst, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      fs.writeFileSync(path.join(dirPath, '.gitkeep'), '');
      docCreated++;
    }
  }
  s.stop(
    docCreated === 0
      ? `${pc.yellow('○')} docs/ subdirs ${pc.dim('— already exist')}`
      : `${pc.green('◆')} docs/ subdirs ${pc.dim(`— ${docCreated} created`)}`
  );

  // 6. CLAUDE.md
  const claudeMdDst = path.join(dst, 'CLAUDE.md');
  if (fs.existsSync(claudeMdDst) && !UPDATE) {
    log.warn(`CLAUDE.md already exists — merge manually`);
    log.info(`Reference: ${pc.dim(path.join(src, 'CLAUDE.md'))}`);
  } else {
    s.start(UPDATE ? 'Updating CLAUDE.md...' : 'Copying CLAUDE.md...');
    fs.copyFileSync(path.join(src, 'CLAUDE.md'), claudeMdDst);
    s.stop(`${pc.green('◆')} CLAUDE.md`);
  }

  console.log();

  note(
    [
      `1. Open ${pc.cyan('CLAUDE.md')} → update VTI Context section`,
      `   (project name, client, repo URL, tech stack)`,
      ``,
      `2. Open project in Claude Code:`,
      `   ${pc.cyan('claude .')}`,
      ``,
      `3. Type ${pc.cyan('/')} to see available commands:`,
      `   /pm:ideate  /ba:spec  /dev:analyze  /qa:testplan ...`,
    ].join('\n'),
    'Next steps'
  );

  outro(pc.green(UPDATE ? 'Framework updated successfully!' : 'Framework installed successfully!'));
}

main().catch((err) => {
  log.error(String(err));
  process.exit(1);
});
