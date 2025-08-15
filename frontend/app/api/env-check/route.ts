export async function GET() {
  return Response.json({
    hasSentryDsn: Boolean(process.env.SENTRY_DSN),
    hasNextPublicSentryDsn: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    env: process.env.SENTRY_ENVIRONMENT || 'unset',
  });
}
