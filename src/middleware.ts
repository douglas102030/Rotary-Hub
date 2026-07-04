import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request: Request) {
    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || process.env.PASSWORD_SECRET_KEY || 'rotary_hub_secret_key_2026',
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/projects/:path*',
    '/profile/:path*',
  ],
};
