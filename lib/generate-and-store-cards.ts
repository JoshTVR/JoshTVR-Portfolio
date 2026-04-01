/**
 * Server-side card image generation + Supabase storage upload.
 * Called by the cron (when card_images is null) and by the admin
 * "Generate & Save Images" button via /api/admin/generate-and-store-cards.
 */

import { createAdminClient } from '@/lib/supabase/admin'

const SITE_URL    = process.env.NEXT_PUBLIC_SITE_URL ?? ''
const CRON_SECRET = process.env.CRON_SECRET ?? ''

function slideCount(cardType: string | null): number {
  if (cardType === 'code_tip')        return 3
  if (cardType === 'qa')              return 2
  if (cardType === 'logic_challenge') return 2
  return 1
}

export async function generateAndStoreCards(postId: string): Promise<string[]> {
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select('card_type')
    .eq('id', postId)
    .single()

  if (!post) return []

  const count = slideCount(post.card_type)
  const urls: string[] = []

  for (let slide = 0; slide < count; slide++) {
    let res: Response
    try {
      res = await fetch(
        `${SITE_URL}/api/admin/generate-card?postId=${encodeURIComponent(postId)}&slide=${slide}`,
        { headers: { Authorization: `Bearer ${CRON_SECRET}` } },
      )
    } catch (e) {
      console.error(`generate-card fetch failed for ${postId} slide ${slide}:`, e)
      continue
    }

    if (!res.ok) {
      console.error(`generate-card returned ${res.status} for ${postId} slide ${slide}`)
      continue
    }

    const buffer   = Buffer.from(await res.arrayBuffer())
    const filename = `cards/${postId}-${slide}.png`

    const { error: uploadErr } = await supabase.storage
      .from('project-images')
      .upload(filename, buffer, { contentType: 'image/png', upsert: true })

    if (uploadErr) {
      console.error(`Storage upload failed for ${postId} slide ${slide}:`, uploadErr)
      continue
    }

    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filename)

    urls.push(publicUrl)
  }

  if (urls.length > 0) {
    await supabase
      .from('posts')
      .update({ card_images: urls, cover_image: urls[0] })
      .eq('id', postId)
  }

  return urls
}
