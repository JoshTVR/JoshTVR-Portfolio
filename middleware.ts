import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/lib/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ---- Admin auth guard ----
  if (pathname.startsWith('/admin')) {
    // Skip the login page itself
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    // If Supabase is not configured, redirect to login
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const githubUsername = user.user_metadata?.user_name as string | undefined
    if (githubUsername?.toLowerCase() !== (process.env.ADMIN_GITHUB_USERNAME || 'josht vr').toLowerCase()) {
      // Not the authorized admin — sign out and redirect
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/', request.url))
    }

    return response
  }

  // ---- Locale routing for public pages ----
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/admin/:path*',
    // next-intl matcher — skip static files and api routes
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
}
