import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET(_req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: `${siteUrl}/api/auth/instagram/callback`,
    scope: 'instagram_basic,instagram_content_publish,pages_show_list,business_management',
    response_type: 'code',
    state: 'instagram-connect',
  })
  return Response.redirect(
    `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`,
  )
}
