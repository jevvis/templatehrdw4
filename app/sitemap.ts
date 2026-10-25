import type { MetadataRoute } from 'next'
import { SITE_URL, SLUGS } from '@/lib/utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...SLUGS.map((slug) => ({ url: `${SITE_URL}/pengalaman/${slug}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.7 })),
  ]
}
