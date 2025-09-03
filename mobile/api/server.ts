import "dotenv/config";
import express from "express";
import { pool } from "./db";
import { apiKeyAuth } from "./middleware/auth";

const app = express();
app.use(express.json());

const CRYPTO_KEY = process.env.APP_CRYPTO_KEY || "localdev-secret";

/* === Health: DB === */
app.get("/health/db", async (_req, res) => {
  try {
    const r = await pool.query("select 1 as ok");
    res.json({ ok: r.rows[0]?.ok === 1 });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

/* === Health: Crypto (pgcrypto direct) === */
app.get("/health/crypto", async (_req, res) => {
  try {
    const have = await pool.query(
      "select to_regprocedure('pgp_sym_encrypt(text,text)') is not null as ok"
    );
    if (!have.rows[0]?.ok) {
      return res.status(500).json({ ok: false, error: "pgcrypto not installed" });
    }
    const r = await pool.query(
      "select pgp_sym_decrypt(pgp_sym_encrypt('ok',$1), $1)='ok' as ok",
      [CRYPTO_KEY]
    );
    res.json({ ok: !!r.rows[0]?.ok });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

/* === /v1/listings with filters === */
app.get("/v1/listings", async (req, res) => {
  const q = req.query as Record<string, string>;
  const limit = Math.max(1, Math.min(100, Number(q.limit) || 20));
  const page = Math.max(1, Number(q.page) || 1);
  const offset = (page - 1) * limit;

  const where: string[] = [];
  const params: any[] = [];
  let i = 1;
  const add = (sql: string, v: any) => { where.push(sql.replace(/\$\d+/g, `$${i}`)); params.push(v); i++; };

  if (q.status)        add("status = $1::listing_status", q.status);
  if (q.intent)        add("intent = $1::listing_intent", q.intent);
  if (q.property_type) add("property_type = $1::property_type", q.property_type);
  if (q.city)          add("city ILIKE $1", `%${q.city}%`);
  if (q.province)      add("province ILIKE $1", `%${q.province}%`);
  if (q.min_price)     add("price_amount >= $1", Number(q.min_price));
  if (q.max_price)     add("price_amount <= $1", Number(q.max_price));
  if (q.search) {
    const s = `%${q.search}%`;
    where.push(`(address_text ILIKE $${i} OR city ILIKE $${i} OR province ILIKE $${i})`);
    params.push(s); i++;
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sql = `
    SELECT id, status::text, intent::text, property_type::text,
           price_amount, price_currency, price_frequency::text,
           beds, baths, floor_area_sqm, lot_area_sqm,
           address_text, city, province, postal_code,
           published_at, updated_at
      FROM listing
      ${whereSql}
     ORDER BY updated_at DESC
     LIMIT ${limit} OFFSET ${offset}
  `;
  try {
    const r = await pool.query(sql, params);
    res.json({ page, limit, items: r.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* === Owner (protected) — try table, fallback to view === */
app.get("/v1/owners/:id", apiKeyAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const r = await pool.query(
      "select id, full_name_or_entity, contact_email, contact_phone from owner where id=$1",
      [id]
    );
    if (r.rows.length) return res.json(r.rows[0]);
  } catch (e: any) {
    if (e?.code !== "42P01") {
      return res.status(500).json({ error: "owner_error", detail: e?.message || String(e) });
    }
  }

  try {
    const r2 = await pool.query(
      "select id, full_name_or_entity, contact_email, contact_phone from owner_secure where id=$1",
      [id]
    );
    if (r2.rows.length) return res.json(r2.rows[0]);
    return res.status(404).json({ error: "not_found" });
  } catch (e2: any) {
    return res.status(500).json({ error: "owner_error", detail: e2?.message || String(e2) });
  }
});

/* === Media === */
app.get("/v1/listings/:id/media", async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, kind, url, width, height, sort_order, meta, created_at, updated_at
         FROM media WHERE listing_id=$1 ORDER BY sort_order, created_at`,
      [req.params.id]
    );
    res.json({ items: r.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

app.post("/v1/listings/:id/media", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  try {
    const r = await pool.query(
      `INSERT INTO media (listing_id, kind, url, width, height, sort_order, meta)
       VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7::jsonb,'{}'::jsonb))
       RETURNING *`,
      [req.params.id, b.kind, b.url, b.width, b.height, b.sort_order ?? 0, JSON.stringify(b.meta ?? {})]
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* === Saved Searches === */
app.get("/v1/saved-searches", async (req, res) => {
  try {
    const actor = (req.query.actor_id as string) || null;
    const r = await pool.query(
      `SELECT * FROM saved_search
       WHERE ($1::text IS NULL OR actor_id=$1)
       ORDER BY updated_at DESC`,
      [actor]
    );
    res.json({ items: r.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

app.post("/v1/saved-searches", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  try {
    const r = await pool.query(
      `INSERT INTO saved_search (actor_id, name, params, is_alert, cadence)
       VALUES ($1,$2,COALESCE($3::jsonb,'{}'::jsonb),$4,COALESCE($5,'instant'))
       RETURNING *`,
      [b.actor_id, b.name ?? null, JSON.stringify(b.params ?? {}), !!b.is_alert, b.cadence]
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* === Saved Homes === */
app.get("/v1/saved-homes", async (req, res) => {
  try {
    const actor = (req.query.actor_id as string) || null;
    const r = await pool.query(
      `SELECT sh.*, l.property_type::text, l.price_amount, l.city, l.province
         FROM saved_home sh
         JOIN listing l ON l.id = sh.listing_id
        WHERE ($1::text IS NULL OR sh.actor_id=$1)
        ORDER BY sh.updated_at DESC`,
      [actor]
    );
    res.json({ items: r.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

app.post("/v1/saved-homes", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  try {
    const r = await pool.query(
      `INSERT INTO saved_home (actor_id, listing_id, note, tags)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (actor_id, listing_id)
       DO UPDATE SET note=EXCLUDED.note, tags=EXCLUDED.tags, updated_at=now()
       RETURNING *`,
      [b.actor_id, b.listing_id, b.note ?? null, b.tags ?? []]
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

app.delete("/v1/saved-homes/:id", apiKeyAuth, async (req, res) => {
  try {
    await pool.query(`DELETE FROM saved_home WHERE id=$1`, [req.params.id]);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* === Threads & Messages === */
app.post("/v1/threads", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  try {
    const r = await pool.query(
      `INSERT INTO thread (subject, created_by, listing_id)
       VALUES ($1,$2,$3) RETURNING *`,
      [b.subject ?? null, b.created_by, b.listing_id ?? null]
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

app.get("/v1/threads/:id/messages", async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT * FROM message WHERE thread_id=$1 ORDER BY sent_at`,
      [req.params.id]
    );
    res.json({ items: r.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

app.post("/v1/threads/:id/messages", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  try {
    const r = await pool.query(
      `INSERT INTO message (thread_id, sender, body)
       VALUES ($1,$2,$3) RETURNING *`,
      [req.params.id, b.sender, b.body]
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* === Tours (robust + tiny QoL endpoints) === */

/* List tours (filters: created_by, status, from, to) */
app.get("/v1/tours", apiKeyAuth, async (req, res) => {
  const q = req.query as Record<string, string>;
  const limit = Math.max(1, Math.min(100, Number(q.limit) || 20));
  const page = Math.max(1, Number(q.page) || 1);
  const offset = (page - 1) * limit;

  const where: string[] = [];
  const params: any[] = [];
  let i = 1;
  const add = (sql: string, v: any) => {
    where.push(sql.replace(/\$\d+/g, `$${i}`));
    params.push(v); i++;
  };

  if (q.created_by) add("created_by = $1", q.created_by);
  if (q.status)     add("status::text = $1", q.status);
  if (q.from)       add("start_time >= $1::timestamptz", q.from);
  if (q.to)         add("start_time <= $1::timestamptz", q.to);

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const sql = `
    SELECT id, created_by, status::text AS status, start_time, notes, created_at, updated_at
      FROM tour
      ${whereSql}
     ORDER BY start_time DESC
     LIMIT ${limit} OFFSET ${offset}
  `;

  try {
    const r = await pool.query(sql, params);
    res.json({ page, limit, items: r.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* Create tour (accept both start_time/scheduled_start; created_by/organizer_id) */
app.post("/v1/tours", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  try {
    const createdBy = b.created_by || b.organizer_id || "DEVUSER";
    const start = b.start_time || b.scheduled_start || null;
    const status = b.status || "scheduled";
    const notes = b.notes ?? null;

    if (!start) {
      return res.status(400).json({ error: "bad_request", detail: "start_time or scheduled_start required" });
    }

    const r = await pool.query(
      `INSERT INTO tour (created_by, status, start_time, notes)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [createdBy, status, start, notes],
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* Get tour with stops */
app.get("/v1/tours/:id", async (req, res) => {
  try {
    const t = await pool.query(`SELECT * FROM tour WHERE id=$1`, [req.params.id]);
    if (!t.rows.length) return res.status(404).json({ error: "not_found" });
    const s = await pool.query(
      `SELECT * FROM tour_stop WHERE tour_id=$1 ORDER BY order_num, created_at`,
      [req.params.id],
    );
    res.json({ tour: t.rows[0], stops: s.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* Update tour (status/start_time/notes; accepts start_time OR scheduled_start) */
app.patch("/v1/tours/:id", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  try {
    const start = b.start_time || b.scheduled_start || null;
    const r = await pool.query(
      `UPDATE tour SET
         status = COALESCE($2,status),
         start_time = COALESCE($3,start_time),
         notes = COALESCE($4,notes),
         updated_at = now()
       WHERE id=$1
       RETURNING *`,
      [req.params.id, b.status ?? null, start, b.notes ?? null],
    );
    if (!r.rows.length) return res.status(404).json({ error: "not_found" });
    res.json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* Transition status (DB-driven; auto-set end_time for terminal states) */
app.post("/v1/tours/:id/status", apiKeyAuth, async (req, res) => {
  try {
    const nsRaw = req.body?.new_status;
    if (!nsRaw || typeof nsRaw !== "string") {
      return res.status(400).json({ error: "bad_request", detail: "new_status required" });
    }
    const ns = nsRaw.trim();

    // If transitioning to a terminal state, set end_time automatically (once).
    const lower = ns.toLowerCase();
    const setsEnd = ["completed","complete","done","closed","finished","cancelled","canceled","ended"].includes(lower);

    const r = await pool.query(
      `UPDATE tour
          SET status   = $2,
              end_time = CASE WHEN $3 THEN COALESCE(end_time, now()) ELSE end_time END,
              updated_at = now()
        WHERE id = $1
        RETURNING *`,
      [req.params.id, ns, setsEnd],
    );
    if (!r.rows.length) return res.status(404).json({ error: "not_found" });
    res.json(r.rows[0]);
  } catch (e: any) {
    // Surface the DB reason (e.g., check constraint) so we can see the exact rule text
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});


/* Create stop (validates tour + listing; auto order if missing) */
app.post("/v1/tours/:id/stops", apiKeyAuth, async (req, res) => {
  const b = req.body || {};
  const tourId = req.params.id;
  try {
    if (!b.listing_id) {
      return res.status(400).json({ error: "bad_request", detail: "listing_id required" });
    }

    const t = await pool.query(`SELECT 1 FROM tour WHERE id=$1`, [tourId]);
    if (!t.rows.length) return res.status(404).json({ error: "tour_not_found" });

    const l = await pool.query(`SELECT 1 FROM listing WHERE id=$1`, [b.listing_id]);
    if (!l.rows.length) return res.status(404).json({ error: "listing_not_found" });

    let order = b.order_num;
    if (order === undefined || order === null) {
      const next = await pool.query(
        `SELECT COALESCE(MAX(order_num),0)+1 AS next FROM tour_stop WHERE tour_id=$1`,
        [tourId],
      );
      order = Number(next.rows[0].next) || 1;
    }

    const r = await pool.query(
      `INSERT INTO tour_stop (tour_id, listing_id, order_num, eta)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [tourId, b.listing_id, order, b.eta ?? null],
    );
    res.status(201).json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* Update stop (order_num, eta) */
app.patch("/v1/tours/:id/stops/:stopId", apiKeyAuth, async (req, res) => {
  try {
    const r = await pool.query(
      `UPDATE tour_stop SET
         order_num = COALESCE($3, order_num),
         eta       = COALESCE($4, eta),
         updated_at= now()
       WHERE id=$2 AND tour_id=$1
       RETURNING *`,
      [req.params.id, req.params.stopId, req.body?.order_num ?? null, req.body?.eta ?? null],
    );
    if (!r.rows.length) return res.status(404).json({ error: "not_found" });
    res.json(r.rows[0]);
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* Resequence stops to 1..N (by order_num, created_at) */
app.post("/v1/tours/:id/stops/resequence", apiKeyAuth, async (req, res) => {
  try {
    const r = await pool.query(
      `WITH ranked AS (
         SELECT id, row_number() OVER (ORDER BY order_num, created_at) rn
           FROM tour_stop
          WHERE tour_id=$1
       )
       UPDATE tour_stop t
          SET order_num = ranked.rn, updated_at = now()
         FROM ranked
        WHERE t.id = ranked.id
       RETURNING t.*`,
      [req.params.id],
    );
    res.json({ items: r.rows });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* Delete stop */
app.delete("/v1/tours/:id/stops/:stopId", apiKeyAuth, async (req, res) => {
  try {
    const r = await pool.query(
      `DELETE FROM tour_stop WHERE id=$1 AND tour_id=$2 RETURNING id`,
      [req.params.stopId, req.params.id],
    );
    if (!r.rows.length) return res.status(404).json({ error: "not_found" });
    res.json({ ok: true, id: r.rows[0].id });
  } catch (e: any) {
    res.status(400).json({ error: "bad_request", detail: e?.message || String(e) });
  }
});

/* === Dev: DB patch — ensure tour.row_version exists (idempotent) === */
app.post("/dev/db/patch-row-version", apiKeyAuth, async (_req, res) => {
  try {
    await pool.query(`
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = 'tour'
       AND column_name = 'row_version'
  ) THEN
    ALTER TABLE public.tour
      ADD COLUMN row_version integer NOT NULL DEFAULT 1;
    UPDATE public.tour SET row_version = COALESCE(row_version, 1);
  END IF;
END $$;
    `);

    const chk = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
       WHERE table_schema='public' AND table_name='tour' AND column_name='row_version'
    `);

    res.json({ ok: true, column: chk.rows[0] || null });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

/* Dev: show the tour status check constraint and parsed allowed values */
app.get("/dev/db/tour-status-allowed", apiKeyAuth, async (_req, res) => {
  try {
    const r = await pool.query(`
      SELECT pg_get_constraintdef(c.oid) AS def
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        JOIN pg_namespace n ON n.oid = t.relnamespace
       WHERE n.nspname='public' AND t.relname='tour' AND c.conname='tour_status_chk'
    `);
    const def = r.rows[0]?.def ?? null;
    let allowed: string[] = [];
    if (def) {
      // Try patterns: IN ('a','b',...) OR ARRAY['a','b',...]
      const m = def.match(/\((?:status\s*IN\s*)\((.*?)\)\)/) || def.match(/ARRAY\[(.*?)\]/);
      if (m?.[1]) {
        allowed = m[1].split(",").map(s => s.replace(/::[a-z_]+/gi,"").replace(/'/g,"").trim());
      }
    }
    res.json({ def, allowed });
  } catch (e: any) {
    res.status(500).json({ error: "inspect_error", detail: e?.message || String(e) });
  }
});

/* === Dev: bootstrap Phase 4 tables (idempotent) === */
app.post("/dev/db/bootstrap-phase4", apiKeyAuth, async (_req, res) => {
  try {
    await pool.query(`
      -- Minimal listing table so stops can validate listing_id
      CREATE TABLE IF NOT EXISTS listing (
        id text PRIMARY KEY
      );
      INSERT INTO listing (id) VALUES ('LISTING_DEV001') ON CONFLICT (id) DO NOTHING;

      -- tour table (with DB-generated ids and status check)
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='tour') THEN
          CREATE TABLE tour (
            id           text PRIMARY KEY DEFAULT ('TOUR_' || encode(gen_random_bytes(8), 'hex')),
            created_by   text        NOT NULL,
            status       text        NOT NULL DEFAULT 'draft',
            start_time   timestamptz NOT NULL,
            end_time     timestamptz,
            notes        text,
            row_version  integer     NOT NULL DEFAULT 1,
            created_at   timestamptz NOT NULL DEFAULT now(),
            updated_at   timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT tour_status_chk CHECK (status IN ('draft','scheduled','done','cancelled'))
          );
        END IF;
      END $$;

      -- tour_stop table
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='tour_stop') THEN
          CREATE TABLE tour_stop (
            id         text PRIMARY KEY DEFAULT ('STOP_' || encode(gen_random_bytes(8), 'hex')),
            tour_id    text NOT NULL REFERENCES tour(id) ON DELETE CASCADE,
            listing_id text NOT NULL,
            order_num  integer NOT NULL DEFAULT 0,
            eta        timestamptz,
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now()
          );
        END IF;
      END $$;
    `);

    const r = await pool.query(`
      SELECT
        (SELECT to_regclass('public.tour') IS NOT NULL) AS have_tour,
        (SELECT to_regclass('public.tour_stop') IS NOT NULL) AS have_tour_stop,
        (SELECT to_regclass('public.listing') IS NOT NULL) AS have_listing
    `);
    res.json({ ok: true, bootstrap: r.rows[0] });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

/* === Vector tiles (MVT) === */
app.get("/v1/tiles/:z/:x/:y.mvt", async (req, res) => {
  try {
    const { z, x, y } = req.params;
    const r = await pool.query(
      `SELECT tile_listings($1::int,$2::int,$3::int) AS mvt`,
      [z, x, y]
    );
    res.type("application/vnd.mapbox-vector-tile").send(r.rows[0].mvt);
  } catch (e: any) {
    res.status(500).json({ error: "tile_error", detail: e?.message || String(e) });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Domana API listening on http://localhost:${port}`));

export default app;
