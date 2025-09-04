const fs = require("fs");
const path = require("path");
const root = process.env.REPO_ROOT || "";
const mobile = path.join(root, "mobile");

function* walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) yield* walk(p);
    else if (/\.(tsx)$/.test(name)) yield p;
  }
}

function backupWrite(file, next) {
  const ts = new Date().toISOString().replace(/[:.]/g,"-");
  fs.copyFileSync(file, file + ".bak." + ts);
  fs.writeFileSync(file, next, "utf8");
}

const candidates = [];
for (const f of walk(mobile)) {
  const txt = fs.readFileSync(f, "utf8");
  // Heuristics: listing rows with price/body meta often include these strings
  if (/(Verified\s*\d|Tags:\s*demo|sqft|bd\s*•\s*ba)/i.test(txt)) {
    candidates.push({ f, score: (txt.match(/Verified|sqft|bd|Tags:/g)||[]).length });
  }
}
candidates.sort((a,b)=>b.score-a.score);

if (!candidates.length) { console.log("No card-like TSX found — skipped."); process.exit(0); }

let patchedAny = false;

for (const { f } of candidates.slice(0, 3)) { // try top 3 likely files
  let code = fs.readFileSync(f, "utf8");
  const before = code;

  // Ensure imports
  if (!/from "react-native";/.test(code)) {
    code = `import { View, useColorScheme } from "react-native";\n` + code;
  } else {
    // add View/useColorScheme if missing
    code = code.replace(/from "react-native";/,
      (m)=> (code.includes("useColorScheme") ? m : m.replace('from "react-native";','from "react-native";')) );
    if (!/useColorScheme/.test(code)) {
      code = code.replace(/import\s*\{([^}]+)\}\s*from\s*"react-native";/,
        (m,g)=>`import { ${g.trim()}, useColorScheme } from "react-native";`);
    }
    if (!/View/.test(code)) {
      code = code.replace(/import\s*\{([^}]+)\}\s*from\s*"react-native";/,
        (m,g)=>`import { ${g.trim()}, View } from "react-native";`);
    }
  }

  // Inject tiny inline theme helper once (same as in layouts)
  if (!/function __getTheme/.test(code)) {
    const helper =
`\n/* --- inline DS theme (auto) --- */
const __TH_LIGHT = { bg:"#FFFFFF", surface:"#F7F7FA", card:"#FFFFFF", border:"#E6E6EB", text:"#0B0B0F", muted:"#6B6B76", primary:"#E53935" };
const __TH_DARK  = { bg:"#0B0B0F", surface:"#111217", card:"#151821", border:"#2A2D35", text:"#F2F3F7", muted:"#A3A6AF", primary:"#FF4D4D" };
function __getTheme(scheme){ return scheme === "dark" ? __TH_DARK : __TH_LIGHT; }
const __domCard = (th)=>({ backgroundColor: th.card, borderColor: th.border, borderWidth: 1, borderRadius: 12, padding: 12, marginHorizontal: 12, marginVertical: 8 });
const __domMuted = (th)=>({ color: th.muted });
`;
    // place after last import
    const lastImport = code.lastIndexOf("import");
    const afterLastImport = code.indexOf("\n", lastImport) + 1;
    code = code.slice(0, afterLastImport) + helper + code.slice(afterLastImport);
  }

  // For the default-exported component that contains the listing text, inject theme + wrapper
  // Insert th/bg after the first "const scheme = useColorScheme();"
  if (/useColorScheme\(\)/.test(code)) {
    code = code.replace(/const\s+scheme\s*=\s*useColorScheme\(\);\s*/,
      (m)=> m + `  const th = __getTheme(scheme as any);\n`);
  } else {
    // add scheme+theme near top of component body
    code = code.replace(/export\s+default\s+function[^{]+\{\s*/,
      (m)=> m + `  const scheme = useColorScheme();\n  const th = __getTheme(scheme as any);\n`);
  }

  // Wrap the FIRST return JSX with our card container (non-destructive)
  let changed = false;
  code = code.replace(/return\s*\(\s*\n/, (m)=>{ changed=true; return m + '    <View style={__domCard(th)}>\n'; });
  if (changed) {
    // close wrapper before the closing );
    // Find the last occurrence of ");" at the same function return level is hard; do a safe replace of the first ")." pattern
    code = code.replace(/\)\s*;\s*$/, (m)=>'    </View>\n' + m);
  }

  // Light text polish: any "Tags:" / "sqft" line gets muted color by simple style merges
  code = code.replace(/<Text([^>]*)>([^<]*Tags?:[^<]*)<\/Text>/g, (_m, attrs, text) =>
    `<Text${attrs} style={[${/style=/.test(attrs) ? attrs.match(/style=\{([^}]+)\}/)[1] : ""}${/style=/.test(attrs)?", ":""}__domMuted(th)]}>${text}</Text>`
  );
  code = code.replace(/<Text([^>]*)>([^<]*sqft[^<]*)<\/Text>/gi, (_m, attrs, text) =>
    `<Text${attrs} style={[${/style=/.test(attrs) ? attrs.match(/style=\{([^}]+)\}/)[1] : ""}${/style=/.test(attrs)?", ":""}__domMuted(th)]}>${text}</Text>`
  );

  if (code !== before) {
    backupWrite(f, code);
    console.log("Polished card in:", path.relative(mobile, f));
    patchedAny = true;
  }
}

if (!patchedAny) console.log("Found candidates but skipped (no safe patch points).");
