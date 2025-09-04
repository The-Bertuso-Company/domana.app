const fs = require("fs");
const path = require("path");

const root   = process.env.REPO_ROOT || "";
const file   = path.join(root, "mobile/src/components/saved/SavedHomeCard.tsx");

function latestBackup(p) {
  const dir = path.dirname(p);
  const base = path.basename(p);
  const files = fs.readdirSync(dir).filter(f => f.startsWith(base + ".bak."));
  if (!files.length) return null;
  return files.map(f => path.join(dir, f)).sort((a,b)=>fs.statSync(b).mtime - fs.statSync(a).mtime)[0];
}

if (!fs.existsSync(file)) {
  console.log("Skip: SavedHomeCard.tsx not found");
  process.exit(0);
}

let restored = false;
const bak = latestBackup(file);
if (bak) {
  // Try restoring the most recent backup (fastest path)
  fs.copyFileSync(bak, file);
  restored = true;
  console.log("Restored from backup:", path.relative(path.join(root,"mobile"), bak));
} else {
  console.log("No backup found; performing in-place repair...");
}

// If restored, we still ensure no duplicate styles snuck in elsewhere
let code = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g,"-");
fs.copyFileSync(file, file + ".safety."+ts);

// 1) Merge duplicate style attributes:  <Text style={{...}} style={[...]}>  -> one style
code = code.replace(/(<Text[^>]*?)\s+style=\{\{([^}]*)\}\}\s+style=\{\[([^\]]*)\]\}([^>]*>)/g,
  (_m, pre, obj, arr, end) => `${pre} style={[{ ${obj.trim()} }, ${arr.trim()}]}${end}`
);
code = code.replace(/(<Text[^>]*?)\s+style=\{\[([^\]]*)\]\}\s+style=\{\{([^}]*)\}\}([^>]*>)/g,
  (_m, pre, arr, obj, end) => `${pre} style={[{ ${obj.trim()} }, ${arr.trim()}]}${end}`
);

// 2) If we accidentally inserted __domMuted(th) without a comma/brace, fix it
code = code.replace(/style=\{\[\{\s*([^}]*)\s*,\s*__domMuted\(th\)\]\}/g,
  (_m, obj) => `style={[{ ${obj.trim()} }, __domMuted(th)]}`
);

// 3) If any remaining duplicate style= occurrences exist on the same <Text>, keep the last one.
code = code.replace(/(<Text[^>]*?)\s+style=\{[^}]+\}\s+style=\{([^}]+)\}([^>]*>)/g,
  (_m, pre, last, end) => `${pre} style={${last}}${end}`
);

// 4) Remove any inline theme helpers accidentally added to this card (keep Phase 9 scope clean)
code = code
  .replace(/\/\* --- inline DS theme \(auto\) --- \*\/[\s\S]*?__domMuted\(th\)\s*=\s*\([^\)]+\)\s*=>\s*\{[^\}]*\};?\s*/g, "")
  .replace(/const\s+__TH_LIGHT[\s\S]*?;\s*/g, "")
  .replace(/const\s+__TH_DARK[\s\S]*?;\s*/g, "")
  .replace(/function\s+__getTheme[\s\S]*?\}\s*/g, "")
  .replace(/const\s+__domMuted\s*=\s*\([^\)]*\)\s*=>\s*\(\{[^\}]*\}\);\s*/g, "");

// 5) Remove `__domMuted(th)` usages that might remain on this file (keep it pristine)
code = code.replace(/,\s*__domMuted\(th\)\s*/g, "");
code = code.replace(/\s*__domMuted\(th\)\s*/g, "");

// Save
fs.writeFileSync(file, code, "utf8");
console.log("Repaired:", path.relative(path.join(root,"mobile"), file));
