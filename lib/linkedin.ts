/**
 * LinkedIn image upload + UGC post helper.
 * Used by both /api/social/post and /api/cron/publish.
 */

const LI_API = 'https://api.linkedin.com/v2'

export interface LinkedInPostPayload {
  title:      string
  excerpt:    string | null
  slug:       string
  imageUrl:   string | null   // card_images[0] or cover_image
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
    Authorization:                `Bearer ${p.token}`,
    'Content-Type':               'application/json',
    'X-Restli-Protocol-Version':  '2.0.0',
  }

  // Require an image — skip posting rather than spamming text-only
  if (!p.imageUrl) {
    return { ok: false, error: 'No image available — post skipped' }
  }

  let assetUrn: string | null = null
  try {
    assetUrn = await uploadImageToLinkedIn(p.imageUrl, p.token, p.personUrn)
  } catch (e) {
    return { ok: false, error: `Image upload to LinkedIn failed: ${e instanceof Error ? e.message : 'unknown'}` }
  }
  if (!assetUrn) {
    return { ok: false, error: 'Image upload to LinkedIn returned no asset URN' }
  }

  // LinkedIn processes the uploaded image asynchronously. Give it a moment
  // before referencing the asset in a UGC post — otherwise the post can be
  // created with no visible media.
  await new Promise((r) => setTimeout(r, 2500))

  const shareMediaCategory = 'IMAGE'
  const media = [{ status: 'READY', media: assetUrn, title: { text: p.title } }]

  const body: Record<string, unknown> = {
    author:         p.personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary:   { text },
        shareMediaCategory,
        ...(media.length > 0 ? { media } : {}),
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

  const data = await res.json().catch(() => ({})) as { id?: string }
  // The LinkedIn API also exposes the URN in the `x-restli-id` response header.
  const headerId = res.headers.get('x-restli-id')
  return { ok: true, postId: data.id ?? headerId ?? null }
}

async function uploadImageToLinkedIn(
  imageUrl: string,
  token: string,
  personUrn: string,
): Promise<string> {
  // Step 1 — register upload
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

  // Step 2 — fetch image binary
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error(`Could not fetch image for upload: ${imgRes.status}`)
  const imgBuffer = await imgRes.arrayBuffer()
  if (imgBuffer.byteLength === 0) throw new Error('Image buffer is empty')

  // Step 3 — PUT to pre-signed upload URL.
  // LinkedIn's pre-signed URL still expects the bearer token; without it the
  // upload returns 401. The Content-Type must match the binary type.
  const contentType = detectContentType(imageUrl)
  const uploadRes = await fetch(uploadUrl, {
    method:  'PUT',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': contentType,
    },
    body: imgBuffer,
  })

  if (!uploadRes.ok) {
    const errText = await uploadRes.text().catch(() => '')
    throw new Error(`Image upload failed: ${uploadRes.status} ${errText.slice(0, 200)}`)
  }
  return assetUrn
}
