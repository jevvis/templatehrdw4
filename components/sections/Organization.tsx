'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

/** Pengalaman organisasi sebagai daftar bergaris: periode di kolom kiri, peran dan tugas di kanan. */
export default function Organization() {
  const { c } = useLang()
  return (
    <section id="organization" className="section">
      <SectionHeading title={c.sections[2].title} />
      <ol className="divide-y divide-white/20">
        {c.orgs.map((o, i) => (
          <li key={o.role} className="py-10 first:pt-0 last:pb-0">
            <Reveal i={i} className="grid gap-3 md:grid-cols-[200px_1fr] md:gap-12">
              <p className="text-sm font-semibold tabular-nums text-text-secondary md:pt-2">{o.period}</p>
              <div>
                <h3 className="text-2xl font-bold leading-snug">{o.role}</h3>
                <p className="mt-1 text-text-secondary">{o.org}</p>
                <ul className="mt-5 space-y-3">
                  {o.points.map((p) => (
                    <li key={p} className="relative max-w-2xl pl-5 text-sm leading-relaxed text-text-secondary before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary">
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
