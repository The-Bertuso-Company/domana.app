import { FastifyInstance } from "fastify";

export function registerHealth(app: FastifyInstance) {
  app.get("/healthz", async () => ({ status: "ok" }));
}
