'use client'

import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { EASE } from '@/lib/utils'

/** `eyebrow` opsional: bagian utama tidak memakainya lagi (judul cukup), varian warna lama masih bisa. */
export default function SectionHeading({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <Reveal className="mb-10 max-w-2xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`${eyebrow ? 'mt-3 ' : ''}text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl`}>{title}</h2>
      {desc && <p className="mt-4 text-text-secondary">{desc}</p>}
      <motion.div
        className="mt-5 h-1 w-14 origin-left rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
      />
    </Reveal>
  )
}
