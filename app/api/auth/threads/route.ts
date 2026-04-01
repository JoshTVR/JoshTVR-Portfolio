import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET(_req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const params = new URLSearchParams({
    client_id:     process.env.META_APP_ID!,
    redirect_uri:  `${siteUrl}/api/auth/threads/callback`,
    scope:         'threads_basic,threads_content_publish',
    response_type: 'code',
  })
  return Response.redirect(`https://threads.net/oauth/authorize?${params.toString()}`)
}
