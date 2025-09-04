const fs = require("fs");
const path = "package.json";
let raw = fs.readFileSync(path, "utf8");
raw = raw.replace(/^\uFEFF/, ""); // strip BOM
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};
pkg.scripts.test = "jest --passWithNoTests";
pkg.scripts["test:watch"] = "jest --watch";
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
console.log("✔ package.json scripts updated");
