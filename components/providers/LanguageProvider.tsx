'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CONTENT } from '@/lib/content'
import { STR } from '@/lib/strings'
import { CATEGORY_LABELS } from '@/lib/utils'
import type { Content, Lang } from '@/lib/types'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  /** Isi CV pada bahasa aktif */
  c: Content
  /** Teks antarmuka pada bahasa aktif */
  s: Record<string, string>
  /** Label kategori pengalaman */
  cat: (typeof CATEGORY_LABELS)['id']
}

const Ctx = createContext<LangCtx | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id')

  // bahasa awal: ?lang=en atau pilihan tersimpan (server selalu merender 'id' dulu)
  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search).get('lang')
      const saved = localStorage.getItem('lang')
      setLangState((q || saved) === 'en' ? 'en' : 'id')
    } catch {}
  }, [])
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
    } catch {}
  }, [])

  const value = useMemo<LangCtx>(() => ({ lang, setLang, c: CONTENT[lang], s: STR[lang], cat: CATEGORY_LABELS[lang] }), [lang, setLang])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const v = useContext(Ctx)
  if (!v) throw new Error('useLang harus dipakai di dalam LanguageProvider')
  return v
}
