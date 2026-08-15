import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Salomon Kabongo, PhD — AI researcher, educator and speaker'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

/**
 * Generated at build time, so there is no binary asset to keep in sync with the
 * brand. Uses system serif/sans — no font fetch, so it cannot fail the build.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#FBF9F6',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#7C7469',
            }}
          >
            {t('credential')}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 88,
              fontFamily: 'serif',
              color: '#14120F',
              lineHeight: 1.05,
            }}
          >
            {t('name')}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              fontFamily: 'serif',
              color: '#4A443C',
              lineHeight: 1.35,
              maxWidth: 900,
            }}
          >
            {t('lede')}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 4, background: '#7A2E1E' }} />
          <div style={{ fontSize: 26, color: '#4A443C' }}>drkabongo.com</div>
        </div>
      </div>
    ),
    size,
  )
}
