import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET(_req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    redirect_uri: `${siteUrl}/api/auth/linkedin/callback`,
    scope: 'openid profile w_member_social w_organization_social',
    state: 'linkedin-connect',
  })
  return Response.redirect(
    `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`,
  )
}
