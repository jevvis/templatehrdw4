'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Counter from '@/components/ui/Counter'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

export default function About() {
  const { c, s } = useLang()
  const stats = [
    { label: s.stat_gpa_prof, to: Number(c.edu[0].gpa), decimals: 2 },
    { label: s.stat_gpa_s1, to: Number(c.edu[1].gpa), decimals: 2 },
    { label: s.stat_exp, to: c.internships.length, decimals: 0 },
    { label: s.stat_cert, to: c.certs.length, decimals: 0 },
  ]
  return (
    <section id="about" className="section">
      <SectionHeading eyebrow={s.about_eyebrow} title={c.tx.aboutBtn} />
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
        <div className="grid grid-cols-2 gap-4">
          {stats.map((st, i) => (
            <Reveal key={st.label} i={i}>
              <div className="glass h-full rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1">
                <p className="gradient-text text-4xl font-extrabold tracking-tight sm:text-5xl">
                  <Counter to={st.to} decimals={st.decimals} />
                </p>
                <p className="mt-2 text-xs font-medium leading-snug text-text-secondary">{st.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
