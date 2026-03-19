import type { ReactNode } from 'react'

interface SkillCategory {
  icon: ReactNode
  title: string
  skills: string[]
}

interface SkillsSectionProps {
  title?: string
  categories?: SkillCategory[]
}

const VRIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.5 6H3.5C2.12 6 1 7.12 1 8.5v7C1 16.88 2.12 18 3.5 18h3.69c.73 0 1.42-.32 1.89-.87l1.5-1.74c.27-.31.65-.39 1.02-.4.37.01.75.09 1.02.4l1.5 1.74c.47.55 1.16.87 1.89.87H20.5c1.38 0 2.5-1.12 2.5-2.5v-7C23 7.12 21.88 6 20.5 6zM7.5 14C6.12 14 5 12.88 5 11.5S6.12 9 7.5 9 10 10.12 10 11.5 8.88 14 7.5 14zm9 0c-1.38 0-2.5-1.12-2.5-2.5S15.12 9 16.5 9 19 10.12 19 11.5 17.88 14 16.5 14z"/>
  </svg>
)

const BrainIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
  </svg>
)

const DatabaseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.59 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17c0 .5-2.13 2-6 2zm0-4c-3.87 0-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V13c0 .5-2.13 2-6 2z"/>
  </svg>
)

const PaletteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
)

const defaultCategories: SkillCategory[] = [
  {
    icon: <VRIcon />,
    title: 'VR / 3D Development',
    skills: ['Unity', 'Blender', 'Maya', 'C#', 'XR Interaction Toolkit', 'Oculus SDK'],
  },
  {
    icon: <BrainIcon />,
    title: 'Data Science / AI / ML',
    skills: ['Python', 'TensorFlow', 'Jupyter Notebook', 'Pandas', 'Scikit-Learn', 'NumPy'],
  },
  {
    icon: <DatabaseIcon />,
    title: 'Backend / Databases',
    skills: ['SQL', 'SQL Server', 'Java', 'REST APIs', 'Database Design'],
  },
  {
    icon: <PaletteIcon />,
    title: 'Design / Multimedia',
    skills: ['Adobe Photoshop', 'Adobe Premiere', 'Illustrator', 'After Effects', 'UI/UX Design'],
  },
]

export default function SkillsSection({
  title = 'Skills',
  categories = defaultCategories,
}: SkillsSectionProps) {
  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <h2 className="section-title reveal">{title}</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '20px',
          }}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="glass reveal-stagger"
              style={{
                padding: '28px 22px',
                transition: 'transform var(--transition-mid), box-shadow var(--transition-mid)',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  color: 'var(--accent)',
                  marginBottom: '14px',
                  filter: 'drop-shadow(0 0 8px var(--accent-glow))',
                  display: 'flex',
                }}
              >
                {category.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '16px',
                  color: 'var(--text-primary)',
                }}
              >
                {category.title}
              </h3>

              {/* Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {category.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
