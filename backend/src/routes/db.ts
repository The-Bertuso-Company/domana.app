import type { Express, Request, Response } from "express";
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL || "";
const isPostgres = /^postgres(ql)?:\/\//i.test(DATABASE_URL);

// Only create Prisma client if actually using Postgres
const prisma = isPostgres ? new PrismaClient() : null;

// 1) Named export expected by server.ts
export function registerDb(app: Express) {
  app.get("/db/ping", async (_req: Request, res: Response) => {
    if (!isPostgres) {
      return res.status(200).json({ ok: true, driver: "dev-fallback", url: DATABASE_URL });
    }
    try {
      await prisma!.$queryRaw`SELECT 1`;
      return res.json({ ok: true, driver: "postgres" });
    } catch (err: any) {
      return res.status(500).json({ ok: false, error: String(err?.message || err) });
    }
  });
}

// 2) Also provide a default router (harmless; enables app.use if needed)
const router = Router();
router.get("/db/ping", async (_req: Request, res: Response) => {
  if (!isPostgres) {
    return res.status(200).json({ ok: true, driver: "dev-fallback", url: DATABASE_URL });
  }
  try {
    await prisma!.$queryRaw`SELECT 1`;
    return res.json({ ok: true, driver: "postgres" });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

export default router;
