'use client'

import { useLang } from '@/components/providers/LanguageProvider'

export default function Footer() {
  const { c, s } = useLang()
  const email = c.contacts[0]
  const linkedin = c.contacts[2]
  return (
    <footer className="border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-xs text-text-secondary sm:flex-row sm:px-8">
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} apt. {c.fullName}, S.Farm. {s.rights}
        </p>
        <div className="flex items-center gap-4">
          <a href={email.href} className="transition-colors hover:text-white">
            Email
          </a>
          <a href={linkedin.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
