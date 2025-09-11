@'
import Fastify from "fastify";
import { registerRoutes } from "./routes/index.js";
import { env } from "./env.js";

const server = Fastify({
  logger: true
});

// Register app routes
registerRoutes(server);

const start = async () => {
  try {
    await server.listen({ port: env.PORT || 4000, host: "0.0.0.0" });
    console.log(`🚀 Server ready at http://localhost:${env.PORT || 4000}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
'@ | Set-Content -Encoding UTF8 src\server.ts
