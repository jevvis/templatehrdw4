'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'
import Lanyard2D from './Lanyard2D'

function Placeholder() {
  return <div className="-mt-28 mx-auto h-[700px] w-full max-w-[460px] sm:-mt-32 sm:h-[780px] lg:translate-x-14" aria-hidden="true" />
}

// Lanyard 3D (three.js + fisika Rapier) dimuat hanya di browser, setelah halaman siap
const Lanyard3D = dynamic(() => import('./Lanyard3D'), { ssr: false, loading: () => <Placeholder /> })

/** WebGL tersedia dan perangkat tidak terlalu lemah (memori/CPU), jika tidak dipakai cadangan 2D. */
function canUse3D(): boolean {
  try {
    const cv = document.createElement('canvas')
    if (!(cv.getContext('webgl2') || cv.getContext('webgl'))) return false
  } catch {
    return false
  }
  const nav = navigator as Navigator & { deviceMemory?: number }
  if ((nav.deviceMemory ?? 8) < 4) return false
  if ((navigator.hardwareConcurrency ?? 8) < 4) return false
  return true
}

/**
 * Memilih lanyard: 3D berfisika bila WebGL dan perangkat memadai, 2D bila tidak. `?lanyard=2d` / `?lanyard=3d` memaksa salah satunya.
 * Pengguna "kurangi gerak" tetap mendapat 3D, tetapi dalam mode tenang: rantai mulai lurus tanpa ayunan masuk dan hanya bergerak
 * saat diseret (`?motion=1` mengembalikan ayunan masuk).
 */
export default function LanyardCard() {
  const { c, s } = useLang()
  const reduce = useReducedMotion()
  const [mode, setMode] = useState<'wait' | '3d' | '2d'>('wait')

  useEffect(() => {
    const force = new URLSearchParams(location.search).get('lanyard')
    if (force === '2d' || force === '3d') return setMode(force)
    setMode(canUse3D() ? '3d' : '2d')
  }, [])

  if (mode === 'wait') return <Placeholder />
  if (mode === '2d') return <Lanyard2D />

  const edu = c.edu[0]
  const calm = !!reduce && !location.search.includes('motion=1')
  return (
    <Lanyard3D
      calm={calm}
      name={c.name}
      role={s.card_role}
      school={`${edu.title} · ${edu.school}`}
      gpa={`${s.card_gpa} ${edu.gpa}`}
      year={edu.year}
      photo={c.photo}
      hint={s.drag_hint.toUpperCase()}
      label={`${c.fullName}: ${s.card_role}`}
    />
  )
}
