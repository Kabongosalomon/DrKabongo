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
  type: 'patent' | 'patent_application' | 'journal' | 'conference' | 'workshop' | 'thesis'
  title: string
  venue: string
  year: number
  authors?: string
  abstract?: string
  award?: string
  paper?: string
  code?: string
  tags: string[]
}

const PUBLICATIONS: Publication[] = [
  {
    type: 'patent',
    title: 'Systems and Methods for Image Privacy and De-identification',
    venue: 'U.S. Patent No. 12,613,996 · Issued April 28, 2026 · Assignee: State Farm',
    year: 2026,
    authors: 'Salomon Kabongo · Co-inventor',
    tags: ['Publicly Disclosed Invention'],
  },
  {
    type: 'conference',
    title: 'INJONGO: A Multicultural Intent Detection and Slot-filling Dataset for 16 African Languages',
    venue: 'ACL 2025 · Long Papers',
    year: 2025,
    abstract:
      'Co-authored a culturally grounded, open benchmark for evaluating intent detection and slot filling across 16 African languages.',
    paper: 'https://aclanthology.org/2025.acl-long.464/',
    tags: ['African Languages', 'Intent Detection', 'Slot Filling', 'LLM Evaluation'],
  },
  {
    type: 'conference',
    title: 'IrokoBench: A New Benchmark for African Languages in the Age of Large Language Models',
    venue: 'NAACL 2025 · Long Papers',
    year: 2025,
    abstract:
      'Co-authored a human-translated benchmark for evaluating natural-language inference, mathematical reasoning, and knowledge-based question answering across 17 African languages.',
    paper: 'https://aclanthology.org/2025.naacl-long.139/',
    tags: ['African Languages', 'LLM Evaluation', 'Reasoning', 'Multilingual NLP'],
  },
  {
    type: 'conference',
    title: 'Effective Context Selection in LLM-based Leaderboard Generation: An Empirical Study',
    venue: 'NLDB 2024',
    year: 2024,
    abstract:
      'First-author study of how document representations and context selection affect extraction quality, reliability, and computational efficiency in LLM-based leaderboard generation.',
    paper: 'https://arxiv.org/pdf/2407.02409',
    tags: ['Large Language Models', 'Context Selection', 'Information Extraction', 'Evaluation'],
  },
  {
    type: 'patent_application',
    title: 'Systems and Methods for Advanced Duplicate Image Search and Analysis',
    venue:
      'Pending U.S. Published Patent Application · App. 18/652,500 · Publication No. US20240411724A1 · Assignee: State Farm',
    year: 2024,
    authors: 'Salomon Kabongo · Co-inventor',
    tags: ['Publicly Disclosed Invention'],
  },
  {
    type: 'conference',
    title: 'Zero-shot Entailment of Leaderboards for Empirical AI Research',
    venue: 'ACM/IEEE Joint Conference on Digital Libraries (JCDL 2023)',
    year: 2023,
    abstract:
      'First-author evaluation of whether supervised leaderboard-extraction models generalize to previously unseen labels, accompanied by a zero-shot evaluation dataset.',
    paper: 'https://arxiv.org/pdf/2303.16835',
    code: 'https://github.com/Kabongosalomon/task-dataset-metric-nli-extraction',
    tags: ['Zero-shot Evaluation', 'Natural Language Inference', 'Information Extraction'],
  },
  {
    type: 'conference',
    title: 'Bibletts & LiSTra: African Speech Corpora',
    venue: 'Interspeech 2022 · NeurIPS 2022 Black in AI Workshop',
    year: 2022,
    abstract:
      'Co-authored BibleTTS, a multilingual speech corpus, and developed LiSTra, an English-to-Lingala speech-translation dataset and baseline using cascade ASR and machine translation alongside an end-to-end architecture.',
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
      'Introduces an end-to-end approach for extracting empirical AI results from scientific text and representing them as searchable, knowledge-graph-based leaderboards.',
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
      'Presents the Lingala Speech Translation (LiSTra) dataset and a reusable pipeline for constructing similar resources in other low-resource languages. Reports cascade ASR-to-MT and transformer-based end-to-end baselines.',
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
      'Contributed to a community-led study of participatory methods for building machine-translation research, datasets, and models for African languages.',
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
  patent_application: 'Patent application',
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
                  </div>

                  <h3 className="mt-2 font-serif text-lg font-medium text-balance text-ink">
                    {pub.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-2">{pub.venue}</p>

                  {pub.authors && <p className="mt-1 text-xs text-ink-3">{pub.authors}</p>}

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
