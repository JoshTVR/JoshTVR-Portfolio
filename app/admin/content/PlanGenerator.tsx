'use client'

import React, { useState } from 'react'
import type { ThemeRotationState } from '@/lib/theme-engine'
import { resolveThemeForDate } from '@/lib/theme-engine'

interface BurstWeek {
  start: string
  end: string
  topic: string
}

interface MyContent {
  date: string
  type: 'devlog' | 'video_promo' | 'announcement'
  description: string
}

export function PlanGenerator({ themeState }: { themeState: ThemeRotationState }) {
  const [period,    setPeriod]    = useState<'month' | 'year'>('month')
  const [month,     setMonth]     = useState(() => new Date().toISOString().slice(0, 7))
  const [year,      setYear]      = useState(() => String(new Date().getFullYear()))
  const [freq,      setFreq]      = useState(2)  // posts/day
  const [aiMix,     setAiMix]     = useState({ code_tip: 40, qa: 25, logic_challenge: 20, study: 15 })
  const [burstWeeks, setBurstWeeks] = useState<BurstWeek[]>([])
  const [myContent,  setMyContent]  = useState<MyContent[]>([])
  const [prompt,    setPrompt]    = useState('')

  // Burst week form
  const [bStart, setBStart] = useState('')
  const [bEnd,   setBEnd]   = useState('')
  const [bTopic, setBTopic] = useState('')

  // My content form
  const [mcDate,  setMcDate]  = useState('')
  const [mcType,  setMcType]  = useState<'devlog' | 'video_promo' | 'announcement'>('devlog')
  const [mcDesc,  setMcDesc]  = useState('')

  function addBurstWeek() {
    if (!bStart || !bEnd || !bTopic) return
    setBurstWeeks(prev => [...prev, { start: bStart, end: bEnd, topic: bTopic }])
    setBStart(''); setBEnd(''); setBTopic('')
  }

  function addMyContent() {
    if (!mcDate || !mcDesc) return
    setMyContent(prev => [...prev, { date: mcDate, type: mcType, description: mcDesc }])
    setMcDate(''); setMcDesc('')
  }

  function generatePrompt() {
    const startDate = period === 'month' ? `${month}-01` : `${year}-01-01`
    const endDate   = period === 'month'
      ? new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0).toISOString().slice(0, 10)
      : `${year}-12-31`

    // Compute themes for each month in range
    const monthThemes: Record<string, string> = {}
    const start = new Date(startDate)
    const end   = new Date(endDate)
    const cur   = new Date(start.getFullYear(), start.getMonth(), 1)
    while (cur <= end) {
      const ym = cur.toISOString().slice(0, 7)
      monthThemes[ym] = resolveThemeForDate(`${ym}-01`, themeState)
      cur.setMonth(cur.getMonth() + 1)
    }

    const totalDays = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1
    const totalPosts = totalDays * freq

    const p = `# Content Plan Request — ${period === 'month' ? month : year}

## Period
- Start: ${startDate}
- End: ${endDate}
- Frequency: ${freq} post(s) per day
- Total posts to generate: ~${totalPosts}

## AI Content Mix (% of AI posts)
${Object.entries(aiMix).map(([type, pct]) => `- ${type}: ${pct}%`).join('\n')}

## Theme Schedule
${Object.entries(monthThemes).map(([ym, theme]) => `- ${ym}: ${theme}`).join('\n')}

## My Content (manual — include in plan, do not change)
${myContent.length === 0 ? '(none)' : myContent.map(mc => `- ${mc.date} [${mc.type}]: ${mc.description}`).join('\n')}

## Burst Weeks (add ON TOP of regular schedule, same frequency)
${burstWeeks.length === 0 ? '(none)' : burstWeeks.map(b => `- ${b.start} to ${b.end}: "${b.topic}" — use burst_group_id: "burst-${b.topic.toLowerCase().replace(/\s+/g, '-')}-${b.start}"`).join('\n')}

---

## Card Type Schemas (card_data fields per type)

**code_tip** (3 slides):
\`\`\`json
{ "title_en": "...", "card_type": "code_tip", "card_data": { "language": "javascript", "code": "...", "tip": "key takeaway" }, "tags": ["js","tip"] }
\`\`\`

**qa** (2 slides):
\`\`\`json
{ "card_type": "qa", "card_data": { "question": "...", "answer": "...", "language": "javascript" } }
\`\`\`

**logic_challenge** (2 slides):
\`\`\`json
{ "card_type": "logic_challenge", "card_data": { "challenge": "...", "solution": "...", "difficulty": "medium" } }
\`\`\`

**study** (single):
\`\`\`json
{ "card_type": "study", "card_data": { "finding": "...", "source": "...", "topic": "JavaScript" } }
\`\`\`

**devlog** (single):
\`\`\`json
{ "card_type": "devlog", "card_data": { "project": "Apheeleon", "update": "...", "milestone": "v0.4" } }
\`\`\`

**video_promo** (single):
\`\`\`json
{ "card_type": "video_promo", "card_data": { "title": "...", "channelName": "JoshTVR" } }
\`\`\`

**announcement** (single):
\`\`\`json
{ "card_type": "announcement", "card_data": { "headline": "...", "description": "...", "cta": "Learn more" } }
\`\`\`

---

## Required Output Format

Respond with ONLY a JSON array of post objects. No markdown, no explanation, just the JSON array.

Each post object must have ALL of these fields:
\`\`\`json
{
  "title_en": "string",
  "title_es": "Spanish translation of title",
  "excerpt_en": "1-2 sentence hook in English",
  "excerpt_es": "1-2 sentence hook in Spanish",
  "content_en": "Full post body in English — NEVER empty. Write 2-4 paragraphs explaining the concept, the WHY behind it, and a real-world use case.",
  "content_es": "Full post body in Spanish — NEVER empty. Translate content_en completely.",
  "type": "post | devlog | announcement | tutorial",
  "card_type": "code_tip | qa | logic_challenge | study | devlog | video_promo | announcement",
  "card_data": { ... fields per schema above ... },
  "tags": ["tag1","tag2"],
  "color_theme": "midnight | matrix | sunset | ocean | minimal | neon | spooky | holiday",
  "scheduled_at": "ISO datetime string e.g. 2026-03-15T09:00:00.000Z",
  "is_ai_generated": true,
  "burst_group_id": "string or null"
}
\`\`\`

## Important Rules
1. Use the theme assigned to each month (see Theme Schedule above).
2. For seasonal months (Oct 15-31 = spooky, Dec = holiday), use the seasonal theme regardless of the schedule.
3. Write COMPLETE content for each post — full code snippets, full questions, full answers. NO placeholders, NO ellipsis, NO "...".
4. content_en and content_es must NEVER be empty strings. They must be full explanatory text (2-4 paragraphs minimum).
5. **code_tip**: Include the full code snippet, then explain WHY this technique exists, when to use it, and a common mistake to avoid. Real, runnable code only.
6. **qa**: Use an analogy from everyday life (cooking, construction, sports) to explain the concept before the technical answer. Make it memorable.
7. **logic_challenge**: Include the full challenge statement, constraints, and example input/output. The solution must show the reasoning step by step, not just the final code.
8. **study**: Include a real finding or statistic from a known source (MDN, TC39, research papers), then show a practical application in a small code example.
9. Distribute types according to the AI Mix percentages above.
10. Space posts evenly throughout each day (e.g., if 2/day: 09:00 and 18:00 UTC).
11. My Content items override AI content for that date/slot.
12. Burst week posts get their burst_group_id and are ADDED to the regular ${freq}/day schedule (so burst days will have more posts).
13. All card_data fields are in English. title_es and content_es are full Spanish translations — not summaries.
`

    setPrompt(p)
  }

  function copyPrompt() {
    navigator.clipboard.writeText(prompt)
  }

  const totalPct = Object.values(aiMix).reduce((s, v) => s + v, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px' }}>

      {/* Period */}
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>Period & Frequency</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={lbl}>Plan period</label>
            <select className="admin-input" value={period} onChange={e => setPeriod(e.target.value as 'month' | 'year')}>
              <option value="month">Single Month</option>
              <option value="year">Full Year</option>
            </select>
          </div>
          {period === 'month' ? (
            <div>
              <label style={lbl}>Month</label>
              <input type="month" className="admin-input" value={month} onChange={e => setMonth(e.target.value)} />
            </div>
          ) : (
            <div>
              <label style={lbl}>Year</label>
              <input type="number" className="admin-input" value={year} onChange={e => setYear(e.target.value)} min="2025" max="2030" />
            </div>
          )}
          <div>
            <label style={lbl}>Posts per day</label>
            <select className="admin-input" value={freq} onChange={e => setFreq(Number(e.target.value))}>
              <option value={1}>1 / day</option>
              <option value={2}>2 / day</option>
              <option value={3}>3 / day</option>
            </select>
          </div>
        </div>
      </section>

      {/* AI Mix */}
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>AI Content Mix <span style={{ fontWeight: 400, color: totalPct !== 100 ? '#f87171' : '#34d399', fontSize: '0.8rem' }}>({totalPct}% — should be 100%)</span></h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {(Object.keys(aiMix) as (keyof typeof aiMix)[]).map(type => (
            <div key={type}>
              <label style={lbl}>{type} (%)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range" min={0} max={100} step={5}
                  value={aiMix[type]}
                  onChange={e => setAiMix(prev => ({ ...prev, [type]: Number(e.target.value) }))}
                  style={{ flex: 1, accentColor: '#7c3aed' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', minWidth: '36px', textAlign: 'right' }}>
                  {aiMix[type]}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Content */}
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>My Content Schedule</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Devlogs, YouTube videos, announcements — placed on specific dates.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr auto', gap: '8px', marginBottom: '8px' }}>
          <input type="date" className="admin-input" value={mcDate} onChange={e => setMcDate(e.target.value)} style={{ fontSize: '0.82rem' }} />
          <select className="admin-input" value={mcType} onChange={e => setMcType(e.target.value as typeof mcType)} style={{ fontSize: '0.82rem' }}>
            <option value="devlog">Devlog</option>
            <option value="video_promo">Video Promo</option>
            <option value="announcement">Announcement</option>
          </select>
          <input className="admin-input" value={mcDesc} onChange={e => setMcDesc(e.target.value)} placeholder="Description / milestone" style={{ fontSize: '0.82rem' }} />
          <button type="button" onClick={addMyContent} style={addBtn}>Add</button>
        </div>
        {myContent.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {myContent.map((mc, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{mc.date} — <strong>{mc.type}</strong>: {mc.description}</span>
                <button onClick={() => setMyContent(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Burst Weeks */}
      <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
        <h3 style={sectionHead}>Burst Weeks</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Intensive topic weeks — posts added ON TOP of regular schedule, grouped by topic.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '130px 130px 1fr auto', gap: '8px', marginBottom: '8px' }}>
          <input type="date" className="admin-input" value={bStart} onChange={e => setBStart(e.target.value)} placeholder="Start" style={{ fontSize: '0.82rem' }} />
          <input type="date" className="admin-input" value={bEnd}   onChange={e => setBEnd(e.target.value)}   placeholder="End"   style={{ fontSize: '0.82rem' }} />
          <input className="admin-input" value={bTopic} onChange={e => setBTopic(e.target.value)} placeholder="e.g. Python Deep Dive" style={{ fontSize: '0.82rem' }} />
          <button type="button" onClick={addBurstWeek} style={addBtn}>Add</button>
        </div>
        {burstWeeks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {burstWeeks.map((bw, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{bw.start} → {bw.end}: <strong>{bw.topic}</strong></span>
                <button onClick={() => setBurstWeeks(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Generate */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button type="button" onClick={generatePrompt}
          style={{ padding: '12px 28px', borderRadius: '10px', background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.4)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
          Generate Claude Prompt
        </button>
      </div>

      {/* Generated prompt */}
      {prompt && (
        <section className="glass" style={{ padding: '20px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ ...sectionHead, margin: 0 }}>Claude Prompt</h3>
            <button type="button" onClick={copyPrompt}
              style={{ padding: '7px 14px', borderRadius: '7px', background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
              Copy
            </button>
          </div>
          <textarea
            readOnly
            value={prompt}
            rows={20}
            style={{
              width: '100%', fontFamily: 'monospace', fontSize: '0.75rem',
              background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '12px', color: 'var(--text-muted)',
              resize: 'vertical', lineHeight: 1.5, boxSizing: 'border-box',
            }}
          />
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Paste this into Claude.ai → copy the JSON array response → go to "Import JSON" tab.
          </p>
        </section>
      )}
    </div>
  )
}

const sectionHead: React.CSSProperties = {
  fontFamily: 'var(--font-heading)', fontSize: '0.88rem', fontWeight: 700,
  color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px',
}
const lbl: React.CSSProperties = {
  display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px',
}
const addBtn: React.CSSProperties = {
  padding: '0 14px', borderRadius: '7px', background: 'rgba(124,58,237,0.15)',
  color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer',
  fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap',
}
