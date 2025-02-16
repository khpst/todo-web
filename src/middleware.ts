import { NextResponse } from 'next/server'
import { verifyToken } from '@/utils/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      try {
        await verifyToken(token)
        return NextResponse.redirect(new URL('/', request.url))
      } catch (error) {
        return NextResponse.next()
      }
    }
    return NextResponse.next()
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    response.cookies.delete('refreshToken');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|favicon.ico).*)',
  ],
}
