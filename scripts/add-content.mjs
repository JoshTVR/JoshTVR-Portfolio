/**
 * add-content.mjs
 * Adds new content to the database:
 *   - Python Essentials 1 certification
 *   - Two internship experience entries (Vortex/Plandi + Clubit)
 *   - Clubit VR project
 *   - Alien Mothership project (unpublished — needs renders first)
 *
 * Usage:
 *   node --env-file=.env.local scripts/add-content.mjs
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// ── 1. Certification ───────────────────────────────────────────────────────────
async function addCertification() {
  console.log('\n🎓  Adding Python Essentials 1 certification...')

  const { error } = await supabase
    .from('certifications')
    .upsert(
      {
        name_en: 'Python Essentials 1',
        name_es: 'Python Esenciales 1',
        issuer: 'Cisco Networking Academy / Python Institute (via UTT)',
        year: 2025,
        sort_order: 1,
      },
      { onConflict: 'id', ignoreDuplicates: false }
    )

  if (error) console.error('  ✗ Certification insert failed:', error.message)
  else console.log('  ✓ Python Essentials 1 added')
}

// ── 2. Experience entries ──────────────────────────────────────────────────────
const EXPERIENCE = [
  {
    role_en: 'Pixel Art Game Developer (Internship)',
    role_es: 'Desarrollador de Videojuego Pixel Art (Prácticas)',
    company: 'Vortex Editorial / Plandi',
    description_en:
      'Internship focused on video game development with a pixel art aesthetic. Participated in the design and development pipeline of a 2D game project, contributing to visual asset creation, game mechanics prototyping, and UI design.',
    description_es:
      'Prácticas profesionales enfocadas en desarrollo de videojuegos con estética pixel art. Participación en el pipeline de diseño y desarrollo de un proyecto de juego 2D, contribuyendo a la creación de assets visuales, prototipado de mecánicas e interfaz.',
    tags: ['Pixel Art', 'Game Development', 'UI Design', '2D Art', 'Prototyping'],
    start_date: '2025-06-01',
    end_date: '2025-09-30',
    sort_order: 1,
  },
  {
    role_en: 'VR Game Developer (Internship)',
    role_es: 'Desarrollador de Juego VR (Prácticas)',
    company: 'Roboarts Club',
    description_en:
      'Developed Clubit, a standalone VR polyrhythm rhythm game for Meta Quest 3S. Built a complete musical interaction system featuring a 88-key interactive 3D piano and a polyrhythm engine rendering 4 simultaneous rhythmic patterns (triangles/3, squares/4, pentagons/5, hexagons/6) drawn pixel-by-pixel on Texture2D. Integrated an n8n webhook for real-time session data collection. Deployed to Meta Quest 3S via SideQuest and ADB.',
    description_es:
      'Desarrollé Clubit, un juego de ritmo VR standalone para Meta Quest 3S. Construí un sistema de interacción musical completo con un piano 3D interactivo de 88 teclas y un motor de polirritmo que renderiza 4 patrones rítmicos simultáneos (triángulos/3, cuadrados/4, pentágonos/5, hexágonos/6) dibujados píxel a píxel en Texture2D. Integración con webhook n8n para captura de sesiones en tiempo real. Despliegue en Meta Quest 3S vía SideQuest y ADB.',
    tags: ['Unity', 'C#', 'VR', 'Meta Quest 3S', 'XR Interaction Toolkit', 'n8n', 'URP', 'TextMesh Pro'],
    start_date: '2025-09-01',
    end_date: '2026-01-31',
    sort_order: 2,
  },
]

async function addExperience() {
  console.log('\n💼  Adding internship experience entries...')

  for (const entry of EXPERIENCE) {
    const { error } = await supabase.from('experience').insert(entry)
    if (error) console.error(`  ✗ ${entry.company}:`, error.message)
    else console.log(`  ✓ ${entry.role_en} @ ${entry.company}`)
  }
}

// ── 3. New projects ────────────────────────────────────────────────────────────
const NEW_PROJECTS = [
  {
    slug: 'cubit-vr',
    title_en: 'Clubit — VR Polyrhythm Game',
    title_es: 'Clubit — Juego VR de Polirritmo',
    description_en:
      'A standalone VR rhythm game for Meta Quest 3S built in Unity 6 with URP. Features a unique polyrhythm engine that simultaneously renders 4 geometric rhythm patterns (triangles/3, squares/4, pentagons/5, hexagons/6) drawn pixel-by-pixel on Texture2D — inspired by the musical concept of polyrhythms. Includes a fully interactive 88-key 3D piano (custom Blender model with individually named keys), FreePlay and SongPlay modes, JSON-choreographed songs, real-time session recording, and n8n webhook integration for data collection.',
    description_es:
      'Juego VR de ritmo standalone para Meta Quest 3S, desarrollado en Unity 6 con URP. Cuenta con un motor de polirritmo que renderiza simultáneamente 4 patrones geométricos (triángulos/3, cuadrados/4, pentágonos/5, hexágonos/6) dibujados píxel a píxel en Texture2D. Incluye un piano 3D interactivo de 88 teclas (modelo Blender con teclas nominadas individualmente), modos FreePlay y SongPlay, canciones coreografiadas en JSON, grabación de sesiones en tiempo real e integración con webhook n8n.',
    content_en: null,
    content_es: null,
    category: 'vr',
    tech_tags: ['Unity', 'C#', 'Meta Quest 3S', 'XR Interaction Toolkit', 'URP', 'n8n', 'Blender', 'TextMesh Pro', 'SideQuest'],
    github_url: null,
    demo_url: null,
    cover_image: null,
    images: [],
    is_published: true,
    is_featured: true,
    sort_order: 12,
  },
  {
    slug: 'alien-mothership',
    title_en: 'Alien Mothership — 3D Model',
    title_es: 'Nave Nodriza Alien — Modelo 3D',
    description_en:
      'An original 3D hard-surface model of an alien mothership created in Blender. Designed from scratch as an original IP — available as FBX for game engines. The design features organic-mechanical alien architecture with complex hull paneling, alien surface detailing, and multiple LOD-ready meshes. Also includes an alien planet environment scene.',
    description_es:
      'Modelo 3D original de una nave nodriza alienígena creado en Blender. Diseñado desde cero como IP original — disponible en FBX para motores de juego. El diseño combina arquitectura alienígena orgánico-mecánica con panelado complejo del casco, detalles de superficie y mallas listas para múltiples niveles de detalle. Incluye también una escena de planeta alienígena.',
    content_en: null,
    content_es: null,
    category: '3d',
    tech_tags: ['Blender', 'Hard Surface Modeling', 'Sci-Fi', 'FBX', 'Game Asset', 'Original IP'],
    github_url: null,
    demo_url: null,
    cover_image: null,
    images: [],
    is_published: false, // Set to true once renders are available
    is_featured: false,
    sort_order: 13,
  },
]

async function addProjects() {
  console.log('\n📦  Adding new projects...')

  for (const p of NEW_PROJECTS) {
    const { error } = await supabase
      .from('projects')
      .upsert(p, { onConflict: 'slug' })
    if (error) console.error(`  ✗ ${p.slug}:`, error.message)
    else {
      const status = p.is_published ? '✓ published' : '✓ saved (draft — needs images)'
      console.log(`  ${status}: ${p.slug}`)
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀  Adding new content to JoshTVR portfolio...')

  const { error: pingError } = await supabase.from('projects').select('id').limit(1)
  if (pingError) {
    console.error('❌ Supabase connection failed:', pingError.message)
    process.exit(1)
  }
  console.log('✅  Supabase connected')

  await addCertification()
  await addExperience()
  await addProjects()

  console.log('\n✅  Done.')
  console.log('   ⚠️  Alien Mothership is saved as DRAFT — publish it after adding renders.')
  console.log('   ⚠️  Clubit has no cover image — add one from the admin panel.')
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1) })
