/**
 * LinkedIn image upload + UGC post helper.
 * Supports multi-image posts (carousel) when imageUrls has >1 entry.
 * Used by both /api/social/post and /api/cron/publish.
 */

const LI_API = 'https://api.linkedin.com/v2'

export interface LinkedInPostPayload {
  title:      string
  excerpt:    string | null
  slug:       string
  imageUrls?: string[]      // all card slides — posts as multi-image if >1
  imageUrl?:  string | null // single image fallback (legacy callers)
  token:      string
  personUrn:  string
  siteUrl:    string
}

function detectContentType(url: string): string {
  const lower = url.toLowerCase().split('?')[0]
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif'))  return 'image/gif'
  return 'image/png'
}

export async function postToLinkedIn(
  p: LinkedInPostPayload,
): Promise<{ ok: boolean; postId?: string | null; error?: string }> {
  const postUrl = `${p.siteUrl}/en/posts/${p.slug}`
  const text    = [p.title, p.excerpt, postUrl].filter(Boolean).join('\n\n')
  const headers = {
    Authorization:               `Bearer ${p.token}`,
    'Content-Type':              'application/json',
    'X-Restli-Protocol-Version': '2.0.0',
  }

  // Resolve images: prefer imageUrls array, fall back to single imageUrl
  const images: string[] = p.imageUrls?.length
    ? p.imageUrls
    : p.imageUrl
    ? [p.imageUrl]
    : []

  if (images.length === 0) {
    return { ok: false, error: 'No image available — post skipped' }
  }

  // Upload all images in parallel
  let assetUrns: string[]
  try {
    assetUrns = await Promise.all(
      images.map((url) => uploadImageToLinkedIn(url, p.token, p.personUrn)),
    )
  } catch (e) {
    return { ok: false, error: `Image upload to LinkedIn failed: ${e instanceof Error ? e.message : 'unknown'}` }
  }

  // LinkedIn processes uploaded images asynchronously — wait before posting
  await new Promise((r) => setTimeout(r, 2500))

  const media = assetUrns.map((urn, i) => ({
    status: 'READY',
    media:  urn,
    ...(i === 0 ? { title: { text: p.title } } : {}),
  }))

  const body: Record<string, unknown> = {
    author:         p.personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary:   { text },
        shareMediaCategory: 'IMAGE',
        media,
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  }

  const res = await fetch(`${LI_API}/ugcPosts`, {
    method:  'POST',
    headers,
    body:    JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    return { ok: false, error: `LinkedIn API error: ${err.slice(0, 200)}` }
  }

  const data     = await res.json().catch(() => ({})) as { id?: string }
  const headerId = res.headers.get('x-restli-id')
  return { ok: true, postId: data.id ?? headerId ?? null }
}

async function uploadImageToLinkedIn(
  imageUrl: string,
  token: string,
  personUrn: string,
): Promise<string> {
  const registerRes = await fetch(`${LI_API}/assets?action=registerUpload`, {
    method:  'POST',
    headers: {
      Authorization:               `Bearer ${token}`,
      'Content-Type':              'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify({
      registerUploadRequest: {
        recipes:              ['urn:li:digitalmediaRecipe:feedshare-image'],
        owner:                personUrn,
        serviceRelationships: [{ relationshipType: 'OWNER', identifier: 'urn:li:userGeneratedContent' }],
        supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD'],
      },
    }),
  })

  if (!registerRes.ok) throw new Error(`Register upload failed: ${await registerRes.text()}`)
  const registerData = await registerRes.json()

  const uploadUrl: string =
    registerData.value.uploadMechanism[
      'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'
    ].uploadUrl
  const assetUrn: string = registerData.value.asset

  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`Could not fetch image for upload: ${imgRes.status}`)
  const imgBuffer = await imgRes.arrayBuffer()
  if (imgBuffer.byteLength === 0) throw new Error('Image buffer is empty')

  const uploadRes = await fetch(uploadUrl, {
    method:  'PUT',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': detectContentType(imageUrl),
    },
    body: imgBuffer,
  })

  if (!uploadRes.ok) {
    const errText = await uploadRes.text().catch(() => '')
    throw new Error(`Image upload failed: ${uploadRes.status} ${errText.slice(0, 200)}`)
  }
  return assetUrn
}
