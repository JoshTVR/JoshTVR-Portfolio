export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: '720px', margin: '80px auto', padding: '0 24px', color: 'var(--text-primary)', fontFamily: 'var(--font-inter)' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '40px' }}>Last updated: April 1, 2025</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>1. Information We Collect</h2>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          This website (joshtvr.com) does not collect personal information from visitors beyond what is voluntarily submitted through contact forms or service inquiries. We may collect basic analytics data such as page views.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>2. How We Use Information</h2>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          Information submitted through contact or inquiry forms is used solely to respond to your request. We do not sell, trade, or share your personal information with third parties.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>3. Third-Party Services</h2>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          This site may use third-party services including Stripe (payments), Supabase (data storage), and social media integrations (LinkedIn, Instagram, Facebook, Threads). Each service operates under its own privacy policy.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>4. Cookies</h2>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          We use minimal cookies required for site functionality (e.g., theme preference). No advertising or tracking cookies are used.
        </p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>5. Contact</h2>
        <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          For any privacy-related questions, contact: <a href="mailto:josh@joshtvr.com" style={{ color: 'var(--accent-light)' }}>josh@joshtvr.com</a>
        </p>
      </section>
    </main>
  )
}
