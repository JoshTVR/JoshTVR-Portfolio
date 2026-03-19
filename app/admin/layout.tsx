import { AdminSidebar } from '@/components/layout/AdminSidebar'

// Middleware in middleware.ts already guards all /admin/* routes.
// This layout simply provides the sidebar chrome.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          padding: 'clamp(24px, 4vw, 48px)',
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  )
}
