'use client'

import { useEffect, useState } from 'react'

// Sinyal sederhana tingkat modul: layar loading memanggil setReady() saat mulai naik (atau langsung bila tidak tampil),
// dan komponen yang animasi masuknya harus menunggu memakai useReady(). Bertahan selama navigasi klien.
let ready = false
const subs = new Set<() => void>()

export const setReady = () => {
  if (ready) return
  ready = true
  subs.forEach((f) => f())
}

export const useReady = () => {
  const [r, setR] = useState(ready)
  useEffect(() => {
    if (ready) {
      setR(true)
      return
    }
    const f = () => setR(true)
    subs.add(f)
    return () => {
      subs.delete(f)
    }
  }, [])
  return r
}
