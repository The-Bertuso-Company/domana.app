import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(req: NextRequest){
  const res=NextResponse.next();
  const isHTML=(req.headers.get('accept')||'').includes('text/html');
  const env=(process.env.NEXT_PUBLIC_ENV??process.env.VERCEL_ENV??'preview').toLowerCase();
  const isProd=env==='prod'||env==='production';
  if(isHTML&&!isProd){res.headers.set('X-Robots-Tag','noindex, nofollow, noarchive');}
  return res;
}
export const config={matcher:['/((?!_next|api|static|.*\\.(?:png|jpg|svg|ico|js|css|map)).*)']};
