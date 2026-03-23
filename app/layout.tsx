import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ui/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'JoshTVR | VR & Digital Business Developer',
    template: '%s | JoshTVR',
  },
  description:
    'JoshTVR — VR & Digital Business Application Developer. Portfolio showcasing VR, AI/ML, Backend, and Design projects.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://joshtvr.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'JoshTVR',
    title: 'JoshTVR | VR & Digital Business Developer',
    description:
      'VR & Digital Business Application Developer — turning ideas into immersive realities across VR, AI, Backend, and Design.',
    images: [{ url: '/og?title=Joshua+Hernandez&description=VR+%26+Digital+Business+Developer', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JoshTVR | VR & Digital Business Developer',
    description:
      'VR & Digital Business Application Developer — turning ideas into immersive realities.',
    images: ['/og?title=Joshua+Hernandez&description=VR+%26+Digital+Business+Developer'],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Anti-flash: set theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();` }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
