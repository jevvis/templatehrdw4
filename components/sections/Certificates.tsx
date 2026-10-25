'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'
import CertificateModal from '@/components/ui/CertificateModal'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

export default function Certificates() {
  const { c, s } = useLang()
  const [open, setOpen] = useState<number | null>(null)
  const n = c.certs.length
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: number) => setOpen((v) => (v === null ? v : (v + d + n) % n)), [n])

  return (
    <section id="certificates" className="section">
      <SectionHeading eyebrow={s.cert_eyebrow} title={c.sections[3].title} />
      <div className="grid gap-6 md:grid-cols-3">
        {c.certs.map((x, i) => (
          <Reveal key={x.title} i={i}>
            <button type="button" onClick={() => setOpen(i)} data-cursor className="glass group flex h-full w-full flex-col rounded-3xl p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-secondary/60">
              <span className="chip w-fit">{x.kind}</span>
              <h3 className="mt-5 text-lg font-bold leading-snug">{x.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{x.issuer}</p>
              <span className="mt-auto pt-6 text-sm font-semibold text-secondary transition-transform duration-300 group-hover:translate-x-1">{s.detail} →</span>
            </button>
          </Reveal>
        ))}
      </div>
      <AnimatePresence>{open !== null && <CertificateModal key="cert" index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
