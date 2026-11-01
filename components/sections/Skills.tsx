'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

/** Logo software dari public/logos (Ms. Office = Word + Excel). */
const logosFor = (name: string) => (/office/i.test(name) ? ['word', 'excel'] : /canva/i.test(name) ? ['canva'] : [])

export default function Skills() {
  const { c, s } = useLang()
  return (
    <section id="skills" className="section">
      <SectionHeading title={s.skills_title} />
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <Reveal>
          <h3 className="text-lg font-bold">{s.skills_tech}</h3>
          <ol className="mt-5 grid gap-x-10 sm:grid-cols-2">
            {c.technical.map((t, i) => (
              <li key={t} className="flex gap-4 border-t py-4 text-sm leading-snug text-text-secondary" style={{ borderColor: 'var(--line)' }}>
                <b className="w-6 shrink-0 font-semibold tabular-nums text-text">{String(i + 1).padStart(2, '0')}</b>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal i={1}>
          <div className="glass space-y-8 rounded-3xl p-6 sm:p-8">
            <div>
              <h3 className="mb-5 text-lg font-bold">{s.skills_personal}</h3>
              <div className="flex flex-wrap gap-2">
                {c.personal.map((p) => (
                  <span key={p} className="chip">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="border-t pt-8" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-5 text-lg font-bold">{s.skills_software}</h3>
              <div className="flex flex-wrap gap-2">
                {c.software.map((p) => (
                  <span key={p} className="chip !pl-2">
                    {logosFor(p).map((l) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={l} src={`/logos/${l}.svg`} alt="" width={26} height={26} className="h-[26px] w-[26px]" />
                    ))}
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
