const fs = require("fs");
const path = require("path");
const root   = process.env.REPO_ROOT || "";
const mobile = path.join(root, "mobile");
const file   = path.join(mobile, "app/(tabs)/_layout.tsx");

if (!fs.existsSync(file)) { console.log("Skip: tabs layout not found"); process.exit(0); }
let code = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g,"-");
fs.copyFileSync(file, file + ".bak." + ts);

// 1) Ensure we can read bottom inset
if (!/useSafeAreaInsets/.test(code)) {
  code = code.replace(
    /import\s+\{\s*SafeAreaView\s*\}\s+from\s+"react-native-safe-area-context";/,
    'import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";'
  );
}

// 2) Make sure edges include bottom on the outer SafeAreaView
code = code.replace(
  /<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g,
  (_m, a, b) => `<SafeAreaView${a}edges={["left","right","bottom"]}${b}>`
);

// 3) Add insets + pb vars after scheme
code = code.replace(
  /const\s+scheme\s*=\s*useColorScheme\(\);\s*/,
  (m) => `${m}  const insets = useSafeAreaInsets();\n  const pb = insets.bottom || 0;\n`
);

// 4) Ensure screenOptions is a function so we can use pb
if (/screenOptions=\{\{/.test(code)) {
  // convert static object to function form
  code = code.replace(
    /<Tabs\s*[\s\S]*?screenOptions=\{\{([\s\S]*?)\}\}/,
    (m, inner) => `<Tabs\n        screenOptions={({ route }) => ({ ${inner} })}`
  );
}

// 5) Inject dynamic height + paddingBottom into tabBarStyle
if (/tabBarStyle:\s*\{[\s\S]*?\}/.test(code)) {
  code = code.replace(/tabBarStyle:\s*\{([\s\S]*?)\}/, (mm, style) => {
    let s = style;
    // remove any existing height/paddingBottom to avoid duplicates
    s = s.replace(/height:\s*[^,}]+,?/g, "");
    s = s.replace(/paddingBottom:\s*[^,}]+,?/g, "");
    // trim and rebuild
    s = s.trim();
    if (s && !s.endsWith(",")) s += ", ";
    return `tabBarStyle: { ${s}height: 52 + pb, paddingBottom: pb }`;
  });
} else {
  code = code.replace(/screenOptions=\{\(\{\s*route\s*\}\)\s*=>\s*\(\{/, (m) =>
    `${m}\n          tabBarStyle: { height: 52 + pb, paddingBottom: pb },`
  );
}

fs.writeFileSync(file, code, "utf8");
console.log("Patched tabs bottom inset:", path.relative(mobile, file));
