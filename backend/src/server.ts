import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import jwt from "@fastify/jwt";
import { env } from "./env.js";
import { registerHealth } from "./routes/health.js";
import { registerStatus } from "./routes/status.js";
import { registerAuth } from "./routes/auth.js";
import { registerDb } from "./routes/db.js";
import { registerListings } from "./routes/listings.js";

const app = Fastify({ logger: true });

await app.register(cors, { origin: true });
await app.register(helmet);
await app.register(rateLimit, { max: env.RATE_MAX, timeWindow: env.RATE_WINDOW });
await app.register(swagger, { openapi: { info: { title: "Domana API", version: "0.0.1" } } });
await app.register(swaggerUI, { routePrefix: "/docs" });
await app.register(jwt, { secret: env.JWT_SECRET });

registerHealth(app);
registerStatus(app);
registerAuth(app);
registerDb(app);
registerListings(app);

app.setErrorHandler((err, _req, reply) => {
  app.log.error(err);
  reply.status(err.statusCode ?? 500).send({ error: "InternalError", message: err.message });
});

await app.ready();
app.log.info("\n" + app.printRoutes());

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    app.log.info(`Domana API listening on :${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
