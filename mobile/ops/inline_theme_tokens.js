const fs = require("fs");
const path = require("path");
const root   = process.env.REPO_ROOT || "";
const mobile = path.join(root, "mobile");

function patchFile(relPath, isTabs = false) {
  const f = path.join(mobile, relPath);
  if (!fs.existsSync(f)) { console.log("Skip (not found):", relPath); return; }
  let code = fs.readFileSync(f, "utf8");
  const ts = new Date().toISOString().replace(/[:.]/g,"-");
  fs.copyFileSync(f, f + ".bak." + ts);

  // 1) Drop any tokens import
  code = code.replace(/^\s*import\s*\{?\s*getTheme\s*\}?\s*from\s*["'][.\/]+ui\/tokens["'];?\s*$/m, "");

  // 2) Ensure useColorScheme import exists (usually already there)
  if (!/useColorScheme/.test(code)) {
    code = `import { useColorScheme } from "react-native";\n` + code;
  }

  // 3) Inject tiny inline theme helper once (right after imports block)
  if (!/function __getTheme/.test(code)) {
    const helper =
`\n/* --- inline DS theme (auto) --- */
const __TH_LIGHT = { bg:"#FFFFFF", surface:"#F7F7FA", card:"#FFFFFF", border:"#E6E6EB", text:"#0B0B0F", muted:"#6B6B76", primary:"#E53935" };
const __TH_DARK  = { bg:"#0B0B0F", surface:"#111217", card:"#151821", border:"#2A2D35", text:"#F2F3F7", muted:"#A3A6AF", primary:"#FF4D4D" };
function __getTheme(scheme){ return scheme === "dark" ? __TH_DARK : __TH_LIGHT; }\n`;
    // place after last import
    const lastImport = code.lastIndexOf("import");
    const afterLastImport = code.indexOf("\n", lastImport) + 1;
    code = code.slice(0, afterLastImport) + helper + code.slice(afterLastImport);
  }

  // 4) Normalize theme lines near useColorScheme()
  // Remove any existing "const th =" or "const bg =" duplicates
  code = code.replace(/^[ \t]*const\s+th\s*=\s*[^;]+;\s*$/gm, "");
  code = code.replace(/^[ \t]*const\s+bg\s*=\s*[^;]+;\s*$/gm, "");

  // Insert canonical th/bg immediately after "const scheme = useColorScheme();"
  code = code.replace(/const\s+scheme\s*=\s*useColorScheme\(\);\s*/, (m)=> m + `  const th = __getTheme(scheme as any);\n  const bg = th.bg;\n`);

  // 5) SafeArea edges:
  if (isTabs) {
    // tabs: left/right only
    code = code.replace(/<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g, (_m,a,b)=>`<SafeAreaView${a}edges={["left","right"]}${b}>`);
  } else {
    // root: top/left/right only
    code = code.replace(/<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g, (_m,a,b)=>`<SafeAreaView${a}edges={["top","left","right"]}${b}>`);
  }

  // 6) Tabs bar colors/labels (if tabs file)
  if (isTabs) {
    // Ensure screenOptions block uses th tokens
    code = code.replace(/<Tabs\s*([^>]*)>/, (_m) =>
`<Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: th.surface, borderTopColor: th.border, height: 52 },
          tabBarActiveTintColor: th.primary,
          tabBarInactiveTintColor: th.muted,
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
          tabBarHideOnKeyboard: true
        }}>`);
  }

  // 7) StatusBar animated
  code = code.replace(/<StatusBar([^>]*?)\/>/g, (m)=> /animated/.test(m) ? m : m.replace(/\/>$/, " animated />"));

  fs.writeFileSync(f, code, "utf8");
  console.log("Patched:", relPath);
}

patchFile("app/_layout.tsx", false);
patchFile("app/(tabs)/_layout.tsx", true);
