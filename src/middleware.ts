import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes, except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check for Supabase session cookie or our mock session cookie
    const hasSupabaseCookie = request.cookies.getAll().some(cookie => 
      cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
    );
    const hasMockCookie = request.cookies.has('mif_admin_logged_in');

    if (!hasSupabaseCookie && !hasMockCookie) {
      // Redirect to login page if no auth session is found
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure middleware matcher to run only on /admin paths
export const config = {
  matcher: ['/admin/:path*'],
};
