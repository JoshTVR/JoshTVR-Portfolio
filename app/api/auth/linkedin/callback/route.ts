import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=linkedin_denied#social`)
  }

  // 1. Exchange code for access token
  const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: `${siteUrl}/api/auth/linkedin/callback`,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  })

  if (!tokenRes.ok) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=linkedin_token#social`)
  }

  const tokenData = await tokenRes.json()
  const accessToken: string = tokenData.access_token
  const expiresIn: number = tokenData.expires_in ?? 5183944 // ~60 days

  // 2. Fetch OpenID userinfo (sub = person id, name)
  const userRes = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  let personUrn = ''
  let name = ''
  if (userRes.ok) {
    const userInfo = await userRes.json()
    personUrn = `urn:li:person:${userInfo.sub}`
    name = userInfo.name ?? ''
  }

  // 3. Store token in settings table
  const supabase = createAdminClient()
  await supabase.from('settings').upsert(
    {
      key: 'linkedin_token',
      value: {
        access_token: accessToken,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        person_urn: personUrn,
        name,
      },
    },
    { onConflict: 'key' },
  )

  return Response.redirect(`${siteUrl}/admin/settings?social_connected=linkedin#social`)
}
