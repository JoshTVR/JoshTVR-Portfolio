import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joshtvr.com'
const LOCALES = ['en', 'es']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient()

  const [{ data: posts }, { data: projects }] = await Promise.all([
    supabase
      .from('posts')
      .select('slug, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false }),
    supabase
      .from('projects')
      .select('slug, updated_at')
      .order('updated_at', { ascending: false }),
  ])

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/posts', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/projects', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/services', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  const staticEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    staticPages.map(page => ({
      url: `${SITE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )

  const postEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    (posts ?? []).map(post => ({
      url: `${SITE_URL}/${locale}/posts/${post.slug}`,
      lastModified: new Date(post.published_at ?? Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  const projectEntries: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    (projects ?? []).map(project => ({
      url: `${SITE_URL}/${locale}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at ?? Date.now()),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  )

  return [...staticEntries, ...postEntries, ...projectEntries]
}
