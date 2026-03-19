export default function ProjectLoading() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="container-site" style={{ maxWidth: '860px' }}>
        <div className="skeleton" style={{ height: '18px', width: '80px', borderRadius: '4px', marginBottom: '32px' }} />
        <div className="skeleton" style={{ height: '48px', width: '60%', borderRadius: '8px', marginBottom: '16px' }} />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {[80, 100, 90].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: '26px', width: `${w}px`, borderRadius: '20px' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: '400px', width: '100%', borderRadius: '16px', marginBottom: '40px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[100, 90, 95, 80, 85].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: '18px', width: `${w}%`, borderRadius: '4px' }} />
          ))}
        </div>
      </div>
    </main>
  )
}
