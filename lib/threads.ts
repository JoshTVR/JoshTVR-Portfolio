export async function postToThreads(p: {
  text: string
  imageUrls?: string[]      // all card slides — posts as carousel if >1
  imageUrl?:  string | null // single image fallback (legacy callers)
  token: string
  userId: string
}): Promise<{ ok: boolean; postId?: string | null; permalink?: string | null; error?: string }> {
  const base = `https://graph.threads.net/v1.0/${p.userId}`

  // Resolve images: prefer imageUrls array, fall back to single imageUrl
  const images: string[] = p.imageUrls?.length
    ? p.imageUrls
    : p.imageUrl
    ? [p.imageUrl]
    : []

  if (images.length === 0) {
    return { ok: false, error: 'No image provided' }
  }

  let creationId: string

  if (images.length === 1) {
    // Single image post
    const containerRes = await fetch(`${base}/threads`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text:         p.text,
        media_type:   'IMAGE',
        image_url:    images[0],
        access_token: p.token,
      }),
    })
    if (!containerRes.ok) {
      const err = await containerRes.text()
      return { ok: false, error: `Container creation failed: ${err}` }
    }
    const data = await containerRes.json() as { id?: string }
    if (!data.id) return { ok: false, error: 'No creation_id returned' }
    creationId = data.id
  } else {
    // Carousel — create one item container per image, then combine
    const itemIds: string[] = []
    for (const url of images) {
      const itemRes = await fetch(`${base}/threads`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          media_type:       'IMAGE',
          image_url:        url,
          is_carousel_item: 'true',
          access_token:     p.token,
        }),
      })
      if (!itemRes.ok) {
        const err = await itemRes.text()
        return { ok: false, error: `Carousel item failed: ${err}` }
      }
      const item = await itemRes.json() as { id?: string }
      if (!item.id) return { ok: false, error: 'Carousel item returned no id' }
      itemIds.push(item.id)
    }

    // Carousel container (text goes here, not on individual items)
    const carouselRes = await fetch(`${base}/threads`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text:         p.text,
        media_type:   'CAROUSEL',
        children:     itemIds.join(','),
        access_token: p.token,
      }),
    })
    if (!carouselRes.ok) {
      const err = await carouselRes.text()
      return { ok: false, error: `Carousel container failed: ${err}` }
    }
    const carousel = await carouselRes.json() as { id?: string }
    if (!carousel.id) return { ok: false, error: 'Carousel container returned no id' }
    creationId = carousel.id
  }

  // Publish
  const publishRes = await fetch(`${base}/threads_publish`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({ creation_id: creationId, access_token: p.token }),
  })

  if (!publishRes.ok) {
    const err = await publishRes.text()
    return { ok: false, error: `Publish failed: ${err}` }
  }

  const publishData = await publishRes.json() as { id?: string }
  const mediaId     = publishData.id ?? null
  const permalink   = mediaId ? await fetchThreadsPermalink(mediaId, p.token) : null
  return { ok: true, postId: mediaId, permalink }
}

async function fetchThreadsPermalink(mediaId: string, token: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://graph.threads.net/v1.0/${mediaId}?fields=permalink&access_token=${encodeURIComponent(token)}`,
      { cache: 'no-store' },
    )
    if (!res.ok) return null
    const data = await res.json() as { permalink?: string }
    return data.permalink ?? null
  } catch {
    return null
  }
}
