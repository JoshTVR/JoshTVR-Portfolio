import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET(_req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID!,
    redirect_uri: `${siteUrl}/api/auth/instagram/callback`,
    scope: 'instagram_business_basic,instagram_business_content_publish',
    response_type: 'code',
  })
  return Response.redirect(
    `https://api.instagram.com/oauth/authorize?${params.toString()}`,
  )
}
