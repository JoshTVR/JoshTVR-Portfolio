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

export async function postToLinkedIn(p: LinkedInPostPayload): Promise<{ ok: boolean; error?: string }> {
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

  const assetUrn = await uploadImageToLinkedIn(p.imageUrl, p.token, p.personUrn).catch(() => null)
  if (!assetUrn) {
    return { ok: false, error: 'Image upload to LinkedIn failed' }
  }

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
  return { ok: true }
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

  // Step 2 — fetch image binary and upload
  const imgRes = await fetch(imageUrl)
  if (!imgRes.ok) throw new Error('Could not fetch image for upload')
  const imgBuffer = await imgRes.arrayBuffer()

  // Detect content type from URL
  const contentType = imageUrl.includes('.jpg') || imageUrl.includes('.jpeg')
    ? 'image/jpeg'
    : 'image/png'

  const uploadRes = await fetch(uploadUrl, {
    method:  'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType },
    body:    imgBuffer,
  })

  if (!uploadRes.ok) throw new Error(`Image upload failed: ${uploadRes.status}`)
  return assetUrn
}
