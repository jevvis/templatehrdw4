import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExperienceDetail from '@/components/sections/ExperienceDetail'
import { CONTENT } from '@/lib/content'
import { SLUGS } from '@/lib/utils'

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const i = SLUGS.indexOf(params.slug)
  if (i < 0) return {}
  const e = CONTENT.id.internships[i]
  const description = e.points[0].length > 155 ? e.points[0].slice(0, 152) + '…' : e.points[0]
  return {
    title: `${e.role} | ${e.org}`,
    description,
    openGraph: { type: 'article', locale: 'id_ID', siteName: 'Portofolio Hafizah Nurfadillah', title: `${e.role} | ${e.org}`, description, images: [{ url: e.img }] },
  }
}

export default function Page({ params }: { params: { slug: string } }) {
  const i = SLUGS.indexOf(params.slug)
  if (i < 0) notFound()
  return <ExperienceDetail index={i} />
}
