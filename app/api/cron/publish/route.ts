import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { postToLinkedIn } from '@/lib/linkedin'
import { postToFacebook } from '@/lib/facebook'
import { postToThreads } from '@/lib/threads'
import { generateAndStoreCards } from '@/lib/generate-and-store-cards'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

function typeEmoji(type: string) {
  if (type === 'devlog')       return '🛠️'
  if (type === 'announcement') return '📢'
  if (type === 'tutorial')     return '📚'
  return '✍️'
}

export async function GET(req: NextRequest) {
  // Auth: Vercel Cron / cron-job.org sends Authorization: Bearer {CRON_SECRET}
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase    = createAdminClient()
  const maxPerRun   = parseInt(process.env.CRON_MAX_PER_RUN ?? '1')
  const window48h   = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

  // Primary: unpublished posts scheduled within last 48h
  const { data: newPosts, error: fetchErr } = await supabase
    .from('posts')
    .select('id,slug,title_en,title_es,excerpt_en,excerpt_es,cover_image,type,tags,card_images,card_type')
    .lte('scheduled_at', new Date().toISOString())
    .gte('scheduled_at', window48h)
    .eq('is_published', false)
    .not('scheduled_at', 'is', null)
    .limit(maxPerRun)

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  }

  // Mark new posts as published
  const newIds = (newPosts ?? []).map(p => p.id)
  if (newIds.length > 0) {
    await supabase
      .from('posts')
      .update({ is_published: true, published_at: new Date().toISOString() })
      .in('id', newIds)
  }

  // Secondary: already published within 48h but social sharing failed (card_images null + not shared)
  const { data: retryPosts } = await supabase
    .from('posts')
    .select('id,slug,title_en,title_es,excerpt_en,excerpt_es,cover_image,type,tags,card_images,card_type')
    .eq('is_published', true)
    .gte('published_at', window48h)
    .is('card_images', null)
    .eq('shared_linkedin', false)
    .eq('shared_threads', false)
    .limit(maxPerRun)

  const posts = [...(newPosts ?? []), ...(retryPosts ?? [])]

  if (posts.length === 0) {
    return NextResponse.json({ published: 0, retried: 0 })
  }

  // Fetch social tokens
  const { data: tokenRows } = await supabase
    .from('settings')
    .select('key,value')
    .in('key', ['linkedin_token', 'instagram_token', 'facebook_token', 'threads_token'])

  const tokenMap: Record<string, Record<string, string>> = {}
  for (const row of tokenRows ?? []) {
    tokenMap[row.key] = row.value as Record<string, string>
  }

  const results: Array<{ id: string; linkedin?: string; instagram?: string; facebook?: string; threads?: string }> = []

  for (const post of posts) {
    const result: { id: string; linkedin?: string; instagram?: string; facebook?: string; threads?: string } = { id: post.id }

    // ── Auto-generate card images if missing ──────────────────────────────────
    let cardImages: string[] = (post.card_images as string[] | null) ?? []
    if (cardImages.length === 0) {
      try {
        cardImages = await generateAndStoreCards(post.id)
      } catch (e) {
        console.error(`Card generation failed for ${post.id}:`, e)
      }
    }
    const imageUrl = cardImages[0] ?? post.cover_image ?? null

    // ── LinkedIn Personal (publishes EVERYTHING until Company Page approved) ─
    // Once linkedin_company_token exists, route AI posts there instead.
    const liToken = tokenMap['linkedin_token']
    if (liToken?.access_token && (!liToken.expires_at || new Date(liToken.expires_at) > new Date())) {
      if (imageUrl) {
        try {
          const liResult = await postToLinkedIn({
            title:     post.title_en,
            excerpt:   post.excerpt_en,
            slug:      post.slug,
            imageUrls: cardImages.length ? cardImages : (imageUrl ? [imageUrl] : []),
            token:     liToken.access_token,
            personUrn: liToken.person_urn,
            siteUrl:   SITE_URL,
          })
          if (liResult.ok) {
            await supabase.from('posts').update({ shared_linkedin: true, linkedin_post_id: liResult.postId ?? null }).eq('id', post.id)
            result.linkedin = 'ok'
          } else {
            result.linkedin = `error: ${liResult.error}`
          }
        } catch (e) {
          result.linkedin = `error: ${e instanceof Error ? e.message : 'unknown'}`
        }
      } else {
        result.linkedin = 'skipped: no image available'
      }
    }

    // ── Facebook Page (ALL post types — both AI and My Content) ──────────────
    const fbToken = tokenMap['facebook_token']
    if (fbToken?.access_token && (!fbToken.expires_at || new Date(fbToken.expires_at) > new Date())) {
      if (imageUrl) {
        try {
          const tags    = ((post.tags ?? []) as string[]).map((t: string) => `#${t}`).join(' ')
          const caption = `${typeEmoji(post.type)} ${post.title_es ?? post.title_en}\n\n${post.excerpt_es ?? post.excerpt_en ?? ''}\n\n${tags} #joshtvr`.trim()
          const fbResult = await postToFacebook({
            caption,
            imageUrl,
            token:  fbToken.access_token,
            pageId: fbToken.page_id,
          })
          if (fbResult.ok) {
            await supabase.from('posts').update({ shared_facebook: true, facebook_post_id: fbResult.postId ?? null }).eq('id', post.id)
            result.facebook = 'ok'
          } else {
            result.facebook = `error: ${fbResult.error}`
          }
        } catch (e) {
          result.facebook = `error: ${e instanceof Error ? e.message : 'unknown'}`
        }
      } else {
        result.facebook = 'skipped: no image available'
      }
    }

    // ── Instagram (publishes EVERYTHING) ─────────────────────────────────────
    const igToken = tokenMap['instagram_token']
    if (igToken?.access_token && (!igToken.expires_at || new Date(igToken.expires_at) > new Date())) {
      try {
        const igResult = await publishToInstagram(post, cardImages, igToken.access_token, igToken.user_id)
        if (igResult.ok) {
          await supabase.from('posts').update({ shared_instagram: true, instagram_post_url: igResult.permalink ?? null }).eq('id', post.id)
          result.instagram = 'ok'
        } else {
          result.instagram = `error: ${igResult.error}`
        }
      } catch (e) {
        result.instagram = `error: ${e instanceof Error ? e.message : 'unknown'}`
      }
    }

    // ── Threads — requires image, same rule as LinkedIn ───────────────────────
    const thToken = tokenMap['threads_token']
    if (thToken?.access_token && (!thToken.expires_at || new Date(thToken.expires_at) > new Date())) {
      if (imageUrl) {
        try {
          const tags   = ((post.tags ?? []) as string[]).map((t: string) => `#${t}`).join(' ')
          const text   = `${typeEmoji(post.type)} ${post.title_es ?? post.title_en}\n\n${post.excerpt_es ?? post.excerpt_en ?? ''}\n\n${tags} #joshtvr`.trim()
          const thResult = await postToThreads({ text, imageUrls: cardImages.length ? cardImages : (imageUrl ? [imageUrl] : []), token: thToken.access_token, userId: thToken.user_id })
          if (thResult.ok) {
            await supabase.from('posts').update({ shared_threads: true, threads_post_id: thResult.postId ?? null, threads_post_url: thResult.permalink ?? null }).eq('id', post.id)
            result.threads = 'ok'
          } else {
            result.threads = `error: ${thResult.error}`
          }
        } catch (e) {
          result.threads = `error: ${e instanceof Error ? e.message : 'unknown'}`
        }
      } else {
        result.threads = 'skipped: no image'
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
    card_type: string | null
  },
  cardImages: string[],
  token: string,
  userId: string,
): Promise<{ ok: boolean; postId?: string | null; permalink?: string | null; error?: string }> {
  const tags    = (post.tags ?? []).map((t: string) => `#${t}`).join(' ')
  const caption = `${typeEmoji(post.type)} ${post.title_es}\n\n${post.excerpt_es ?? ''}\n\n👉 ${SITE_URL}/es/posts/${post.slug}\n\n${tags} #joshtvr`.trim()

  // Prefer generated card images, fall back to cover_image
  const images: string[] = cardImages.length
    ? cardImages
    : post.cover_image
    ? [post.cover_image]
    : []

  if (images.length === 0) {
    return { ok: false, error: 'No image available for Instagram' }
  }

  if (images.length === 1) {
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
    const publishData = await publishRes.json().catch(() => ({})) as { id?: string }
    const mediaId    = publishData.id ?? null
    const permalink  = mediaId ? await fetchInstagramPermalink(mediaId, token) : null
    return { ok: true, postId: mediaId, permalink }
  }

  // Carousel
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
  const publishData = await publishRes.json().catch(() => ({})) as { id?: string }
  const mediaId    = publishData.id ?? null
  const permalink  = mediaId ? await fetchInstagramPermalink(mediaId, token) : null
  return { ok: true, postId: mediaId, permalink }
}

async function fetchInstagramPermalink(mediaId: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://graph.instagram.com/v21.0/${mediaId}?fields=permalink&access_token=${encodeURIComponent(token)}`,
      { cache: 'no-store' },
    )
    if (!res.ok) return null
    const data = await res.json() as { permalink?: string }
    return data.permalink ?? null
  } catch {
    return null
  }
}
