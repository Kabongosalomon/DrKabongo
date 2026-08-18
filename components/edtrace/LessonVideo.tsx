'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { LOCALE_NAMES } from '@/i18n/routing'

interface LessonVideoProps {
  videoId: string
  /** Language of the recording. */
  language: string
  /** Language the lesson text is shown in — used to flag a mismatch. */
  lessonLanguage: string
  title: string
}

/**
 * The recorded lecture, above the lesson itself.
 *
 * Click-to-play rather than a bare iframe: an embed loads YouTube's player on
 * every page view, which costs a slow request on the mobile connections these
 * courses are meant to reach and sets third-party cookies before the reader has
 * asked for anything. The poster is a still from YouTube's own thumbnail CDN
 * (already allowed in `next.config.ts`), and the player is only mounted on
 * click — through `youtube-nocookie.com`, matching the viewer's own embeds.
 */
export default function LessonVideo({
  videoId,
  language,
  lessonLanguage,
  title,
}: LessonVideoProps) {
  const t = useTranslations('courses')
  const [playing, setPlaying] = useState(false)

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="eyebrow">{t('lecture_video')}</h2>
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="link text-xs"
        >
          {t('watch_on_youtube')}
        </a>
      </div>

      <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-lg border border-rule bg-raised">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${t('play_lecture')} — ${title}`}
            className="group absolute inset-0 h-full w-full cursor-pointer border-0 p-0"
          >
            <Image
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              // hqdefault is 4:3 with letterbox bars — cover crops them away.
              className="object-cover transition-opacity duration-200 group-hover:opacity-90"
              sizes="(min-width: 1024px) 900px, 100vw"
            />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/80 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                <svg className="ml-1 h-6 w-6 text-paper" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>

      {language !== lessonLanguage && (
        <p className="mt-2 text-xs text-ink-3">
          {t('video_language_note', { language: LOCALE_NAMES[language] ?? language })}
        </p>
      )}
    </section>
  )
}
