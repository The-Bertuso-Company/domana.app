const DATABASE_URL = process.env.DATABASE_URL || "";
const forcedFallback = process.env.FORCE_DB_FALLBACK === "1";
const computedIsPostgres = /^postgres(ql)?:\/\//i.test(DATABASE_URL);
const isPostgres = computedIsPostgres && !forcedFallback;

// tiny helper to respond on Express OR Fastify
function sendJSON(res: any, code: number, payload: any) {
  if (res && typeof res.status === "function" && typeof res.json === "function") {
    return res.status(code).json(payload);              // Express
  }
  if (res && typeof res.code === "function" && typeof res.send === "function") {
    return res.code(code).send(payload);                // Fastify
  }
  if (res && typeof res.status === "function" && typeof res.send === "function") {
    return res.status(code).send(payload);              // Koa-ish/adapters
  }
  return res?.send ? res.send(payload) : payload;
}

// When Postgres is configured, ping it with node-postgres (no Prisma).
async function pingPostgres(): Promise<void> {
  const { Client } = await import("pg");
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  await client.query("SELECT 1");
  await client.end().catch(() => {});
}

// Named export expected by server.ts
export function registerDb(app: any) {
  app.get("/db/ping", async (_req: any, res: any) => {
    if (!isPostgres) {
      return sendJSON(res, 200, { ok: true, driver: "dev-fallback", url: DATABASE_URL });
    }
    try {
      await pingPostgres();
      return sendJSON(res, 200, { ok: true, driver: "postgres" });
    } catch (err: any) {
      return sendJSON(res, 500, { ok: false, error: String(err?.message || err) });
    }
  });
}

// default export is optional; keep a no-op for app.use patterns
export default { registerDb };
