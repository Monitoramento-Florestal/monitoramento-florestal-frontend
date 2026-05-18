import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/storage'

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value
  const hasSession = Boolean(token || refreshToken)
  const pathname = request.nextUrl.pathname
  const isDev = process.env.NODE_ENV === 'development'

  const isPublicPath =
    pathname === '/' || pathname === '/login' || pathname.startsWith('/public')

  const isProtectedPath =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/citizen') ||
    pathname.startsWith('/researcher') ||
    pathname.startsWith('/manager')

  if (isDev && isProtectedPath) {
    return NextResponse.next()
  }

  if (isProtectedPath && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && hasSession && pathname === '/login') {
    return NextResponse.redirect(new URL('/citizen', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/public/:path*', '/citizen/:path*', '/researcher/:path*', '/manager/:path*', '/admin/:path*', '/login'],
}
