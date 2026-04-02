export async function postToThreads(p: {
  text: string
  imageUrl?: string | null
  token: string
  userId: string
}): Promise<{ ok: boolean; postId?: string | null; error?: string }> {
  const base = `https://graph.threads.net/v1.0/${p.userId}`

  // 1. Create media container
  const containerParams: Record<string, string> = {
    text:         p.text,
    access_token: p.token,
  }
  if (p.imageUrl) {
    containerParams.media_type = 'IMAGE'
    containerParams.image_url  = p.imageUrl
  } else {
    containerParams.media_type = 'TEXT'
  }

  const containerRes = await fetch(`${base}/threads`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams(containerParams),
  })

  if (!containerRes.ok) {
    const err = await containerRes.text()
    return { ok: false, error: `Container creation failed: ${err}` }
  }

  const containerData = await containerRes.json()
  const creationId: string = containerData.id
  if (!creationId) return { ok: false, error: 'No creation_id returned' }

  // 2. Publish container
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
  return { ok: true, postId: publishData.id ?? null }
}
