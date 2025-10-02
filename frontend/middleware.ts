import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const isHTML = (req.headers.get('accept') || '').includes('text/html')
  if (isHTML) res.headers.set('x-robots-tag', 'noindex, nofollow, noarchive')
  return res
}

// Run on everything except Next static assets, images, and these files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
