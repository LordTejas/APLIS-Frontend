import { NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/signin']

export default async function middleware(req) {
  try {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    console.log('isProtectedRoute', isProtectedRoute)
    console.log('isPublicRoute', isPublicRoute)
    console.log('path', path)

    if (isPublicRoute) {
      return NextResponse.next()
    }

    // 3. Decrypt the session from the cookie
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    // 5. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session?.user?.id) {
      return NextResponse.redirect(new URL('/signin', req.nextUrl))
    }
    // 6. Redirect to /dashboard if the user is authenticated
    if (
      isPublicRoute &&
      session?.user?.id &&
      req.nextUrl.pathname.startsWith('/signin')
    ) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error in middleware:', error.message)
    return NextResponse.redirect(new URL('/signin', req.nextUrl))
  }
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}