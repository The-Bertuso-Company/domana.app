// scripts/gen-icons.js
// Scans src/icons and generates src/components/icons.gen.ts with exact imports.
const fs = require('fs');
const path = require('path');

const ICON_DIR = path.join(__dirname, '..', 'src', 'icons');
const OUT = path.join(__dirname, '..', 'src', 'components', 'icons.gen.ts');

function cleanBase(name) {
  // drop trailing theme ("— LIGHT", "-- DARK", "- light")
  return name.replace(/\s*(—|--|-)\s*(light|dark)$/i, '');
}
function slug(basename) {
  return basename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function varName(file) {
  return 'I_' + file.replace(/\.[^/.]+$/, '').replace(/[^A-Za-z0-9_]/g, '_');
}

function run() {
  if (!fs.existsSync(ICON_DIR)) fs.mkdirSync(ICON_DIR, { recursive: true });
  const files = fs.readdirSync(ICON_DIR).filter(f => f.toLowerCase().endsWith('.svg')).sort();

  let imports = "import type { SvgProps } from 'react-native-svg';\n";
  const map = [];

  for (const f of files) {
    const baseRaw = path.basename(f, '.svg');
    const key = slug(cleanBase(baseRaw));     // e.g. "chevron-left"
    const id = varName(f);                    // e.g. "I_chevron_left"
    imports += "import " + id + " from '../icons/" + f + "';\n";
    map.push("  '" + key + "': " + id);
  }

  const out =
    "// AUTO-GENERATED - do not edit\n" +
    "import React from 'react';\n" +
    imports +
    "\nexport const ICONS = {\n" +
    map.join(',\n') +
    "\n} as const;\n\n" +
    "export type IconName = keyof typeof ICONS;\n" +
    "export type IconComponent = React.FC<SvgProps>;\n";

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, out, 'utf8');
  console.log('Generated ' + OUT + ' (' + files.length + ' icon(s))');
}
run();
