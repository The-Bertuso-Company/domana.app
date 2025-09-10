import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();

const DATABASE_URL = process.env.DATABASE_URL || "";
const isPostgres = /^postgres(ql)?:\/\//i.test(DATABASE_URL);

// Only create a Prisma client if we’re actually pointed at Postgres
const prisma = isPostgres ? new PrismaClient() : null;

router.get("/db/ping", async (_req: Request, res: Response) => {
  if (!isPostgres) {
    // On SQLite (or any non-postgres dev fallback), just return OK
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
