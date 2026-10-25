'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

/** Angka yang menghitung naik dari 0 saat masuk layar. */
export default function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const a = animate(0, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: setV })
    return () => a.stop()
  }, [inView, to])
  return <span ref={ref}>{v.toFixed(decimals)}</span>
}
