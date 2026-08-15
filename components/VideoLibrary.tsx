'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CHANNELS, CHANNEL_KEYS, topicsOf, type ChannelKey, type TopicKey, type Video } from '@/lib/videos'
import VideoCard from './VideoCard'

type ChannelFilter = ChannelKey | 'all'
type TopicFilter = TopicKey | 'all'

function FilterRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="eyebrow shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-ink bg-ink text-paper'
          : 'border-rule text-ink-2 hover:border-ink-3 hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export default function VideoLibrary({ videos, locale }: { videos: Video[]; locale: string }) {
  const t = useTranslations('videos')
  const [channel, setChannel] = useState<ChannelFilter>('all')
  const [topic, setTopic] = useState<TopicFilter>('all')

  const topics = useMemo(() => topicsOf(videos), [videos])

  const visible = useMemo(
    () =>
      videos.filter(
        (video) =>
          (channel === 'all' || video.channel === channel) &&
          (topic === 'all' || video.topics.includes(topic)),
      ),
    [videos, channel, topic],
  )

  // Only offer channels that actually have something to show.
  const channelsWithVideos = CHANNEL_KEYS.filter((key) =>
    videos.some((video) => video.channel === key),
  )

  return (
    <>
      <div className="mt-10 space-y-3 border-t border-rule pt-6">
        {channelsWithVideos.length > 1 && (
          <FilterRow label={t('filter_by_channel')}>
            <Chip active={channel === 'all'} onClick={() => setChannel('all')}>
              {t('filter_all')}
            </Chip>
            {channelsWithVideos.map((key) => (
              <Chip key={key} active={channel === key} onClick={() => setChannel(key)}>
                {CHANNELS[key].handle}
              </Chip>
            ))}
          </FilterRow>
        )}

        {topics.length > 1 && (
          <FilterRow label={t('filter_by_topic')}>
            <Chip active={topic === 'all'} onClick={() => setTopic('all')}>
              {t('filter_all')}
            </Chip>
            {topics.map((key) => (
              <Chip key={key} active={topic === key} onClick={() => setTopic(key)}>
                {t(`topic_${key}`)}
              </Chip>
            ))}
          </FilterRow>
        )}
      </div>

      <p className="mt-6 text-sm text-ink-3" aria-live="polite">
        {t('count', { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <p className="mt-10 border-t border-rule pt-6 text-base text-ink-2">{t('no_results')}</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((video, index) => (
            <VideoCard key={video.id} video={video} locale={locale} priority={index < 3} />
          ))}
        </div>
      )}
    </>
  )
}
