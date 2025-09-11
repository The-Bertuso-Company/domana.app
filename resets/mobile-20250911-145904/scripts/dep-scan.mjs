import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const project = process.cwd();
const pkg = JSON.parse(fs.readFileSync(path.join(project, "package.json"), "utf8"));
const existing = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (/\.(m?[jt]sx?)$/i.test(e.name)) out.push(f);
  }
  return out;
}

const roots = ["app", "src"];
const files = roots.flatMap((r) => walk(path.join(project, r)));
const specRe = /(?:import\s+(?:[^'"]+?\s+from\s+)?|require\s*\(|import\s*\()["']([^"']+)["']/g;

const specs = new Set();
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  let m;
  while ((m = specRe.exec(text))) {
    const s = m[1];
    if (!s || s.startsWith(".") || s.startsWith("@/")) continue;
    specs.add(s);
  }
}

function baseName(s) {
  if (s.startsWith("@")) {
    const parts = s.split("/");
    return parts.slice(0, 2).join("/");
  }
  return s.split("/")[0];
}

const ignore = new Set(["react", "react-native", "expo", "expo-router"]);
const wanted = new Set([...specs].map(baseName));
for (const k of ignore) wanted.delete(k);

let missing = [...wanted].filter((n) => !existing.has(n));

// Companion pairs you likely need together
const ensurePairs = [
  ["@tanstack/react-query", "@tanstack/query-core"],
];
for (const [a, b] of ensurePairs) {
  if ((missing.includes(a) || missing.includes(b)) && (!existing.has(a) || !existing.has(b))) {
    if (!missing.includes(a) && !existing.has(a)) missing.push(a);
    if (!missing.includes(b) && !existing.has(b)) missing.push(b);
  }
}

// Partition: Expo-managed vs other libs
const expoManaged = [];
const otherLibs = [];
for (const n of missing) {
  if (n.startsWith("expo-") || n.startsWith("@react-native/") || n.startsWith("react-native-")) {
    expoManaged.push(n);
  } else {
    otherLibs.push(n);
  }
}

// Opportunistically align analytics SDK version
if (!expoManaged.includes("expo-analytics-amplitude")) expoManaged.push("expo-analytics-amplitude");

function run(cmd) {
  console.log("> " + cmd);
  execSync(cmd, { stdio: "inherit", shell: true });
}

if (expoManaged.length) run("pnpm exec expo install " + expoManaged.join(" "));
if (otherLibs.length) run("pnpm add " + otherLibs.join(" "));

console.log("✅ Dependency scan complete.");
