import type { Variants } from 'framer-motion'
import meta from './meta.json'

export type Category = 'hospital' | 'pharmacy' | 'primary' | 'regulatory' | 'industry' | 'academic'

/** Slug halaman detail, urutan sama dengan CONTENT[lang].internships. */
export const SLUGS: string[] = meta.slugs
/** Kategori tiap pengalaman (klasifikasi dari nama instansi), urutan sama dengan SLUGS. */
export const CATEGORIES = meta.categories as Category[]
export const CATEGORY_LABELS = meta.categoryLabels as Record<'id' | 'en', Record<'all' | Category, string>>

/** Alamat situs untuk metadata, sitemap, dan robots. Isi lewat .env (NEXT_PUBLIC_SITE_URL) sebelum publish. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

/** Varian animasi bersama (Framer Motion). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
}
