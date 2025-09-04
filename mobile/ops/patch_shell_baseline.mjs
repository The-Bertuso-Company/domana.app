import fs from "fs";
import path from "path";

const file = process.argv[2];
if (!file) { console.error("Usage: node patcher <file>"); process.exit(1); }
if (!fs.existsSync(file)) { console.log("Skip: not found ->", file); process.exit(0); }

let code = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g, "-");
fs.copyFileSync(file, file + `.bak.${ts}`);

function ensureImport(line) {
  if (!code.includes(line)) code = line + "\n" + code;
}

// minimal imports (non-destructive)
ensureImport('import { StatusBar } from "expo-status-bar";');
ensureImport('import { SafeAreaView } from "react-native-safe-area-context";');
if (!code.includes("useColorScheme")) ensureImport('import { useColorScheme } from "react-native";');
if (!code.match(/from\s+"react-native".*View|import\s+\{\s*View\s*\}\s+from\s+"react-native"/))
  ensureImport('import { View } from "react-native";');

// add wrapper once
if (!code.includes("__DomanaBG")) {
  const idx = code.indexOf("export default");
  const insertAt = idx > -1 ? idx : code.length;
  const wrapper = `
/* --- Domana shell baseline wrapper (auto) --- */
const __DomanaBG = ({children}: any) => {
  const scheme = useColorScheme();
  const bg = scheme === "dark" ? "#0B0B0F" : "#FFFFFF";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top","left","right"]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} backgroundColor={bg} />
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        {children}
      </View>
    </SafeAreaView>
  );
};
`;
  code = code.slice(0, insertAt) + wrapper + code.slice(insertAt);
}

// wrap first <Slot /> (idempotent)
let before = code;
code = code.replace(/<Slot\s*\/>/, "<__DomanaBG><Slot /></__DomanaBG>");
if (before === code) {
  code = code.replace(/<Slot\s*\/\s*>/, "<__DomanaBG><Slot /></__DomanaBG>");
}

fs.writeFileSync(file, code, "utf8");
console.log("Patched:", path.relative(process.cwd(), file));
