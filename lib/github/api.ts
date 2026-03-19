// GitHub REST + GraphQL fetchers.
// Server-only — never import from client components.

export interface LanguageStat {
  name:       string
  percentage: number
  color:      string
}

export interface ContributionDay {
  count: number
  date:  string
  level: 0 | 1 | 2 | 3 | 4
}

export interface ContributionWeek {
  days: ContributionDay[]
}

export interface GitHubStats {
  username:      string
  repos:         number
  stars:         number
  followers:     number
  contributions: number
  languages:     LanguageStat[]
  weeks:         ContributionWeek[]
  fetchedAt:     string
}

const GH_GRAPHQL = 'https://api.github.com/graphql'
const GH_REST    = 'https://api.github.com'

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN
  return {
    'Content-Type': 'application/json',
    Accept:         'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const LEVEL_MAP: Record<string, 0 | 1 | 2 | 3 | 4> = {
  NONE:            0,
  FIRST_QUARTILE:  1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE:  3,
  FOURTH_QUARTILE: 4,
}

const GQL_QUERY = `
  query($login: String!) {
    user(login: $login) {
      followers { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        isFork: false
        privacy: PUBLIC
      ) {
        nodes {
          stargazerCount
          primaryLanguage { name color }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              contributionLevel
            }
          }
        }
      }
    }
  }
`

export async function fetchGitHubStats(username: string): Promise<GitHubStats> {
  // --- GraphQL: contributions + languages + stars ---
  const gqlRes = await fetch(GH_GRAPHQL, {
    method:  'POST',
    headers: authHeaders(),
    body:    JSON.stringify({ query: GQL_QUERY, variables: { login: username } }),
    cache:   'no-store',
  })

  if (!gqlRes.ok) {
    throw new Error(`GitHub GraphQL HTTP ${gqlRes.status}`)
  }

  const { data, errors } = (await gqlRes.json()) as {
    data?:   { user: GQLUser }
    errors?: { message: string }[]
  }

  if (errors?.length) throw new Error(errors[0].message)
  if (!data?.user)    throw new Error('GitHub user not found')

  const { user } = data

  // Aggregate stars
  const stars = user.repositories.nodes.reduce(
    (sum, r) => sum + r.stargazerCount,
    0
  )

  // Language distribution (by repo count, top 6)
  const langMap: Record<string, { count: number; color: string }> = {}
  for (const repo of user.repositories.nodes) {
    if (repo.primaryLanguage) {
      const { name, color } = repo.primaryLanguage
      if (!langMap[name]) langMap[name] = { count: 0, color: color ?? '#7c3aed' }
      langMap[name].count++
    }
  }
  const totalRepos = Object.values(langMap).reduce((s, v) => s + v.count, 0)
  const languages: LanguageStat[] = Object.entries(langMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([name, { count, color }]) => ({
      name,
      percentage: totalRepos > 0 ? Math.round((count / totalRepos) * 100) : 0,
      color,
    }))

  // Contribution calendar
  const cal = user.contributionsCollection.contributionCalendar
  const weeks: ContributionWeek[] = cal.weeks.map((w) => ({
    days: w.contributionDays.map((d) => ({
      count: d.contributionCount,
      date:  d.date,
      level: LEVEL_MAP[d.contributionLevel] ?? 0,
    })),
  }))

  // --- REST: public repo count ---
  const restRes = await fetch(`${GH_REST}/users/${username}`, {
    headers: authHeaders(),
    cache:   'no-store',
  })
  const restUser = (await restRes.json()) as { public_repos?: number }

  return {
    username,
    repos:         restUser.public_repos ?? user.repositories.nodes.length,
    stars,
    followers:     user.followers.totalCount,
    contributions: cal.totalContributions,
    languages,
    weeks,
    fetchedAt:     new Date().toISOString(),
  }
}

// ---- GQL type helpers ----
interface GQLUser {
  followers: { totalCount: number }
  repositories: {
    nodes: {
      stargazerCount: number
      primaryLanguage: { name: string; color: string } | null
    }[]
  }
  contributionsCollection: {
    contributionCalendar: {
      totalContributions: number
      weeks: {
        contributionDays: {
          contributionCount: number
          date:             string
          contributionLevel: string
        }[]
      }[]
    }
  }
}
