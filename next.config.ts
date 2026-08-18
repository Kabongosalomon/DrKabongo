import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  /**
   * `vega-canvas` ships a Node build that optionally requires the native
   * `canvas` package for server-side rendering. It reaches the bundle through
   * the EdTrace viewer's lazy plot chunk, which only ever runs in a browser
   * against the DOM canvas, so the dependency is unreachable — without this
   * alias every build logs a "Can't resolve 'canvas'" warning for it.
   */
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, canvas: false }
    return config
  },
}

export default withNextIntl(nextConfig)
