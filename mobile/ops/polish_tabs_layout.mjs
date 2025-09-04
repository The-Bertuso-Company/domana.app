import fs from "fs";
import path from "path";
const root = process.env.REPO_ROOT!;
const mobile = path.join(root, "mobile");
const file = path.join(mobile, "app/(tabs)/_layout.tsx");
if (!fs.existsSync(file)) { console.log("Skip: (tabs)/_layout.tsx not found"); process.exit(0); }
let code = fs.readFileSync(file, "utf8");
const ts = new Date().toISOString().replace(/[:.]/g,"-");
fs.copyFileSync(file, file + ".bak."+ts);

// ensure imports
if (!code.includes('@expo/vector-icons')) {
  code = 'import { Ionicons } from "@expo/vector-icons";\n' + code;
}
if (!code.includes('ui/tokens')) {
  const rel = "../../ui/tokens";
  code = `import { getTheme } from "${rel}";\n` + code;
}

// inject theme + styled tab bar + icons
code = code.replace(/export default function TabLayout\(\)\s*\{([\s\S]*?)return\s*\(/, (m, pre) => {
  let head = `export default function TabLayout(){\n  const scheme = useColorScheme();\n  const th = getTheme(scheme as any);\n`;
  return head + "  return (";
});

// style the SafeAreaView + Tabs options
code = code.replace(/<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/, (_m, a, b) =>
  `<SafeAreaView${a}edges={["left","right"]}${b}>`
);

// build a standard screenOptions block
code = code.replace(/<Tabs\s*([\s\S]*?)>/, (_m) => {
  return `<Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: th.surface, borderTopColor: th.border, height: 56 },
          tabBarActiveTintColor: th.primary,
          tabBarInactiveTintColor: th.muted,
          tabBarIcon: ({ color, size }) => {
            const name =
              route.name === "index" ? "search-outline" :
              route.name === "activity/index" ? "time-outline" :
              route.name === "sell/index" ? "pricetag-outline" :
              route.name === "pro/index" ? "briefcase-outline" :
              "person-outline";
            return <Ionicons name={name as any} size={size} color={color} />;
          },
        })}>`;
});

// ensure exactly 5 tabs remain
code = code.replace(/<Tabs\.Screen[\s\S]*?name="dev"[\s\S]*?\/>\n?/g, "");
code = code.replace(/<Tabs\.Screen[\s\S]*?name="saved"[\s\S]*?\/>\n?/g, "");

fs.writeFileSync(file, code, "utf8");
console.log("Patched tabs:", path.relative(mobile, file));
