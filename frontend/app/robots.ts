import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProd = (process.env.VERCEL_ENV ?? '') === 'production';
  return isProd
    ? { rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://domana.app/sitemap.xml', host: 'https://domana.app' }
    : { rules: [{ userAgent: '*', disallow: '/' }] };
}
