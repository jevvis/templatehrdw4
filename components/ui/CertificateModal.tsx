'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'

/** Detail sertifikat: foto (placeholder bila belum ada), penerbit, pemegang, deskripsi, dan navigasi antar sertifikat. */
export default function CertificateModal({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: number) => void }) {
  const { c, s } = useLang()
  const x = c.certs[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const [broken, setBroken] = useState(false)

  useEffect(() => setBroken(false), [index])
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onStep(-1)
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'Tab') {
        const f = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])
        if (!f.length) return
        const a = document.activeElement as HTMLElement | null
        if (e.shiftKey && (a === f[0] || !dialogRef.current?.contains(a))) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && (a === f[f.length - 1] || !dialogRef.current?.contains(a))) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    addEventListener('keydown', key)
    return () => {
      removeEventListener('keydown', key)
      document.body.style.overflow = ''
      opener?.focus?.()
    }
  }, [onClose, onStep])

  return (
    <motion.div
      ref={dialogRef}
      className="fixed inset-0 z-[110] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-title"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative grid max-h-[90vh] w-full max-w-4xl overflow-auto rounded-3xl border bg-surface md:grid-cols-[1.1fr_1fr]"
        style={{ borderColor: 'var(--line)' }}
      >
        <button ref={closeRef} type="button" onClick={onClose} aria-label={s.cert_close} className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full border bg-black/40 text-xl leading-none" style={{ borderColor: 'var(--line)' }}>
          ×
        </button>
        <div className="grid min-h-[240px] place-items-center bg-[#080c20] p-5">
          {!broken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={x.imgSrc} alt={x.title} onError={() => setBroken(true)} className="max-h-[60vh] w-auto max-w-full rounded-lg" />
          ) : (
            <p className="max-w-[260px] text-center text-sm leading-relaxed text-text-secondary">{c.tx.noPhoto}</p>
          )}
        </div>
        <div className="space-y-3 p-6 sm:p-8">
          <span className="chip">{x.kind}</span>
          <h3 id="cert-title" className="text-2xl font-bold leading-snug">
            {x.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {c.tx.issuedBy}: {x.issuer}
          </p>
          <p className="text-sm text-text-secondary">
            {c.tx.holder}: apt. {c.fullName}, S.Farm
          </p>
          <p className="pt-2 text-sm leading-relaxed text-text">{x.desc}</p>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 text-xs text-text-secondary">
            <button type="button" className="btn-ghost !px-4 !py-2" onClick={() => onStep(-1)}>
              ← {s.prev}
            </button>
            <span>
              {index + 1} {s.cert_count} {c.certs.length}
            </span>
            <button type="button" className="btn-ghost !px-4 !py-2" onClick={() => onStep(1)}>
              {s.next} →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
