import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('forest_token')?.value
  const pathname = request.nextUrl.pathname

  const isPublicPath =
    pathname === '/' || pathname === '/login' || pathname.startsWith('/public')

  const isProtectedPath =
    pathname.startsWith('/citizen') ||
    pathname.startsWith('/researcher') ||
    pathname.startsWith('/manager')

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicPath && token && pathname === '/login') {
    return NextResponse.redirect(new URL('/citizen', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/public/:path*', '/citizen/:path*', '/researcher/:path*', '/manager/:path*', '/login'],
}
