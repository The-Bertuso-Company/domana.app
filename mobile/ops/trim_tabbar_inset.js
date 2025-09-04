const fs = require("fs");
const path = require("path");
const root = process.env.REPO_ROOT || "";
const file = path.join(root, "mobile/app/(tabs)/_layout.tsx");
if (!fs.existsSync(file)) { console.log("Skip: tabs layout not found"); process.exit(0); }
let code = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g,"-");
fs.copyFileSync(file, file + ".bak."+ts);

// 1) SafeAreaView: left/right only (so we don't get an extra bottom gap)
code = code.replace(
  /<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g,
  (_m, a, b) => `<SafeAreaView${a}edges={["left","right"]}${b}>`
);

// 2) Ensure useSafeAreaInsets is imported
if (!/useSafeAreaInsets/.test(code)) {
  code = code.replace(
    /import\s+\{\s*SafeAreaView\s*\}\s+from\s+"react-native-safe-area-context";/,
    'import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";'
  );
}

// 3) Ensure we read insets and compute a slight-trim pb (avoid visual overshoot)
if (!/const\s+insets\s*=\s*useSafeAreaInsets\(\)/.test(code)) {
  code = code.replace(
    /const\s+scheme\s*=\s*useColorScheme\(\);\s*/,
    (m) => `${m}  const insets = useSafeAreaInsets();\n  const pb = Math.max((insets.bottom || 0) - 2, 0);\n`
  );
} else {
  // normalize pb line
  code = code.replace(/const\s+pb\s*=\s*[^;]+;/, 'const pb = Math.max((insets.bottom || 0) - 2, 0);');
}

// 4) Make sure screenOptions is a function so we can use pb
if (/screenOptions=\{\{/.test(code)) {
  code = code.replace(
    /<Tabs\s*[\s\S]*?screenOptions=\{\{([\s\S]*?)\}\}/,
    (_m, inner) => `<Tabs\n        screenOptions={({ route }) => ({ ${inner} })}`
  );
}

// 5) Apply dynamic height + paddingBottom (and remove any duplicates)
if (/tabBarStyle:\s*\{[\s\S]*?\}/.test(code)) {
  code = code.replace(/tabBarStyle:\s*\{([\s\S]*?)\}/, (_mm, style) => {
    let s = style.replace(/height:\s*[^,}]+,?/g, "")
                 .replace(/paddingBottom:\s*[^,}]+,?/g, "")
                 .trim();
    if (s && !s.endsWith(",")) s += ", ";
    return `tabBarStyle: { ${s}height: 52 + pb, paddingBottom: pb }`;
  });
} else {
  code = code.replace(/screenOptions=\{\(\{\s*route\s*\}\)\s*=>\s*\(\{/, (m) =>
    `${m}\n          tabBarStyle: { height: 52 + pb, paddingBottom: pb },`
  );
}

fs.writeFileSync(file, code, "utf8");
console.log("Trimmed tab bar inset in:", path.relative(path.join(root,"mobile"), file));
