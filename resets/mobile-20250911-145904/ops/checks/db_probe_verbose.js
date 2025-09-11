require("dotenv").config();
const { Client } = require("pg");

(async () => {
  const url = process.env.DATABASE_URL || "";
  const ssl =
    process.env.PGSSL_NO_VERIFY === "1" ||
    process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0" ||
    url.includes("supabase.co")
      ? { rejectUnauthorized: false }
      : undefined;

  const c = new Client({ connectionString: url, ssl });
  try {
    await c.connect();
    const r = await c.query("select current_user u, current_database() d, inet_server_addr() a");
    console.log("Connected:", r.rows[0]);
  } catch (e) {
    console.error("\n=== PROBE ERROR (top-level) ===");
    console.error(e?.message || String(e));
    if (e?.code) console.error("code:", e.code);

    // If it's an AggregateError, dump inner errors
    const errs = e?.errors;
    if (Array.isArray(errs) && errs.length) {
      console.error("\n--- inner errors ---");
      for (const err of errs) {
        console.error("-", err?.message || String(err));
        if (err?.code) console.error("  code:", err.code);
      }
    }
    console.error("---------------------\n");
  } finally {
    await c.end().catch(()=>{});
  }
})();
