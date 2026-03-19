import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === 'es'
  return {
    title: isEs ? 'Servicios — JoshTVR' : 'Services — JoshTVR',
    description: isEs
      ? 'Servicios freelance de desarrollo 3D/VR, backend, ciencia de datos y diseño.'
      : 'Freelance services: 3D/VR development, backend, data science and design.',
    openGraph: {
      title: isEs ? 'Servicios — JoshTVR' : 'Services — JoshTVR',
      description: isEs ? 'Servicios freelance de JoshTVR' : 'JoshTVR freelance services',
      type: 'website',
    },
  }
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
