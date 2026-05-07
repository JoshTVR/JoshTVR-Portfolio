import { createAdminClient } from '@/lib/supabase/admin'
import { renderCardSlide } from '@/lib/render-card-slide'

function slideCount(cardType: string | null): number {
  if (cardType === 'code_tip')        return 3
  if (cardType === 'qa')              return 2
  if (cardType === 'logic_challenge') return 2
  return 1
}

export async function generateAndStoreCards(postId: string): Promise<string[]> {
  // errors thrown here will surface in the cron response for debugging
  const supabase = createAdminClient()

  const { data: post } = await supabase
    .from('posts')
    .select('card_type,card_data,color_theme,title_en,tags')
    .eq('id', postId)
    .single()

  if (!post) return []

  const count = slideCount(post.card_type)
  const urls: string[] = []

  for (let slide = 0; slide < count; slide++) {
    try {
      const imageResponse = renderCardSlide(post, slide)
      const buffer        = Buffer.from(await imageResponse.arrayBuffer())
      const filename      = `cards/${postId}-${slide}.png`

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
    } catch (e) {
      throw new Error(`Card render failed for ${postId} slide ${slide}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  if (urls.length > 0) {
    await supabase
      .from('posts')
      .update({ card_images: urls, cover_image: urls[0] })
      .eq('id', postId)
  }

  return urls
}
