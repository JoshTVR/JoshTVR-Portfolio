'use client'

import { useEffect, useRef, useState } from 'react'

const LINES = [
  '> Initializing portfolio...',
  '> Developer ready.\n',
  'const dev = {',
  '  name:      "Joshua Hernandez",',
  '  alias:     "JoshTVR",',
  '  role:      "Fullstack Dev & 3D Artist",',
  '  stack:     ["Next.js", "Python", "Blender"],',
  '  focus:     ["VR/AR", "Data Science", "3D"],',
  '  available:  true, // open to work',
  '}',
]

export default function TerminalBlock() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const full = LINES.join('\n')
    let i = 0
    let tid: ReturnType<typeof setTimeout>

    function tick() {
      i++
      setDisplayed(full.slice(0, i))
      if (i < full.length) {
        // Faster on comment/bracket chars, slower on letters
        const ch = full[i] ?? ''
        const delay = ch === '\n' ? 60 : /[{},[\]]/.test(ch) ? 18 : 22
        tid = setTimeout(tick, delay)
      } else {
        setDone(true)
      }
    }

    // Start after short delay
    tid = setTimeout(tick, 600)
    return () => clearTimeout(tid)
  }, [])

  // Syntax highlight pass
  function highlight(text: string) {
    return text
      .replace(/(&gt;[^\n]*)/g, '<span class="t-cmd">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="t-comment">$1</span>')
      .replace(/"([^"]*)"/g, '<span class="t-str">"$1"</span>')
      .replace(/\b(const|true|false)\b/g, '<span class="t-kw">$1</span>')
      .replace(/\b(name|alias|role|stack|focus|available)\b/g, '<span class="t-key">$1</span>')
  }

  const safe = displayed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return (
    <div
      ref={ref}
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, monospace',
        fontSize: 'clamp(0.72rem, 1.1vw, 0.82rem)',
        lineHeight: 1.7,
      }}
    >
      {/* Title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', display: 'block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', display: 'block' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', display: 'block' }} />
        <span style={{ marginLeft: 8, fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', userSelect: 'none' }}>
          portfolio.js
        </span>
      </div>

      {/* Code area */}
      <div style={{ padding: '18px 20px', minHeight: '220px' }}>
        <pre
          style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#cdd6f4' }}
          dangerouslySetInnerHTML={{
            __html: highlight(safe) + (done ? '' : '<span class="t-cursor">▋</span>'),
          }}
        />
      </div>

      <style>{`
        .t-cmd     { color: #6c7086; }
        .t-comment { color: #585b70; font-style: italic; }
        .t-str     { color: #a6e3a1; }
        .t-kw      { color: #cba6f7; }
        .t-key     { color: #89b4fa; }
        .t-cursor  { animation: cur 1s step-end infinite; }
        @keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}
