import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'publications' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/publications'),
  }
}

interface Publication {
  type: 'patent' | 'journal' | 'conference' | 'workshop' | 'thesis'
  title: string
  venue: string
  year: number
  authors?: string
  abstract?: string
  citations?: number
  award?: string
  paper?: string
  code?: string
  tags: string[]
}

const PUBLICATIONS: Publication[] = [
  {
    type: 'patent',
    title: 'Systems and Methods for Advanced Duplicate Image Search and Analysis',
    venue: 'US Patent Issued · App. 18/652,500 · Publication No. US20240411724A1',
    year: 2024,
    authors: 'Salomon Kabongo (Assignee: State Farm)',
    abstract:
      'Issued patent for a system identifying duplicate documents using vector embeddings and similarity hashing. Provides scalable, high-accuracy deduplication for enterprise-scale document repositories. Additionally, 3+ AI/ML patent filings pending.',
    tags: ['Computer Vision', 'Vector Embeddings', 'Similarity Hashing', 'AI/ML'],
  },
  {
    type: 'conference',
    title: 'Bibletts & LiSTra: African Speech Corpora',
    venue: 'Interspeech 2022 · NeurIPS 2022 Black in AI Workshop',
    year: 2022,
    abstract:
      'Co-authored "Bibletts", a high-fidelity multilingual speech corpus. Developed LiSTra, the first English-to-Lingala speech translation dataset and baseline — using both traditional cascade ASR+MT and a transformer-based End-to-End architecture.',
    code: 'https://github.com/dsfsi/2020-AMMI-salomon',
    tags: ['ASR', 'Speech Translation', 'Lingala', 'Low-Resource NLP'],
  },
  {
    type: 'journal',
    title: 'Automated Mining of Leaderboards for Empirical AI Research',
    venue: 'ICADL 2021 · International Journal on Digital Libraries',
    year: 2021,
    award: 'ICADL 2021 Best Paper Award',
    abstract:
      'Presents a comprehensive approach for generating Leaderboards for knowledge-graph-based scholarly information organization. Investigates automated leaderboard construction using BERT, SciBERT, and XLNet — achieving F1 > 90% and setting new state-of-the-art for leaderboard extraction.',
    citations: 30,
    paper: 'https://arxiv.org/pdf/2109.13089.pdf',
    code: 'https://github.com/Kabongosalomon/task-dataset-metric-nli-extraction',
    tags: ['Knowledge Graphs', 'Information Extraction', 'NLP', 'Scholarly IE'],
  },
  {
    type: 'conference',
    title: 'LiSTra Automatic Speech Translation: English to Lingala Case Study',
    venue: 'NeurIPS 2021 · Black in AI Workshop (Spotlight)',
    year: 2021,
    abstract:
      'Presents the Lingala Speech Translation (LiSTra) dataset and releases a full pipeline for constructing such datasets in other low-resource languages. Reports baselines using both cascade ASR→MT and a revolutionary transformer-based End-to-End architecture with customized interactive attention.',
    paper: '/archive/posterBiai2021.pdf',
    code: 'https://github.com/dsfsi/2020-AMMI-salomon',
    tags: ['ASR', 'Machine Translation', 'Lingala', 'Transformers'],
  },
  {
    type: 'conference',
    title: 'Participatory Research for Low-Resourced Machine Translation',
    venue: 'EMNLP Findings 2020 · AfricaNLP Workshop ICLR 2020',
    year: 2020,
    abstract:
      'Contributor to the Masakhane NLP initiative. Discusses methodology for building an African NLP research community and outlines success in addressing the lack of resources for African languages. Sets the standard for African Language NLP.',
    citations: 280,
    paper: 'https://arxiv.org/pdf/2003.11529.pdf',
    code: 'https://github.com/masakhane-io/masakhane.git',
    tags: ['Machine Translation', 'African Languages', 'Low-Resource NLP', 'Community'],
  },
  {
    type: 'thesis',
    title: 'An Empirical Investigation into the Properties of Standard Word Embeddings',
    venue: 'MSc Thesis · University of the Western Cape / AIMS South Africa',
    year: 2020,
    abstract:
      'Reviews mechanisms for computing word embeddings, investigates popular toolkits and embedding matrices, and experiments with selected implementations to better understand their characteristics and properties.',
    paper:
      'https://library.nexteinstein.org/thesis/an-empirical-investigation-into-the-properties-of-standard-word-embeddings/',
    code: 'https://github.com/Kabongosalomon/Word-Embedding-Investigation',
    tags: ['Word Embeddings', 'NLP', 'Deep Learning'],
  },
]

const TYPE_LABELS: Record<Publication['type'], string> = {
  patent: 'Patent',
  journal: 'Journal / Conference',
  conference: 'Conference / Workshop',
  workshop: 'Workshop',
  thesis: 'Thesis',
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'publications' })

  const byYear = PUBLICATIONS.reduce<Record<number, Publication[]>>((acc, pub) => {
    ;(acc[pub.year] ??= []).push(pub)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{t('subtitle')}</p>

        <a
          href={t('scholar_url')}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex min-w-0 items-center gap-1.5 rounded-md border border-rule px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
        >
          {t('scholar')}
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7m0 0H8m9 0v9" />
          </svg>
        </a>

        {years.map((year) => (
          <section key={year} className="mt-16">
            <h2 className="font-serif text-2xl font-medium text-ink">{year}</h2>

            <ul className="mt-6 space-y-10">
              {byYear[year].map((pub) => (
                <li key={pub.title} className="border-t border-rule pt-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="eyebrow">{TYPE_LABELS[pub.type]}</span>
                    {pub.citations && (
                      <span className="text-xs text-ink-3">
                        {pub.citations}+ {t('citations_label')}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 font-serif text-lg font-medium text-balance text-ink">
                    {pub.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-2">{pub.venue}</p>

                  {pub.award && (
                    <p className="mt-2 text-sm font-medium text-accent">
                      {t('award_label')}: {pub.award}
                    </p>
                  )}

                  {pub.abstract && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-2">{pub.abstract}</p>
                  )}

                  <p className="mt-3 text-xs text-ink-3">{pub.tags.join(' · ')}</p>

                  {(pub.paper || pub.code) && (
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                      {pub.paper && (
                        <a
                          href={pub.paper}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link text-sm font-medium"
                        >
                          {t('paper')}
                        </a>
                      )}
                      {pub.code && (
                        <a
                          href={pub.code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link text-sm font-medium"
                        >
                          {t('code')}
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
