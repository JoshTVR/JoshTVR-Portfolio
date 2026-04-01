import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { postToLinkedIn } from '@/lib/linkedin'
import { postToFacebook } from '@/lib/facebook'
import { postToThreads } from '@/lib/threads'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

function typeEmoji(type: string) {
  if (type === 'devlog') return '🛠️'
  if (type === 'announcement') return '📢'
  if (type === 'tutorial') return '📚'
  return '✍️'
}

export async function POST(req: NextRequest) {
  // Verify admin session
  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          )
        },
      },
    },
  )
  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const githubUsername = user.user_metadata?.user_name as string | undefined
  if (githubUsername?.toLowerCase() !== (process.env.ADMIN_GITHUB_USERNAME ?? 'JoshTVR').toLowerCase()) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.network || !body?.postId) {
    return NextResponse.json({ error: 'Missing network or postId' }, { status: 400 })
  }

  const { network, postId }: { network: 'linkedin' | 'instagram' | 'facebook' | 'threads'; postId: string } = body
  const supabase = createAdminClient()

  // 1. Fetch post
  const { data: post, error: postErr } = await supabase
    .from('posts')
    .select('title_en,title_es,excerpt_en,excerpt_es,cover_image,slug,type,tags,card_images,card_type')
    .eq('id', postId)
    .single()

  if (postErr || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // 2. Fetch token
  const tokenKey = network === 'linkedin' ? 'linkedin_token'
    : network === 'instagram' ? 'instagram_token'
    : network === 'threads' ? 'threads_token'
    : 'facebook_token'
  const { data: tokenRow } = await supabase
    .from('settings')
    .select('value')
    .eq('key', tokenKey)
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
      return await handleLinkedIn(post, accessToken, tokenValue.person_urn)
    } else if (network === 'facebook') {
      return await handleFacebook(post, accessToken, tokenValue.page_id)
    } else if (network === 'threads') {
      return await handleThreads(post, accessToken, tokenValue.user_id)
    } else {
      return await postToInstagram(post, accessToken, tokenValue.user_id)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  async function handleFacebook(
    post: { title_es: string; excerpt_es: string | null; cover_image: string | null; slug: string; tags: string[]; card_images: string[] | null; type: string },
    token: string,
    pageId: string,
  ) {
    const imageUrl = post.card_images?.[0] ?? post.cover_image ?? null
    if (!imageUrl) {
      return NextResponse.json({ error: 'Facebook requiere una imagen para publicar' }, { status: 400 })
    }
    const tags    = (post.tags ?? []).map((t: string) => `#${t}`).join(' ')
    const caption = `${typeEmoji(post.type)} ${post.title_es}\n\n${post.excerpt_es ?? ''}\n\n${tags} #joshtvr`.trim()
    const result  = await postToFacebook({ caption, imageUrl, token, pageId })
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    await markShared(postId, 'facebook')
    return NextResponse.json({ ok: true })
  }

  async function handleThreads(
    post: { title_es: string; excerpt_es: string | null; cover_image: string | null; slug: string; tags: string[]; card_images: string[] | null; type: string },
    token: string,
    userId: string,
  ) {
    const imageUrl = post.card_images?.[0] ?? post.cover_image ?? null
    const tags     = (post.tags ?? []).map((t: string) => `#${t}`).join(' ')
    const text     = `${typeEmoji(post.type)} ${post.title_es}\n\n${post.excerpt_es ?? ''}\n\n${tags} #joshtvr`.trim()
    const result   = await postToThreads({ text, imageUrl, token, userId })
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    await markShared(postId, 'threads')
    return NextResponse.json({ ok: true })
  }

  async function handleLinkedIn(
    post: { title_en: string; excerpt_en: string | null; slug: string; cover_image: string | null; card_images: string[] | null },
    token: string,
    personUrn: string,
  ) {
    const imageUrl = post.card_images?.[0] ?? post.cover_image ?? null
    const result = await postToLinkedIn({
      title:     post.title_en,
      excerpt:   post.excerpt_en,
      slug:      post.slug,
      imageUrl,
      token,
      personUrn,
      siteUrl:   SITE_URL,
    })
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    await markShared(postId, 'linkedin')
    return NextResponse.json({ ok: true })
  }

  async function postToInstagram(
    post: { title_es: string; excerpt_es: string | null; cover_image: string | null; slug: string; tags: string[]; card_images: string[] | null },
    token: string,
    userId: string,
  ) {
    const images: string[] = post.card_images?.length
      ? post.card_images
      : post.cover_image
      ? [post.cover_image]
      : []

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Instagram requiere imagen de portada para publicar' },
        { status: 400 },
      )
    }

    const tags = (post.tags ?? []).map((t: string) => `#${t}`).join(' ')
    const caption = `${typeEmoji(body.type ?? 'post')} ${post.title_es}\n\n${post.excerpt_es ?? ''}\n\n👉 ${SITE_URL}/es/posts/${post.slug}\n\n${tags} #joshtvr`.trim()

    if (images.length === 1) {
      // Single image post
      const containerRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image_url: images[0], caption }),
      })
      if (!containerRes.ok) {
        const errBody = await containerRes.text()
        return NextResponse.json({ error: `Instagram container error: ${errBody}` }, { status: 500 })
      }
      const { id: creationId } = await containerRes.json()

      const publishRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ creation_id: creationId }),
      })
      if (!publishRes.ok) {
        const errBody = await publishRes.text()
        return NextResponse.json({ error: `Instagram publish error: ${errBody}` }, { status: 500 })
      }
    } else {
      // Carousel: N item containers → carousel container → publish
      const itemIds: string[] = []
      for (const imageUrl of images) {
        const itemRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ image_url: imageUrl, is_carousel_item: true }),
        })
        if (!itemRes.ok) {
          const errBody = await itemRes.text()
          return NextResponse.json({ error: `Carousel item error: ${errBody}` }, { status: 500 })
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
        const errBody = await carouselRes.text()
        return NextResponse.json({ error: `Carousel container error: ${errBody}` }, { status: 500 })
      }
      const { id: carouselId } = await carouselRes.json()

      const publishRes = await fetch(`https://graph.instagram.com/v21.0/${userId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ creation_id: carouselId }),
      })
      if (!publishRes.ok) {
        const errBody = await publishRes.text()
        return NextResponse.json({ error: `Carousel publish error: ${errBody}` }, { status: 500 })
      }
    }

    await markShared(postId, 'instagram')
    return NextResponse.json({ ok: true })
  }

  async function markShared(id: string, net: 'linkedin' | 'instagram' | 'facebook' | 'threads') {
    const field = net === 'linkedin' ? 'shared_linkedin'
      : net === 'instagram' ? 'shared_instagram'
      : net === 'threads' ? 'shared_threads'
      : 'shared_facebook'
    await supabase.from('posts').update({ [field]: true }).eq('id', id)
  }
}
