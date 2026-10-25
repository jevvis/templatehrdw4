'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Education() {
  const { c, s } = useLang()
  return (
    <section id="education" className="section">
      <SectionHeading eyebrow={s.edu_eyebrow} title={c.sections[0].title} />
      <div className="grid gap-6 md:grid-cols-2">
        {c.edu.map((e, i) => (
          <Reveal key={e.title} i={i}>
            <article className="glass group h-full overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1.5">
              <div className="relative aspect-[16/9] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <span className="chip">{e.year}</span>
                <h3 className="mt-4 text-xl font-bold">{e.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{e.school}</p>
                <p className="mt-5 text-sm text-text-secondary">
                  <span className="gradient-text mr-2 text-3xl font-extrabold">{e.gpa}</span>
                  {c.tx.gpaLabel}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
