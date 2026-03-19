import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=no_code`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`)
  }

  // ---- Single-user guard: only JoshTVR can be admin ----
  const githubUsername = data.user.user_metadata?.user_name as string | undefined
  const adminUsername = process.env.ADMIN_GITHUB_USERNAME || 'JoshTVR'

  if (githubUsername?.toLowerCase() !== adminUsername.toLowerCase()) {
    await supabase.auth.signOut()
    return NextResponse.redirect(`${origin}/?error=unauthorized`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
