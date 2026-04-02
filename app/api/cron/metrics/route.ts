import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const FB_GRAPH = 'https://graph.facebook.com/v21.0'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Fetch tokens
  const { data: tokenRows } = await supabase
    .from('settings')
    .select('key,value')
    .in('key', ['facebook_token', 'threads_token'])

  const tokenMap: Record<string, Record<string, string>> = {}
  for (const row of tokenRows ?? []) {
    tokenMap[row.key] = row.value as Record<string, string>
  }

  // Fetch posts that have at least one external post ID
  const { data: posts } = await supabase
    .from('posts')
    .select('id,facebook_post_id,threads_post_id')
    .eq('is_published', true)
    .or('facebook_post_id.not.is.null,threads_post_id.not.is.null')
    .limit(50)

  if (!posts || posts.length === 0) {
    return NextResponse.json({ updated: 0, message: 'No posts with external IDs found' })
  }

  const fbToken     = tokenMap['facebook_token']?.access_token
  const thToken     = tokenMap['threads_token']?.access_token
  const results: Array<{ id: string; facebook?: string; threads?: string }> = []

  for (const post of posts) {
    const result: { id: string; facebook?: string; threads?: string } = { id: post.id }
    const update: Record<string, unknown> = { metrics_updated_at: new Date().toISOString() }

    // ── Facebook metrics ─────────────────────────────────────────────────────
    if (post.facebook_post_id && fbToken) {
      try {
        // Reactions (likes)
        const reactRes = await fetch(
          `${FB_GRAPH}/${post.facebook_post_id}/reactions?summary=true&access_token=${fbToken}`,
          { cache: 'no-store' }
        )
        // Comments
        const commRes = await fetch(
          `${FB_GRAPH}/${post.facebook_post_id}/comments?summary=true&access_token=${fbToken}`,
          { cache: 'no-store' }
        )

        if (reactRes.ok && commRes.ok) {
          const reactData = await reactRes.json() as { summary?: { total_count?: number } }
          const commData  = await commRes.json() as { summary?: { total_count?: number } }
          update.facebook_likes    = reactData.summary?.total_count ?? 0
          update.facebook_comments = commData.summary?.total_count ?? 0
          result.facebook = `likes:${update.facebook_likes} comments:${update.facebook_comments}`
        } else {
          result.facebook = 'fetch failed'
        }
      } catch (e) {
        result.facebook = `error: ${e instanceof Error ? e.message : 'unknown'}`
      }
    }

    // ── Threads metrics ──────────────────────────────────────────────────────
    if (post.threads_post_id && thToken) {
      try {
        const insightsRes = await fetch(
          `https://graph.threads.net/v1.0/${post.threads_post_id}/insights?metric=likes,replies,reposts,quotes,views&access_token=${thToken}`,
          { cache: 'no-store' }
        )

        if (insightsRes.ok) {
          const insightsData = await insightsRes.json() as {
            data?: { name: string; values?: { value: number }[]; total_value?: { value: number } }[]
          }
          const metrics: Record<string, number> = {}
          for (const metric of insightsData.data ?? []) {
            const val = metric.total_value?.value ?? metric.values?.[0]?.value ?? 0
            metrics[metric.name] = val
          }
          update.threads_likes   = metrics.likes   ?? 0
          update.threads_replies = metrics.replies  ?? 0
          update.threads_views   = metrics.views    ?? 0
          result.threads = `likes:${update.threads_likes} replies:${update.threads_replies} views:${update.threads_views}`
        } else {
          result.threads = `fetch failed: ${await insightsRes.text()}`
        }
      } catch (e) {
        result.threads = `error: ${e instanceof Error ? e.message : 'unknown'}`
      }
    }

    if (Object.keys(update).length > 1) {
      await supabase.from('posts').update(update).eq('id', post.id)
    }

    results.push(result)
  }

  return NextResponse.json({ updated: results.length, results })
}
