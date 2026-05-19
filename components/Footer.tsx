import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

function localePath(locale: string, path: string) {
  return locale === 'en' ? path : `/${locale}${path}`
}

export default function Footer() {
  const t = useTranslations('footer')
  const tn = useTranslations('nav')
  const locale = useLocale()

  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-sm font-black text-white">
                SK
              </span>
              <span className="font-bold text-white">Dr. Kabongo</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI Researcher · Engineer · Educator<br />
              Building bridges between continents through technology.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Navigation</h3>
            <ul className="space-y-2">
              {[
                { href: localePath(locale, '/blog'), label: tn('blog') },
                { href: localePath(locale, '/projects'), label: tn('projects') },
                { href: localePath(locale, '/publications'), label: tn('publications') },
                { href: localePath(locale, '/cv'), label: tn('cv') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Connect</h3>
            <ul className="space-y-2">
              {[
                { href: 'https://www.youtube.com/@DrKabongo', label: 'YouTube @DrKabongo' },
                { href: 'https://www.youtube.com/@DrKabongoFr', label: 'YouTube @DrKabongoFr' },
                { href: 'https://www.youtube.com/@DarAkili', label: 'YouTube @DarAkili' },
                { href: 'https://x.com/SalomonKabongo', label: 'X @SalomonKabongo' },
                { href: 'https://linkedin.com/in/salomon-kabongo', label: 'LinkedIn' },
                { href: 'https://github.com/Kabongosalomon', label: 'GitHub' },
                { href: 'https://scholar.google.com/citations?user=BPDma7YAAAAJ', label: 'Google Scholar' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex items-center justify-center">
          <p className="text-xs text-slate-500">
            © {year} Salomon Kabongo. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  )
}
