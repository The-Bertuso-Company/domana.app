import type { Express, Request, Response } from "express";
import { Router } from "express";

const DATABASE_URL = process.env.DATABASE_URL || "";
const isPostgres = /^postgres(ql)?:\/\//i.test(DATABASE_URL);

// When Postgres is configured, ping it with node-postgres (no Prisma).
async function pingPostgres(): Promise<void> {
  const { Client } = await import("pg");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  await client.query("SELECT 1");
  await client.end().catch(() => {});
}

// 1) Named export expected by server.ts
export function registerDb(app: Express) {
  app.get("/db/ping", async (_req: Request, res: Response) => {
    if (!isPostgres) {
      return res.status(200).json({ ok: true, driver: "dev-fallback", url: DATABASE_URL });
    }
    try {
      await pingPostgres();
      return res.json({ ok: true, driver: "postgres" });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: String(err?.message || err) });
    }
  });
}

// 2) Default router export (kept for flexibility)
const router = Router();
router.get("/db/ping", async (_req: Request, res: Response) => {
  if (!isPostgres) {
    return res.status(200).json({ ok: true, driver: "dev-fallback", url: DATABASE_URL });
  }
  try {
    await pingPostgres();
    return res.json({ ok: true, driver: "postgres" });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

export default router;
