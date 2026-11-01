'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

/** Dua jenjang pendidikan sebagai baris lebar: foto dan keterangan bergantian sisi, IPK sebagai angka besar. */
export default function Education() {
  const { c } = useLang()
  return (
    <section id="education" className="section">
      <SectionHeading title={c.sections[0].title} />
      <div className="divide-y divide-white/20">
        {c.edu.map((e, i) => (
          <Reveal key={e.title} i={i} className="py-10 first:pt-0 last:pb-0">
            <article className="group grid items-center gap-8 md:grid-cols-12 md:gap-12">
              <div className={`relative aspect-[3/2] overflow-hidden rounded-3xl md:col-span-5 ${i % 2 ? 'md:order-2' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent" />
              </div>
              <div className={`md:col-span-7 ${i % 2 ? 'md:order-1' : ''}`}>
                <span className="chip">{e.year}</span>
                <h3 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">{e.title}</h3>
                <p className="mt-2 text-text-secondary">{e.school}</p>
                <p className="mt-8 flex items-baseline gap-3">
                  <span className="text-6xl font-extrabold tabular-nums tracking-tight sm:text-7xl">{e.gpa}</span>
                  <span className="text-sm text-text-secondary">{c.tx.gpaLabel}</span>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
