/**
 * Facebook Pages posting helper.
 * Uses the Graph API to post a photo (with caption) to a Facebook Page.
 */

const FB_GRAPH = 'https://graph.facebook.com/v21.0'

export interface FacebookPostPayload {
  caption:  string   // full caption text
  imageUrl: string   // card image URL (always required — media-first)
  token:    string   // page access token
  pageId:   string
}

export async function postToFacebook(
  p: FacebookPostPayload,
): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`${FB_GRAPH}/${p.pageId}/photos`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${p.token}` },
    body:    JSON.stringify({ url: p.imageUrl, caption: p.caption }),
  })

  if (!res.ok) {
    const err = await res.text()
    return { ok: false, error: `Facebook API error: ${err.slice(0, 300)}` }
  }
  return { ok: true }
}
