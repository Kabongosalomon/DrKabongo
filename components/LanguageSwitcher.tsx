'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const LABELS: Record<string, string> = {
  en: 'EN',
  fr: 'FR',
  ln: 'LN',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (next: string) => {
    if (next === locale) return
    router.push(pathname, { locale: next })
  }

  return (
    <div className="flex items-center gap-1 bg-slate-800/60 border border-slate-700 rounded-full p-1">
      {(routing.locales as readonly string[]).map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
            l === locale
              ? 'bg-brand text-white shadow-sm shadow-brand/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700'
          }`}
          aria-current={l === locale ? 'true' : undefined}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}
