'use client'

import { useState, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'

type Status = 'idle' | 'sending' | 'pending' | 'already' | 'invalid' | 'busy' | 'error'

/**
 * "Get new posts by email" box. `emailEnabled` is false on builds without a
 * KIT_API_KEY / KIT_FORM_ID, which then offer only the RSS feed rather than a form
 * that can never succeed.
 */
export default function Subscribe({ emailEnabled }: { emailEnabled: boolean }) {
  const t = useTranslations('subscribe')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      const data = (await res.json().catch(() => ({}))) as { status?: Status }
      setStatus(data.status ?? 'error')
      if (data.status === 'pending' || data.status === 'already') setEmail('')
    } catch {
      setStatus('error')
    }
  }

  const done = status === 'pending' || status === 'already'

  return (
    <aside className="rounded-lg border border-rule bg-surface p-5 sm:p-6">
      <h2 className="font-serif text-xl font-medium text-ink">{t('title')}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{t('subtitle')}</p>

      {emailEnabled &&
        (done ? (
          <p role="status" className="mt-4 text-sm font-medium text-ink">
            {t(status === 'already' ? 'already' : 'pending')}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4">
            <div className="flex flex-col gap-3 xs:flex-row">
              <label htmlFor="subscribe-email" className="sr-only">
                {t('placeholder')}
              </label>
              <input
                id="subscribe-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholder')}
                className="min-w-0 flex-1 rounded-md border border-rule bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
              />
              {/* Honeypot — invisible to people, see app/api/subscribe/route.ts. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex shrink-0 items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {status === 'sending' ? t('sending') : t('button')}
              </button>
            </div>
            {(status === 'invalid' || status === 'busy' || status === 'error') && (
              <p role="alert" className="mt-2 text-sm text-accent">
                {t(status)}
              </p>
            )}
          </form>
        ))}

      <p className="mt-4 text-xs text-ink-3">
        {emailEnabled ? t('no_spam') + ' ' : ''}
        <a href="/feed.xml" className="inline-flex items-center gap-1 underline-offset-4 hover:text-accent hover:underline">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36ZM4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44Zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z" />
          </svg>
          {t('rss')}
        </a>
      </p>
    </aside>
  )
}
