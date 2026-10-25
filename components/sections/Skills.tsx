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
      <SectionHeading eyebrow={s.skills_eyebrow} title={s.skills_title} />
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h3 className="mb-5 text-lg font-bold">{s.skills_tech}</h3>
            <ol className="grid gap-3 sm:grid-cols-2">
              {c.technical.map((t, i) => (
                <li key={t} className="flex gap-3 rounded-2xl border p-3.5 text-sm leading-snug text-text-secondary transition-colors hover:bg-white/5" style={{ borderColor: 'var(--line)' }}>
                  <b className="gradient-text w-6 shrink-0 font-bold">{String(i + 1).padStart(2, '0')}</b>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
        <div className="space-y-8">
          <Reveal i={1}>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <h3 className="mb-5 text-lg font-bold">{s.skills_personal}</h3>
              <div className="flex flex-wrap gap-2">
                {c.personal.map((p) => (
                  <span key={p} className="chip">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal i={2}>
            <div className="glass rounded-3xl p-6 sm:p-8">
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
          </Reveal>
        </div>
      </div>
    </section>
  )
}
