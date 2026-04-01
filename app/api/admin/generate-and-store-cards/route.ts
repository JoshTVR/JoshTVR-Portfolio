import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateAndStoreCards } from '@/lib/generate-and-store-cards'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Verify admin session
  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
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
    },
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const githubUsername = user.user_metadata?.user_name as string | undefined
  if (githubUsername?.toLowerCase() !== (process.env.ADMIN_GITHUB_USERNAME ?? 'joshtv').toLowerCase()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.postId) return NextResponse.json({ error: 'Missing postId' }, { status: 400 })

  const urls = await generateAndStoreCards(body.postId)
  return NextResponse.json({ ok: true, urls })
}
