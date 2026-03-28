import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=instagram_denied#social`)
  }

  // 1. Exchange code for short-lived token
  const shortRes = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: `${siteUrl}/api/auth/instagram/callback`,
      code,
    }),
  })

  if (!shortRes.ok) {
    const err = await shortRes.text()
    console.error('Instagram short token error:', err)
    return Response.redirect(`${siteUrl}/admin/settings?social_error=instagram_token#social`)
  }

  const shortData = await shortRes.json()
  const shortToken: string = shortData.access_token
  const userId: string = String(shortData.user_id)

  // 2. Exchange for long-lived token (~60 days)
  const longRes = await fetch(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.META_APP_SECRET}&access_token=${shortToken}`,
  )

  let accessToken = shortToken
  let expiresIn = 5183944 // ~60 days fallback
  if (longRes.ok) {
    const longData = await longRes.json()
    accessToken = longData.access_token ?? shortToken
    expiresIn = longData.expires_in ?? expiresIn
  }

  // 3. Get Instagram username
  let username = ''
  const userRes = await fetch(
    `https://graph.instagram.com/me?fields=username&access_token=${accessToken}`,
  )
  if (userRes.ok) {
    const userData = await userRes.json()
    username = userData.username ?? ''
  }

  // 4. Store in settings table
  const supabase = createAdminClient()
  await supabase.from('settings').upsert(
    {
      key: 'instagram_token',
      value: {
        access_token: accessToken,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        user_id: userId,
        username,
      },
    },
    { onConflict: 'key' },
  )

  return Response.redirect(`${siteUrl}/admin/settings?social_connected=instagram#social`)
}
