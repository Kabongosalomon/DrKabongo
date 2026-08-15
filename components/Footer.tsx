import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { CHANNELS, CHANNEL_KEYS } from '@/lib/videos'
import { COMMUNITY, DARAKILI_URL } from '@/content/community'
import { BOOKING_URL } from '@/lib/contact'

const SOCIAL = [
  { href: 'https://scholar.google.com/citations?user=BPDma7YAAAAJ', label: 'Google Scholar' },
  { href: 'https://linkedin.com/in/salomon-kabongo', label: 'LinkedIn' },
  { href: 'https://github.com/Kabongosalomon', label: 'GitHub' },
  { href: 'https://x.com/SalomonKabongo', label: 'X · @SalomonKabongo' },
]

export default function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')
  const year = new Date().getFullYear()

  const explore = [
    { href: '/videos', label: tn('videos') },
    { href: '/blog', label: tn('blog') },
    { href: '/publications', label: tn('publications') },
    { href: '/projects', label: tn('projects') },
    { href: '/cv', label: tn('cv') },
  ]

  const work = [
    { href: '/speaking', label: tn('speaking') },
    { href: '/consulting', label: tn('consulting') },
  ]

  // Channels first, then the community spaces, then the profiles.
  const connect = [
    ...CHANNEL_KEYS.map((key) => ({
      href: CHANNELS[key].url,
      label: `YouTube · ${CHANNELS[key].handle}`,
    })),
    ...COMMUNITY.map(({ key, href }) => ({ href, label: t(`connect_${key}`) })),
    { href: DARAKILI_URL, label: 'DarAkili · darakili.com' },
    ...SOCIAL,
  ]

  return (
    <footer className="border-t border-rule bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-serif text-lg font-medium text-ink">Salomon Kabongo, PhD</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-2">{t('tagline')}</p>
          </div>

          <nav aria-label={t('explore')}>
            <h2 className="eyebrow">{t('explore')}</h2>
            <ul className="mt-3 space-y-2">
              {explore.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-ink-2 transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('work_with_me')}>
            <h2 className="eyebrow">{t('work_with_me')}</h2>
            <ul className="mt-3 space-y-2">
              {work.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-ink-2 transition-colors hover:text-accent">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-2 transition-colors hover:text-accent"
                >
                  {t('book_time')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:kabongosalomon@gmail.com"
                  className="text-sm break-all text-ink-2 transition-colors hover:text-accent"
                >
                  kabongosalomon@gmail.com
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label={t('connect')}>
            <h2 className="eyebrow">{t('connect')}</h2>
            <ul className="mt-3 space-y-2">
              {connect.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-2 transition-colors hover:text-accent"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-rule pt-6 text-xs text-ink-3">
          <p>
            © {year} Dr. Kabongo. {t('rights')}
          </p>
          <p className="mt-3 max-w-3xl leading-relaxed">{t('disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
