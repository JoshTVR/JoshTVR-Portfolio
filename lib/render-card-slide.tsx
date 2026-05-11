import { ImageResponse } from 'next/og'
import { THEMES, type ThemeName } from '@/components/content-cards/themes'

export type CardPost = {
  card_type: string | null
  card_data: Record<string, unknown> | null
  color_theme: string | null
  title_en: string
  tags: string[] | null
}

const SIZE = { width: 1080, height: 1080 } as const

// ─── Shared helpers ──────────────────────────────────────────────────────────

type ThemeCtx = ReturnType<typeof getThemeCtx>

function getThemeCtx(post: CardPost) {
  const themeName = (post.color_theme ?? 'midnight') as ThemeName
  const theme     = THEMES[themeName] ?? THEMES.midnight
  const data      = (post.card_data ?? {}) as Record<string, unknown>
  return {
    theme,
    data,
    str:  (k: string) => String(data[k] ?? ''),
    tags: ((post.tags ?? []) as string[]).map(t => `#${t}`).join(' '),
  }
}

function Brand({ ctx }: { ctx: ThemeCtx }) {
  const { theme, tags } = ctx
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto', paddingTop: 24 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 16,
        background: `rgba(${theme.accentRgb},0.3)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, color: theme.accent,
      }}>J</div>
      <span style={{ color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>@joshtvr</span>
      <span style={{ color: theme.textMuted, fontSize: 13, marginLeft: 8 }}>{tags}</span>
    </div>
  )
}

function Badge({ text, color, ctx }: { text: string; color: string; ctx: ThemeCtx }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '6px 16px', borderRadius: 100,
      background: `rgba(${ctx.theme.accentRgb},0.15)`,
      color, fontSize: 14, fontWeight: 700,
    }}>
      {text}
    </div>
  )
}

function LangBadge({ language, ctx }: { language: string; ctx: ThemeCtx }) {
  const lang   = (language || 'python').toLowerCase()
  const isPy   = lang === 'python' || lang === 'py'
  const isSql  = lang === 'sql'
  const colors = isPy
    ? { bg: 'rgba(55,118,171,0.18)', fg: '#4b8bbe', label: 'PYTHON' }
    : isSql
    ? { bg: 'rgba(245,158,11,0.18)', fg: '#f59e0b', label: 'SQL' }
    : { bg: `rgba(${ctx.theme.accentRgb},0.15)`, fg: ctx.theme.accent, label: lang.toUpperCase() }
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '4px 14px', borderRadius: 100,
      background: colors.bg, color: colors.fg,
      fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
    }}>
      {colors.label}
    </div>
  )
}

function CodeBlock({ code, ctx, maxChars = 1100 }: { code: string; ctx: ThemeCtx; maxChars?: number }) {
  const { theme } = ctx
  return (
    <div style={{
      flex: 1,
      background: theme.codeBg,
      borderRadius: 16,
      padding: 32,
      fontFamily: 'monospace',
      fontSize: 18,
      color: '#a5d6a7',
      lineHeight: 1.55,
      whiteSpace: 'pre',
      overflow: 'hidden',
      borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.12)`,
      display: 'flex', flexDirection: 'column',
    }}>
      {code.slice(0, maxChars)}
    </div>
  )
}

function PageFrame({ ctx, children, padding = 64, withGlow = false }: {
  ctx: ThemeCtx; children: React.ReactNode; padding?: number; withGlow?: boolean
}) {
  const { theme } = ctx
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: theme.bg, padding, overflow: 'hidden', position: 'relative',
    }}>
      {withGlow && (
        <div style={{
          position: 'absolute', top: -120, right: -120, width: 400, height: 400,
          borderRadius: 200, display: 'flex',
          background: `radial-gradient(circle, rgba(${theme.accentRgb},0.15), transparent 70%)`,
        }} />
      )}
      {children}
    </div>
  )
}

// ─── Main render ──────────────────────────────────────────────────────────────

export function renderCardSlide(post: CardPost, slide: number): ImageResponse {
  const ctx = getThemeCtx(post)
  const { theme, data, str } = ctx

  // ── code_tip ────────────────────────────────────────────────────────────────
  if (post.card_type === 'code_tip') {
    if (slide === 0) {
      return new ImageResponse(
        <PageFrame ctx={ctx} withGlow>
          <Badge text="Code Tip 💡" color={theme.accent} ctx={ctx} />
          <div style={{ marginTop: 40, fontSize: 48, fontWeight: 800, color: theme.text, lineHeight: 1.2, maxWidth: 900 }}>
            {str('question') || post.title_en}
          </div>
          <div style={{ marginTop: 24, fontSize: 22, color: theme.textMuted, lineHeight: 1.5, maxWidth: 860 }}>
            Do you know when to use it and why it matters?
          </div>
          <Brand ctx={ctx} />
        </PageFrame>,
        SIZE,
      )
    }
    if (slide === 1) {
      return new ImageResponse(
        <PageFrame ctx={ctx} padding={48}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <LangBadge language={str('language')} ctx={ctx} />
          </div>
          <CodeBlock code={str('code') || '# example'} ctx={ctx} />
          <Brand ctx={ctx} />
        </PageFrame>,
        SIZE,
      )
    }
    return new ImageResponse(
      <PageFrame ctx={ctx}>
        <Badge text="💡 Takeaway" color={theme.accent} ctx={ctx} />
        <div style={{ marginTop: 32, fontSize: 30, color: theme.text, lineHeight: 1.6, maxWidth: 920 }}>{str('explanation') || str('tip')}</div>
        <div style={{
          marginTop: 28, padding: '20px 28px', borderRadius: 14,
          background: `rgba(${theme.accentRgb},0.08)`,
          borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.2)`,
          fontSize: 26, fontWeight: 700, color: theme.accent, display: 'flex',
        }}>
          {str('takeaway') || str('tip')}
        </div>
        <Brand ctx={ctx} />
      </PageFrame>,
      SIZE,
    )
  }

  // ── qa ──────────────────────────────────────────────────────────────────────
  if (post.card_type === 'qa') {
    if (slide === 0) {
      return new ImageResponse(
        <PageFrame ctx={ctx}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <Badge text="Q&A" color={theme.accent} ctx={ctx} />
            {!!data.language && <LangBadge language={str('language')} ctx={ctx} />}
          </div>
          <div style={{
            padding: '32px 40px', borderRadius: 20,
            background: `rgba(${theme.accentRgb},0.08)`,
            borderWidth: 2, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.25)`,
            fontSize: 34, fontWeight: 700, color: theme.text, lineHeight: 1.45, display: 'flex',
          }}>
            {str('question')}
          </div>
          <div style={{ marginTop: 32, fontSize: 22, color: theme.textMuted }}>👇 Swipe for the answer</div>
          <Brand ctx={ctx} />
        </PageFrame>,
        SIZE,
      )
    }
    const hasCode = !!data.code_example
    return new ImageResponse(
      <PageFrame ctx={ctx}>
        <Badge text="Answer ✓" color={theme.accent} ctx={ctx} />
        <div style={{ marginTop: 28, fontSize: 26, color: theme.text, lineHeight: 1.6, maxWidth: 940 }}>{str('answer').slice(0, 320)}</div>
        {hasCode && (
          <div style={{
            marginTop: 24, background: theme.codeBg, borderRadius: 14, padding: 26,
            fontFamily: 'monospace', fontSize: 18, color: '#a5d6a7',
            lineHeight: 1.55, whiteSpace: 'pre', overflow: 'hidden', display: 'flex',
            borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.12)`,
          }}>
            {str('code_example').slice(0, 500)}
          </div>
        )}
        <Brand ctx={ctx} />
      </PageFrame>,
      SIZE,
    )
  }

  // ── logic_challenge ─────────────────────────────────────────────────────────
  if (post.card_type === 'logic_challenge') {
    const diffColor: Record<string, string> = { easy: '#34d399', medium: '#fbbf24', hard: '#f87171' }
    const diff = str('difficulty').toLowerCase() || 'medium'
    if (slide === 0) {
      return new ImageResponse(
        <PageFrame ctx={ctx}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 32 }}>
            <Badge text="Logic Challenge ⚡" color={theme.accent} ctx={ctx} />
            <div style={{
              padding: '6px 16px', borderRadius: 100, display: 'flex',
              background: `rgba(${diff === 'easy' ? '52,211,153' : diff === 'hard' ? '248,113,113' : '251,191,36'},0.15)`,
              color: diffColor[diff] ?? '#fbbf24', fontSize: 13, fontWeight: 700,
            }}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </div>
          </div>
          <div style={{ fontSize: 28, color: theme.text, lineHeight: 1.6, maxWidth: 940 }}>{str('challenge')}</div>
          <div style={{ marginTop: 32, fontSize: 20, color: theme.textMuted }}>⏱️ Can you solve it? Swipe for the solution →</div>
          <Brand ctx={ctx} />
        </PageFrame>,
        SIZE,
      )
    }
    const solution  = str('solution')
    const hasCodeBlock = solution.includes('\n') && (solution.includes('def ') || solution.includes('SELECT') || solution.includes('import '))
    return new ImageResponse(
      <PageFrame ctx={ctx}>
        <Badge text="Solution ✓" color={theme.accent} ctx={ctx} />
        {hasCodeBlock ? (
          <CodeBlock code={solution} ctx={ctx} maxChars={900} />
        ) : (
          <div style={{ marginTop: 28, fontSize: 24, color: theme.text, lineHeight: 1.65, maxWidth: 940, whiteSpace: 'pre-wrap' }}>{solution.slice(0, 600)}</div>
        )}
        <Brand ctx={ctx} />
      </PageFrame>,
      SIZE,
    )
  }

  // ── study ───────────────────────────────────────────────────────────────────
  if (post.card_type === 'study') {
    return new ImageResponse(
      <PageFrame ctx={ctx}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          <Badge text={str('topic') || 'Study'} color={theme.accent} ctx={ctx} />
        </div>
        <div style={{ fontSize: 100, color: `rgba(${theme.accentRgb},0.15)`, lineHeight: 0.8, fontFamily: 'Georgia, serif', display: 'flex' }}>"</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: theme.text, lineHeight: 1.45, maxWidth: 920, marginTop: 8 }}>{str('finding').slice(0, 320)}</div>
        {!!data.source && (
          <div style={{
            marginTop: 28, fontSize: 18, color: theme.textMuted,
            padding: '10px 20px', borderRadius: 8,
            background: `rgba(${theme.accentRgb},0.06)`,
            borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.12)`,
            display: 'flex',
          }}>
            📚 {str('source')}
          </div>
        )}
        <Brand ctx={ctx} />
      </PageFrame>,
      SIZE,
    )
  }

  // ── announcement ────────────────────────────────────────────────────────────
  if (post.card_type === 'announcement') {
    return new ImageResponse(
      <PageFrame ctx={ctx} withGlow>
        <Badge text="📢 Announcement" color={theme.accent} ctx={ctx} />
        <div style={{ marginTop: 32, fontSize: 52, fontWeight: 800, color: theme.text, lineHeight: 1.1 }}>{str('headline') || post.title_en}</div>
        <div style={{ marginTop: 28, fontSize: 26, color: theme.textMuted, lineHeight: 1.55, maxWidth: 880 }}>{str('description').slice(0, 220)}</div>
        {!!data.cta && (
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', padding: '14px 32px', borderRadius: 100, background: `rgba(${theme.accentRgb},0.2)`, color: theme.accent, fontSize: 20, fontWeight: 700, width: 'fit-content' }}>
            {str('cta')} →
          </div>
        )}
        <Brand ctx={ctx} />
      </PageFrame>,
      SIZE,
    )
  }

  // ── devlog ──────────────────────────────────────────────────────────────────
  if (post.card_type === 'devlog') {
    return new ImageResponse(
      <PageFrame ctx={ctx}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24 }}>
          <Badge text={`🛠️ ${str('project') || 'Devlog'}`} color={theme.accent} ctx={ctx} />
          {!!data.milestone && (
            <div style={{ padding: '6px 16px', borderRadius: 100, display: 'flex', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontSize: 13, fontWeight: 700 }}>
              {str('milestone')}
            </div>
          )}
        </div>
        <div style={{ fontSize: 30, color: theme.text, lineHeight: 1.65, maxWidth: 940 }}>{str('update').slice(0, 420)}</div>
        {Array.isArray(data.tech_tags) && (
          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {(data.tech_tags as string[]).slice(0, 5).map((t, i) => (
              <div key={i} style={{ padding: '6px 14px', borderRadius: 8, display: 'flex', background: `rgba(${theme.accentRgb},0.08)`, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                {t}
              </div>
            ))}
          </div>
        )}
        <Brand ctx={ctx} />
      </PageFrame>,
      SIZE,
    )
  }

  // ── Fallback ────────────────────────────────────────────────────────────────
  return new ImageResponse(
    <PageFrame ctx={ctx} withGlow>
      <div style={{ fontSize: 20, color: theme.textMuted, marginBottom: 32 }}>joshtvr.com</div>
      <div style={{ fontSize: 52, fontWeight: 800, color: theme.text, lineHeight: 1.1, maxWidth: 900 }}>{post.title_en}</div>
      <Brand ctx={ctx} />
    </PageFrame>,
    SIZE,
  )
}
