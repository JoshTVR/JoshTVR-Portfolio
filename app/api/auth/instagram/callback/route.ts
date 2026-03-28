import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const GRAPH = 'https://graph.facebook.com/v19.0'

export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=instagram_denied#social`)
  }

  // 1. Exchange code for short-lived token
  const shortRes = await fetch(`${GRAPH}/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      redirect_uri: `${siteUrl}/api/auth/instagram/callback`,
      code,
    }),
  })

  if (!shortRes.ok) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=instagram_token#social`)
  }

  const shortData = await shortRes.json()
  const shortToken: string = shortData.access_token

  // 2. Exchange for long-lived token (~60 days)
  const longRes = await fetch(
    `${GRAPH}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${shortToken}`,
  )

  let accessToken = shortToken
  let expiresIn = 5183944 // ~60 days fallback
  if (longRes.ok) {
    const longData = await longRes.json()
    accessToken = longData.access_token ?? shortToken
    expiresIn = longData.expires_in ?? expiresIn
  }

  // 3. Get Facebook pages to find Instagram Business account
  const pagesRes = await fetch(`${GRAPH}/me/accounts?access_token=${accessToken}`)
  let igUserId = ''
  let igUsername = ''

  if (pagesRes.ok) {
    const pagesData = await pagesRes.json()
    const pages: Array<{ id: string; access_token: string }> = pagesData.data ?? []

    // Check each page for a linked Instagram Business account
    for (const page of pages) {
      const igRes = await fetch(
        `${GRAPH}/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`,
      )
      if (igRes.ok) {
        const igData = await igRes.json()
        if (igData.instagram_business_account?.id) {
          igUserId = igData.instagram_business_account.id

          // Get Instagram username
          const usernameRes = await fetch(
            `${GRAPH}/${igUserId}?fields=username&access_token=${accessToken}`,
          )
          if (usernameRes.ok) {
            const usernameData = await usernameRes.json()
            igUsername = usernameData.username ?? ''
          }
          break
        }
      }
    }
  }

  if (!igUserId) {
    return Response.redirect(`${siteUrl}/admin/settings?social_error=instagram_no_account#social`)
  }

  // 4. Store in settings table
  const supabase = createAdminClient()
  await supabase.from('settings').upsert(
    {
      key: 'instagram_token',
      value: {
        access_token: accessToken,
        expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        user_id: igUserId,
        username: igUsername,
      },
    },
    { onConflict: 'key' },
  )

  return Response.redirect(`${siteUrl}/admin/settings?social_connected=instagram#social`)
}
