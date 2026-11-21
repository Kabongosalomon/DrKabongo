import type { MetadataRoute } from 'next'
import { IS_PRODUCTION_DEPLOYMENT } from '@/lib/metadata'

export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOYMENT) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://drkabongo.com/sitemap.xml',
  }
}
