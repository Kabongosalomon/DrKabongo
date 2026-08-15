/**
 * Past talks, lectures and spotlights.
 *
 * Titles and venues here were taken from the recordings and the archived slide
 * decks themselves, so they match what was actually delivered.
 */

export interface Talk {
  title: string
  venue: string
  /** ISO date or `YYYY-MM` when only the month is known. */
  date: string
  /** YouTube ID — renders a "Watch recording" link. */
  videoId?: string
  slides?: string
  poster?: string
}

export const TALKS: Talk[] = [
  {
    title: 'LiSTra Automatic Speech Translation: English to Lingala Case Study',
    venue: '5th Black in AI Workshop, NeurIPS 2021 — Spotlight',
    date: '2021-12',
    videoId: 'ZlEEXpedJWk',
    poster: '/archive/posterBiai2021.pdf',
  },
  {
    title: 'Masakhane MT: How to Get Started',
    venue: 'Masakhane community tutorial',
    date: '2020-05-23',
    videoId: 'jOKy_AnyLic',
  },
  {
    title: 'The Transformer: From RNN to Attention',
    venue: 'Data Science for Social Impact Research Group, University of Pretoria',
    date: '2020-04-17',
    videoId: 'rC_DDhMhVc8',
    slides: '/archive/Talk_2.pdf',
  },
  {
    title: 'Introduction to Deep Learning with PyTorch',
    venue: 'Workshop series, session 2',
    date: '2019-08-07',
    videoId: 'CCRV43RKZ2g',
  },
  {
    title: 'Natural Language Processing: How Machine Learning Changed the Field',
    venue: 'African Institute for Mathematical Sciences (AIMS), South Africa',
    date: '2018-12-31',
    slides: '/archive/Talk_1.pdf',
  },
]
