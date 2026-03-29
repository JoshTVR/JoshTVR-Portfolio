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

export async function GET(req: NextRequest) {
  // Auth: Vercel Cron sends Authorization: Bearer {CRON_SECRET}
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Find posts scheduled for publishing right now
  const { data: posts, error: fetchErr } = await supabase
    .from('posts')
    .select('id,slug,title_en,title_es,excerpt_en,excerpt_es,cover_image,type,tags,card_images,card_type')
    .lte('scheduled_at', new Date().toISOString())
    .eq('is_published', false)
    .not('scheduled_at', 'is', null)

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ published: 0 })
  }

  // Mark all as published first
  const ids = posts.map(p => p.id)
  await supabase
    .from('posts')
    .update({ is_published: true, published_at: new Date().toISOString() })
    .in('id', ids)

  // Fetch social tokens
  const { data: tokenRows } = await supabase
    .from('settings')
    .select('key,value')
    .in('key', ['linkedin_token', 'instagram_token'])

  const tokenMap: Record<string, Record<string, string>> = {}
  for (const row of tokenRows ?? []) {
    tokenMap[row.key] = row.value as Record<string, string>
  }

  const results: Array<{ id: string; linkedin?: string; instagram?: string }> = []

  for (const post of posts) {
    const result: { id: string; linkedin?: string; instagram?: string } = { id: post.id }

    // --- LinkedIn ---
    const liToken = tokenMap['linkedin_token']
    if (liToken?.access_token && (!liToken.expires_at || new Date(liToken.expires_at) > new Date())) {
      try {
        const postUrl = `${SITE_URL}/en/posts/${post.slug}`
        const text = [post.title_en, post.excerpt_en, postUrl].filter(Boolean).join('\n\n')

        const liRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${liToken.access_token}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
          body: JSON.stringify({
            author: liToken.person_urn,
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

        if (liRes.ok) {
          await supabase.from('posts').update({ shared_linkedin: true }).eq('id', post.id)
          result.linkedin = 'ok'
        } else {
          const err = await liRes.text()
          result.linkedin = `error: ${err.slice(0, 120)}`
        }
      } catch (e) {
        result.linkedin = `error: ${e instanceof Error ? e.message : 'unknown'}`
      }
    }

    // --- Instagram ---
    const igToken = tokenMap['instagram_token']
    if (igToken?.access_token && (!igToken.expires_at || new Date(igToken.expires_at) > new Date())) {
      try {
        const igResult = await publishToInstagram(post, igToken.access_token, igToken.user_id)
        if (igResult.ok) {
          await supabase.from('posts').update({ shared_instagram: true }).eq('id', post.id)
          result.instagram = 'ok'
        } else {
          result.instagram = `error: ${igResult.error}`
        }
      } catch (e) {
        result.instagram = `error: ${e instanceof Error ? e.message : 'unknown'}`
      }
    }

    results.push(result)
  }

  return NextResponse.json({ published: posts.length, results })
}

async function publishToInstagram(
  post: {
    id: string
    slug: string
    title_es: string
    excerpt_es: string | null
    cover_image: string | null
    type: string
    tags: string[]
    card_images: string[] | null
    card_type: string | null
  },
  token: string,
  userId: string,
): Promise<{ ok: boolean; error?: string }> {
  const tags = (post.tags ?? []).map((t: string) => `#${t}`).join(' ')
  const caption = `${typeEmoji(post.type)} ${post.title_es}\n\n${post.excerpt_es ?? ''}\n\n👉 ${SITE_URL}/es/posts/${post.slug}\n\n${tags} #joshtvr`.trim()

  // Use card_images for carousel if multiple, otherwise fall back to cover_image
  const images: string[] = post.card_images?.length
    ? post.card_images
    : post.cover_image
    ? [post.cover_image]
    : []

  if (images.length === 0) {
    return { ok: false, error: 'No image available for Instagram' }
  }

  if (images.length === 1) {
    // Single image post
    const containerRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image_url: images[0], caption }),
    })
    if (!containerRes.ok) {
      return { ok: false, error: `container: ${await containerRes.text()}` }
    }
    const { id: creationId } = await containerRes.json()

    const publishRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ creation_id: creationId }),
    })
    if (!publishRes.ok) {
      return { ok: false, error: `publish: ${await publishRes.text()}` }
    }
    return { ok: true }
  }

  // Carousel: create N item containers, then carousel container, then publish
  const itemIds: string[] = []
  for (const imageUrl of images) {
    const itemRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image_url: imageUrl, is_carousel_item: true }),
    })
    if (!itemRes.ok) {
      return { ok: false, error: `carousel item: ${await itemRes.text()}` }
    }
    const { id } = await itemRes.json()
    itemIds.push(id)
  }

  const carouselRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ media_type: 'CAROUSEL', children: itemIds.join(','), caption }),
  })
  if (!carouselRes.ok) {
    return { ok: false, error: `carousel container: ${await carouselRes.text()}` }
  }
  const { id: carouselId } = await carouselRes.json()

  const publishRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ creation_id: carouselId }),
  })
  if (!publishRes.ok) {
    return { ok: false, error: `carousel publish: ${await publishRes.text()}` }
  }
  return { ok: true }
}
