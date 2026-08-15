import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { alternatesFor } from '@/lib/metadata'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cv' })
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/cv'),
  }
}

const CONTACT = [
  { href: 'mailto:kabongosalomon@gmail.com', label: 'kabongosalomon@gmail.com' },
  { href: 'https://linkedin.com/in/salomon-kabongo', label: 'LinkedIn' },
  { href: 'https://github.com/Kabongosalomon', label: 'GitHub' },
  { href: 'https://scholar.google.com/citations?user=BPDma7YAAAAJ', label: 'Google Scholar' },
  { href: 'https://x.com/SalomonKabongo', label: '@SalomonKabongo' },
]

const PUBLICATIONS = [
  {
    title: 'Systems and Methods for Advanced Duplicate Image Search and Analysis',
    venue: 'US Patent',
    year: '2024',
    detail: 'App. 18/652,500, No. US20240411724A1 · Assignee: State Farm',
    award: 'US Patent',
  },
  {
    title: 'Bibletts & LiSTra: African Speech Corpora',
    venue: 'Interspeech, NeurIPS Workshops',
    year: '2022',
    detail:
      'High-fidelity multilingual speech corpus; first English-to-Lingala speech translation baseline',
  },
  {
    title: 'Automated Mining of Leaderboards for Empirical AI Research',
    venue: 'ICADL · International Journal on Digital Libraries',
    year: '2021',
    detail: '30+ citations. SOTA metric extraction from scientific text.',
    award: 'ICADL 2021 Best Paper Award',
  },
  {
    title: 'Participatory Research for Low-Resourced Machine Translation',
    venue: 'EMNLP Findings',
    year: '2020',
    detail: '280+ citations. Standard benchmark for African Language NLP.',
  },
]

const AWARDS = [
  {
    year: '2024',
    award: 'US Patent Issued (AI/ML) + 3 Pending',
    org: 'State Farm — Innovation Group',
  },
  {
    year: '2021',
    award: 'ICADL Best Paper Award',
    org: 'International Conference on Asian Digital Libraries',
  },
  { year: '2020', award: 'DLRL Summer School', org: 'CIFAR / Mila, Montreal' },
  { year: '2020', award: 'Google Hash Code — Ranked 1747/10724', org: 'Google' },
  {
    year: '2019',
    award: 'ACM Future of Computing Academy (FCA) Member',
    org: 'Association for Computing Machinery — 36 selected globally',
  },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-rule pb-2 font-serif text-2xl font-medium text-ink">
      {children}
    </h2>
  )
}

function ExperienceItem({
  role,
  org,
  period,
  location,
  bullets,
  highlight,
}: {
  role: string
  org: string
  period: string
  location: string
  bullets: string[]
  highlight?: string
}) {
  return (
    <li className="border-t border-rule pt-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-medium text-balance text-ink">{role}</h3>
          <p className="text-sm text-ink-2">{org}</p>
        </div>
        <div className="min-w-0 text-left sm:shrink-0 sm:text-right">
          <p className="text-xs text-ink-3">{period}</p>
          <p className="text-xs text-ink-3">{location}</p>
        </div>
      </div>

      {highlight && <p className="mt-2 text-sm font-medium text-accent">{highlight}</p>}

      <ul className="mt-3 space-y-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-3" aria-hidden="true" />
            <span className="text-sm leading-relaxed text-ink-2">{bullet}</span>
          </li>
        ))}
      </ul>
    </li>
  )
}

function EducationItem({
  degree,
  institution,
  location,
  period,
  note,
}: {
  degree: string
  institution: string
  location: string
  period: string
  note?: string
}) {
  return (
    <li className="flex flex-col gap-1 border-t border-rule pt-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h3 className="font-serif text-base font-medium text-balance text-ink">{degree}</h3>
        <p className="text-sm text-ink-2">{institution}</p>
        {note && <p className="mt-0.5 text-xs text-ink-3">{note}</p>}
      </div>
      <div className="min-w-0 text-left sm:shrink-0 sm:text-right">
        <p className="text-xs text-ink-3">{period}</p>
        <p className="text-xs text-ink-3">{location}</p>
      </div>
    </li>
  )
}

function SkillGroup({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="border-t border-rule pt-4">
      <h3 className="eyebrow">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">{items.join(' · ')}</p>
    </div>
  )
}

export default async function CVPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'cv' })

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-4xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          Salomon Kabongo
        </h1>
        <p className="mt-3 text-base text-ink-2">{t('subtitle')}</p>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          {CONTACT.map(({ href, label }) => (
            <li key={href} className="min-w-0">
              <a
                href={href}
                {...(href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="link text-sm break-all"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 space-y-16">
          {/* ── EXPERIENCE ── */}
          <section>
            <SectionHeading>{t('experience')}</SectionHeading>
            <ul className="mt-8 space-y-8">
              <ExperienceItem
                role="Lead Software Engineer"
                org="State Farm — Innovation Group"
                period={`Feb 2022 – ${t('present')}`}
                location="Bloomington-Normal, IL"
                bullets={[
                  'Designed automated pre-labeling pipelines using embedding-based retrieval to accelerate data annotation.',
                  'Architected a proprietary document deduplication system utilizing visual similarity and hashing algorithms to identify near-duplicates, significantly streamlining business workflows.',
                  'Led R&D initiatives on Synthetic Media (Deepfake) detection and Video Understanding; benchmarked Visual Language Models (VLMs) against vendor solutions.',
                  'Invented novel computer vision applications for the insurance domain in AI/ML, resulting in 1 issued patent and 3+ additional filings pending.',
                ]}
                highlight="4 patent filings"
              />

              <ExperienceItem
                role="Board Member"
                org="Masakhane Research Foundation"
                period="2021 – May 2026"
                location="Global"
                bullets={[
                  'Spearheaded the strategic formation of the Masakhane AI Hub, defining the 2025–2029 roadmap to build digital public infrastructure for 1 billion+ African language speakers.',
                  'Secured and oversaw the execution of ~$9M USD in research funding (including $5M from the Bill & Melinda Gates Foundation and $4M from IDRC) to democratize AI access.',
                  "Led high-level collaborations with strategic partners including Google.org, Lacuna Fund, and UNESCO, scaling the community's impact across 50+ African languages.",
                ]}
                highlight="~$9M research funding"
              />

              <ExperienceItem
                role="Research Assistant"
                org="L3S / Leibniz Information Center for Science & Technology (TIB)"
                period="Nov 2020 – Nov 2022"
                location="Hannover, Germany"
                bullets={[
                  'Engineered the core "Leaderboards" feature for the Open Research Knowledge Graph (ORKG), utilizing Knowledge Graphs to automatically track and visualize state-of-the-art (SOTA) progress across scientific publications.',
                  'Collaborated with Hannover Medical School (MHH) on personalized medicine research, applying machine learning techniques to analyze large-scale genetic datasets for predictive healthcare outcomes.',
                  'Conducted research on Scholarly Information Extraction, developing novel NLP pipelines to extract metric data from unstructured text for knowledge graph construction.',
                ]}
              />
            </ul>
          </section>

          {/* ── EDUCATION ── */}
          <section>
            <SectionHeading>{t('education')}</SectionHeading>
            <ul className="mt-8 space-y-6">
              <EducationItem
                degree="PhD in Computer Science — AI / Natural Language Processing (LLMs)"
                institution="Leibniz Universität Hannover"
                location="Hannover, Germany"
                period="Nov 2020 – Nov 2025"
              />
              <EducationItem
                degree="Master's in Machine Intelligence"
                institution="African Master's in Machine Intelligence (AMMI)"
                location="Accra, Ghana"
                period="Oct 2019 – Nov 2020"
                note="Sponsored by Google and Facebook through AIMS"
              />
              <EducationItem
                degree="Master's in Mathematical Sciences"
                institution="University of the Western Cape"
                location="Cape Town, South Africa"
                period="Aug 2018 – Jun 2019"
                note="African Institute for Mathematical Sciences (AIMS South Africa)"
              />
              <EducationItem
                degree="BSc (Honours) in Mathematics & Computer Science"
                institution="Université de Lubumbashi"
                location="Lubumbashi, DRC"
                period="Oct 2014 – Jul 2017"
              />
            </ul>
          </section>

          {/* ── PUBLICATIONS ── */}
          <section>
            <SectionHeading>{t('publications_patents')}</SectionHeading>
            <ul className="mt-8 space-y-6">
              {PUBLICATIONS.map((pub) => (
                <li key={pub.title} className="border-t border-rule pt-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className="min-w-0 font-serif text-base font-medium text-balance text-ink">
                      {pub.title}
                    </h3>
                    <span className="shrink-0 text-xs text-ink-3">{pub.year}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-2">{pub.venue}</p>
                  <p className="mt-1 text-xs text-ink-3">{pub.detail}</p>
                  {pub.award && (
                    <p className="mt-1.5 text-xs font-medium text-accent">{pub.award}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* ── SKILLS ── */}
          <section>
            <SectionHeading>{t('skills')}</SectionHeading>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <SkillGroup
                label={t('languages_label')}
                items={['Python', 'C/C++', 'SQL', 'Bash']}
              />
              <SkillGroup
                label={t('deep_learning')}
                items={[
                  'PyTorch',
                  'TensorFlow',
                  'Hugging Face Transformers',
                  'LLMs',
                  'RAG',
                  'LangChain',
                  'OpenCV',
                ]}
              />
              <SkillGroup
                label={t('cloud')}
                items={[
                  'AWS (SageMaker, Lambda)',
                  'Docker',
                  'Kubernetes',
                  'Google Cloud Vertex AI',
                  'Linux',
                  'Git',
                ]}
              />
              <SkillGroup
                label={t('research_areas')}
                items={[
                  'NLP',
                  'Computer Vision',
                  'Knowledge Graphs',
                  'Speech Translation',
                  'Generative AI',
                ]}
              />
            </div>
          </section>

          {/* ── AWARDS ── */}
          <section>
            <SectionHeading>{t('awards')}</SectionHeading>
            <ul className="mt-8 space-y-4">
              {AWARDS.map(({ year, award, org }) => (
                <li key={award} className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 border-t border-rule pt-4">
                  <span className="w-10 shrink-0 font-mono text-xs text-ink-3">{year}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{award}</p>
                    <p className="text-xs text-ink-3">{org}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
