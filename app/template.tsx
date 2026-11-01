'use client'

import { motion } from 'framer-motion'
import { DUR, EASE } from '@/lib/utils'

/** Transisi antar halaman: isi halaman naik dan memudar masuk setiap kali rute berganti. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.slow, ease: EASE }}>
      {children}
    </motion.div>
  )
}
