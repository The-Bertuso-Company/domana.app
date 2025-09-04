const fs=require("fs"); const p="package.json";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
j.scripts = j.scripts || {};
j.scripts["api:dev"] = "ts-node-dev --respawn --transpile-only api/server.ts";
j.scripts["migrate"] = "node ops/migrate/run_migrations.js";
j.scripts["bootstrap:owner"] = "node ops/init/bootstrap_owner.js";
fs.writeFileSync(p, JSON.stringify(j,null,2));
console.log("package.json scripts updated.");
