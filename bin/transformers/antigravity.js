const fs = require('fs');
const path = require('path');

function copyDir(srcDir, dstDir, opts = {}) {
  const { langFilter, getLangDestName, update } = opts;
  if (!fs.existsSync(srcDir)) return { copied: 0, skipped: 0, updated: 0, filtered: 0 };
  fs.mkdirSync(dstDir, { recursive: true });
  let copied = 0, skipped = 0, updated = 0, filtered = 0;

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const siblingNames = new Set(entries.filter((e) => !e.isDirectory()).map((e) => e.name));

  for (const entry of entries) {
    const s = path.join(srcDir, entry.name);

    if (entry.isDirectory()) {
      const sub = copyDir(s, path.join(dstDir, entry.name), opts);
      copied += sub.copied;
      skipped += sub.skipped;
      updated += sub.updated;
      filtered += sub.filtered;
      continue;
    }

    if (langFilter && !langFilter(entry.name, siblingNames)) {
      filtered++;
      continue;
    }

    const dstName = getLangDestName ? getLangDestName(entry.name) : entry.name;
    const d = path.join(dstDir, dstName);

    if (fs.existsSync(d)) {
      if (update) { fs.copyFileSync(s, d); updated++; } else { skipped++; }
    } else {
      fs.copyFileSync(s, d);
      copied++;
    }
  }
  return { copied, skipped, updated, filtered };
}

function copyAndTransform(opencodeSrcDir, dstDir, opts = {}) {
  return copyDir(opencodeSrcDir, dstDir, opts);
}

module.exports = { copyAndTransform };
