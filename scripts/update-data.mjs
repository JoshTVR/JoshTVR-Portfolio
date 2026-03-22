/**
 * update-data.mjs
 * - Sube video de Cells Animation a Supabase Storage
 * - Actualiza el video_url de cells-animation en la DB
 * - Agrega proyectos de GitHub repos
 * - Actualiza servicios con nuevos precios
 *
 * Uso:
 *   node --env-file=.env.local scripts/update-data.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const BUCKET = 'project-images'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

// ── 1. Upload video ────────────────────────────────────────────────────────────
async function uploadVideo() {
  console.log('\n📹  Uploading Cells Animation video...')

  const videoPath = join(__dirname, '../_project-assets/models/Cells-Animations/Imgs/Cells Animations.mp4')
  if (!existsSync(videoPath)) {
    console.log('    ⚠️  Video file not found, skipping.')
    return null
  }

  const buffer = readFileSync(videoPath)
  const storagePath = 'cells-animation/cells-animation.mp4'

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, { contentType: 'video/mp4', upsert: true })

  if (error) { console.error('    ✗ Upload failed:', error.message); return null }

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  console.log('    ✓ Uploaded →', storagePath)

  const { error: updateErr } = await supabase
    .from('projects')
    .update({ video_url: publicUrl })
    .eq('slug', 'cells-animation')

  if (updateErr) console.error('    ✗ DB update failed:', updateErr.message)
  else console.log('    ✓ cells-animation video_url updated')

  return publicUrl
}

// ── 2. GitHub repo projects ────────────────────────────────────────────────────
const GITHUB_PROJECTS = [
  {
    slug: 'business-intelligence',
    title_en: 'Business Intelligence — Northwind ETL',
    title_es: 'Business Intelligence — ETL Northwind',
    description_en: 'Complete enterprise data warehouse built on the Northwind database. Implements the Kimball dimensional modeling methodology with a full ETL pipeline using SSIS across three iterations, containerized with Docker and Docker Compose. Culminates in Power BI dashboards analyzing sales, customers, products, and employee performance.',
    description_es: 'Data warehouse empresarial completo sobre la base de datos Northwind. Implementa la metodología dimensional de Kimball con un pipeline ETL completo en SSIS, contenedorizado con Docker y Docker Compose. Culmina en dashboards de Power BI analizando ventas, clientes, productos y rendimiento de empleados.',
    content_en: null,
    content_es: null,
    category: 'data',
    tech_tags: ['SQL Server', 'SSIS', 'Power BI', 'Docker', 'ETL', 'Kimball', 'PostgreSQL', 'Data Warehouse'],
    github_url: 'https://github.com/JoshTVR/Business-Intelligence',
    demo_url: null,
    cover_image: null,
    images: [],
    is_published: true,
    is_featured: true,
    sort_order: 9,
  },
  {
    slug: 'matplotlib-zero-to-hero',
    title_en: 'Matplotlib: Zero to Hero',
    title_es: 'Matplotlib: De Cero a Experto',
    description_en: 'Bilingual (EN/ES) educational resource covering Python data visualization from the ground up. Includes Jupyter notebooks with interactive examples, custom datasets, a cheatsheet PDF, and exercises covering line plots, bar charts, scatter plots, pie charts, multi-chart layouts, and export formats.',
    description_es: 'Recurso educativo bilingüe (EN/ES) sobre visualización de datos en Python desde cero. Incluye Jupyter notebooks con ejemplos interactivos, datasets personalizados, cheatsheet PDF y ejercicios de gráficas de línea, barras, dispersión, pastel, layouts multi-gráfica y formatos de exportación.',
    content_en: null,
    content_es: null,
    category: 'data',
    tech_tags: ['Python', 'Matplotlib', 'NumPy', 'Pandas', 'Jupyter', 'Data Visualization'],
    github_url: 'https://github.com/JoshTVR/Matplotlib-From-Zero-To-Hero',
    demo_url: null,
    cover_image: null,
    images: [],
    is_published: true,
    is_featured: false,
    sort_order: 10,
  },
  {
    slug: 'data-analytics-digital-business',
    title_en: 'Data Analytics for Digital Business',
    title_es: 'Analítica de Datos para Negocios Digitales',
    description_en: 'Academic coursework repository from Universidad Tecnológica de Tula-Tepeji covering 7 data science topics: Big Data fundamentals, data treatment, statistical analysis, Python for data science, ETL with SSIS, dimensional modeling, and enterprise data flow automation. All with Python notebooks using Pandas, NumPy, Matplotlib and Seaborn.',
    description_es: 'Repositorio de materiales académicos de la UTT que cubre 7 temas de ciencia de datos: fundamentos de Big Data, tratamiento de datos, análisis estadístico, Python para ciencia de datos, ETL con SSIS, modelado dimensional y automatización de flujo de datos empresarial.',
    content_en: null,
    content_es: null,
    category: 'data',
    tech_tags: ['Python', 'Pandas', 'NumPy', 'Seaborn', 'Matplotlib', 'SSIS', 'ETL', 'Jupyter'],
    github_url: 'https://github.com/JoshTVR/Data-Analitics-For-Digital-Businesses',
    demo_url: null,
    cover_image: null,
    images: [],
    is_published: true,
    is_featured: false,
    sort_order: 11,
  },
]

async function upsertGithubProjects() {
  console.log('\n📦  Upserting GitHub repo projects...')
  for (const p of GITHUB_PROJECTS) {
    const { error } = await supabase
      .from('projects')
      .upsert(p, { onConflict: 'slug' })
    if (error) console.error(`    ✗ ${p.slug}:`, error.message)
    else console.log(`    ✓ ${p.slug}`)
  }
}

// ── 3. Update services ─────────────────────────────────────────────────────────
const SERVICES = [
  {
    slug: '3d-modeling',
    title_en: '3D Modeling',
    title_es: 'Modelado 3D',
    description_en: 'Custom 3D props, characters, environments and assets modeled in Blender. Includes materials, lighting setup and up to 3 render outputs. Suitable for games, presentations, and portfolio use.',
    description_es: 'Props, personajes, entornos y assets 3D personalizados modelados en Blender. Incluye materiales, configuración de iluminación y hasta 3 renders de salida. Ideal para juegos, presentaciones y portafolio.',
    price_from: 80,
    price_to: 250,
    currency: 'USD',
    delivery_days: 5,
    is_active: true,
    sort_order: 1,
    features_en: ['Custom Blender model', 'Materials & textures', 'Up to 3 render outputs', 'Source file included'],
    features_es: ['Modelo Blender personalizado', 'Materiales y texturas', 'Hasta 3 renders de salida', 'Archivo fuente incluido'],
  },
  {
    slug: '3d-animation',
    title_en: '3D Animation',
    title_es: 'Animación 3D',
    description_en: 'Short 3D animations up to 30 seconds — product showcases, technical visualizations, or cinematic sequences. Rendered in Blender Cycles or EEVEE depending on quality needs.',
    description_es: 'Animaciones 3D cortas de hasta 30 segundos — presentaciones de producto, visualizaciones técnicas o secuencias cinematográficas. Renderizadas en Blender Cycles o EEVEE según las necesidades.',
    price_from: 150,
    price_to: 400,
    currency: 'USD',
    delivery_days: 7,
    is_active: true,
    sort_order: 2,
    features_en: ['Up to 30 seconds', 'Cycles or EEVEE render', 'MP4 export', 'Background music optional'],
    features_es: ['Hasta 30 segundos', 'Render Cycles o EEVEE', 'Exportación MP4', 'Música de fondo opcional'],
  },
  {
    slug: 'vr-prototype',
    title_en: 'VR Experience Prototype',
    title_es: 'Prototipo de Experiencia VR',
    description_en: 'Functional VR prototype built in Unity with XR Interaction Toolkit. Includes environment, basic interactions, and a working build. Ideal for demos, pitches, and early-stage testing.',
    description_es: 'Prototipo VR funcional desarrollado en Unity con XR Interaction Toolkit. Incluye entorno, interacciones básicas y build funcional. Ideal para demos, pitches y pruebas en etapa temprana.',
    price_from: 500,
    price_to: 1500,
    currency: 'USD',
    delivery_days: 14,
    is_active: true,
    sort_order: 3,
    features_en: ['Unity XR build', 'Basic VR interactions', 'Environment design', '1 revision round'],
    features_es: ['Build Unity XR', 'Interacciones VR básicas', 'Diseño de entorno', '1 ronda de revisión'],
  },
  {
    slug: 'data-dashboard',
    title_en: 'Data Dashboard & Analysis',
    title_es: 'Dashboard de Datos y Análisis',
    description_en: 'Data analysis report and interactive dashboard built with Python (Pandas, Matplotlib/Seaborn) or Power BI. Includes data cleaning, key metrics visualization, and a written summary of findings.',
    description_es: 'Reporte de análisis de datos y dashboard interactivo con Python (Pandas, Matplotlib/Seaborn) o Power BI. Incluye limpieza de datos, visualización de métricas clave y resumen escrito de hallazgos.',
    price_from: 150,
    price_to: 500,
    currency: 'USD',
    delivery_days: 5,
    is_active: true,
    sort_order: 4,
    features_en: ['Data cleaning included', 'Charts & visualizations', 'PDF or Notebook report', 'Dataset up to 100k rows'],
    features_es: ['Limpieza de datos incluida', 'Gráficas y visualizaciones', 'Reporte PDF o Notebook', 'Dataset hasta 100k filas'],
  },
  {
    slug: 'data-visualization',
    title_en: 'Custom Python Visualization',
    title_es: 'Visualización Python Personalizada',
    description_en: 'Custom charts, graphs and visual exports from your data using Python (Matplotlib, Seaborn, Plotly). Delivered as publication-ready PNG/SVG or embedded in a Jupyter notebook.',
    description_es: 'Gráficas, diagramas y exportaciones visuales personalizadas de tus datos usando Python. Entregado como PNG/SVG listo para publicación o embebido en un Jupyter notebook.',
    price_from: 80,
    price_to: 250,
    currency: 'USD',
    delivery_days: 3,
    is_active: true,
    sort_order: 5,
    features_en: ['Matplotlib / Seaborn / Plotly', 'PNG, SVG or HTML export', 'Your data or sample data', 'Source code included'],
    features_es: ['Matplotlib / Seaborn / Plotly', 'Exportación PNG, SVG o HTML', 'Tus datos o datos de muestra', 'Código fuente incluido'],
  },
  {
    slug: 'ui-design',
    title_en: 'UI Design (Figma)',
    title_es: 'Diseño UI (Figma)',
    description_en: 'Clean interface mockups and prototypes designed in Figma. Up to 5 screens with responsive layouts, component library, and a clickable prototype link.',
    description_es: 'Mockups de interfaces limpias y prototipos diseñados en Figma. Hasta 5 pantallas con layouts responsivos, biblioteca de componentes y link de prototipo clickeable.',
    price_from: 100,
    price_to: 400,
    currency: 'USD',
    delivery_days: 4,
    is_active: true,
    sort_order: 6,
    features_en: ['Up to 5 screens', 'Desktop + mobile layouts', 'Clickable Figma prototype', 'Component library'],
    features_es: ['Hasta 5 pantallas', 'Layouts desktop + móvil', 'Prototipo Figma clickeable', 'Biblioteca de componentes'],
  },
]

async function updateServices() {
  console.log('\n💼  Updating services...')

  // Clear existing and insert fresh
  const { error: delErr } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (delErr) console.error('    ✗ Delete failed:', delErr.message)

  for (const s of SERVICES) {
    const { error } = await supabase.from('services').insert(s)
    if (error) console.error(`    ✗ ${s.slug}:`, error.message)
    else console.log(`    ✓ ${s.title_en} ($${s.price_from}–$${s.price_to})`)
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀  Starting data update...')
  await uploadVideo()
  await upsertGithubProjects()
  await updateServices()
  console.log('\n✅  Done.\n')
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1) })
