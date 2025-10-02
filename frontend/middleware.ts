import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const isHTML = (req.headers.get('accept') || '').includes('text/html');
  const isProd = (process.env.VERCEL_ENV ?? '') === 'production';
  if (isHTML && !isProd) res.headers.set('x-robots-tag','noindex, nofollow, noarchive');
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'] };