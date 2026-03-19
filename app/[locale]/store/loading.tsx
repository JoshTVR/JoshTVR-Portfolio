export default function StoreLoading() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh', paddingTop: '96px', paddingBottom: '80px' }}>
      <div className="container-site">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="skeleton" style={{ height: '40px', width: '200px', margin: '0 auto 16px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '18px', width: '320px', margin: '0 auto', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="skeleton" style={{ height: '200px', width: '100%' }} />
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="skeleton" style={{ height: '22px', width: '70%', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '16px', width: '100%', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '16px', width: '80%', borderRadius: '4px' }} />
                <div className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '8px', marginTop: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
