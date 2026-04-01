import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const { searchParams } = new URL(req.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=facebook_denied#social`)
  }

  // 1. Exchange code for short-lived user access token
  const tokenRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      redirect_uri:  `${siteUrl}/api/auth/facebook/callback`,
      code,
    }),
  })

  if (!tokenRes.ok) {
    console.error('Facebook token error:', await tokenRes.text())
    return Response.redirect(`${siteUrl}/admin/settings?social_error=facebook_token#social`)
  }

  const { access_token: userToken } = await tokenRes.json()

  // 2. Exchange for long-lived user token (60 days)
  const longRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${userToken}`,
  )
  let longUserToken = userToken
  if (longRes.ok) {
    const d = await longRes.json()
    longUserToken = d.access_token ?? userToken
  }

  // 3. Get the list of pages managed by this user
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?access_token=${longUserToken}`,
  )
  if (!pagesRes.ok) {
    console.error('Facebook pages error:', await pagesRes.text())
    return Response.redirect(`${siteUrl}/admin/settings?social_error=facebook_no_pages#social`)
  }

  const pagesData = await pagesRes.json()
  const pages: Array<{ id: string; name: string; access_token: string }> = pagesData.data ?? []

  if (pages.length === 0) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=facebook_no_pages#social`)
  }

  // Auto-select first page (can be expanded to a picker later)
  const page = pages[0]
  const pageToken = page.access_token

  // 4. Extend page token to long-lived (60 days) — page tokens often never expire but be safe
  let finalPageToken = pageToken
  let expiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days default
  const extendRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${pageToken}`,
  )
  if (extendRes.ok) {
    const extData = await extendRes.json()
    finalPageToken = extData.access_token ?? pageToken
    if (extData.expires_in) {
      expiresAt = new Date(Date.now() + extData.expires_in * 1000).toISOString()
    }
  }

  // 5. Store in settings
  const supabase = createAdminClient()
  await supabase.from('settings').upsert(
    {
      key: 'facebook_token',
      value: {
        access_token: finalPageToken,
        page_id:      page.id,
        page_name:    page.name,
        expires_at:   expiresAt,
      },
    },
    { onConflict: 'key' },
  )

  return Response.redirect(`${siteUrl}/admin/settings?social_connected=facebook#social`)
}
