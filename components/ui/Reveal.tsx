'use client'

import { motion } from 'framer-motion'
import { fadeUp } from '@/lib/utils'

/** Membungkus konten supaya muncul (fade + naik) sekali saat masuk layar. `i` mengatur urutan antar elemen bersaudara. */
export default function Reveal({ children, i = 0, className }: { children: React.ReactNode; i?: number; className?: string }) {
  return (
    <motion.div variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className={className}>
      {children}
    </motion.div>
  )
}
