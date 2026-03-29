import { getThemeState, getContentPosts } from './actions'
import { ContentTabs } from './ContentTabs'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const [themeState, posts] = await Promise.all([
    getThemeState(),
    getContentPosts(),
  ])

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Content Hub
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Plan, generate, schedule, and automate your content pipeline
        </p>
      </div>

      <ContentTabs themeState={themeState} posts={posts} />
    </div>
  )
}
