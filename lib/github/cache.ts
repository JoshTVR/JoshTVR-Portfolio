import { createAdminClient } from '@/lib/supabase/admin'
import { fetchGitHubStats, type GitHubStats } from './api'

const CACHE_KEY = 'github_stats'
const TTL_MS    = 6 * 60 * 60 * 1000 // 6 hours

export async function getGitHubStats(): Promise<GitHubStats | null> {
  const username = process.env.GITHUB_USERNAME ?? 'JoshTVR'

  try {
    const supabase = createAdminClient()

    // 1. Try cache
    const { data: cached } = await supabase
      .from('github_cache')
      .select('data, updated_at')
      .eq('key', CACHE_KEY)
      .single()

    if (cached) {
      const age = Date.now() - new Date(cached.updated_at).getTime()
      if (age < TTL_MS) {
        return cached.data as GitHubStats
      }
    }

    // 2. Fetch fresh (requires GITHUB_TOKEN for GraphQL)
    if (!process.env.GITHUB_TOKEN) {
      // No token — return stale cache if available
      if (cached) return cached.data as GitHubStats
      return null
    }

    const stats = await fetchGitHubStats(username)

    // 3. Write to cache
    await supabase
      .from('github_cache')
      .upsert(
        { key: CACHE_KEY, data: stats, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )

    return stats
  } catch (err) {
    console.error('[GitHub cache] error:', err)
    return null
  }
}

export async function invalidateGitHubCache(): Promise<void> {
  try {
    const supabase = createAdminClient()
    await supabase.from('github_cache').delete().eq('key', CACHE_KEY)
  } catch {
    // ignore
  }
}
