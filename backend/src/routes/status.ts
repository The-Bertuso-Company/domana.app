import { FastifyInstance } from "fastify";
export function registerStatus(app: FastifyInstance) {
  app.get("/status", async () => ({
    api: "ok",
    uptime: process.uptime(),
    now: new Date().toISOString()
  }));
}
