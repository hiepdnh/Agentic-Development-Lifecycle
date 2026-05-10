#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');
const pc   = require('picocolors');

const ROOT     = path.resolve(__dirname, '..');
const OUT_ARG  = process.argv.indexOf('--out');
const OUT      = OUT_ARG !== -1 ? process.argv[OUT_ARG + 1] : path.join(ROOT, 'docs', 'dashboard.html');
const TEMPLATE = path.join(ROOT, 'templates', 'dashboard.html');

const PHASE_ORDER = ['empty', 'discovery', 'planning', 'dev', 'review', 'qa'];

// ── Task scanner ────────────────────────────────────────────

function derivePhase(files) {
  if (!files.includes('requirements.md')) return 'empty';
  if (!files.includes('analysis.md'))     return 'discovery';
  if (!files.includes('verification.md')) return 'planning';
  if (files.includes('test-plan.md'))     return 'qa';
  if (files.includes('pr.md'))            return 'review';
  return 'dev';
}

function parseTitle(fp) {
  try { const m = fs.readFileSync(fp, 'utf8').match(/^#\s+(.+)/m); return m ? m[1].trim() : null; }
  catch { return null; }
}

function parseRisk(fp) {
  try { const m = fs.readFileSync(fp, 'utf8').match(/Lane:\s*(tiny|normal|high-risk)/i); return m ? m[1].toLowerCase() : null; }
  catch { return null; }
}

function scanTasks(tasksDir) {
  if (!fs.existsSync(tasksDir)) return [];
  const tasks = [];
  for (const entry of fs.readdirSync(tasksDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const taskDir = path.join(tasksDir, entry.name);
    const files   = fs.readdirSync(taskDir).filter(f => f.endsWith('.md'));
    const phase   = derivePhase(files);
    const title   = files.includes('requirements.md') ? parseTitle(path.join(taskDir, 'requirements.md')) : null;
    const risk    = files.includes('analysis.md')     ? parseRisk(path.join(taskDir, 'analysis.md'))     : null;

    let lastMod = 0;
    for (const f of files) {
      try { const ms = fs.statSync(path.join(taskDir, f)).mtimeMs; if (ms > lastMod) lastMod = ms; } catch {}
    }

    tasks.push({ id: entry.name, title: title || entry.name, phase, risk, files, lastMod: lastMod ? new Date(lastMod).toISOString() : null });
  }
  return tasks.sort((a, b) => PHASE_ORDER.indexOf(a.phase) - PHASE_ORDER.indexOf(b.phase));
}

// ── Backlog parser ──────────────────────────────────────────

function parseBacklog(fp) {
  if (!fs.existsSync(fp)) return [];
  const rows = [];
  for (const line of fs.readFileSync(fp, 'utf8').split('\n')) {
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length >= 5 && /^IB-\d+$/.test(cells[0]))
      rows.push({ id: cells[0], source: cells[1], friction: cells[2], fix: cells[3], status: cells[4] });
  }
  return rows;
}

function toJST(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(new Date(isoStr).getTime() + 9 * 3600 * 1000);
  return d.toISOString().replace('T', ' ').slice(0, 16) + ' JST';
}

// ── Build ───────────────────────────────────────────────────

function build() {
  const tasks   = scanTasks(path.join(ROOT, 'docs', 'tasks'));
  const backlog = parseBacklog(path.join(ROOT, 'docs', 'improvement-backlog.md'));
  const nowJST  = toJST(new Date().toISOString());
  const data    = { generatedAt: nowJST, tasks, backlog };

  if (!fs.existsSync(TEMPLATE)) {
    console.error(pc.red(`Template not found: ${TEMPLATE}`));
    process.exit(1);
  }

  const html = fs.readFileSync(TEMPLATE, 'utf8').replace('{{EMBEDDED_JSON}}', JSON.stringify(data, null, 2));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, html, 'utf8');

  return { tasks: tasks.length, backlog: backlog.length, nowJST };
}

function main() {
  console.log(pc.cyan('\n  VTI SDLC Dashboard Generator\n'));
  const s = build();
  console.log(`  ${pc.green('◆')} ${pc.cyan(OUT)}`);
  console.log(`  ${pc.dim(`${s.tasks} tasks · ${s.backlog} backlog · ${s.nowJST}`)}\n`);
}

main();
