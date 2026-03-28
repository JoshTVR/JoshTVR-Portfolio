import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es'
  return {
    title: isEs ? 'JoshTVR — Desarrollador Fullstack & Artista 3D/VR' : 'JoshTVR — Fullstack Developer & 3D/VR Artist',
    description: isEs
      ? 'Portafolio de Joshua Hernandez — desarrollo backend, ciencia de datos, arte 3D y experiencias VR/AR.'
      : 'Portfolio of Joshua Hernandez — backend development, data science, 3D art and VR/AR experiences.',
    openGraph: {
      title: 'JoshTVR',
      description: isEs ? 'Portafolio personal de JoshTVR' : 'JoshTVR personal portfolio',
      url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joshtvr.com',
      siteName: 'JoshTVR',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: 'JoshTVR', description: isEs ? 'Portafolio de JoshTVR' : 'JoshTVR portfolio' },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://joshtvr.com'}/${locale}`,
      languages: { en: '/en', es: '/es' },
    },
  }
}
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import SkillsSection from '@/components/sections/SkillsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import GitHubStatsSection from '@/components/sections/GitHubStatsSection'
import GitHubReposSection from '@/components/sections/GitHubReposSection'
import ExperienceSection from '@/components/sections/ExperienceSection'
import CertificationsSection from '@/components/sections/CertificationsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import { PostsFeedSection } from '@/components/sections/PostsFeedSection'
import ContactSection from '@/components/sections/ContactSection'
import { getGitHubStats, getPublicRepos } from '@/lib/github/cache'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [tAbout, tSkills, tProjects, tGh, tExp, tCerts, tTestimonials, tContact] =
    await Promise.all([
      getTranslations('about'),
      getTranslations('skills'),
      getTranslations('projects'),
      getTranslations('githubStats'),
      getTranslations('exp'),
      getTranslations('certs'),
      getTranslations('testimonials'),
      getTranslations('contact'),
    ])

  // Default stat values (fallback before Supabase is configured)
  const defaultStats = [
    { value: '30%', label: tAbout('stat1') },
    { value: '4',   label: tAbout('stat2') },
    { value: '5+',  label: tAbout('stat3') },
    { value: '2+',  label: tAbout('stat4') },
  ]

  let projects: ProjectRow[] = []
  let experience: ExperienceRow[] = []
  let certifications: CertRow[] = []
  let testimonials: TestimonialRow[] = []
  let latestPosts: PostPreview[] = []
  let aboutStats = defaultStats
  let showGitHubStats = true
  let showTestimonials = true

  try {
    const supabase = await createClient()

    const [projectsRes, expRes, certsRes, testimonialsRes, settingsRes, postsRes] =
      await Promise.all([
        supabase
          .from('projects')
          .select('id,slug,title_en,title_es,description_en,description_es,category,tech_tags,github_url,demo_url,cover_image,is_featured,github_repo')
          .eq('is_published', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('experience')
          .select('id,role_en,role_es,company,description_en,description_es,tags,start_date,end_date')
          .order('sort_order', { ascending: true }),
        supabase
          .from('certifications')
          .select('id,name_en,name_es,issuer,year')
          .order('sort_order', { ascending: true }),
        supabase
          .from('testimonials')
          .select('id,quote_en,quote_es,author_name,author_role_en,author_role_es')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('settings')
          .select('key,value')
          .in('key', ['about_stat1_value', 'about_stat2_value', 'about_stat3_value', 'about_stat4_value']),
        supabase
          .from('posts')
          .select('id,slug,title_en,title_es,excerpt_en,excerpt_es,cover_image,youtube_url,type,published_at')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(3),
      ])

    projects      = (projectsRes.data ?? []) as ProjectRow[]
    experience    = (expRes.data ?? []) as ExperienceRow[]
    certifications = (certsRes.data ?? []) as CertRow[]
    testimonials  = (testimonialsRes.data ?? []) as TestimonialRow[]
    latestPosts   = (postsRes.data ?? []) as PostPreview[]

    if (settingsRes.data && settingsRes.data.length > 0) {
      const map: Record<string, string> = {}
      for (const row of settingsRes.data) {
        const raw = row.value
        map[row.key] = typeof raw === 'string' ? raw : String(raw)
      }
      aboutStats = [
        { value: (map['about_stat1_value'] ?? '30') + '%', label: tAbout('stat1') },
        { value:  map['about_stat2_value'] ?? '4',          label: tAbout('stat2') },
        { value: (map['about_stat3_value'] ?? '5') + '+',   label: tAbout('stat3') },
        { value: (map['about_stat4_value'] ?? '2') + '+',   label: tAbout('stat4') },
      ]
    }

    // Section visibility settings
    const sectionsRes = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'sections_visible')
      .single()
    if (sectionsRes.data?.value) {
      const sv = sectionsRes.data.value as Record<string, boolean>
      if (sv.github_stats === false) showGitHubStats  = false
      if (sv.testimonials === false) showTestimonials = false
    }
  } catch {
    // Supabase not configured yet — render with empty data
  }

  // Fetch GitHub stats + repos (use cache, returns null/[] if not configured)
  const [githubStats, githubRepos] = await Promise.all([
    showGitHubStats ? getGitHubStats() : Promise.resolve(null),
    getPublicRepos(),
  ])

  // Build map: repoName → { slug, title_en, title_es } for repos linked to projects
  const linkedProjects: Record<string, { slug: string; title_en: string; title_es: string }> = {}
  for (const p of projects) {
    if (p.github_repo) {
      linkedProjects[p.github_repo] = { slug: p.slug, title_en: p.title_en, title_es: p.title_es }
    }
  }

  const filterLabels: Record<string, string> = {
    all:    tProjects('filter.all'),
    '3d':   tProjects('filter.3d'),
    video:  tProjects('filter.video'),
    vr:     tProjects('filter.vr'),
    data:   tProjects('filter.data'),
    design: tProjects('filter.design'),
    github: 'Open Source',
  }

  return (
    <>
      <HeroSection />
      <AboutSection
        title={tAbout('title')}
        bio1={tAbout('p1')}
        bio2={tAbout('p2')}
        bio3={tAbout('p3')}
        stats={aboutStats}
      />
      <SkillsSection title={tSkills('title')} />
      <ProjectsSection
        projects={projects}
        filterLabels={filterLabels}
        title={tProjects('title')}
      />
      {showGitHubStats && (
        <GitHubStatsSection
          stats={githubStats}
          title={tGh('title')}
          reposLabel={tGh('repos')}
          starsLabel={tGh('stars')}
          contsLabel={tGh('contributions')}
          langsLabel={tGh('languages')}
          heatmapLabel={tGh('heatmapLabel')}
        />
      )}
      <GitHubReposSection repos={githubRepos} locale={locale} linkedProjects={linkedProjects} />
      <ExperienceSection
        items={experience}
        title={tExp('title')}
        locale={locale}
      />
      <CertificationsSection
        items={certifications}
        title={tCerts('title')}
        locale={locale}
      />
      {showTestimonials && (
        <TestimonialsSection
          items={testimonials}
          title={tTestimonials('title')}
          locale={locale}
        />
      )}
      <PostsFeedSection posts={latestPosts} locale={locale} />
      <ContactSection
        title={tContact('title')}
        subtitle={tContact('subtitle')}
      />
    </>
  )
}

// --------------- Local types (avoid importing full DB types) ---------------

interface ProjectRow {
  id: string
  slug: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  category: string
  tech_tags: string[]
  github_url: string | null
  demo_url: string | null
  cover_image: string | null
  is_featured: boolean
  github_repo: string | null
}

interface ExperienceRow {
  id: string
  role_en: string
  role_es: string
  company: string
  description_en: string
  description_es: string
  tags: string[]
  start_date: string
  end_date: string | null
}

interface CertRow {
  id: string
  name_en: string
  name_es: string
  issuer: string
  year: number
}

interface TestimonialRow {
  id: string
  quote_en: string
  quote_es: string
  author_name: string
  author_role_en: string
  author_role_es: string
}

interface PostPreview {
  id: string
  slug: string
  title_en: string
  title_es: string
  excerpt_en: string | null
  excerpt_es: string | null
  cover_image: string | null
  youtube_url: string | null
  type: string
  published_at: string | null
}
