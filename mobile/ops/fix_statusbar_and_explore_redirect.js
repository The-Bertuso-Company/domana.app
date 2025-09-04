const fs = require("fs");
const path = require("path");
const root = process.env.REPO_ROOT || "";
const mobile = path.join(root, "mobile");

function backupWrite(file, next) {
  if (!fs.existsSync(file)) return false;
  const ts = new Date().toISOString().replace(/[:.]/g,"-");
  fs.copyFileSync(file, file + ".bak."+ts);
  fs.writeFileSync(file, next, "utf8");
  return true;
}

/* A) Remove backgroundColor from StatusBar to avoid edge-to-edge warning */
(() => {
  const f = path.join(mobile, "app/_layout.tsx");
  if (!fs.existsSync(f)) return console.log("Skip: app/_layout.tsx not found");
  let code = fs.readFileSync(f, "utf8");
  const before = code;
  // Drop any backgroundColor prop on <StatusBar .../>
  code = code.replace(/<StatusBar([^>]*?)backgroundColor=\{[^}]+\}([^>]*?)\/>/g, "<StatusBar$1$2 />");
  code = code.replace(/<StatusBar([^>]*?)backgroundColor="[^"]+"([^>]*?)\/>/g, "<StatusBar$1$2 />");
  if (code !== before && backupWrite(f, code)) {
    console.log("StatusBar backgroundColor removed in:", path.relative(mobile, f));
  } else {
    console.log("StatusBar already clean or patch skipped");
  }
})();

/* B) Redirect the Explore tab to the actual Explore screen (if present) */
(() => {
  const tabsIndex = path.join(mobile, "app/(tabs)/index.tsx");
  if (!fs.existsSync(tabsIndex)) return console.log("Skip: (tabs)/index.tsx not found");

  // Look for likely explore routes
  const candidates = [
    { href: "/explore", file: path.join(mobile, "app/explore/index.tsx") },
    { href: "/explore", file: path.join(mobile, "app/explore.tsx") },
    { href: "/search",  file: path.join(mobile, "app/search/index.tsx") },
    { href: "/search",  file: path.join(mobile, "app/search.tsx") },
  ];
  const found = candidates.find(c => fs.existsSync(c.file));

  if (!found) {
    console.log("No dedicated /explore or /search route found; leaving placeholder.");
    return;
  }

  const content = `import { Redirect } from "expo-router";
export default function ExploreTab(){ return <Redirect href="${found.href}" />; }
`;
  backupWrite(tabsIndex, content);
  console.log("Explore tab now redirects to:", found.href);
})();
