/**
 * seed-projects.mjs
 * Sube todas las imágenes a Supabase Storage e inserta los proyectos en la DB.
 *
 * Uso:
 *   node --env-file=.env.local scripts/seed-projects.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const READY_DIR = join(__dirname, '../_project-assets/ready-to-upload')
const BUCKET = 'project-images'

// ── Supabase admin client (bypasses RLS) ──────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// ── Helpers ──────────────────────────────────────────────────────────────────
function mime(filename) {
  const ext = extname(filename).toLowerCase()
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
  if (ext === '.png')  return 'image/png'
  if (ext === '.webp') return 'image/webp'
  return 'image/jpeg'
}

async function uploadFile(localPath, storagePath) {
  const buffer = readFileSync(localPath)
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: mime(localPath), upsert: true })
  if (error) throw new Error(`Upload failed [${storagePath}]: ${error.message}`)
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return publicUrl
}

async function uploadProject(folder, slug) {
  const dir = join(READY_DIR, folder)
  const files = readdirSync(dir).filter(f => !f.startsWith('_') && !f.endsWith('.txt'))

  const coverFile = files.find(f => f.startsWith('cover'))
  const galleryFiles = files.filter(f => f.startsWith('gallery')).sort()

  let cover_image = null
  if (coverFile) {
    cover_image = await uploadFile(join(dir, coverFile), `${slug}/${coverFile}`)
    console.log(`    ✓ cover  → ${coverFile}`)
  }

  const images = []
  for (const f of galleryFiles) {
    const url = await uploadFile(join(dir, f), `${slug}/${f}`)
    images.push(url)
    console.log(`    ✓ gallery → ${f}`)
  }

  return { cover_image, images }
}

// ── Project data ──────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    folder: '01-steam-train',
    slug: 'steam-train',
    title_en: 'Low-Poly Steam Train',
    title_es: 'Tren de Vapor Low-Poly',
    description_en: 'A detailed low-poly steam locomotive scene rendered in Blender Cycles. The composition features dramatic night lighting with a star-filled sky, warm lantern glow from the engine, and a lush low-poly forest environment — showcasing lighting, material design, and cinematic scene composition.',
    description_es: 'Una escena detallada de locomotora de vapor low-poly renderizada en Blender Cycles. La composición presenta iluminación nocturna dramática con cielo estrellado, la cálida luz de la linterna del motor y un exuberante entorno forestal low-poly.',
    content_en: null,
    content_es: null,
    category: '3d',
    tech_tags: ['Blender', 'Cycles', 'Low-Poly', '3D Modeling', 'Scene Design', 'Lighting'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: true,
    sort_order: 1,
  },
  {
    folder: '02-cells-animation',
    slug: 'cells-animation',
    title_en: 'Biological Cells Animation',
    title_es: 'Animación de Células Biológicas',
    description_en: 'A photorealistic 3D animation of biological cells rendered in Blender Cycles. The project simulates cellular behavior — division, movement, and interaction — with hyper-detailed materials that replicate real electron microscopy imagery. A second EEVEE version presents five cell types simultaneously through a scientific microscope display panel.',
    description_es: 'Una animación 3D fotorrealista de células biológicas renderizada en Blender Cycles. El proyecto simula el comportamiento celular con materiales ultra-detallados que replican imágenes reales de microscopía electrónica. Una segunda versión EEVEE presenta cinco tipos de células en un panel de visualización científica.',
    content_en: null,
    content_es: null,
    category: 'video',
    tech_tags: ['Blender', 'Cycles', 'EEVEE', '3D Animation', 'Scientific Visualization', 'Materials'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: true,
    sort_order: 2,
  },
  {
    folder: '03-filtration-animation',
    slug: 'filtration-process-animation',
    title_en: 'Water Filtration Process Animation',
    title_es: 'Animación de Proceso de Filtración de Agua',
    description_en: 'Client work — A technical 3D animation produced for a water treatment company, visualizing the complete water filtration process: UV disinfection, sand and carbon filtration, and system flow. Designed as an educational and commercial marketing asset. Rendered in Blender EEVEE with clean industrial aesthetics.',
    description_es: 'Trabajo de cliente — Animación técnica 3D producida para una empresa de tratamiento de agua, visualizando el proceso completo de filtración: desinfección UV, filtros de arena y carbón, y el flujo del sistema. Diseñada como material educativo y de marketing comercial. Renderizada en Blender EEVEE.',
    content_en: null,
    content_es: null,
    category: 'video',
    tech_tags: ['Blender', 'EEVEE', '3D Animation', 'Technical Visualization', 'Client Work', 'Industrial Design'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: true,
    sort_order: 3,
  },
  {
    folder: '04-torturama',
    slug: 'torturama',
    title_en: 'Torturama — Mobile Voxel Game',
    title_es: 'Torturama — Videojuego Voxel Móvil',
    description_en: 'Client work — A complete mobile voxel game developed for a company. Responsibilities included original character design, 3D voxel art, gameplay animations, and promotional materials. The game follows Tortunela, a blue-and-gold voxel turtle navigating tropical island environments against Archemides, a seagull rival.',
    description_es: 'Trabajo de cliente — Un videojuego voxel móvil completo desarrollado para empresa. Responsabilidades: diseño de personajes originales, arte voxel 3D, animaciones de gameplay y materiales promocionales. El juego sigue a Tortunela, una tortuga voxel azul y dorada, contra Archemides, un rival gaviota.',
    content_en: null,
    content_es: null,
    category: '3d',
    tech_tags: ['MagicaVoxel', 'Blender', 'Game Development', 'Voxel Art', 'Character Design', 'Animation', 'Client Work'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: true,
    sort_order: 4,
  },
  {
    folder: '05-zgen-freasky',
    slug: 'zgen-freasky',
    title_en: 'ZGen — Freasky Original Character Design',
    title_es: 'ZGen — Diseño del Personaje Original Freasky',
    description_en: 'An original IP — Freasky is the mascot and main character of ZGen, a personal game project. The design blends a whimsical, slightly spooky aesthetic with voxel art and low-poly 3D. The character lives in dark atmospheric forest environments, combining cartoon personality with a darker, moodier visual language.',
    description_es: 'IP original — Freasky es el personaje mascota de ZGen, un proyecto de videojuego personal. El diseño mezcla una estética caprichosa y levemente siniestra con arte voxel y 3D low-poly. El personaje habita bosques oscuros y atmosféricos, combinando personalidad cartoon con un lenguaje visual más oscuro.',
    content_en: null,
    content_es: null,
    category: 'design',
    tech_tags: ['Blender', 'MagicaVoxel', 'Character Design', 'Concept Art', 'Low-Poly', 'Original IP', 'Game Design'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: true,
    sort_order: 5,
  },
  {
    folder: '06-tie-fighter',
    slug: 'tie-fighter',
    title_en: 'TIE Fighter — Fan Art 3D Render',
    title_es: 'TIE Fighter — Fan Art Render 3D',
    description_en: 'Fan Art · Star Wars — A high-quality 3D render of the iconic TIE Fighter spacecraft. Multiple cinematic compositions showcase hard-surface modeling skills: a dramatic red-metallic variant set against a deep black starfield, and a space scene featuring Earth in the background.',
    description_es: 'Fan Art · Star Wars — Un render 3D de alta calidad del icónico TIE Fighter. Múltiples composiciones cinematográficas muestran habilidades de modelado hard-surface: una variante roja-metálica dramática y una escena espacial con la Tierra de fondo.',
    content_en: null,
    content_es: null,
    category: '3d',
    tech_tags: ['Blender', 'Cycles', 'Hard Surface Modeling', 'Sci-Fi', 'Lighting', 'Fan Art'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: false,
    sort_order: 6,
  },
  {
    folder: '07-mr-meeseek',
    slug: 'mr-meeseek',
    title_en: 'Mr. Meeseek — Fan Art 3D Model',
    title_es: 'Mr. Meeseek — Fan Art Modelo 3D',
    description_en: "Fan Art · Rick & Morty — A 3D fan art recreation of Mr. Meeseek featuring stylized toon shading that faithfully replicates the show's distinctive cel-shaded animation style. The model demonstrates character modeling and Non-Photorealistic Rendering (NPR) techniques in Blender.",
    description_es: 'Fan Art · Rick & Morty — Recreación en 3D de Mr. Meeseek con toon shading estilizado que replica fielmente el estilo cel-shaded de la serie. El modelo demuestra técnicas de modelado de personajes y Renderizado No Fotorrealista (NPR) en Blender.',
    content_en: null,
    content_es: null,
    category: '3d',
    tech_tags: ['Blender', 'Toon Shading', 'NPR', 'Character Modeling', 'Cel-Shading', 'Fan Art'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: false,
    sort_order: 7,
  },
  {
    folder: '08-bread',
    slug: 'cartoon-bread',
    title_en: 'Cartoon Bread Character',
    title_es: 'Personaje de Pan Cartoon',
    description_en: 'A stylized 3D cartoon bread character featuring toon shading and a cheerful, expressive design. A fun exploration of cartoon character modeling and NPR rendering techniques in Blender.',
    description_es: 'Un personaje de pan cartoon 3D estilizado con toon shading y diseño expresivo. Una exploración divertida de modelado de personajes cartoon y técnicas de renderizado NPR en Blender.',
    content_en: null,
    content_es: null,
    category: '3d',
    tech_tags: ['Blender', 'Toon Shading', 'Character Modeling', 'NPR', 'Cartoon'],
    github_url: null,
    demo_url: null,
    is_published: true,
    is_featured: false,
    sort_order: 8,
  },
]

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 JoshTVR — Project Seeder\n')

  // Verify connection
  const { error: pingError } = await supabase.from('projects').select('id').limit(1)
  if (pingError) {
    console.error('❌ Supabase connection failed:', pingError.message)
    console.error('   Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }
  console.log('✅ Supabase connected')

  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  const bucketExists = buckets?.some(b => b.name === BUCKET)
  if (!bucketExists) {
    console.log(`   Creating bucket "${BUCKET}"...`)
    const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, { public: true })
    if (bucketErr) {
      console.error('❌ Could not create bucket:', bucketErr.message)
      process.exit(1)
    }
    console.log(`✅ Bucket "${BUCKET}" created`)
  } else {
    console.log(`✅ Bucket "${BUCKET}" exists`)
  }
  console.log()

  for (const project of PROJECTS) {
    const { folder, ...data } = project
    console.log(`📦 [${data.sort_order}/8] ${data.slug}`)

    let cover_image = null
    let images = []

    try {
      const result = await uploadProject(folder, data.slug)
      cover_image = result.cover_image
      images = result.images
    } catch (err) {
      console.error(`  ✗ Image upload error: ${err.message}`)
      continue
    }

    const { error: dbError } = await supabase
      .from('projects')
      .upsert({ ...data, cover_image, images }, { onConflict: 'slug' })

    if (dbError) {
      console.error(`  ✗ DB insert error: ${dbError.message}`)
    } else {
      console.log(`  ✓ Saved to DB (${images.length} gallery images)\n`)
    }
  }

  console.log('✅ All projects seeded!')
  console.log('   → Check https://joshtvr.com/en#projects')
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
