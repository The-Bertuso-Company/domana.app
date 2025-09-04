const fs = require("fs");
const path = require("path");
const root   = process.env.REPO_ROOT || "";
const mobile = path.join(root, "mobile");
const file   = path.join(mobile, "app/_layout.tsx");

if (!fs.existsSync(file)) {
  console.log("Skip: app/_layout.tsx not found");
  process.exit(0);
}

let code = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g,"-");
fs.copyFileSync(file, file + ".bak." + ts);

// 1) Ensure tokens import exists (exactly once)
if (!/ui\/tokens/.test(code)) {
  code = `import { getTheme } from "../ui/tokens";\n` + code;
}

// 2) Remove ALL existing theme lines to avoid duplicates
code = code.replace(/^[ \t]*const\s+th\s*=\s*getTheme\([^\)]*\);\s*$/gm, "");
code = code.replace(/^[ \t]*const\s+bg\s*=\s*.*?;\s*$/gm, "");

// 3) Insert the canonical theme lines right after `const scheme = useColorScheme();`
code = code.replace(
  /const\s+scheme\s*=\s*useColorScheme\(\);\s*/,
  (m) => m + `  const th = getTheme(scheme as any);\n  const bg = th.bg;\n`
);

// 4) Normalize SafeArea edges to top/left/right (no bottom gap on Android)
code = code.replace(
  /<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g,
  (m, a, b) => `<SafeAreaView${a}edges={["top","left","right"]}${b}>`
);

// 5) Keep StatusBar animated, do not set translucent
code = code.replace(/<StatusBar([^>]*?)\/>/g, (m) => {
  let out = m;
  if (!/animated/.test(out)) out = out.replace(/\/>$/, " animated />");
  return out;
});

fs.writeFileSync(file, code, "utf8");
console.log("Fixed:", path.relative(mobile, file));
