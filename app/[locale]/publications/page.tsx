import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Link from 'next/link'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'publications' })
  return { title: t('title'), description: t('subtitle') }
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
    paper: 'https://library.nexteinstein.org/thesis/an-empirical-investigation-into-the-properties-of-standard-word-embeddings/',
    code: 'https://github.com/Kabongosalomon/Word-Embedding-Investigation',
    tags: ['Word Embeddings', 'NLP', 'Deep Learning'],
  },
]

const TYPE_COLORS: Record<Publication['type'], string> = {
  patent: '#f59e0b',
  journal: '#6366f1',
  conference: '#10b981',
  workshop: '#8b5cf6',
  thesis: '#06b6d4',
}

const TYPE_LABELS: Record<Publication['type'], string> = {
  patent: 'Patent',
  journal: 'Journal / Conference',
  conference: 'Conference / Workshop',
  workshop: 'Workshop',
  thesis: 'Thesis',
}

export default async function PublicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'publications' })

  const byYear = PUBLICATIONS.reduce<Record<number, Publication[]>>((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = []
    acc[pub.year].push(pub)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="section-label">{t('section_label')}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{t('title')}</h1>
            <p className="text-slate-400 max-w-xl">{t('subtitle')}</p>
          </div>
          <a
            href={t('scholar_url')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors shrink-0"
          >
            {t('scholar')} ↗
          </a>
        </div>

        {years.map((year) => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
              {year}
              <span className="flex-1 h-px bg-slate-800" />
            </h2>
            <div className="space-y-6">
              {byYear[year].map((pub) => (
                <div
                  key={pub.title}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                  <div className="flex flex-wrap items-start gap-2 mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${TYPE_COLORS[pub.type]}15`,
                        color: TYPE_COLORS[pub.type],
                        border: `1px solid ${TYPE_COLORS[pub.type]}30`,
                      }}
                    >
                      {TYPE_LABELS[pub.type]}
                    </span>
                    {pub.award && (
                      <span className="text-xs font-semibold bg-accent/10 text-accent border border-accent/20 px-2.5 py-0.5 rounded-full">
                        🏆 {pub.award}
                      </span>
                    )}
                    {pub.citations && (
                      <span className="text-xs text-slate-500 ml-auto">
                        {pub.citations}+ {t('citations_label')}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{pub.title}</h3>
                  <p className="text-sm text-brand-light mb-3">{pub.venue}</p>

                  {pub.abstract && (
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{pub.abstract}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pub.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {pub.paper && (
                      <a
                        href={pub.paper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand-light px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {t('paper')} ↗
                      </a>
                    )}
                    {pub.code && (
                      <a
                        href={pub.code}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {t('code')}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
