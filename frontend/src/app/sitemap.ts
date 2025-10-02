import type { MetadataRoute } from 'next';

const ENV = (process.env.NEXT_PUBLIC_ENV ?? process.env.VERCEL_ENV ?? 'preview').toLowerCase();
const SITE_URL_ENV = process.env.NEXT_PUBLIC_SITE_URL;

const DEFAULT_PROD_HOST = 'https://domana.app';
const DEFAULT_STAGING_HOST = 'https://staging.domana.app';

const isProd = ENV === 'prod' || ENV === 'production';
const host = SITE_URL_ENV ?? (isProd ? DEFAULT_PROD_HOST : DEFAULT_STAGING_HOST);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: \System.Management.Automation.Internal.Host.InternalHost/, lastModified: new Date() },
    // Add more routes as they go live
  ];
}