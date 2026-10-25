'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** Garis progres di tepi atas yang memanjang sesuai posisi scroll. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed left-0 right-0 top-0 z-[90] h-[3px] origin-left bg-gradient-to-r from-primary via-secondary to-accent" />
}
