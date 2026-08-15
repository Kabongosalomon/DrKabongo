import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/projects'),
  }
}

interface Project {
  name: string
  description: string
  tags: string[]
  github?: string
  demo?: string
  paper?: string
  youtube?: string
  highlight?: string
}

const PROJECTS: Project[] = [
  {
    name: 'DarAkili',
    description:
      'A STEM education platform where African professionals publish free mini-courses in their own languages — so that learning a technical subject no longer requires going through English or French first. Bridging the diaspora and the continent through teaching.',
    tags: ['STEM Education', 'African Languages', 'Community', 'Platform'],
    demo: 'https://darakili.com',
    youtube: 'https://www.youtube.com/@DarAkili',
    highlight: 'STEM education platform',
  },
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

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'projects' })

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{t('subtitle')}</p>

        <ul className="mt-14 space-y-10">
          {PROJECTS.map((project) => (
            <li key={project.name} className="border-t border-rule pt-5">
              {project.highlight && <p className="eyebrow">{project.highlight}</p>}

              <h2 className="mt-2 font-serif text-lg font-medium text-balance text-ink">
                {project.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
                {project.description}
              </p>

              <p className="mt-3 text-xs text-ink-3">{project.tags.join(' \u00b7 ')}</p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-sm font-medium"
                  >
                    {t('github')}
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-sm font-medium"
                  >
                    {t('demo')}
                  </a>
                )}
                {project.paper && (
                  <a
                    href={project.paper}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-sm font-medium"
                  >
                    {t('paper')}
                  </a>
                )}
                {project.youtube && (
                  <a
                    href={project.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link text-sm font-medium"
                  >
                    {t('youtube')}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
