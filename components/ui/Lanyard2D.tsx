'use client'

import { useEffect, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'

const BASE = 100 // jarak gesper ke tepi atas kartu saat diam (px)
const ANCHOR = 58 // posisi gesper dari tepi atas area (px)
const CARD_W = 260
const V_LEN = 190 // panjang tiap pita atas pada susunan V (px)

/** Teks cetak pada pita: nama dan peran berulang, dibaca dari bawah ke atas (seperti lanyard cetak). */
function StrapPrint({ a, b }: { a: string; b: string }) {
  return (
    <div className="strap-text absolute inset-0 overflow-hidden px-[9px] py-2" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i}>
          {a}
          <i className="mx-3 not-italic text-white/45">•</i>
          <b className="text-[#ffd84d]">{b}</b>
          <i className="mx-3 not-italic text-white/45">•</i>
        </span>
      ))}
    </div>
  )
}

/**
 * Cadangan 2D untuk lanyard 3D (perangkat tanpa WebGL, lemah, atau memilih kurangi gerak).
 * Kartu ID yang tergantung di lanyard berpita lebar: dua pita membentuk V, bertemu di gesper hitam, lalu satu pita turun ke
 * kartu. Kartu bisa diseret; saat dilepas kembali ke posisi semula dengan ayunan pegas
 * (bandul). Fisikanya 2D (Framer Motion), bukan 3D, supaya ringan di HP. Di layar sentuh hanya seret horizontal,
 * sehingga scroll halaman tetap jalan.
 */
export default function Lanyard2D() {
  const { c, s } = useLang()
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sway = useMotionValue(0)

  // kemiringan kartu mengikuti posisi x lewat pegas yang kurang teredam, jadi berayun melewati titik tengah
  const swing = useSpring(useTransform(x, [-200, 200], [-18, 18]), reduce ? { stiffness: 260, damping: 40 } : { stiffness: 80, damping: 5, mass: 1 })
  const rotate = useTransform([swing, sway], ([a, b]: number[]) => a + b)
  // tali menghubungkan jangkar di atas ke tepi atas kartu
  const strapLen = useTransform([x, y], ([lx, ly]: number[]) => Math.hypot(lx, BASE + ly))
  const strapRot = useTransform([x, y], ([lx, ly]: number[]) => (Math.atan2(-lx, BASE + ly) * 180) / Math.PI)

  // di layar sentuh, seret hanya ke samping: Framer Motion lalu memberi touch-action: pan-y sehingga scroll vertikal tetap jalan
  const [coarse, setCoarse] = useState(false)
  useEffect(() => setCoarse(matchMedia('(pointer: coarse)').matches), [])

  // ayunan pelan saat tidak disentuh
  useEffect(() => {
    if (reduce) return
    const a = animate(sway, [0, 2.4, 0, -2.4, 0], { duration: 7, repeat: Infinity, ease: 'easeInOut' })
    return () => a.stop()
  }, [reduce, sway])

  const edu = c.edu[0]
  const printA = c.name.toUpperCase()
  const printB = s.card_role.toUpperCase()

  return (
    <div className="relative mx-auto h-[620px] w-full max-w-[340px] select-none sm:h-[660px]" role="img" aria-label={`${c.fullName}: ${s.card_role}`}>
      {/* dua pita atas membentuk V dan bertemu di gesper */}
      {[-1, 1].map((d) => (
        <div
          key={d}
          aria-hidden="true"
          className="strap absolute left-1/2 -ml-[17px] w-[34px] rounded-t-[3px]"
          style={{ top: ANCHOR - V_LEN, height: V_LEN, transformOrigin: '50% 100%', transform: `rotate(${d * 26}deg)` }}
        >
          <StrapPrint a={printA} b={printB} />
        </div>
      ))}
      {/* Gesper pengaman hitam di titik temu */}
      <div className="absolute left-1/2 z-20 -translate-x-1/2" style={{ top: ANCHOR - 16 }} aria-hidden="true">
        <div className="relative h-[52px] w-[46px] rounded-[12px] bg-gradient-to-b from-[#2e3340] via-[#12151d] to-[#07080c] shadow-[0_8px_18px_-6px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
          <div className="mx-auto mt-3 h-2.5 w-8 rounded-md bg-black/80 ring-1 ring-white/10" />
          <div className="mx-auto mt-2 h-1.5 w-5 rounded bg-white/10" />
          <div className="mx-auto mt-1.5 h-1.5 w-7 rounded bg-white/5" />
        </div>
      </div>
      {/* pita utama ke kartu: mengikuti posisi kartu */}
      <motion.div
        aria-hidden="true"
        style={{ top: ANCHOR, height: strapLen, rotate: strapRot, transformOrigin: '50% 0%' }}
        className="strap absolute left-1/2 -ml-[17px] w-[34px] overflow-hidden rounded-b-[3px]"
      >
        <StrapPrint a={printA} b={printB} />
        <div className="strap-tip absolute inset-x-0 bottom-0 h-8" />
      </motion.div>

      <motion.div
        drag={coarse ? 'x' : true}
        dragConstraints={{ left: -150, right: 150, top: -20, bottom: 110 }}
        dragElastic={0.25}
        dragSnapToOrigin
        dragTransition={reduce ? { bounceStiffness: 400, bounceDamping: 40 } : { bounceStiffness: 200, bounceDamping: 9 }}
        whileDrag={{ scale: 1.03 }}
        style={{ x, y, rotate, top: ANCHOR + BASE, width: CARD_W, marginLeft: -CARD_W / 2, transformOrigin: '50% 0%' }}
        className="absolute left-1/2 cursor-grab active:cursor-grabbing"
        data-cursor
      >
        {/* klip logam penghubung tali dan kartu */}
        <div className="absolute -top-3 left-1/2 z-10 h-6 w-9 -translate-x-1/2 rounded-md bg-gradient-to-b from-slate-200 to-slate-500 shadow-md" />
        <div className="overflow-hidden rounded-[26px] border shadow-glow" style={{ borderColor: 'var(--line)', background: 'linear-gradient(180deg,#18214a,#0b1129)' }}>
          <div className="relative h-[280px] overflow-hidden bg-gradient-to-b from-[#1d6fa5] via-[#1f4f9a] to-[#18214a]">
            <div className="absolute left-1/2 top-4 h-2 w-14 -translate-x-1/2 rounded-full bg-black/40" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.photo} alt="" draggable={false} className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[96%] w-auto max-w-none object-contain object-bottom" />
          </div>
          <div className="space-y-2 px-5 pb-5 pt-4">
            <p className="text-2xl font-extrabold tracking-tight">{c.name}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{s.card_role}</p>
            <p className="text-xs text-text-secondary">
              {edu.title} · {edu.school}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="chip">
                {s.card_gpa} {edu.gpa}
              </span>
              <span className="text-[10px] tracking-widest text-text-secondary">{edu.year}</span>
            </div>
          </div>
        </div>
      </motion.div>
      <p className="absolute bottom-0 left-0 right-0 text-center text-[11px] tracking-[0.25em] text-text-secondary">{s.drag_hint.toUpperCase()}</p>
    </div>
  )
}
