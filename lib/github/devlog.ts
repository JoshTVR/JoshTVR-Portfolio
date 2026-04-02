// Auto-devlog: fetch recent commits from public repos and create draft posts.
// Server-only — never import from client components.

import { createAdminClient } from '@/lib/supabase/admin'

const GH_REST = 'https://api.github.com'

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

interface RestRepo {
  name:     string
  fork:     boolean
  archived: boolean
  private:  boolean
}

interface RestCommit {
  sha:    string
  commit: { message: string; author: { date: string } }
}

export async function generateDevlogDrafts(username: string): Promise<{
  created: number
  repos:   string[]
  errors:  string[]
}> {
  const supabase = createAdminClient()

  // 1. Read last-run timestamp from settings
  const { data: lastRunRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'github_devlog_last_run')
    .single()

  const lastRun = (lastRunRow?.value as { timestamp?: string } | null)?.timestamp
  const since   = lastRun ?? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // default: last 7 days

  // 2. Fetch public repos
  const reposRes = await fetch(
    `${GH_REST}/users/${username}/repos?type=owner&sort=pushed&per_page=50`,
    { headers: authHeaders(), cache: 'no-store' }
  )
  if (!reposRes.ok) {
    throw new Error(`GitHub repos HTTP ${reposRes.status}`)
  }
  const repos = (await reposRes.json()) as RestRepo[]
  const publicRepos = repos.filter(r => !r.fork && !r.archived && !r.private)

  const created: string[] = []
  const errors:  string[] = []

  // 3. For each repo, fetch commits since last run
  for (const repo of publicRepos) {
    try {
      const commitsRes = await fetch(
        `${GH_REST}/repos/${username}/${repo.name}/commits?since=${since}&per_page=10`,
        { headers: authHeaders(), cache: 'no-store' }
      )
      if (!commitsRes.ok) continue

      const commits = (await commitsRes.json()) as RestCommit[]
      if (!Array.isArray(commits) || commits.length === 0) continue

      // Filter out merge commits
      const messages = commits
        .map(c => c.commit.message.split('\n')[0].trim())
        .filter(m => !m.startsWith('Merge '))

      if (messages.length === 0) continue

      // 4. Create a draft devlog post
      const title   = `Devlog — ${repo.name}: ${messages.length} update${messages.length > 1 ? 's' : ''}`
      const update  = messages.map((m, i) => `${i + 1}. ${m}`).join('\n')
      const slug    = `devlog-${repo.name.toLowerCase()}-${Date.now()}`

      await supabase.from('posts').insert({
        title_en:        title,
        title_es:        title,
        slug,
        type:            'devlog',
        card_type:       'devlog',
        is_published:    false,
        is_ai_generated: false,
        card_data: {
          project:    repo.name,
          update,
          tech_tags:  [],
        },
        scheduled_at: null,
        tags:         ['devlog', repo.name.toLowerCase()],
      })

      created.push(repo.name)
    } catch (e) {
      errors.push(`${repo.name}: ${e instanceof Error ? e.message : 'unknown'}`)
    }
  }

  // 5. Save new last-run timestamp
  await supabase.from('settings').upsert({
    key:   'github_devlog_last_run',
    value: { timestamp: new Date().toISOString() },
  })

  return { created: created.length, repos: created, errors }
}
