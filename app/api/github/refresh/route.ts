import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { invalidateGitHubCache, getGitHubStats } from '@/lib/github/cache'

export async function POST(request: Request) {
  // Verify admin session
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const githubUsername = user.user_metadata?.user_name as string | undefined
  if (githubUsername?.toLowerCase() !== (process.env.ADMIN_GITHUB_USERNAME ?? 'joshtv').toLowerCase()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await invalidateGitHubCache()
    const stats = await getGitHubStats()
    return NextResponse.json({ success: true, contributions: stats?.contributions ?? 0, fetchedAt: stats?.fetchedAt })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
