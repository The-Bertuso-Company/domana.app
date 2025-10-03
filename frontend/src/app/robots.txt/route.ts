export async function GET() {
  const isProd = (process.env.VERCEL_ENV ?? '') === 'production';
  const body = isProd
    ? `User-agent: *\nAllow: /\nSitemap: https://domana.app/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
