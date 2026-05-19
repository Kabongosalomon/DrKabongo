import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Image from 'next/image'
import Link from 'next/link'
import YouTubeChannelCard from '@/components/YouTubeChannelCard'
import BlogCard from '@/components/BlogCard'
import { getAllPosts } from '@/lib/blog'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function localePath(locale: string, path: string) {
  return locale === 'en' ? path : `/${locale}${path}`
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'hero' })
  const ta = await getTranslations({ locale, namespace: 'about' })
  const ty = await getTranslations({ locale, namespace: 'youtube' })
  const tb = await getTranslations({ locale, namespace: 'blog' })
  const tc = await getTranslations({ locale, namespace: 'contact' })
  const ts = await getTranslations({ locale, namespace: 'stats' })

  const recentPosts = getAllPosts().slice(0, 3)

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-semibold text-brand-light">
                  @DrKabongo · @DarAkili
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-3">
                {t('name')}
                <span className="block text-2xl sm:text-3xl font-semibold mt-1 gradient-text">
                  {t('title')}
                </span>
              </h1>

              <p className="text-lg text-brand-light font-medium mb-4">{t('tagline')}</p>

              <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-lg">
                {t('description')}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={localePath(locale, '/cv')}
                  className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dim text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-brand/20"
                >
                  {t('cta_cv')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href="https://www.youtube.com/@DrKabongo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  {t('cta_youtube')}
                </a>
                <a
                  href="https://appt.link/meeting-with-salomon-kabongo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-slate-700 hover:border-brand text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  {t('cta_contact')}
                </a>
              </div>
            </div>

            {/* Photo */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-brand/40 to-accent/30 blur-2xl scale-110" />
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-brand/30 shadow-2xl">
                  <Image
                    src="/images/salomon.jpg"
                    alt="Dr. Salomon Kabongo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-2 -right-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 shadow-xl shrink-0">
                  <p className="text-xs font-bold text-white">PhD · NLP</p>
                  <p className="text-xs text-slate-400">Leibniz U. Hannover</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: ts('patent'), sub: ts('patent_year'), color: '#6366f1' },
              { value: ts('bestpaper'), sub: ts('bestpaper_venue'), color: '#f59e0b' },
              { value: ts('citations'), sub: ts('citations_label'), color: '#10b981' },
              { value: ts('funding'), sub: ts('funding_label'), color: '#8b5cf6' },
            ].map(({ value, sub, color }) => (
              <div
                key={value}
                className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 text-center"
              >
                <p className="text-sm font-bold text-white mb-0.5">{value}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section id="about" className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <span className="section-label">{ta('section_label')}</span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                {ta('title')}
              </h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>{ta('bio1')}</p>
                <p>{ta('bio2')}</p>
                <p>{ta('bio3')}</p>
              </div>

              <div className="mt-8 flex gap-4">
                <a
                  href="https://linkedin.com/in/salomon-kabongo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Kabongosalomon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  GitHub
                </a>
                <a
                  href="https://scholar.google.com/citations?user=BPDma7YAAAAJ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Scholar
                </a>
                <a
                  href="https://x.com/SalomonKabongo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X / Twitter
                </a>
              </div>
            </div>

            {/* Research interests */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">{ta('research_title')}</h3>
              <ul className="space-y-3">
                {(ta.raw('research_items') as string[]).map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-light" />
                    </span>
                    <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Talks */}
              <div className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">Talks & Presentations</h3>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>
                    <a
                      href="https://youtu.be/rC_DDhMhVc8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-light transition-colors underline decoration-slate-600 hover:decoration-brand-light"
                    >
                      The Transformer: From RNN to Attention
                    </a>
                    <span className="ml-2 text-slate-600">— Data Science for Social Impact, 2020</span>
                  </li>
                  <li>
                    <a href="/archive/Talk_1.pdf" className="hover:text-brand-light transition-colors underline decoration-slate-600 hover:decoration-brand-light">
                      Introduction to NLP
                    </a>
                    <span className="ml-2 text-slate-600">— AIMS Cape Town</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── YOUTUBE CHANNELS ─── */}
      <section id="youtube" className="py-24 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">{ty('section_label')}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">{ty('title')}</h2>
            <p className="text-slate-400 max-w-xl mx-auto">{ty('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <YouTubeChannelCard
              handle={ty('english_name')}
              url="https://www.youtube.com/@DrKabongo"
              label={ty('english_label')}
              description={ty('english_desc')}
              accentColor="#ef4444"
              subscribeLabel={ty('subscribe')}
            />
            <YouTubeChannelCard
              handle={ty('french_name')}
              url="https://www.youtube.com/@DrKabongoFr"
              label={ty('french_label')}
              description={ty('french_desc')}
              accentColor="#3b82f6"
              subscribeLabel={ty('subscribe')}
            />
            <YouTubeChannelCard
              handle={ty('lingala_name')}
              url="https://www.youtube.com/@DarAkili"
              label={ty('lingala_label')}
              description={ty('lingala_desc')}
              accentColor="#10b981"
              subscribeLabel={ty('subscribe')}
            />
          </div>
        </div>
      </section>

      {/* ─── LATEST BLOG POSTS ─── */}
      {recentPosts.length > 0 && (
        <section id="blog" className="py-24 bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="section-label">{tb('section_label')}</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">{tb('title')}</h2>
              </div>
              <Link
                href={localePath(locale, '/blog')}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-light hover:text-white transition-colors"
              >
                {tb('all_posts')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  locale={locale}
                  readMoreLabel={tb('read_more')}
                  minReadLabel={tb('min_read')}
                />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href={localePath(locale, '/blog')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-light"
              >
                {tb('all_posts')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-24 bg-linear-to-b from-slate-900/40 to-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label">{tc('section_label')}</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">{tc('title')}</h2>
          <p className="text-slate-400 mb-10">{tc('subtitle')}</p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={tc('book_call_url')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dim text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-lg shadow-brand/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {tc('book_call')}
            </a>
            <a
              href="mailto:kabongosalomon@gmail.com"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {tc('email')}
            </a>
            <a
              href="https://linkedin.com/in/salomon-kabongo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-slate-700 hover:border-brand text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              {tc('linkedin')}
            </a>
            <a
              href="https://x.com/SalomonKabongo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-slate-700 hover:border-brand text-slate-300 hover:text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              @SalomonKabongo
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
