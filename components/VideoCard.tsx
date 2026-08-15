import Image from 'next/image'
import { CHANNELS, type Video } from '@/lib/videos'

function formatDate(iso: string, locale: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'short' })
}

export default function VideoCard({
  video,
  locale,
  featured = false,
  priority = false,
}: {
  video: Video
  locale: string
  /** Renders the large hero treatment used at the top of a video section. */
  featured?: boolean
  priority?: boolean
}) {
  const channel = CHANNELS[video.channel]

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-rule bg-raised">
        <Image
          src={video.thumbnail}
          alt=""
          fill
          // hqdefault is 4:3 with letterbox bars — cover crops them away.
          className="object-cover transition-opacity duration-200 group-hover:opacity-90"
          sizes={
            featured
              ? '(min-width: 1024px) 640px, 100vw'
              : '(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw'
          }
          priority={priority}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/80 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
            <svg className="ml-0.5 h-5 w-5 text-paper" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          </span>
        </span>
      </div>

      <h3
        className={`mt-3 font-serif font-medium text-balance text-ink decoration-accent decoration-1 underline-offset-4 group-hover:underline ${
          featured
            ? 'text-xl sm:text-2xl'
            : // Reserve two lines so meta rows stay aligned across a grid row.
              'text-base leading-snug line-clamp-2 sm:min-h-11'
        }`}
      >
        {video.title}
      </h3>

      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-3">
        <span className="min-w-0 truncate">{channel.handle}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={video.published}>{formatDate(video.published, locale)}</time>
      </p>

      {featured && video.description && (
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-2 line-clamp-3">
          {video.description}
        </p>
      )}
    </a>
  )
}
