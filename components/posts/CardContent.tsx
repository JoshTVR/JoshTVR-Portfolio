/**
 * Server component that renders card_data as readable HTML for each card_type.
 * Used on the post page to show content for AI-generated posts that have no content_en.
 */

interface CardContentProps {
  type: string
  data: Record<string, unknown>
}

function str(data: Record<string, unknown>, key: string): string {
  return String(data[key] ?? '')
}

function has(data: Record<string, unknown>, key: string): boolean {
  return !!data[key]
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div style={{ position: 'relative', marginTop: '16px', marginBottom: '16px' }}>
      {language && (
        <div style={{
          display: 'inline-block', marginBottom: '6px', padding: '2px 10px',
          borderRadius: '4px', background: 'rgba(124,58,237,0.12)',
          color: 'var(--accent-light)', fontSize: '0.72rem', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {language}
        </div>
      )}
      <pre style={{
        background: '#0d1117', borderRadius: '10px', padding: '20px 24px',
        fontSize: '0.88rem', lineHeight: 1.7, color: '#a5d6a7',
        overflowX: 'auto', margin: 0, fontFamily: 'monospace',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function Tag({ text }: { text: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '3px 12px', borderRadius: '20px',
      background: 'rgba(124,58,237,0.10)', color: 'var(--accent-light)',
      fontSize: '0.75rem', fontWeight: 600, marginRight: '6px', marginBottom: '6px',
    }}>
      {text}
    </span>
  )
}

export function CardContent({ type, data }: CardContentProps) {
  if (type === 'code_tip') {
    return (
      <div style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
        {has(data, 'question') && (
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {str(data, 'question')}
          </h2>
        )}
        {has(data, 'language') && has(data, 'code') && (
          <CodeBlock code={str(data, 'code')} language={str(data, 'language')} />
        )}
        {has(data, 'explanation') && (
          <p style={{ fontSize: '1rem', marginTop: '16px' }}>{str(data, 'explanation')}</p>
        )}
        {has(data, 'takeaway') && (
          <div style={{
            marginTop: '16px', padding: '14px 20px', borderRadius: '10px',
            background: 'rgba(124,58,237,0.07)', borderLeft: '3px solid var(--accent)',
            fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)',
          }}>
            💡 {str(data, 'takeaway')}
          </div>
        )}
      </div>
    )
  }

  if (type === 'qa') {
    return (
      <div style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
        {has(data, 'question') && (
          <blockquote style={{
            margin: '0 0 20px 0', padding: '16px 20px',
            borderLeft: '4px solid var(--accent)',
            background: 'rgba(124,58,237,0.07)', borderRadius: '0 8px 8px 0',
            fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)',
          }}>
            {str(data, 'question')}
          </blockquote>
        )}
        {has(data, 'answer') && (
          <p style={{ fontSize: '1rem', marginBottom: '16px' }}>{str(data, 'answer')}</p>
        )}
        {has(data, 'code_example') && (
          <CodeBlock code={str(data, 'code_example')} language={str(data, 'language') || undefined} />
        )}
      </div>
    )
  }

  if (type === 'logic_challenge') {
    const diffColors: Record<string, string> = {
      easy: '#34d399', medium: '#fbbf24', hard: '#f87171',
    }
    const diff = str(data, 'difficulty').toLowerCase() || 'medium'
    return (
      <div style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
            background: `rgba(${diff === 'easy' ? '52,211,153' : diff === 'hard' ? '248,113,113' : '251,191,36'},0.12)`,
            color: diffColors[diff] ?? '#fbbf24',
          }}>
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏱️ Logic Challenge</span>
        </div>
        {has(data, 'challenge') && (
          <div style={{
            padding: '16px 20px', borderRadius: '10px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '1rem', marginBottom: '20px', color: 'var(--text-primary)',
          }}>
            {str(data, 'challenge')}
          </div>
        )}
        {has(data, 'hint') && (
          <p style={{ fontSize: '0.9rem', marginBottom: '16px', fontStyle: 'italic' }}>
            💡 Hint: {str(data, 'hint')}
          </p>
        )}
        {has(data, 'solution') && (
          <details style={{ marginTop: '16px' }}>
            <summary style={{
              cursor: 'pointer', padding: '10px 16px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
              fontWeight: 600, fontSize: '0.9rem', userSelect: 'none',
            }}>
              Ver solución
            </summary>
            <div style={{ marginTop: '12px', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
              {str(data, 'solution')}
            </div>
          </details>
        )}
      </div>
    )
  }

  if (type === 'study') {
    return (
      <div style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
        {has(data, 'topic') && <Tag text={str(data, 'topic')} />}
        {has(data, 'finding') && (
          <blockquote style={{
            margin: '16px 0', padding: '20px 28px',
            borderLeft: '4px solid var(--accent)',
            background: 'rgba(124,58,237,0.07)', borderRadius: '0 8px 8px 0',
            fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', fontStyle: 'italic',
          }}>
            {str(data, 'finding')}
          </blockquote>
        )}
        {has(data, 'source') && (
          <p style={{ fontSize: '0.82rem', marginTop: '8px' }}>
            📚 <em>{str(data, 'source')}</em>
          </p>
        )}
        {Array.isArray(data.tags) && (
          <div style={{ marginTop: '16px' }}>
            {(data.tags as string[]).map(t => <Tag key={t} text={`#${t}`} />)}
          </div>
        )}
      </div>
    )
  }

  if (type === 'announcement') {
    return (
      <div style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
        {has(data, 'headline') && (
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {str(data, 'headline')}
          </h2>
        )}
        {has(data, 'description') && (
          <p style={{ fontSize: '1rem', marginBottom: '16px' }}>{str(data, 'description')}</p>
        )}
        {has(data, 'cta') && has(data, 'link') && (
          <a
            href={str(data, 'link')}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block', padding: '10px 24px', borderRadius: '8px',
              background: 'rgba(124,58,237,0.15)', color: 'var(--accent-light)',
              fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
              border: '1px solid rgba(124,58,237,0.3)',
            }}
          >
            {str(data, 'cta')} →
          </a>
        )}
      </div>
    )
  }

  if (type === 'devlog') {
    return (
      <div style={{ color: 'var(--text-muted)', lineHeight: 1.75 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          {has(data, 'project') && (
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
              background: 'rgba(124,58,237,0.12)', color: 'var(--accent-light)',
            }}>
              🛠️ {str(data, 'project')}
            </span>
          )}
          {has(data, 'milestone') && (
            <span style={{
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700,
              background: 'rgba(251,191,36,0.12)', color: '#fbbf24',
            }}>
              {str(data, 'milestone')}
            </span>
          )}
        </div>
        {has(data, 'update') && (
          <p style={{ fontSize: '1rem', marginBottom: '16px' }}>{str(data, 'update')}</p>
        )}
        {Array.isArray(data.tech_tags) && (
          <div style={{ marginTop: '8px' }}>
            {(data.tech_tags as string[]).map(t => <Tag key={t} text={t} />)}
          </div>
        )}
      </div>
    )
  }

  return null
}
