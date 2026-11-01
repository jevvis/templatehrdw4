'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'
import CertificateModal from '@/components/ui/CertificateModal'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

/** STR adalah bukti izin praktik, jadi dijadikan kartu utama; sertifikat lain mengikuti di sisi kanan. */
const FEATURED = 1

export default function Certificates() {
  const { c, s } = useLang()
  const [open, setOpen] = useState<number | null>(null)
  const n = c.certs.length
  const close = useCallback(() => setOpen(null), [])
  const step = useCallback((d: number) => setOpen((v) => (v === null ? v : (v + d + n) % n)), [n])

  return (
    <section id="certificates" className="section">
      <SectionHeading title={c.sections[3].title} />
      <div className="grid gap-6 md:grid-cols-6">
        {c.certs.map((x, i) => {
          const featured = i === FEATURED
          return (
            <Reveal key={x.title} i={i} className={featured ? 'md:order-first md:col-span-4 md:row-span-2' : 'md:col-span-2'}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                data-cursor
                className="glass group flex h-full w-full flex-col overflow-hidden rounded-3xl text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-secondary/60"
              >
                <span className={`relative block w-full overflow-hidden bg-[#080c20] ${featured ? 'min-h-[300px] flex-1' : 'aspect-[3/2]'}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={x.imgSrc}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="chip absolute left-4 top-4 bg-black/45 backdrop-blur-sm">{x.kind}</span>
                </span>
                <span className={`flex flex-col ${featured ? 'p-7 sm:p-8' : 'flex-1 p-5'}`}>
                  <span className={`font-bold leading-snug ${featured ? 'text-2xl' : 'text-base'}`}>{x.title}</span>
                  <span className={`mt-2 text-text-secondary ${featured ? 'text-base' : 'text-sm'}`}>{x.issuer}</span>
                  <span className="mt-auto pt-5 text-sm font-semibold text-secondary transition-transform duration-300 group-hover:translate-x-1">{s.detail} →</span>
                </span>
              </button>
            </Reveal>
          )
        })}
      </div>
      <AnimatePresence>{open !== null && <CertificateModal key="cert" index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
