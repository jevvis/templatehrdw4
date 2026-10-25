'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'
import SectionHeading from '@/components/ui/SectionHeading'
import { CATEGORIES, SLUGS, cn, type Category } from '@/lib/utils'

/** Pengalaman magang: filter kategori + kartu yang membuka halaman detail. */
export default function Experience() {
  const { c, s, cat } = useLang()
  const [filter, setFilter] = useState<'all' | Category>('all')
  const items = c.internships.map((e, i) => ({ e, slug: SLUGS[i], category: CATEGORIES[i] })).filter((x) => filter === 'all' || x.category === filter)
  const chips: ('all' | Category)[] = ['all', ...CATEGORIES]

  return (
    <section id="experience" className="section">
      <SectionHeading eyebrow={s.exp_eyebrow} title={c.sections[1].title} />
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label={s.category}>
        {chips.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={filter === k}
            onClick={() => setFilter(k)}
            className={cn('rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300', filter === k ? 'border-transparent bg-white text-black' : 'text-text-secondary hover:bg-white/10 hover:text-white')}
            style={filter === k ? undefined : { borderColor: 'var(--line)' }}
          >
            {cat[k]}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map(({ e, slug, category }) => (
            <motion.article
              key={slug}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="glass group flex flex-col overflow-hidden rounded-3xl"
            >
              <Link href={`/pengalaman/${slug}`} className="flex h-full flex-col" data-cursor>
                <div className="relative aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="chip absolute left-3 top-3 bg-black/50 backdrop-blur">{cat[category]}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">{e.period}</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug">{e.role}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{e.org}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">{e.points[0]}</p>
                  <span className="mt-auto pt-5 text-sm font-semibold text-secondary transition-transform duration-300 group-hover:translate-x-1">{s.detail} →</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
