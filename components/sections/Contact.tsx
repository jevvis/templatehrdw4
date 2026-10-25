'use client'

import { useState } from 'react'
import { useLang } from '@/components/providers/LanguageProvider'
import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/ui/SectionHeading'

/**
 * Form kontak tanpa backend: saat dikirim, aplikasi email pengunjung terbuka dengan pesan yang sudah terisi (mailto).
 * Untuk pengiriman langsung dari situs, sambungkan ke API route / Formspree / EmailJS.
 */
export default function Contact() {
  const { c, s } = useLang()
  const email = c.contacts[0]
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`${s.contact_title}: ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n${form.name}\n${form.email}`)
    setSent(true)
    window.location.href = `mailto:${email.value}?subject=${subject}&body=${body}`
  }
  const field = 'w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm outline-none transition-colors placeholder:text-text-secondary/60 focus:border-secondary'

  return (
    <section id="contact" className="section">
      <SectionHeading eyebrow={s.contact_eyebrow} title={s.contact_title} desc={s.contact_desc} />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          {c.contacts.map((k, i) => {
            const body = (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">{k.label}</p>
                <p className="mt-1 break-all text-sm font-medium">{k.value}</p>
              </>
            )
            return (
              <Reveal key={k.label} i={i}>
                {k.href ? (
                  <a href={k.href} target={k.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" data-cursor className="glass block rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/60">
                    {body}
                  </a>
                ) : (
                  <div className="glass rounded-3xl p-5">{body}</div>
                )}
              </Reveal>
            )
          })}
        </div>
        <Reveal i={1}>
          <form onSubmit={submit} className="glass space-y-4 rounded-3xl p-6 sm:p-8">
            <label className="block text-xs font-semibold text-text-secondary">
              {s.form_name}
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={s.form_ph_name} className={`${field} mt-2`} style={{ borderColor: 'var(--line)' }} />
            </label>
            <label className="block text-xs font-semibold text-text-secondary">
              {s.form_email}
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={s.form_ph_email} className={`${field} mt-2`} style={{ borderColor: 'var(--line)' }} />
            </label>
            <label className="block text-xs font-semibold text-text-secondary">
              {s.form_msg}
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={s.form_ph_msg} className={`${field} mt-2 resize-none`} style={{ borderColor: 'var(--line)' }} />
            </label>
            <div className="flex items-center gap-4">
              <button type="submit" className="btn-primary">
                {s.form_send}
              </button>
              {sent && (
                <p role="status" className="text-xs text-text-secondary">
                  {s.form_hint}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
