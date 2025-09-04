const fs = require("fs");
const path = require("path");
const root   = process.env.REPO_ROOT || "";
const mobile = path.join(root, "mobile");

function backupWrite(file, next) {
  if (!fs.existsSync(file)) return false;
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  fs.copyFileSync(file, file + ".bak." + ts);
  fs.writeFileSync(file, next, "utf8");
  return true;
}

/* A) Patch app/_layout.tsx to use DS theme bg and keep top/left/right safe areas */
(() => {
  const f = path.join(mobile, "app/_layout.tsx");
  if (!fs.existsSync(f)) return console.log("Skip: app/_layout.tsx not found");
  let code = fs.readFileSync(f, "utf8");
  const before = code;

  // Ensure import
  if (!code.includes("ui/tokens")) {
    code = `import { getTheme } from "../ui/tokens";\n` + code;
  }

  // If our wrapper exists, convert to theme bg.
  if (/__DomanaBG/.test(code)) {
    // Insert th from scheme; replace any existing const bg = ...
    code = code.replace(/const\s+scheme\s*=\s*useColorScheme\(\);\s*/,
      (m) => m + `  const th = getTheme(scheme as any);\n  const bg = th.bg;\n`
    );
    code = code.replace(/const\s+bg\s*=\s*[^;]+;/, `const th = getTheme(scheme as any);\n  const bg = th.bg;`);
    // SafeArea edges: top/left/right only
    code = code.replace(/<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g,
      (m, a, b) => `<SafeAreaView${a}edges={["top","left","right"]}${b}>`
    );
  }

  if (code !== before && backupWrite(f, code)) {
    console.log("Patched root:", path.relative(mobile, f));
  } else {
    console.log("Root already themed or patch skipped");
  }
})();

/* B) Replace tabs layout with a themed, compact, label-forward version (no extra deps) */
(() => {
  const f = path.join(mobile, "app/(tabs)/_layout.tsx");
  if (!fs.existsSync(f)) return console.log("Skip: (tabs)/_layout.tsx not found");
  const content = `import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { getTheme } from "../../ui/tokens";

export default function TabLayout() {
  const scheme = useColorScheme();
  const th = getTheme(scheme as any);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: th.bg }} edges={["left","right"]}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: th.surface, borderTopColor: th.border, height: 52 },
          tabBarActiveTintColor: th.primary,
          tabBarInactiveTintColor: th.muted,
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
          tabBarHideOnKeyboard: true
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Explore" }} />
        <Tabs.Screen name="activity/index" options={{ title: "Activity" }} />
        <Tabs.Screen name="sell/index" options={{ title: "Sell" }} />
        <Tabs.Screen name="pro/index" options={{ title: "Pro" }} />
        <Tabs.Screen name="me/index" options={{ title: "Me" }} />
      </Tabs>
    </SafeAreaView>
  );
}
`;
  backupWrite(f, content);
  console.log("Patched tabs:", path.relative(mobile, f));
})();
