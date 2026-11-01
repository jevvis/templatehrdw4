'use client'

import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'
import { WHATSAPP_NUMBER } from '@/lib/utils'

/**
 * Kontak tanpa form: tombol langsung membuka WhatsApp (wa.me) dengan sapaan yang sudah terisi, dan CV bisa diunduh.
 * Nomor tujuan dari NEXT_PUBLIC_WHATSAPP_NUMBER; bila kosong WhatsApp terbuka tanpa tujuan dan pengunjung memilih kontaknya sendiri.
 */
export default function Contact() {
  const { c, s } = useLang()
  const wa = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(s.wa_greeting)}`

  return (
    <section id="contact" className="section">
      <SectionHeading title={s.contact_title} desc={s.contact_desc} />
      <Reveal className="flex flex-wrap items-center gap-4">
        <a href={wa} target="_blank" rel="noopener noreferrer" data-cursor className="btn-primary">
          {s.contact_wa}
        </a>
        <a href="/CV_Hafizah_Nurfadillah.pdf" download data-cursor className="btn-ghost">
          {s.cv_download}
        </a>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {c.contacts.map((k, i) => {
          const body = (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-soft">{k.label}</p>
              <p className="mt-1 break-all text-sm font-medium">{k.value}</p>
            </>
          )
          return (
            <Reveal key={k.label} i={i} className="h-full">
              {k.href ? (
                <a href={k.href} target={k.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" data-cursor className="glass block h-full rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60">
                  {body}
                </a>
              ) : (
                <div className="glass h-full rounded-3xl p-5">{body}</div>
              )}
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
