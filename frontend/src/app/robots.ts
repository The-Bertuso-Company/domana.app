import type { MetadataRoute } from 'next';
const ENV=(process.env.NEXT_PUBLIC_ENV??process.env.VERCEL_ENV??'preview').toLowerCase();
const SITE_URL_ENV=process.env.NEXT_PUBLIC_SITE_URL;
const isProd=ENV==='prod'||ENV==='production';
const isStaging=ENV==='staging';
const DEFAULT_PROD_HOST='https://domana.app';
const DEFAULT_STAGING_HOST='https://staging.domana.app';
const host=SITE_URL_ENV ?? (isProd?DEFAULT_PROD_HOST:(isStaging?DEFAULT_STAGING_HOST:''));
export default function robots(): MetadataRoute.Robots {
  const allowIndex=isProd;
  return {
    rules: allowIndex ? [{userAgent:'*',allow:'/'}] : [{userAgent:'*',disallow:'/'}],
    sitemap: allowIndex&&host?${host}/sitemap.xml:undefined,
    host: allowIndex&&host?host:undefined,
  };
}
