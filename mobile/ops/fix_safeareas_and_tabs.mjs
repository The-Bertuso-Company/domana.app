import fs from "fs";
import path from "path";

const root   = process.env.REPO_ROOT;
const mobile = path.join(root, "mobile");
const p = (...segs) => path.join(mobile, ...segs);

function exists(f){ return fs.existsSync(f); }
function bakWrite(file, next){
  if (!exists(file)) return false;
  const ts = new Date().toISOString().replace(/[:.]/g,"-");
  fs.copyFileSync(file, file + ".bak." + ts);
  fs.writeFileSync(file, next, "utf8");
  return true;
}

/* 1) Root SafeArea: top/left/right only (avoid huge Android bottom inset) */
(() => {
  const f = p("app/_layout.tsx");
  if (!exists(f)) return console.log("Skip: app/_layout.tsx not found");
  let code = fs.readFileSync(f, "utf8");

  // Ensure our wrapper exists (from prior patch). If not, just normalize any SafeAreaView it finds.
  // Normalize edges prop to top,left,right only.
  code = code.replace(
    /<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g,
    (m, a, b) => `<SafeAreaView${a}edges={["top","left","right"]}${b}>`,
  );
  // If there was no edges prop, add one on first SafeAreaView.
  if (!/edges=\{\[/.test(code)) {
    code = code.replace(/<SafeAreaView([^>]*)>/, `<SafeAreaView$1 edges={["top","left","right"]}>`);
  }

  // StatusBar: keep animated, ensure style is light/dark but don't set translucent.
  code = code.replace(/<StatusBar([^>]*?)\/>/g, (m, attrs) => {
    let out = m;
    if (!/animated/.test(out)) out = out.replace(/\/>$/, " animated />");
    return out;
  });

  bakWrite(f, code) && console.log("Patched:", path.relative(mobile, f));
})();

/* 2) Tabs SafeArea: left/right only + tabBar tweaks + ensure exactly 5 tabs */
(() => {
  const f = p("app","(tabs)","_layout.tsx");
  if (!exists(f)) return console.log("Skip: (tabs)/_layout.tsx not found");
  let code = fs.readFileSync(f, "utf8");

  // SafeArea left/right only
  code = code.replace(
    /<SafeAreaView([^>]*?)edges=\{\[[^\]]*\]\}([^>]*)>/g,
    (m, a, b) => `<SafeAreaView${a}edges={["left","right"]}${b}>`,
  );
  if (!/edges=\{\[/.test(code)) {
    code = code.replace(/<SafeAreaView([^>]*)>/, `<SafeAreaView$1 edges={["left","right"]}>`);
  }

  // Ensure screenOptions include tabBarHideOnKeyboard and a sane height
  if (/screenOptions=\{\{[^}]*\}\}/.test(code)) {
    code = code.replace(/screenOptions=\{\{([\s\S]*?)\}\}/, (m, inner) => {
      let i = inner;
      if (!/tabBarHideOnKeyboard/.test(i)) i = `tabBarHideOnKeyboard: true, ${i}`;
      // ensure tabBarStyle has height ~56 and no extra padding
      if (/tabBarStyle:\s*\{[\s\S]*?\}/.test(i)) {
        i = i.replace(/tabBarStyle:\s*\{([\s\S]*?)\}/, (mm, style) => {
          let s = style;
          if (!/height:/.test(s)) s = `height: 56, ${s}`;
          s = s.replace(/paddingBottom:\s*\d+,?/g, ""); // remove paddingBottom if present
          return `tabBarStyle: { ${s} }`;
        });
      } else {
        i = `tabBarStyle: { height: 56 }, ${i}`;
      }
      return `screenOptions={{ ${i} }}`;
    });
  }

  bakWrite(f, code) && console.log("Patched:", path.relative(mobile, f));
})();

/* 3) Remove dev/saved from the tab bar by moving those files out of (tabs) */
(() => {
  const tabsDir = p("app","(tabs)");
  const devInTabs   = p("app","(tabs)","dev.tsx");
  const savedInTabs = p("app","(tabs)","saved.tsx");

  // DEV -> app/dev/index.tsx (if index exists already, just delete tabs/dev)
  if (exists(devInTabs)) {
    const devOutDir = p("app","dev");
    const devOut = p("app","dev","index.tsx");
    if (!exists(devOutDir)) fs.mkdirSync(devOutDir, { recursive: true });
    if (!exists(devOut)) {
      fs.copyFileSync(devInTabs, devOut);
      console.log("Moved dev tab to:", path.relative(mobile, devOut));
    }
    fs.rmSync(devInTabs);
    console.log("Removed:", path.relative(mobile, devInTabs));
  }

  // SAVED -> app/saved/index.tsx (keep /saved area but not in tabs)
  if (exists(savedInTabs)) {
    const savedOutDir = p("app","saved");
    const savedOut = p("app","saved","index.tsx");
    if (!exists(savedOutDir)) fs.mkdirSync(savedOutDir, { recursive: true });
    if (!exists(savedOut)) {
      fs.copyFileSync(savedInTabs, savedOut);
      console.log("Moved saved tab to:", path.relative(mobile, savedOut));
    }
    fs.rmSync(savedInTabs);
    console.log("Removed:", path.relative(mobile, savedInTabs));
  }
})();
