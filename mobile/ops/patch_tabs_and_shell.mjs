import fs from "fs";
import path from "path";

const root = process.env.REPO_ROOT;
const mobile = path.join(root, "mobile");

function backup(p) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const bak = p + ".bak." + ts;
  fs.copyFileSync(p, bak);
  return bak;
}

/* 1) Improve SafeArea + StatusBar in app/_layout.tsx without breaking providers */
(function patchRootLayout(){
  const file = path.join(mobile, "app/_layout.tsx");
  if (!fs.existsSync(file)) { console.log("Skip root patch: _layout.tsx not found"); return; }
  let code = fs.readFileSync(file, "utf8");
  const before = code;

  // Ensure imports
  const ensure = (imp) => { if (!code.includes(imp)) code = imp + "\n" + code; };
  ensure('import { StatusBar } from "expo-status-bar";');
  ensure('import { SafeAreaView } from "react-native-safe-area-context";');
  if (!code.includes("useColorScheme")) ensure('import { useColorScheme } from "react-native";');
  if (!code.match(/from\s+"react-native".*View|import\s+\{\s*View\s*\}\s+from\s+"react-native"/))
    ensure('import { View } from "react-native";');

  // If our wrapper exists, just normalize edges/bg/padding; else insert wrapper + wrap <Slot />
  if (!code.includes("__DomanaBG")) {
    const idx = code.indexOf("export default");
    const insertAt = idx > -1 ? idx : code.length;
    const wrapper = `
/* --- Domana shell baseline wrapper (auto) --- */
const __DomanaBG = ({children}: any) => {
  const scheme = useColorScheme();
  const bg = scheme === "dark" ? "#0B0B0F" : "#FFFFFF";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["top","bottom","left","right"]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} backgroundColor={bg} animated />
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        {children}
      </View>
    </SafeAreaView>
  );
};
`;
    code = code.slice(0, insertAt) + wrapper + code.slice(insertAt);
    code = code.replace(/<Slot\s*\/>/, "<__DomanaBG><Slot /></__DomanaBG>")
               .replace(/<Slot\s*\/\s*>/, "<__DomanaBG><Slot /></__DomanaBG>");
  } else {
    // Normalize existing wrapper: ensure bottom edge + animated status bar + background color variable
    code = code.replace(/edges=\{\[([^\]]*)\]\}/g, (m, inside) => {
      const want = '"top","bottom","left","right"';
      const hasAll = /top/.test(inside) && /bottom/.test(inside) && /left/.test(inside) && /right/.test(inside);
      return `edges={[${hasAll ? inside : want}]}`;
    });
    code = code.replace(/<StatusBar([^>]*?)\/>/g, (m) => {
      let out = m;
      if (!/animated/.test(out)) out = out.replace(/\/>$/, " animated />");
      return out;
    });
    if (!/const bg =/.test(code)) {
      code = code.replace(/useColorScheme\(\);?/, (mm) => `${mm}\n  const bg = scheme === "dark" ? "#0B0B0F" : "#FFFFFF";`);
      code = code.replace(/backgroundColor:\s*[^}\s]+/g, "backgroundColor: bg");
    }
  }

  if (code !== before) {
    const bak = backup(file);
    fs.writeFileSync(file, code, "utf8");
    console.log("Patched root layout:", path.relative(mobile, file), " (backup:", path.basename(bak), ")");
  } else {
    console.log("Root layout already OK");
  }
})();

/* 2) Replace tabs layout to enforce our IA (Explore, Activity, Sell, Pro, Me) */
(function patchTabsLayout(){
  const file = path.join(mobile, "app/(tabs)/_layout.tsx");
  if (!fs.existsSync(file)) { console.log("Skip tabs patch: (tabs)/_layout.tsx not found"); return; }
  const bak = backup(file);

  const content = `import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const scheme = useColorScheme();
  const bg = scheme === "dark" ? "#0B0B0F" : "#FFFFFF";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={["left","right","bottom"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: bg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Explore" }} />
        <Tabs.Screen name="activity/index" options={{ title: "Activity" }} />
        <Tabs.Screen name="sell/index" options={{ title: "Sell" }} />
        <Tabs.Screen name="pro/index" options={{ title: "Pro" }} />
        <Tabs.Screen name="me/index" options={{ title: "Me" }} />
        {/** dev and saved intentionally omitted from tab bar */}
      </Tabs>
    </SafeAreaView>
  );
}
`;
  fs.writeFileSync(file, content, "utf8");
  console.log("Patched tabs layout:", path.relative(mobile, file), " (backup:", path.basename(bak), ")");
})();

/* 3) Ensure placeholder screens exist for activity & me so tabs render */
(function ensurePlaceholders(){
  const mk = (rel, title) => {
    const p = path.join(mobile, "app/(tabs)", rel);
    const dir = path.dirname(p);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(p)) {
      const s = `import { View, Text } from "react-native";
export default function Screen(){ return (<View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>${title} (coming soon)</Text></View>); }
`;
      fs.writeFileSync(p, s, "utf8");
      console.log("Created:", path.relative(mobile, p));
    } else {
      console.log("Exists:", path.relative(mobile, p));
    }
  };
  mk("activity/index.tsx", "Activity");
  mk("me/index.tsx", "Me");
})();
