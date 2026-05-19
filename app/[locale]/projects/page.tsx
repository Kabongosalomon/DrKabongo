import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  return { title: t('title'), description: t('subtitle') }
}

interface Project {
  name: string
  description: string
  tags: string[]
  github?: string
  demo?: string
  paper?: string
  highlight?: string
}

const PROJECTS: Project[] = [
  {
    name: 'Masakhane Web Platform',
    description:
      'A Mozilla-funded web platform for African language translation — similar to Google Translate but focused exclusively on African languages made available by the Masakhane community.',
    tags: ['NLP', 'Machine Translation', 'African Languages', 'Web'],
    demo: 'http://translate.masakhane.io/',
    highlight: 'Mozilla Open Source Support Award',
  },
  {
    name: 'Masakhane Initiative',
    description:
      'Putting African researchers from across the continent together to build translation models for African languages. Masakhane means "We Build Together" in isiZulu.',
    tags: ['NLP', 'African Languages', 'Community', 'Research'],
    github: 'https://github.com/masakhane-io/masakhane',
    demo: 'https://www.masakhane.io/home',
    highlight: '280+ Citations · EMNLP Findings 2020',
  },
  {
    name: 'ORKG Leaderboards',
    description:
      'Engineered the Leaderboards feature for the Open Research Knowledge Graph (ORKG) to automatically track and visualize state-of-the-art progress across scientific publications using Knowledge Graphs.',
    tags: ['Knowledge Graphs', 'NLP', 'Scholarly IE', 'Python'],
    github: 'https://github.com/Kabongosalomon/task-dataset-metric-nli-extraction',
    paper: 'https://arxiv.org/pdf/2109.13089.pdf',
    highlight: 'ICADL 2021 Best Paper Award',
  },
  {
    name: 'LiSTra Speech Translation',
    description:
      'The first English-to-Lingala automatic speech translation dataset and baseline. Released a full pipeline for constructing similar datasets in other low-resource languages.',
    tags: ['ASR', 'Speech Translation', 'Lingala', 'Low-Resource NLP'],
    github: 'https://github.com/dsfsi/2020-AMMI-salomon',
    paper: '/archive/posterBiai2021.pdf',
    highlight: 'NeurIPS 2021 Black in AI Workshop',
  },
  {
    name: 'CNN Dog Breed Classifier',
    description:
      'A Convolutional Neural Network that performs better than average humans at identifying dog breeds. Also produces an estimate of the closest-resembling dog breed for human photos.',
    tags: ['Computer Vision', 'CNN', 'PyTorch'],
    github: 'https://github.com/Kabongosalomon/CNN-Project-Dog-Breed-Classifier',
  },
  {
    name: 'Face Generation with DCGAN',
    description:
      'Generating realistic face images using Deep Convolutional Generative Adversarial Networks (DCGAN) — a pair of competing multilayer neural networks.',
    tags: ['Generative AI', 'GAN', 'Computer Vision', 'PyTorch'],
    github: 'https://github.com/Kabongosalomon/Face-Generation-Project',
  },
]

function TagBadge({ label }: { label: string }) {
  return (
    <span className="text-xs bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
      {label}
    </span>
  )
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'projects' })

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12">
          <span className="section-label">{t('section_label')}</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">{t('title')}</h1>
          <p className="text-slate-400 text-lg max-w-xl">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.name}
              className="card-hover bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col"
            >
              {project.highlight && (
                <span className="text-xs font-semibold bg-accent/10 text-accent border border-accent/20 px-2.5 py-0.5 rounded-full mb-3 self-start">
                  {project.highlight}
                </span>
              )}

              <h2 className="text-lg font-bold text-white mb-2">{project.name}</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} />
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    {t('github')}
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand-light px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {t('demo')} ↗
                  </a>
                )}
                {project.paper && (
                  <a
                    href={project.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {t('paper')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
