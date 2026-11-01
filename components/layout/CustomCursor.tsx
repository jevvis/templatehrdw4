'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

/** Cincin yang mengikuti kursor. Hanya aktif di perangkat dengan mouse (bukan layar sentuh) dan tanpa preferensi kurangi gerak. */
export default function CustomCursor() {
  const reduce = useReducedMotion()
  const [on, setOn] = useState(false)
  const [big, setBig] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 })

  useEffect(() => {
    if (reduce || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setOn(true)
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as Element | null
      setBig(!!t?.closest?.('a, button, input, textarea, [data-cursor]'))
    }
    addEventListener('pointermove', move, { passive: true })
    return () => removeEventListener('pointermove', move)
  }, [reduce, x, y])

  if (!on) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] -ml-4 -mt-4 h-8 w-8 rounded-full border border-secondary/70 mix-blend-screen"
      style={{ x: sx, y: sy }}
      animate={{ scale: big ? 1.9 : 1, backgroundColor: big ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0)' }}
      transition={{ duration: 0.25 }}
    />
  )
}
