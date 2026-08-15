import { CHANNELS, type ChannelKey } from '@/lib/videos'

const YOUTUBE_PATH =
  'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z'

export default function ChannelCard({
  channelKey,
  label,
  description,
  videoCount,
  subscribeLabel,
  countLabel,
  comingSoonLabel,
}: {
  channelKey: ChannelKey
  /** Language of the channel, e.g. "English". */
  label: string
  description: string
  videoCount: number
  subscribeLabel: string
  /** Pluralised "N videos" string, already formatted by the caller. */
  countLabel: string
  comingSoonLabel: string
}) {
  const channel = CHANNELS[channelKey]
  const empty = videoCount === 0

  return (
    <div className="flex flex-col border-t border-rule pt-5">
      <p className="eyebrow">{label}</p>

      <h3 className="mt-2 flex items-center gap-2 font-serif text-xl font-medium text-ink">
        <svg className="h-4 w-4 shrink-0 text-ink-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={YOUTUBE_PATH} />
          <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" className="text-surface" fill="var(--paper)" />
        </svg>
        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 break-words decoration-accent decoration-1 underline-offset-4 hover:underline"
        >
          {channel.handle}
        </a>
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{description}</p>

      <p className="mt-3 text-xs text-ink-3">
        {empty ? (
          <span className="font-medium text-accent">{comingSoonLabel}</span>
        ) : (
          countLabel
        )}
      </p>

      <a
        href={channel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-accent"
      >
        {subscribeLabel}
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </a>
    </div>
  )
}
