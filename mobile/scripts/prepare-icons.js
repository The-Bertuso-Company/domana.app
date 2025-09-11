// scripts/prepare-icons.js
// Rewrites src/icons/*.svg so fill/stroke use "currentColor" (colorable in RN).
const fs = require('fs');
const path = require('path');

const ICON_DIR = path.join(__dirname, '..', 'src', 'icons');

function toCurrentColor(svg) {
  // replace hard-coded fills/strokes (except "none")
  return svg
    .replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"')
    .replace(/stroke="(?!none)[^"]*"/g, 'stroke="currentColor"');
}

function run() {
  if (!fs.existsSync(ICON_DIR)) {
    console.error('No src/icons folder found. Make sure your SVGs are in src/icons/.');
    process.exit(1);
  }
  const files = fs.readdirSync(ICON_DIR).filter(f => f.toLowerCase().endsWith('.svg'));
  let changed = 0;
  files.forEach(file => {
    const p = path.join(ICON_DIR, file);
    const original = fs.readFileSync(p, 'utf8');
    const updated = toCurrentColor(original);
    if (updated !== original) {
      fs.writeFileSync(p, updated, 'utf8');
      changed++;
    }
  });
  console.log(`Processed ${files.length} SVG(s). Rewrote ${changed}.`);
}

run();
