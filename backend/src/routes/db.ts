import { FastifyInstance } from "fastify";
import { prisma } from "../db.js";

export function registerDb(app: FastifyInstance) {
  app.get("/db/ping", async () => {
    const r = await prisma.$queryRaw`SELECT 1 as one`;
    return { ok: true, result: r };
  });
}
