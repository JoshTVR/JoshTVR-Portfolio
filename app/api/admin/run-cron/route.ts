import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const VALID_JOBS = ['publish', 'github-devlog', 'metrics'] as const
type CronJob = typeof VALID_JOBS[number]

/**
 * Admin-only endpoint that:
 *  - Triggers any of the cron jobs on demand (using the CRON_SECRET internally).
 *  - Returns a queue snapshot for the publish job so the user can see exactly
 *    what's scheduled, what's due, and what got skipped.
 *
 * Used from the Settings page "Cron Diagnostics" panel.
 */
export async function POST(req: NextRequest) {
  // 1. Verify admin session (same gate as other admin routes).
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
  if (githubUsername?.toLowerCase() !== (process.env.ADMIN_GITHUB_USERNAME ?? 'JoshTVR').toLowerCase()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 2. Parse request.
  const body = await req.json().catch(() => null)
  const job  = body?.job as CronJob | undefined
  if (!job || !VALID_JOBS.includes(job)) {
    return NextResponse.json({ error: `Invalid job. Must be one of: ${VALID_JOBS.join(', ')}` }, { status: 400 })
  }

  // 3. Forward to the cron route with the secret. We hit the same deployment.
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${req.headers.get('host') ?? ''}`
  const cronUrl = `${baseUrl}/api/cron/${job}`

  let cronResult: unknown = null
  let cronError: string | null = null
  try {
    const res = await fetch(cronUrl, {
      headers: { Authorization: `Bearer ${cronSecret}` },
      cache: 'no-store',
    })
    cronResult = await res.json().catch(() => ({ raw: 'non-json response' }))
    if (!res.ok) cronError = `HTTP ${res.status}`
  } catch (e) {
    cronError = e instanceof Error ? e.message : 'unknown'
  }

  // 4. For the publish job, also include a queue snapshot so the user can
  //    immediately see why the cron returned `published: 0` (if it did).
  let snapshot: Record<string, unknown> | null = null
  if (job === 'publish') {
    const supabase = createAdminClient()
    const now      = new Date()
    const window48hAgo  = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString()
    const window7dAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const [scheduledRes, dueRes, expiredRes, upcomingRes] = await Promise.all([
      supabase.from('posts').select('id', { count: 'exact', head: true })
        .eq('is_published', false).not('scheduled_at', 'is', null),
      supabase.from('posts').select('id', { count: 'exact', head: true })
        .eq('is_published', false).not('scheduled_at', 'is', null)
        .lte('scheduled_at', now.toISOString()).gte('scheduled_at', window48hAgo),
      supabase.from('posts').select('id', { count: 'exact', head: true })
        .eq('is_published', false).not('scheduled_at', 'is', null)
        .lt('scheduled_at', window48hAgo),
      supabase.from('posts').select('id,title_en,scheduled_at', { count: 'exact' })
        .eq('is_published', false).not('scheduled_at', 'is', null)
        .gt('scheduled_at', now.toISOString()).lte('scheduled_at', window7dAhead)
        .order('scheduled_at', { ascending: true }).limit(5),
    ])

    snapshot = {
      total_unpublished_with_schedule: scheduledRes.count ?? 0,
      due_in_window:                   dueRes.count ?? 0,
      expired_outside_48h_window:      expiredRes.count ?? 0,
      next_upcoming:                   upcomingRes.data ?? [],
    }
  }

  return NextResponse.json({
    job,
    triggered_at: new Date().toISOString(),
    cron_result:  cronResult,
    cron_error:   cronError,
    snapshot,
  })
}
