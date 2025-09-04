import fs from "fs";
import path from "path";
const root = process.env.REPO_ROOT!;
const mobile = path.join(root, "mobile");
const file = path.join(mobile, "app/_layout.tsx");
if (!fs.existsSync(file)) { console.log("Skip: app/_layout.tsx not found"); process.exit(0); }
let code = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g,"-");
fs.copyFileSync(file, file + ".bak."+ts);

// ensure tokens import
const rel = "../ui/tokens";
if (!code.includes('ui/tokens')) {
  code = `import { getTheme } from "${rel}";\n` + code;
}

// ensure scheme + theme usage inside our wrapper
if (code.includes("__DomanaBG")) {
  // replace manual bg with theme.bg
  code = code.replace(/const bg = [^\n]+;/, 'const th = getTheme(scheme as any);\n  const bg = th.bg;');
  // ensure edges top/left/right only
  code = code.replace(/edges=\{\[[^\]]*\]\}/g, 'edges={["top","left","right"]}');
  // normalize inner padding using tokens.spacing.md (16)
  code = code.replace(/paddingHorizontal:\s*\d+/, 'paddingHorizontal: 16');
  code = code.replace(/paddingTop:\s*\d+/, 'paddingTop: 8');
} else {
  // if wrapper not present, do nothing risky
  console.log("Note: __DomanaBG not detected; minimal patch only");
}

fs.writeFileSync(file, code, "utf8");
console.log("Patched root:", path.relative(mobile, file));
