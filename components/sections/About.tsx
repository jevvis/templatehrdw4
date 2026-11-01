'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Counter from '@/components/ui/Counter'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

export default function About() {
  const { c, s } = useLang()
  // IPK sudah tampil besar di bagian Pendidikan, jadi di sini hanya angka yang tidak diulang di tempat lain
  const stats = [
    { label: s.stat_exp, to: c.internships.length, decimals: 0 },
    { label: s.stat_cert, to: c.certs.length, decimals: 0 },
  ]
  return (
    <section id="about" className="section">
      <SectionHeading title={c.tx.aboutBtn} />
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Reveal>
            <p className="leading-[1.85] text-text-secondary">{c.tx.aboutText}</p>
          </Reveal>
          <Reveal i={1} className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">{s.about_focus}</p>
            <div className="flex flex-wrap gap-2">
              {c.technical.slice(0, 8).map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="divide-y divide-white/20 self-start">
          {stats.map((st, i) => (
            <Reveal key={st.label} i={i} className="flex items-baseline gap-5 py-7 first:pt-0 last:pb-0">
              <p className="text-6xl font-extrabold tabular-nums tracking-tight sm:text-7xl">
                <Counter to={st.to} decimals={st.decimals} />
              </p>
              <p className="text-sm leading-snug text-text-secondary">{st.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
