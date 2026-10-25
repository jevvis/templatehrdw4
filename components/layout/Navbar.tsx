'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/components/providers/LanguageProvider'
import { cn } from '@/lib/utils'

const LINKS = [
  ['home', 'nav_home'],
  ['about', 'nav_about'],
  ['education', 'nav_education'],
  ['experience', 'nav_experience'],
  ['organization', 'nav_organization'],
  ['certificates', 'nav_certificates'],
  ['skills', 'nav_skills'],
  ['contact', 'nav_contact'],
] as const

export default function Navbar() {
  const { lang, setLang, s, c } = useLang()
  const pathname = usePathname()
  const home = pathname === '/'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const on = () => setScrolled(scrollY > 24)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])

  // bagian yang sedang dilihat ditandai di menu (hanya di halaman utama)
  useEffect(() => {
    if (!home) return
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [home])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])
  useEffect(() => setOpen(false), [pathname])

  const href = (id: string) => (home ? `#${id}` : `/#${id}`)
  // di halaman detail tautan bagian memakai Link (navigasi klien, tanpa muat ulang dan tanpa layar loading)
  const NavLink = ({ id, className, children, onClick }: { id: string; className: string; children: React.ReactNode; onClick?: () => void }) =>
    home ? (
      <a href={href(id)} className={className} onClick={onClick}>
        {children}
      </a>
    ) : (
      <Link href={href(id)} className={className} onClick={onClick}>
        {children}
      </Link>
    )

  return (
    <>
      <a href="#konten" className="sr-only fixed left-4 top-4 z-[120] rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black focus:not-sr-only">
        {s.skip}
      </a>
      <header className={cn('fixed inset-x-0 top-0 z-[80] transition-all duration-500', scrolled ? 'py-2' : 'py-4')}>
        <nav
          aria-label="Navigasi utama"
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500 sm:px-6',
            scrolled ? 'glass mx-3 shadow-lg sm:mx-auto' : 'bg-transparent'
          )}
        >
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            {c.name}
            <span className="text-accent">.</span>
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map(([id, key]) => (
              <li key={id}>
                <NavLink
                  id={id}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                    home && active === id ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'
                  )}
                >
                  {s[key]}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div role="group" aria-label="Bahasa" className="flex rounded-full border p-0.5 text-[11px] font-semibold" style={{ borderColor: 'var(--line)' }}>
              {(['id', 'en'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={cn('rounded-full px-2.5 py-1 uppercase transition-colors', lang === l ? 'bg-white text-black' : 'text-text-secondary hover:text-white')}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label={open ? s.close : s.menu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-content-center gap-[5px] rounded-full border lg:hidden"
              style={{ borderColor: 'var(--line)' }}
            >
              <motion.span animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 rounded bg-white" />
              <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-0.5 w-5 rounded bg-white" />
              <motion.span animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 rounded bg-white" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[70] flex flex-col justify-center bg-background/90 px-8 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-1">
              {LINKS.map(([id, key], i) => (
                <motion.li key={id} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                  <NavLink id={id} onClick={() => setOpen(false)} className={cn('block py-2 text-3xl font-bold tracking-tight', home && active === id ? 'gradient-text' : 'text-white')}>
                    {s[key]}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
