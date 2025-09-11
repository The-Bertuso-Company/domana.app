/* tiles_service.ts — HTTP server exposing /tiles/{z}/{x}/{y}.mvt via Postgres function */
import express from "express";
import { Client } from "pg";

const app = express();
const conn = process.env.DATABASE_URL || "";

app.get("/tiles/:z/:x/:y.mvt", async (req, res) => {
  try {
    const z = parseInt(req.params.z, 10);
    const x = parseInt(req.params.x, 10);
    const y = parseInt(req.params.y, 10);
    const c = new Client({ connectionString: conn });
    await c.connect();
    const r = await c.query("SELECT tile_listings($1::int,$2::int,$3::int) AS mvt", [z, x, y]);
    await c.end();
    const buf = r.rows?.[0]?.mvt as Buffer | undefined;
    if (!buf) {
      res.status(404).send("No tile");
      return;
    }
    res.setHeader("Content-Type", "application/vnd.mapbox-vector-tile");
    res.send(buf);
  } catch (e: any) {
    res.status(500).send(e.message || "Server error");
  }
});

const port = Number(process.env.PORT) || 4600;
app.listen(port, () => console.log(`Tiles service on :${port}`));
