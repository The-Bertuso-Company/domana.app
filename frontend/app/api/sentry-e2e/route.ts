import * as Sentry from '@sentry/nextjs';

export async function GET() {
  const eventId = Sentry.captureException(new Error('E2E Sentry test (server)'));
  await Sentry.flush(2000); // wait up to 2s to send
  return Response.json({ ok: true, eventId, at: new Date().toISOString() });
}
