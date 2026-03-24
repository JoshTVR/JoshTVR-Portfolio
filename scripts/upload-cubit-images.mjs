/**
 * upload-cubit-images.mjs
 * Uploads selected Cubit screenshots to Supabase Storage
 * and updates the cubit-vr project record.
 *
 * Usage:
 *   node --env-file=.env.local scripts/upload-cubit-images.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const SRC = join(__dirname, '../_project-assets/projects/Clubit')
const BUCKET = 'project-images'
const SLUG = 'cubit-vr'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

const COVER = {
  src: '{5DCC121C-B32F-4CEA-80AF-172041E896AF}.png',
  dest: 'cubit-vr/cover.png',
}

const GALLERY = [
  { src: '{FFCC0337-2E77-494C-BDB7-07FFDC0934DF}.png', dest: 'cubit-vr/gallery-01-piano-displays.png' },
  { src: '{210EEFE9-4207-49E3-BF72-8815E7299A27}.png', dest: 'cubit-vr/gallery-02-polyrhythm-gameplay.png' },
  { src: '{ACC9E5DD-C1AB-4EAA-8C59-C6854958963F}.png', dest: 'cubit-vr/gallery-03-unity-piano-scene.png' },
  { src: '{00907008-716A-4089-AC9E-29FA3DB5CAEC}.png', dest: 'cubit-vr/gallery-04-song-selection.png' },
  { src: '{3AC33612-1236-484F-B810-6592B955DE80}.png', dest: 'cubit-vr/gallery-05-unity-editor.png' },
  { src: '{0C30E57B-B6B5-4CC0-8948-4DB1929F60FA}.png', dest: 'cubit-vr/gallery-06-poly-game-manager.png' },
]

async function upload(src, dest) {
  const buffer = readFileSync(join(SRC, src))
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(dest, buffer, { contentType: 'image/png', upsert: true })
  if (error) throw new Error(`Upload failed [${dest}]: ${error.message}`)
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(dest)
  return publicUrl
}

async function main() {
  console.log('🚀  Uploading Cubit images...\n')

  const { error: pingError } = await supabase.from('projects').select('id').limit(1)
  if (pingError) { console.error('❌ Supabase error:', pingError.message); process.exit(1) }

  console.log('📸  Cover...')
  const coverUrl = await upload(COVER.src, COVER.dest)
  console.log(`  ✓ ${COVER.dest}`)

  console.log('🖼️   Gallery...')
  const galleryUrls = []
  for (const { src, dest } of GALLERY) {
    const url = await upload(src, dest)
    galleryUrls.push(url)
    console.log(`  ✓ ${dest}`)
  }

  console.log('\n💾  Updating DB...')
  const { error } = await supabase
    .from('projects')
    .update({ cover_image: coverUrl, images: galleryUrls })
    .eq('slug', SLUG)

  if (error) console.error('  ✗ DB update failed:', error.message)
  else console.log(`  ✓ cubit-vr updated with cover + ${galleryUrls.length} gallery images`)

  console.log('\n✅  Done.')
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1) })
