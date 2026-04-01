import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET(_req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const params = new URLSearchParams({
    client_id:     process.env.META_APP_ID!,
    redirect_uri:  `${siteUrl}/api/auth/facebook/callback`,
    scope:         'pages_manage_posts,pages_read_engagement',
    response_type: 'code',
    state:         process.env.CRON_SECRET ?? 'state',
  })
  return Response.redirect(
    `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`,
  )
}
