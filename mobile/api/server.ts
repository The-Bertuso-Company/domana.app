import "dotenv/config";
import express from "express";
import { pool, sql } from "./db";
import { apiKeyAuth } from "./middleware/auth";

const app = express();
app.use(express.json());

// DB health
app.get("/health/db", async (_req, res) => {
  try { const r = await pool.query("select 1 as ok"); res.json({ ok: r.rows[0]?.ok === 1 }); }
  catch (e:any) { res.status(500).json({ ok:false, error: e.message }); }
});

// Crypto health (uses pgcrypto directly; no helper functions required)
app.get("/health/crypto", async (_req, res) => {
  try {
    const have = await pool.query("select to_regprocedure('pgp_sym_encrypt(text,text)') is not null as ok");
    if (!have.rows[0]?.ok) return res.status(500).json({ ok:false, error:"pgcrypto not installed" });
    const q = `
      select pgp_sym_decrypt(
               pgp_sym_encrypt('ok', current_setting('app.crypto_key')),
               current_setting('app.crypto_key')
             ) = 'ok' as ok
    `;
    const r = await pool.query(q);
    res.json({ ok: !!r.rows[0]?.ok });
  } catch (e:any) {
    res.status(500).json({ ok:false, error: e.message });
  }
});

// Minimal listings endpoint
app.get("/v1/listings", async (req, res) => {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  try {
    const r = await pool.query(
      `select id, status::text, intent::text, property_type::text,
              price_amount, price_currency, price_frequency::text,
              beds, baths, floor_area_sqm, lot_area_sqm,
              published_at, updated_at
         from listing
        order by updated_at desc
        limit $1`, [limit]
    );
    res.json({ items: r.rows });
  } catch (e:any) {
    res.status(400).json({ error:"bad_request", detail: e.message });
  }
});

// Owner (protected)
app.get("/v1/owners/:id", apiKeyAuth, async (req, res) => {
  try {
    const r = await sql("select id, full_name_or_entity, contact_email, contact_phone from owner_secure where id=$1", [req.params.id]);
    if (!r.length) return res.status(404).json({ error:"not_found" });
    res.json(r[0]);
  } catch (e:any) {
    res.status(500).json({ error:"owner_error", detail: e.message });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Domana API listening on http://localhost:${port}`));
