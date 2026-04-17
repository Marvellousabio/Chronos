import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard') ||
      req.nextUrl.pathname.startsWith('/repositories') ||
      req.nextUrl.pathname.startsWith('/scan') ||
      req.nextUrl.pathname.startsWith('/studio') ||
      req.nextUrl.pathname.startsWith('/team') ||
      req.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }

    // Check org membership for org routes
    if (req.nextUrl.pathname.startsWith('/org/')) {
      const orgSlug = req.nextUrl.pathname.split('/')[2];
      // Verify user belongs to org
      // Could fetch from DB and redirect if not member
    }
  }

  // Billing check for certain features
  if (req.nextUrl.pathname.startsWith('/api/scan') && token) {
    // Check subscription status
    // Could return 402 if limit exceeded
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/repositories/:path*',
    '/scan/:path*',
    '/studio/:path*',
    '/team/:path*',
    '/admin/:path*',
    '/api/scan/:path*',
    '/api/refactor/:path*',
    '/api/export/:path*',
  ],
};
