const isProd = process.env.VERCEL_ENV === 'production';
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: isProd ? 'https://domana.app' : 'https://example.invalid',
  generateRobotsTxt: true,
  robotsTxtOptions: isProd
    ? { policies: [{ userAgent: '*', allow: '/' }, { userAgent: '*', disallow: '/beta' }] }
    : { policies: [{ userAgent: '*', disallow: '/' }] },
};
