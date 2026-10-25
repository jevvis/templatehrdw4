'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'

/** Layar pembuka dengan progress bar. Tampil sekali per sesi (tambahkan ?loading=1 untuk memaksa tampil lagi). */
export default function LoadingScreen() {
  const { c } = useLang()
  const reduce = useReducedMotion()
  const [show, setShow] = useState(true)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('loaded') === '1' && !location.search.includes('loading=1')
    } catch {}
    if (seen) {
      setShow(false)
      return
    }
    const total = reduce ? 500 : 1500
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        try {
          sessionStorage.setItem('loaded', '1')
        } catch {}
        setShow(false)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          data-loader
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          <p className="text-3xl font-extrabold tracking-tight">
            {c.name}
            <span className="text-accent">.</span>
          </p>
          <div className="mt-6 h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-[11px] tracking-[0.3em] text-text-secondary">{pct}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
