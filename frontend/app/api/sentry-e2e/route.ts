// frontend/app/api/sentry-e2e/route.ts
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  Sentry.captureException(new Error('E2E Sentry test (server)'));
  await Sentry.flush(2000);
  return Response.json({ ok: true, at: new Date().toISOString() });
}
