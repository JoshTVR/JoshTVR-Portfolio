import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { renderCardSlide } from '@/lib/render-card-slide'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const auth = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const postId = searchParams.get('postId')
  const slide  = parseInt(searchParams.get('slide') ?? '0')

  if (!postId) return new Response('Missing postId', { status: 400 })

  const supabase = createAdminClient()
  const { data: post } = await supabase
    .from('posts')
    .select('card_type,card_data,color_theme,title_en,tags')
    .eq('id', postId)
    .single()

  if (!post) return new Response('Post not found', { status: 404 })

  return renderCardSlide(post, slide)
}
