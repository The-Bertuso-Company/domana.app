import "dotenv/config";
import express from "express";
import { pool, sql } from "./db";
import { apiKeyAuth } from "./middleware/auth";

const app = express();
app.use(express.json());

// Health: DB
app.get("/health/db", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 AS ok");
    res.json({ ok: r.rows[0]?.ok === 1 });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

// Health: Crypto (safe: catches when helpers missing)
app.get("/health/crypto", async (_req, res) => {
  try {
    const key = process.env.APP_CRYPTO_KEY || "localdev-secret";
    const r = await pool.query("select dec_key(enc_key('ok',$1),$1)='ok' as ok", [key]);
    res.json({ ok: !!r.rows[0]?.ok });
  } catch (e:any) {
    res.status(500).json({
      ok: false,
      error: e?.message || String(e),
      hint: "Ensure enc_key/dec_key helpers exist in DB"
    });
  }
});
  } catch (e: any) {
    res.status(500).json({
      ok: false,
      error: e?.message || String(e),
      hint: "Ensure enc/dec helpers exist and APP_CRYPTO_KEY is set",
    });
  }
});

// Simple listings endpoint (no filters to avoid SQL errors)
app.get("/v1/listings", async (_req, res) => {
  try {
    const r = await sql(`
      SELECT id, status::text, intent::text, property_type::text,
             price_amount, price_currency, price_frequency::text,
             beds, baths, floor_area_sqm, lot_area_sqm,
             published_at, updated_at
      FROM listing
      ORDER BY updated_at DESC
      LIMIT 50
    `);
    res.json({ count: r.length, items: r });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

// Protected owner read
app.get("/v1/owners/:id", apiKeyAuth, async (req, res) => {
  try {
    const rows = await sql(
      "SELECT id, full_name_or_entity, contact_email, contact_phone FROM owner WHERE id=$1",
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "not_found" });
    res.json(rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: "owner_error", detail: e?.message || String(e) });
  }
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => console.log(`Domana API listening on http://localhost:${port}`));

export default app;
