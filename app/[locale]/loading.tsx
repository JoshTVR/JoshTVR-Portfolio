export default function HomeLoading() {
  return (
    <main style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Hero skeleton */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '640px' }}>
          <div className="skeleton" style={{ height: '20px', width: '160px', margin: '0 auto 24px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '64px', width: '80%', margin: '0 auto 16px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '64px', width: '60%', margin: '0 auto 32px', borderRadius: '8px' }} />
          <div className="skeleton" style={{ height: '18px', width: '90%', margin: '0 auto 8px', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '18px', width: '70%', margin: '0 auto 40px', borderRadius: '4px' }} />
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <div className="skeleton" style={{ height: '48px', width: '140px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ height: '48px', width: '140px', borderRadius: '8px' }} />
          </div>
        </div>
      </section>
    </main>
  )
}
