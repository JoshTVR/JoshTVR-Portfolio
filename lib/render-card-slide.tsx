import { ImageResponse } from 'next/og'
import { THEMES, type ThemeName } from '@/components/content-cards/themes'

export type CardPost = {
  card_type: string | null
  card_data: Record<string, unknown> | null
  color_theme: string | null
  title_en: string
  tags: string[] | null
}

export function renderCardSlide(post: CardPost, slide: number): ImageResponse {
  const themeName = (post.color_theme ?? 'midnight') as ThemeName
  const theme     = THEMES[themeName] ?? THEMES.midnight
  const data      = (post.card_data ?? {}) as Record<string, unknown>

  const str  = (k: string) => String(data[k] ?? '')
  const tags = ((post.tags ?? []) as string[]).map(t => `#${t}`).join(' ')

  function Brand() {
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

  function Badge({ text, color }: { text: string; color: string }) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '6px 16px', borderRadius: 100,
        background: `rgba(${theme.accentRgb},0.15)`,
        color, fontSize: 14, fontWeight: 700,
      }}>
        {text}
      </div>
    )
  }

  // ── code_tip ──────────────────────────────────────────────────────────────────
  if (post.card_type === 'code_tip') {
    if (slide === 0) {
      return new ImageResponse(
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: theme.bg, padding: 64, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -120, right: -120, width: 400, height: 400,
            borderRadius: 200, background: `radial-gradient(circle, rgba(${theme.accentRgb},0.15), transparent 70%)`,
            display: 'flex',
          }} />
          <Badge text="Code Tip 💡" color={theme.accent} />
          <div style={{ marginTop: 40, fontSize: 48, fontWeight: 800, color: theme.text, lineHeight: 1.2, maxWidth: 900 }}>
            {str('question') || post.title_en}
          </div>
          <div style={{ marginTop: 24, fontSize: 22, color: theme.textMuted, lineHeight: 1.5, maxWidth: 860 }}>
            ¿Sabes cuándo usarlo y por qué importa?
          </div>
          <Brand />
        </div>,
        { width: 1080, height: 1080 },
      )
    }
    if (slide === 1) {
      const lang = str('language') || 'js'
      const code = str('code') || '// example'
      return new ImageResponse(
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 48, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ padding: '4px 14px', borderRadius: 100, background: `rgba(${theme.accentRgb},0.15)`, color: theme.accent, fontSize: 13, fontWeight: 700, display: 'flex' }}>
              {lang.toUpperCase()}
            </div>
          </div>
          <div style={{
            flex: 1, background: theme.codeBg, borderRadius: 16, padding: 36,
            fontFamily: 'monospace', fontSize: 22, color: '#a5d6a7',
            lineHeight: 1.7, whiteSpace: 'pre', overflow: 'hidden',
            borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.12)`,
            display: 'flex', flexDirection: 'column',
          }}>
            {code.slice(0, 600)}
          </div>
          <Brand />
        </div>,
        { width: 1080, height: 1080 },
      )
    }
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden' }}>
        <Badge text="💡 Takeaway" color={theme.accent} />
        <div style={{ marginTop: 32, fontSize: 30, color: theme.text, lineHeight: 1.6, maxWidth: 920 }}>{str('explanation')}</div>
        <div style={{
          marginTop: 28, padding: '20px 28px', borderRadius: 14,
          background: `rgba(${theme.accentRgb},0.08)`,
          borderWidth: 1, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.2)`,
          fontSize: 26, fontWeight: 700, color: theme.accent, display: 'flex',
        }}>
          {str('takeaway')}
        </div>
        <Brand />
      </div>,
      { width: 1080, height: 1080 },
    )
  }

  // ── qa ────────────────────────────────────────────────────────────────────────
  if (post.card_type === 'qa') {
    if (slide === 0) {
      return new ImageResponse(
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            <Badge text="Q&A" color={theme.accent} />
          </div>
          <div style={{
            padding: '32px 40px', borderRadius: 20,
            background: `rgba(${theme.accentRgb},0.08)`,
            borderWidth: 2, borderStyle: 'solid', borderColor: `rgba(${theme.accentRgb},0.25)`,
            fontSize: 34, fontWeight: 700, color: theme.text, lineHeight: 1.45, display: 'flex',
          }}>
            {str('question')}
          </div>
          <div style={{ marginTop: 32, fontSize: 22, color: theme.textMuted }}>👇 Swipe para ver la respuesta</div>
          <Brand />
        </div>,
        { width: 1080, height: 1080 },
      )
    }
    const hasCode = !!data.code_example
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden' }}>
        <Badge text="Respuesta ✓" color={theme.accent} />
        <div style={{ marginTop: 28, fontSize: 26, color: theme.text, lineHeight: 1.6, maxWidth: 940 }}>{str('answer').slice(0, 300)}</div>
        {hasCode && (
          <div style={{
            marginTop: 24, background: theme.codeBg, borderRadius: 14, padding: 28,
            fontFamily: 'monospace', fontSize: 20, color: '#a5d6a7',
            lineHeight: 1.6, whiteSpace: 'pre', overflow: 'hidden', display: 'flex',
          }}>
            {str('code_example').slice(0, 300)}
          </div>
        )}
        <Brand />
      </div>,
      { width: 1080, height: 1080 },
    )
  }

  // ── logic_challenge ───────────────────────────────────────────────────────────
  if (post.card_type === 'logic_challenge') {
    const diffColor: Record<string, string> = { easy: '#34d399', medium: '#fbbf24', hard: '#f87171' }
    const diff = str('difficulty').toLowerCase() || 'medium'
    if (slide === 0) {
      return new ImageResponse(
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 32 }}>
            <Badge text="Logic Challenge ⚡" color={theme.accent} />
            <div style={{
              padding: '6px 16px', borderRadius: 100, display: 'flex',
              background: `rgba(${diff === 'easy' ? '52,211,153' : diff === 'hard' ? '248,113,113' : '251,191,36'},0.15)`,
              color: diffColor[diff] ?? '#fbbf24', fontSize: 13, fontWeight: 700,
            }}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </div>
          </div>
          <div style={{ fontSize: 28, color: theme.text, lineHeight: 1.6, maxWidth: 940 }}>{str('challenge')}</div>
          <div style={{ marginTop: 32, fontSize: 20, color: theme.textMuted }}>⏱️ ¿Puedes resolverlo? Swipe para la solución →</div>
          <Brand />
        </div>,
        { width: 1080, height: 1080 },
      )
    }
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden' }}>
        <Badge text="Solución ✓" color={theme.accent} />
        <div style={{ marginTop: 28, fontSize: 26, color: theme.text, lineHeight: 1.7, maxWidth: 940, whiteSpace: 'pre-wrap' }}>{str('solution').slice(0, 500)}</div>
        <Brand />
      </div>,
      { width: 1080, height: 1080 },
    )
  }

  // ── study ─────────────────────────────────────────────────────────────────────
  if (post.card_type === 'study') {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 32 }}>
          <Badge text={str('topic') || 'Study'} color={theme.accent} />
        </div>
        <div style={{ fontSize: 100, color: `rgba(${theme.accentRgb},0.15)`, lineHeight: 0.8, fontFamily: 'Georgia, serif', display: 'flex' }}>"</div>
        <div style={{ fontSize: 30, fontWeight: 700, color: theme.text, lineHeight: 1.45, maxWidth: 920, marginTop: 8 }}>{str('finding').slice(0, 300)}</div>
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
        <Brand />
      </div>,
      { width: 1080, height: 1080 },
    )
  }

  // ── announcement ──────────────────────────────────────────────────────────────
  if (post.card_type === 'announcement') {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, borderRadius: 180, display: 'flex', background: `radial-gradient(circle, rgba(${theme.accentRgb},0.2), transparent 70%)` }} />
        <Badge text="📢 Announcement" color={theme.accent} />
        <div style={{ marginTop: 32, fontSize: 52, fontWeight: 800, color: theme.text, lineHeight: 1.1 }}>{str('headline') || post.title_en}</div>
        <div style={{ marginTop: 28, fontSize: 26, color: theme.textMuted, lineHeight: 1.55, maxWidth: 880 }}>{str('description').slice(0, 200)}</div>
        {!!data.cta && (
          <div style={{ marginTop: 36, display: 'flex', alignItems: 'center', padding: '14px 32px', borderRadius: 100, background: `rgba(${theme.accentRgb},0.2)`, color: theme.accent, fontSize: 20, fontWeight: 700, width: 'fit-content' }}>
            {str('cta')} →
          </div>
        )}
        <Brand />
      </div>,
      { width: 1080, height: 1080 },
    )
  }

  // ── devlog ────────────────────────────────────────────────────────────────────
  if (post.card_type === 'devlog') {
    return new ImageResponse(
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24 }}>
          <Badge text={`🛠️ ${str('project') || 'Devlog'}`} color={theme.accent} />
          {!!data.milestone && (
            <div style={{ padding: '6px 16px', borderRadius: 100, display: 'flex', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontSize: 13, fontWeight: 700 }}>
              {str('milestone')}
            </div>
          )}
        </div>
        <div style={{ fontSize: 30, color: theme.text, lineHeight: 1.65, maxWidth: 940 }}>{str('update').slice(0, 400)}</div>
        {Array.isArray(data.tech_tags) && (
          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {(data.tech_tags as string[]).slice(0, 5).map((t, i) => (
              <div key={i} style={{ padding: '6px 14px', borderRadius: 8, display: 'flex', background: `rgba(${theme.accentRgb},0.08)`, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                {t}
              </div>
            ))}
          </div>
        )}
        <Brand />
      </div>,
      { width: 1080, height: 1080 },
    )
  }

  // ── Fallback ──────────────────────────────────────────────────────────────────
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: theme.bg, padding: 64, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 200, display: 'flex', background: `radial-gradient(circle, rgba(${theme.accentRgb},0.15), transparent 70%)` }} />
      <div style={{ fontSize: 20, color: theme.textMuted, marginBottom: 32 }}>joshtvr.com</div>
      <div style={{ fontSize: 52, fontWeight: 800, color: theme.text, lineHeight: 1.1, maxWidth: 900 }}>{post.title_en}</div>
      <Brand />
    </div>,
    { width: 1080, height: 1080 },
  )
}
