'use client'

import { useEffect } from 'react'

/**
 * Warna latar berganti halus mengikuti segmen yang sedang di tengah layar: tiap segmen punya biru sendiri
 * (atas, tengah, bawah gradasi), dan di antara dua segmen warnanya dicampur menurut posisi scroll.
 * Kecerahan setiap biru dibatasi (teks putih dan teks sekunder tetap >= 4,5:1), jadi pergantian tidak mengorbankan keterbacaan.
 * Halaman tanpa segmen ini (mis. detail pengalaman) tetap memakai warna bawaan di globals.css.
 */
const PALETTE: { id: string; top: string; mid: string; bot: string }[] = [
  { id: 'home', top: '#0d69c7', mid: '#0a66c2', bot: '#07529f' }, // biru kobalt (bawaan)
  { id: 'about', top: '#0a6cae', mid: '#09609d', bot: '#064a82' }, // biru langit tua
  { id: 'education', top: '#2a5fd0', mid: '#234fb8', bot: '#16398f' }, // biru indigo
  { id: 'experience', top: '#1658c4', mid: '#1049a8', bot: '#0a3680' }, // biru royal
  { id: 'organization', top: '#0b6a96', mid: '#0a5983', bot: '#074266' }, // biru baja
  { id: 'certificates', top: '#3556c8', mid: '#2c47ae', bot: '#1d3282' }, // biru periwinkle
  { id: 'skills', top: '#0b5fd1', mid: '#094fb0', bot: '#063a86' }, // biru safir
  { id: 'contact', top: '#0a52a8', mid: '#083f88', bot: '#052c64' }, // biru laut dalam
]

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = rgb(a)
  const [r2, g2, b2] = rgb(b)
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`
}
const ease = (t: number) => t * t * (3 - 2 * t)

export default function SectionTint() {
  useEffect(() => {
    const root = document.documentElement
    const segs = PALETTE.map((p) => ({ p, el: document.getElementById(p.id) })).filter((s): s is { p: (typeof PALETTE)[number]; el: HTMLElement } => !!s.el)
    if (segs.length < 2) return

    let centers: number[] = []
    let raf = 0
    const measure = () => {
      centers = segs.map(({ el }) => el.getBoundingClientRect().top + window.scrollY + el.offsetHeight / 2)
    }
    const paint = () => {
      raf = 0
      const y = window.scrollY + window.innerHeight * 0.5
      let i = 0
      while (i < centers.length - 1 && y > centers[i + 1]) i++
      const last = i >= centers.length - 1
      const t = last || y <= centers[0] ? 0 : ease(Math.min(1, Math.max(0, (y - centers[i]) / (centers[i + 1] - centers[i]))))
      const a = segs[i].p
      const b = segs[last ? i : i + 1].p
      root.style.setProperty('--bg-top', mix(a.top, b.top, t))
      root.style.setProperty('--bg-mid', mix(a.mid, b.mid, t))
      root.style.setProperty('--bg-bot', mix(a.bot, b.bot, t))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const remeasure = () => {
      measure()
      schedule()
    }

    remeasure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', remeasure)
    const ro = new ResizeObserver(remeasure) // tinggi segmen bisa berubah (animasi masuk, ganti bahasa, filter)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', remeasure)
      ro.disconnect()
      if (raf) cancelAnimationFrame(raf)
      root.style.removeProperty('--bg-top')
      root.style.removeProperty('--bg-mid')
      root.style.removeProperty('--bg-bot')
    }
  }, [])

  return null
}
