import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
import path from 'node:path';

export function registerUploads(app: FastifyInstance) {
  const uploadRoot = path.join(process.cwd(), 'uploads');
  try { fs.mkdirSync(uploadRoot, { recursive: true }); } catch {}

  app.post('/v1/uploads', async (req, reply) => {
    const anyReq = req as any;
    if (!anyReq.file || typeof anyReq.file !== 'function') {
      return reply.code(400).send({ error: 'no_multipart' });
    }
    const part = await anyReq.file();
    if (!part) return reply.code(400).send({ error: 'no_file' });

    const orig = typeof part.filename === 'string' ? part.filename : '';
    const ext = path.extname(orig || '').toLowerCase();
    const fname = Date.now().toString() + '_' + randomUUID() + ext;
    const dest = path.join(uploadRoot, fname);

    await pipeline(part.file, fs.createWriteStream(dest));

    return reply.code(201).send({
      ok: true,
      url: '/uploads/' + fname,
      filename: fname,
      originalName: orig,
      mimeType: part.mimetype
    });
  });
}
