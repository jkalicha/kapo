import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

const PROTECTED_ROUTES = ['/dashboard', '/onboarding']
const AUTH_ROUTES = ['/sign-in', '/sign-up']

export function middleware(request: NextRequest): NextResponse {
  const sessionCookie = getSessionCookie(request)
  const pathname = request.nextUrl.pathname

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  if (isProtected && !sessionCookie) {
    const redirectUrl = new URL('/sign-in', request.url)
    redirectUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/sign-in', '/sign-up'],
}
