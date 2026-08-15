/**
 * Curation overlay for the YouTube feeds.
 *
 * Videos sync automatically from the channel RSS feeds — you do NOT need to
 * touch this file when you publish. Edit it only to feature, hide or tag.
 *
 * Full guide: content/VIDEOS.md
 */

export type TopicKey =
  | 'ai_explained'
  | 'deep_learning'
  | 'african_languages'
  | 'research_talks'
  | 'tutorials'

/**
 * Pinned to the top of /videos, in this order.
 * The FIRST entry is also the large featured video on the homepage.
 * Remove an ID (or empty the array) and ordering falls back to newest-first.
 */
export const FEATURED: string[] = [
  'rC_DDhMhVc8', // The Transformer, From RNN to Attention
  'jOKy_AnyLic', // Masakhane MT. How to get started?
  'ZlEEXpedJWk', // Black in AI Workshop @ NeurIPS 2021 — LiSTra spotlight
]

/** Never rendered. Add an ID here to retire a video from the site. */
export const HIDDEN: string[] = [
  '8FxfFZXpMWI', // "Kabongo Live Stream" — untitled test stream, no content
  '4Jp6ZtiYd2M', // 2018 ACM Turing Award — no longer public on the channel
]

/**
 * Topic tags drive the filter chips on /videos.
 * Every key used here needs a matching `videos.topic_<key>` string in ALL
 * message files (messages/*.json). Untagged videos still appear under "All".
 */
export const TOPICS: Record<string, TopicKey[]> = {
  // @DrKabongo — English
  ZlEEXpedJWk: ['research_talks', 'african_languages'],
  jOKy_AnyLic: ['african_languages', 'research_talks'],
  'FShFA9eK-eU': ['research_talks'],
  rC_DDhMhVc8: ['deep_learning', 'research_talks'],
  CCRV43RKZ2g: ['deep_learning', 'tutorials'],
  '4Jp6ZtiYd2M': ['deep_learning'],
  pfSkjwZP_TU: ['tutorials'],
  wCuBwQslUX0: ['tutorials'],
  ZW6Wa1QEtyQ: ['tutorials'],
  iejqZwWR4NY: ['tutorials'],
}
