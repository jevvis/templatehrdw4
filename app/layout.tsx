import type { Metadata, Viewport } from 'next'
import './globals.css'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import LoadingScreen from '@/components/layout/LoadingScreen'
import ScrollProgress from '@/components/layout/ScrollProgress'
import SectionTint from '@/components/layout/SectionTint'
import MoleculeBackground from '@/components/layout/MoleculeBackground'
import CustomCursor from '@/components/layout/CustomCursor'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CONTENT } from '@/lib/content'
import { SITE_URL } from '@/lib/utils'

const c = CONTENT.id
const description = c.tx.aboutText.split('. ')[0] + '.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Hafizah Nurfadillah | Apoteker', template: '%s | Hafizah Nurfadillah' },
  description,
  keywords: ['apoteker', 'farmasi klinis', 'portofolio', 'Universitas Indonesia', 'Hafizah Nurfadillah'],
  authors: [{ name: c.fullName }],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    title: 'Hafizah Nurfadillah | Apoteker',
    description,
    siteName: 'Portofolio Hafizah Nurfadillah',
    images: [{ url: c.photo, width: 1087, height: 1600, alt: c.fullName }],
  },
  twitter: { card: 'summary_large_image', title: 'Hafizah Nurfadillah | Apoteker', description, images: [c.photo] },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#0a66c2',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* tanpa JavaScript layar loading disembunyikan */}
        <noscript>
          <style>{'[data-loader]{display:none!important}'}</style>
        </noscript>
      </head>
      <body>
        <LanguageProvider>
          <LoadingScreen />
          <ScrollProgress />
          <SectionTint />
          <MoleculeBackground />
          <CustomCursor />
          <Navbar />
          <main id="konten">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  )
}
