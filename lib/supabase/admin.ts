import { createClient } from '@supabase/supabase-js'

// Service-role client — NEVER import this in client components or expose to browser.
// Bypasses Row Level Security. Use only in Server Components and API Routes.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
