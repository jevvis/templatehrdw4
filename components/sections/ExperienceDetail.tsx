'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import { CATEGORIES, SLUGS } from '@/lib/utils'

/** Halaman detail satu pengalaman: hanya isi yang ada di CV (instansi, peran, periode, kegiatan). */
export default function ExperienceDetail({ index }: { index: number }) {
  const { c, s, cat } = useLang()
  const e = c.internships[index]
  const prev = index > 0 ? index - 1 : null
  const next = index < c.internships.length - 1 ? index + 1 : null

  const facts: [string, string][] = [
    [s.institution, e.org],
    [s.period, e.period],
    [s.category, cat[CATEGORIES[index]]],
  ]

  return (
    <article className="mx-auto w-full max-w-5xl px-5 pb-24 pt-28 sm:px-8">
      <Link href="/#experience" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-transform hover:-translate-x-1">
        ← {s.back_to_exp}
      </Link>

      <header className="mt-8">
        <span className="chip">{cat[CATEGORIES[index]]}</span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          <span className="gradient-text">{e.role}</span>
        </h1>
        <p className="mt-3 text-text-secondary">
          {e.org} · {e.period}
        </p>
      </header>

      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="glass mt-8 overflow-hidden rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={e.img} alt={`${e.role} - ${e.org}`} className="aspect-[16/9] w-full object-cover" />
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.4fr]">
        <Reveal>
          <aside className="glass rounded-3xl p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent-soft">{s.overview}</h2>
            <dl className="space-y-4">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-text-secondary">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </Reveal>
        <Reveal i={1}>
          <section className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-accent-soft">{s.activities}</h2>
            <ol className="space-y-4">
              {e.points.map((p, i) => (
                <li key={p} className="flex gap-4 text-sm leading-relaxed text-text-secondary">
                  <b className="gradient-text mt-0.5 w-7 shrink-0 font-bold">{String(i + 1).padStart(2, '0')}</b>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>
      </div>

      <nav aria-label="Pengalaman lain" className="mt-12 grid gap-4 sm:grid-cols-2">
        {prev !== null ? (
          <Link href={`/pengalaman/${SLUGS[prev]}`} className="glass group rounded-3xl p-5 transition-all hover:-translate-y-1 hover:border-secondary/60" data-cursor>
            <p className="text-xs text-text-secondary">← {s.prev}</p>
            <p className="mt-1 font-semibold">{c.internships[prev].role}</p>
            <p className="text-sm text-text-secondary">{c.internships[prev].org}</p>
          </Link>
        ) : (
          <span />
        )}
        {next !== null && (
          <Link href={`/pengalaman/${SLUGS[next]}`} className="glass group rounded-3xl p-5 text-right transition-all hover:-translate-y-1 hover:border-secondary/60 sm:col-start-2" data-cursor>
            <p className="text-xs text-text-secondary">{s.next} →</p>
            <p className="mt-1 font-semibold">{c.internships[next].role}</p>
            <p className="text-sm text-text-secondary">{c.internships[next].org}</p>
          </Link>
        )}
      </nav>
    </article>
  )
}
