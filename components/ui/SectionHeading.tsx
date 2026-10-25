'use client'

import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {desc && <p className="mt-4 text-text-secondary">{desc}</p>}
      <div className="mt-5 h-1 w-14 rounded-full bg-gradient-to-r from-primary via-secondary to-accent" />
    </Reveal>
  )
}
