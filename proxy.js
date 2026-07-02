import { auth } from "@/auth"

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  const isHelperRoute = nextUrl.pathname.startsWith('/helper')
  const isDashboardRoute = nextUrl.pathname === '/dashboard'

  if (!isLoggedIn && (isHelperRoute || isDashboardRoute)) {
    return Response.redirect(new URL('/login', nextUrl))
  }

  if (isLoggedIn) {
    if (isHelperRoute && role !== 'helper') {
      return Response.redirect(new URL('/', nextUrl))
    }
    if (isDashboardRoute) {
      if (role === 'helper') return Response.redirect(new URL('/helper/dashboard', nextUrl))
      return Response.redirect(new URL('/', nextUrl))
    }
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
