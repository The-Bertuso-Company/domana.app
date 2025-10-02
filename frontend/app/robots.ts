import type { MetadataRoute } from 'next';

const env = (process.env.NEXT_PUBLIC_ENV ?? process.env.VERCEL_ENV ?? 'preview').toLowerCase();
const isProd = env === 'prod' || env === 'production';

export default function robots(): MetadataRoute.Robots {
  return isProd
    ? { rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://domana.app/sitemap.xml', host: 'https://domana.app' }
    : { rules: [{ userAgent: '*', disallow: '/' }] };
}