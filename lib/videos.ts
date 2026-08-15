import { FEATURED, HIDDEN, TOPICS, type TopicKey } from '@/content/videos.config'
import fallback from '@/content/videos.fallback.json'

export type { TopicKey }

/**
 * Channel keys are deliberately NOT the site's locale list — Swahili is a site
 * language with no channel, and a channel could exist without a matching UI
 * locale. See `content/VIDEOS.md` for how to add one.
 */
export type ChannelKey = 'en' | 'fr' | 'ln' | 'lua'

export interface Channel {
  key: ChannelKey
  /** YouTube channel ID — resolved from the handle, used for the RSS feed. */
  id: string
  handle: string
  url: string
}

export const CHANNELS: Record<ChannelKey, Channel> = {
  en: {
    key: 'en',
    id: 'UCZOom0SgNbTgu8NrHPzO8bw',
    handle: '@DrKabongo',
    url: 'https://www.youtube.com/@DrKabongo',
  },
  fr: {
    key: 'fr',
    id: 'UCrAB1l9xV6nwSPJVHuKXK_w',
    handle: '@DrKabongoFR',
    url: 'https://www.youtube.com/@DrKabongoFR',
  },
  ln: {
    key: 'ln',
    id: 'UCg7VcWhZmVzCgzif3RYLK_w',
    handle: '@DrKabongoLingala',
    url: 'https://www.youtube.com/@DrKabongoLingala',
  },
  lua: {
    key: 'lua',
    id: 'UCVAFhKgOL5sMdZOvU5JFBGw',
    handle: '@DrKabongoTshiluba',
    url: 'https://www.youtube.com/@DrKabongoTshiluba',
  },
}

export const CHANNEL_KEYS = Object.keys(CHANNELS) as ChannelKey[]

export interface Video {
  id: string
  title: string
  /** ISO 8601 publish date. */
  published: string
  channel: ChannelKey
  thumbnail: string
  url: string
  description: string
  topics: TopicKey[]
  featured: boolean
}

const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?channel_id='

/**
 * `maxresdefault` 404s on older uploads, so we always request `hqdefault`,
 * which YouTube generates for every video. It is 4:3 with letterbox bars —
 * render it in an `aspect-video` box with `object-cover` to crop them.
 */
export function thumbnailFor(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

function decodeEntities(input: string) {
  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      return String.fromCodePoint(parseInt(entity.slice(2), 16))
    }
    if (entity.startsWith('#')) {
      return String.fromCodePoint(parseInt(entity.slice(1), 10))
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })
}

function tagContent(entry: string, tag: string) {
  const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))
  return match ? decodeEntities(match[1]).trim() : ''
}

/**
 * YouTube's Atom feed is machine-generated and stable, so a targeted reader is
 * enough — and keeps this dependency-free, like the rest of the codebase.
 */
export function parseFeed(xml: string, channel: ChannelKey): Video[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? []

  return entries.flatMap((entry) => {
    const id = tagContent(entry, 'yt:videoId')
    if (!id) return []

    return [
      {
        id,
        // `media:title` survives when the Atom <title> is empty; prefer it.
        title: tagContent(entry, 'media:title') || tagContent(entry, 'title'),
        published: tagContent(entry, 'published'),
        channel,
        thumbnail: thumbnailFor(id),
        url: `https://www.youtube.com/watch?v=${id}`,
        description: tagContent(entry, 'media:description'),
        topics: [],
        featured: false,
      },
    ]
  })
}

async function fetchChannel(channel: ChannelKey): Promise<Video[]> {
  const res = await fetch(`${FEED_URL}${CHANNELS[channel].id}`, {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`YouTube feed ${channel} responded ${res.status}`)
  return parseFeed(await res.text(), channel)
}

function fallbackFor(channel: ChannelKey): Video[] {
  return (fallback as Video[]).filter((video) => video.channel === channel)
}

/** Applies the curation overlay: drop hidden, tag topics, mark + order featured. */
function curate(videos: Video[]): Video[] {
  const hidden = new Set(HIDDEN)
  const featuredRank = new Map(FEATURED.map((id, index) => [id, index]))

  const visible = videos
    .filter((video) => !hidden.has(video.id))
    .map((video) => ({
      ...video,
      topics: TOPICS[video.id] ?? [],
      featured: featuredRank.has(video.id),
    }))

  return visible.sort((a, b) => {
    const rankA = featuredRank.get(a.id)
    const rankB = featuredRank.get(b.id)
    if (rankA !== undefined && rankB !== undefined) return rankA - rankB
    if (rankA !== undefined) return -1
    if (rankB !== undefined) return 1
    return b.published.localeCompare(a.published)
  })
}

/**
 * Every channel is fetched independently and falls back to the committed
 * snapshot on its own, so one unreachable feed never empties the page.
 */
export async function getAllVideos(): Promise<Video[]> {
  const results = await Promise.allSettled(CHANNEL_KEYS.map(fetchChannel))

  const videos = results.flatMap((result, index) => {
    const channel = CHANNEL_KEYS[index]
    if (result.status === 'fulfilled' && result.value.length > 0) return result.value
    if (result.status === 'rejected') {
      console.warn(`[videos] ${channel} feed unavailable, using snapshot:`, result.reason)
      return fallbackFor(channel)
    }
    // Fulfilled but empty is a legitimate state (a channel with no uploads yet).
    return []
  })

  const deduped = new Map(videos.map((video) => [video.id, video]))
  return curate([...deduped.values()])
}

/** Video counts per channel, used to drive the "coming soon" state. */
export function countByChannel(videos: Video[]): Record<ChannelKey, number> {
  return Object.fromEntries(
    CHANNEL_KEYS.map((key) => [key, videos.filter((video) => video.channel === key).length]),
  ) as Record<ChannelKey, number>
}

/** All distinct topics present on the current set, for the filter bar. */
export function topicsOf(videos: Video[]): TopicKey[] {
  return [...new Set(videos.flatMap((video) => video.topics))].sort()
}
