import './env';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import fs from 'node:fs';

import { registerHealth } from './routes/health.js';
import { registerStatus } from './routes/status.js';
import { registerAuth } from './routes/auth.js';
import { registerDb } from './routes/db.js';
import { registerListings } from './routes/listings.js';
import { registerUploads } from './routes/uploads.js';

const env = {
  PORT: parseInt(process.env.PORT ?? '4000', 10),
  JWT_SECRET: process.env.JWT_SECRET ?? 'dev-secret',
  RATE_MAX: parseInt(process.env.RATE_MAX ?? '20', 10),
  RATE_WINDOW: process.env.RATE_WINDOW ?? '10 seconds',
};

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  const required = ['JWT_SECRET', 'DATABASE_URL'];
  const missing = required.filter(k => !process.env[k] || String(process.env[k]).trim() === '');
  if (missing.length) {
    console.error('Missing required env vars: ' + missing.join(', '));
    process.exit(1);
  }
}

async function init() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(helmet);
  await app.register(rateLimit, { max: env.RATE_MAX, timeWindow: env.RATE_WINDOW });

  await app.register(swagger, { openapi: { info: { title: 'Domana API', version: '0.0.1' } } });
  await app.register(swaggerUI, { routePrefix: '/docs' });
  await app.register(jwt, { secret: env.JWT_SECRET });

  const uploadRoot = path.join(process.cwd(), 'uploads');
  try { fs.mkdirSync(uploadRoot, { recursive: true }); } catch {}
  await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });
  await app.register(fastifyStatic, { root: uploadRoot, prefix: '/uploads/' });

  registerHealth(app);
  registerStatus(app);
  registerAuth(app);
  registerDb(app);
  registerListings(app);
  registerUploads(app);

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply.status(err.statusCode ?? 500).send({ error: 'InternalError', message: err.message });
  });

  await app.ready();
  app.log.info('\n' + app.printRoutes());
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
  app.log.info('Domana API listening on :' + env.PORT);
}

init().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

