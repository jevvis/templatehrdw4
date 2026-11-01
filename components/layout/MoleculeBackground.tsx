'use client'

import { useEffect, useRef } from 'react'

/**
 * Latar bergerak bertema farmasi: jaringan atom (titik + garis ikatan), cincin heksagon (struktur benzena) dan kapsul obat
 * yang melayang pelan. Bergeser mengikuti scroll (kedalaman berbeda) dan sedikit mengikuti mouse.
 * Semua digambar sangat transparan di belakang konten supaya kontras teks tidak berubah.
 * Hemat: jumlah elemen mengikuti luas layar (dan dikurangi di perangkat lemah), berhenti saat tab tidak terlihat,
 * dan menjadi satu gambar diam bila pengunjung memilih "kurangi gerak".
 */
type Body = { x: number; y: number; vx: number; vy: number; d: number }
type Atom = Body & { r: number }
type Ring = Body & { r: number; a: number; va: number }
type Pill = Body & { len: number; w: number; a: number; va: number; teal: boolean }

const WHITE = '215, 236, 255'
const TEAL = '127, 240, 228'
const LINK = 150 // jarak maksimum dua atom masih terhubung (px)

const rand = (a: number, b: number) => a + Math.random() * (b - a)

export default function MoleculeBackground() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = navigator as Navigator & { deviceMemory?: number }
    const weak = (nav.deviceMemory ?? 8) < 4 || (navigator.hardwareConcurrency ?? 8) < 4

    let W = 0
    let H = 0
    let atoms: Atom[] = []
    let rings: Ring[] = []
    let pills: Pill[] = []
    let mx = 0
    let my = 0
    let raf = 0
    let last = 0

    const build = () => {
      const k = weak ? 0.55 : 1
      const nAtoms = Math.round(Math.min(46, Math.max(20, (W * H) / 38000)) * k)
      const nRings = Math.round(Math.min(7, Math.max(3, (W * H) / 220000)) * k)
      const nPills = Math.round(Math.min(6, Math.max(3, (W * H) / 260000)) * k)
      const body = (): Body => ({ x: rand(0, W), y: rand(0, H), vx: rand(-9, 9), vy: rand(-9, 9), d: rand(0.25, 1) })
      atoms = Array.from({ length: nAtoms }, () => ({ ...body(), r: rand(1.6, 3.2) }))
      rings = Array.from({ length: nRings }, () => ({ ...body(), r: rand(34, 78), a: rand(0, Math.PI), va: rand(-0.06, 0.06) }))
      pills = Array.from({ length: nPills }, () => ({ ...body(), len: rand(46, 78), w: rand(18, 26), a: rand(0, Math.PI * 2), va: rand(-0.12, 0.12), teal: Math.random() < 0.5 }))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      W = window.innerWidth
      H = window.innerHeight
      cv.width = Math.round(W * dpr)
      cv.height = Math.round(H * dpr)
      cv.style.width = `${W}px`
      cv.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      build()
      if (reduce) draw()
    }

    /** Posisi di layar: gerak sendiri + geser mengikuti scroll dan mouse menurut kedalaman, dibungkus supaya selalu ada isi. */
    const place = (b: Body, margin: number) => {
      const wrap = (v: number, size: number) => ((((v + margin) % (size + margin * 2)) + (size + margin * 2)) % (size + margin * 2)) - margin
      return { x: wrap(b.x + mx * b.d * 28, W), y: wrap(b.y - window.scrollY * b.d * 0.22 + my * b.d * 18, H) }
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const pos = atoms.map((a) => place(a, 40))

      // ikatan antar atom
      ctx.lineWidth = 1
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const dx = pos[i].x - pos[j].x
          const dy = pos[i].y - pos[j].y
          const d = Math.hypot(dx, dy)
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${WHITE}, ${0.28 * (1 - d / LINK)})`
            ctx.beginPath()
            ctx.moveTo(pos[i].x, pos[i].y)
            ctx.lineTo(pos[j].x, pos[j].y)
            ctx.stroke()
          }
        }
      }
      // atom
      atoms.forEach((a, i) => {
        ctx.fillStyle = `rgba(${a.r > 2.6 ? TEAL : WHITE}, ${0.5 + 0.3 * a.d})`
        ctx.beginPath()
        ctx.arc(pos[i].x, pos[i].y, a.r, 0, Math.PI * 2)
        ctx.fill()
      })

      // cincin heksagon (benzena)
      rings.forEach((r) => {
        const p = place(r, r.r + 20)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(r.a)
        ctx.strokeStyle = `rgba(${WHITE}, ${0.1 + 0.1 * r.d})`
        ctx.lineWidth = 1.2
        for (const s of [1, 0.62]) {
          ctx.beginPath()
          for (let k = 0; k < 6; k++) {
            const t = (Math.PI / 3) * k
            ctx.lineTo(Math.cos(t) * r.r * s, Math.sin(t) * r.r * s)
          }
          ctx.closePath()
          ctx.stroke()
        }
        ctx.restore()
      })

      // kapsul obat
      pills.forEach((c) => {
        const p = place(c, c.len + 20)
        const hl = c.len / 2
        const rr = c.w / 2
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(c.a)
        ctx.beginPath()
        ctx.arc(-hl + rr, 0, rr, Math.PI / 2, (Math.PI * 3) / 2)
        ctx.arc(hl - rr, 0, rr, -Math.PI / 2, Math.PI / 2)
        ctx.closePath()
        ctx.fillStyle = `rgba(${WHITE}, ${0.06 + 0.05 * c.d})`
        ctx.fill()
        ctx.save()
        ctx.clip()
        ctx.fillStyle = `rgba(${c.teal ? TEAL : WHITE}, ${0.13 + 0.07 * c.d})`
        ctx.fillRect(-hl, -rr, hl, c.w)
        ctx.restore()
        ctx.strokeStyle = `rgba(${WHITE}, ${0.14 + 0.08 * c.d})`
        ctx.lineWidth = 1.2
        ctx.stroke()
        ctx.restore()
      })
    }

    const step = (t: number) => {
      raf = requestAnimationFrame(step)
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      const move = (b: Body) => {
        b.x += b.vx * dt
        b.y += b.vy * dt
      }
      atoms.forEach(move)
      rings.forEach((r) => {
        move(r)
        r.a += r.va * dt
      })
      pills.forEach((c) => {
        move(c)
        c.a += c.va * dt
      })
      draw()
    }

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / W - 0.5) * 2
      my = (e.clientY / H - 0.5) * 2
    }
    const onVisible = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden && !reduce) {
        last = performance.now()
        raf = requestAnimationFrame(step)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduce) {
      window.addEventListener('scroll', draw, { passive: true })
    } else {
      window.addEventListener('mousemove', onMove, { passive: true })
      document.addEventListener('visibilitychange', onVisible)
      last = performance.now()
      raf = requestAnimationFrame(step)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', draw)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 print:hidden" />
}
