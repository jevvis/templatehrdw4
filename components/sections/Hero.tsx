'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'
import LanyardCard from '@/components/ui/LanyardCard'
import { useReady } from '@/lib/ready'
import { fadeUp } from '@/lib/utils'

export default function Hero() {
  const { c, s } = useLang()
  const lead = c.tx.aboutText.split('. ')[0] + '.'
  const email = c.contacts[0]
  const linkedin = c.contacts[2]
  const ready = useReady() // animasi masuk menunggu layar loading mulai naik
  const item = { variants: fadeUp, initial: 'hidden', animate: ready ? 'show' : 'hidden' } as const

  return (
    <section id="home" className="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-4 px-5 pb-10 pt-28 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <motion.p {...item} custom={0.5} className="eyebrow">
          {s.welcome}
        </motion.p>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          <motion.span {...item} custom={1} className="block">
            {s.hi}
          </motion.span>
          <motion.span {...item} custom={2} className="gradient-text block pb-1">
            {c.fullName}
          </motion.span>
        </h1>
        <motion.p {...item} custom={3} className="mt-4 text-lg font-semibold text-secondary">
          {s.role}
        </motion.p>
        <motion.p {...item} custom={4} className="mt-2 max-w-xl text-xs leading-relaxed text-text-secondary">
          {c.headline}
        </motion.p>
        <motion.p {...item} custom={5} className="mt-5 max-w-xl leading-relaxed text-text-secondary">
          {lead}
        </motion.p>
        <motion.div {...item} custom={6} className="mt-8 flex flex-wrap gap-3">
          <a href={email.href} className="btn-primary">
            {s.hero_cta1}
          </a>
          <a href="#experience" className="btn-ghost">
            {s.hero_cta2}
          </a>
          <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            {s.hero_cta3}
          </a>
        </motion.div>
      </div>
      {/* di HP/tablet (satu kolom) lanyard dipindah ke paling atas, pita menggantung dari tepi atas halaman; di lg ke atas tetap kolom kanan */}
      <motion.div className="order-first lg:order-none" initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 0.5, duration: 1 }}>
        <LanyardCard />
      </motion.div>
    </section>
  )
}
