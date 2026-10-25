'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

/** Pengalaman organisasi sebagai timeline vertikal. */
export default function Organization() {
  const { c, s } = useLang()
  return (
    <section id="organization" className="section">
      <SectionHeading eyebrow={s.org_eyebrow} title={c.sections[2].title} />
      <ol className="relative ml-3 space-y-10 border-l pl-8" style={{ borderColor: 'var(--line)' }}>
        {c.orgs.map((o, i) => (
          <li key={o.role} className="relative">
            <span className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-2 border-accent bg-background shadow-[0_0_18px_rgba(45,212,191,0.6)]" />
            <Reveal i={i}>
              <div className="glass rounded-3xl p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">{o.period}</p>
                <h3 className="mt-2 text-xl font-bold">{o.role}</h3>
                <p className="mt-1 text-sm text-text-secondary">{o.org}</p>
                <ul className="mt-4 space-y-2.5">
                  {o.points.map((p) => (
                    <li key={p} className="relative pl-5 text-sm leading-relaxed text-text-secondary before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
