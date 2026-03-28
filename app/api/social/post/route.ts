import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

function typeEmoji(type: string) {
  if (type === 'devlog') return '🛠️'
  if (type === 'announcement') return '📢'
  if (type === 'tutorial') return '📚'
  return '✍️'
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.network || !body?.postId) {
    return NextResponse.json({ error: 'Missing network or postId' }, { status: 400 })
  }

  const { network, postId }: { network: 'linkedin' | 'instagram'; postId: string } = body
  const supabase = createAdminClient()

  // 1. Fetch post
  const { data: post, error: postErr } = await supabase
    .from('posts')
    .select('title_en,title_es,excerpt_en,excerpt_es,cover_image,slug,type,tags')
    .eq('id', postId)
    .single()

  if (postErr || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // 2. Fetch token
  const { data: tokenRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', network === 'linkedin' ? 'linkedin_token' : 'instagram_token')
    .single()

  if (!tokenRow?.value) {
    return NextResponse.json({ error: `${network} not connected` }, { status: 400 })
  }

  const tokenValue = tokenRow.value as Record<string, string>
  const accessToken = tokenValue.access_token

  // Check token expiry
  if (tokenValue.expires_at && new Date(tokenValue.expires_at) < new Date()) {
    return NextResponse.json({ error: `${network} token expired — reconnect in Settings` }, { status: 400 })
  }

  try {
    if (network === 'linkedin') {
      return await postToLinkedIn(post, accessToken, tokenValue.person_urn, tokenValue.org_urn)
    } else {
      return await postToInstagram(post, accessToken, tokenValue.user_id)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  async function postToLinkedIn(
    post: { title_en: string; excerpt_en: string | null; slug: string },
    token: string,
    personUrn: string,
    orgUrn?: string,
  ) {
    const postUrl = `${SITE_URL}/en/posts/${post.slug}`
    const text = [post.title_en, post.excerpt_en, postUrl].filter(Boolean).join('\n\n')

    async function publishAs(author: string) {
      return fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text },
              shareMediaCategory: 'ARTICLE',
              media: [{ status: 'READY', originalUrl: postUrl, title: { text: post.title_en } }],
            },
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
        }),
      })
    }

    const personalRes = await publishAs(personUrn)
    if (!personalRes.ok) {
      const errBody = await personalRes.text()
      return NextResponse.json({ error: `LinkedIn API error: ${errBody}` }, { status: 500 })
    }

    if (orgUrn) {
      const orgRes = await publishAs(orgUrn)
      if (!orgRes.ok) {
        // Personal post succeeded — don't fail, just note the org error
        const errBody = await orgRes.text()
        console.error('LinkedIn org post failed:', errBody)
      }
    }

    await markShared(postId, 'linkedin')
    return NextResponse.json({ ok: true })
  }

  async function postToInstagram(
    post: { title_es: string; excerpt_es: string | null; cover_image: string | null; slug: string; tags: string[] },
    token: string,
    userId: string,
  ) {
    if (!post.cover_image) {
      return NextResponse.json(
        { error: 'Instagram requiere imagen de portada para publicar' },
        { status: 400 },
      )
    }

    const tags = (post.tags ?? []).map((t: string) => `#${t}`).join(' ')
    const caption = `${typeEmoji(body.type ?? 'post')} ${post.title_es}\n\n${post.excerpt_es ?? ''}\n\n👉 ${SITE_URL}/es/posts/${post.slug}\n\n${tags} #joshtvr`.trim()

    // Step 1: Create media container
    const containerRes = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          image_url: post.cover_image,
          caption,
        }),
      },
    )

    if (!containerRes.ok) {
      const errBody = await containerRes.text()
      return NextResponse.json({ error: `Instagram container error: ${errBody}` }, { status: 500 })
    }

    const containerData = await containerRes.json()
    const creationId: string = containerData.id

    // Step 2: Publish
    const publishRes = await fetch(
      `https://graph.instagram.com/v21.0/${userId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creation_id: creationId }),
      },
    )

    if (!publishRes.ok) {
      const errBody = await publishRes.text()
      return NextResponse.json({ error: `Instagram publish error: ${errBody}` }, { status: 500 })
    }

    await markShared(postId, 'instagram')
    return NextResponse.json({ ok: true })
  }

  async function markShared(id: string, net: 'linkedin' | 'instagram') {
    const field = net === 'linkedin' ? 'shared_linkedin' : 'shared_instagram'
    await supabase.from('posts').update({ [field]: true }).eq('id', id)
  }
}
