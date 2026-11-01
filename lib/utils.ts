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

/** Nomor WhatsApp pemilik, hanya angka dengan kode negara (mis. 628123456789). Isi lewat .env (NEXT_PUBLIC_WHATSAPP_NUMBER); kosong = WhatsApp terbuka tanpa tujuan dan pengirim memilih sendiri kontaknya. */
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')

export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ')

/** Easing dan durasi gerak yang dipakai bersama supaya semua perpindahan terasa satu keluarga. */
export const EASE = [0.16, 1, 0.3, 1] as const // keluar halus (masuk elemen)
export const EASE_CURTAIN = [0.76, 0, 0.24, 1] as const // tirai: cepat di tengah
export const DUR = { fast: 0.35, base: 0.7, slow: 0.95 }

/** Varian animasi bersama (Framer Motion). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 34 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, delay: i * 0.09, ease: EASE },
  }),
}
