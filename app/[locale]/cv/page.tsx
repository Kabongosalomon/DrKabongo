import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cv' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function CVPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'cv' })

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <span className="section-label">{t('section_label')}</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">Salomon Kabongo</h1>
            <p className="text-brand-light font-medium">{t('subtitle')}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <a
              href="mailto:kabongosalomon@gmail.com"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              kabongosalomon@gmail.com
            </a>
            <a
              href="https://linkedin.com/in/salomon-kabongo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Kabongosalomon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://x.com/SalomonKabongo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              @SalomonKabongo
            </a>
          </div>
        </div>

        <div className="space-y-12">
          {/* ── EXPERIENCE ── */}
          <section>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              {t('experience')}
              <span className="flex-1 h-px bg-slate-800" />
            </h2>
            <div className="space-y-6">
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
                highlight="4 Patent Filings"
              />

              <ExperienceItem
                role="Board Member"
                org="Masakhane Research Foundation"
                period="2021 – May 2026"
                location="Global"
                bullets={[
                  'Spearheaded the strategic formation of the Masakhane AI Hub, defining the 2025–2029 roadmap to build digital public infrastructure for 1 billion+ African language speakers.',
                  'Secured and oversaw the execution of ~$9M USD in research funding (including $5M from the Bill & Melinda Gates Foundation and $4M from IDRC) to democratize AI access.',
                  'Led high-level collaborations with strategic partners including Google.org, Lacuna Fund, and UNESCO, scaling the community\'s impact across 50+ African languages.',
                ]}
                highlight="~$9M Research Funding"
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
            </div>
          </section>

          {/* ── EDUCATION ── */}
          <section>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              {t('education')}
              <span className="flex-1 h-px bg-slate-800" />
            </h2>
            <div className="space-y-4">
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
            </div>
          </section>

          {/* ── PUBLICATIONS ── */}
          <section>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              Selected Publications &amp; Patents
              <span className="flex-1 h-px bg-slate-800" />
            </h2>
            <div className="space-y-4">
              {[
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
                  detail: 'High-fidelity multilingual speech corpus; first English-to-Lingala speech translation baseline',
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
              ].map((pub) => (
                <div key={pub.title} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white flex-1">{pub.title}</h3>
                    <span className="text-xs text-slate-500 shrink-0">{pub.year}</span>
                  </div>
                  <p className="text-xs text-brand-light mb-1">{pub.venue}</p>
                  <p className="text-xs text-slate-500">{pub.detail}</p>
                  {pub.award && (
                    <span className="mt-2 inline-block text-xs font-semibold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full">
                      🏆 {pub.award}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── SKILLS ── */}
          <section>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              {t('skills')}
              <span className="flex-1 h-px bg-slate-800" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkillGroup
                label={t('languages_label')}
                items={['Python', 'C/C++', 'SQL', 'Bash']}
                color="#6366f1"
              />
              <SkillGroup
                label={t('deep_learning')}
                items={['PyTorch', 'TensorFlow', 'Hugging Face Transformers', 'LLMs', 'RAG', 'LangChain', 'OpenCV']}
                color="#10b981"
              />
              <SkillGroup
                label={t('cloud')}
                items={['AWS (SageMaker, Lambda)', 'Docker', 'Kubernetes', 'Google Cloud Vertex AI', 'Linux', 'Git']}
                color="#f59e0b"
              />
              <SkillGroup
                label={t('research_areas')}
                items={['NLP', 'Computer Vision', 'Knowledge Graphs', 'Speech Translation', 'Generative AI']}
                color="#8b5cf6"
              />
            </div>
          </section>

          {/* ── AWARDS ── */}
          <section>
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-3">
              {t('awards')}
              <span className="flex-1 h-px bg-slate-800" />
            </h2>
            <div className="space-y-3">
              {[
                { year: '2024', award: 'US Patent Issued (AI/ML) + 3 Pending', org: 'State Farm — Innovation Group' },
                { year: '2021', award: 'ICADL Best Paper Award', org: 'International Conference on Asian Digital Libraries' },
                { year: '2020', award: 'DLRL Summer School', org: 'CIFAR / Mila, Montreal' },
                { year: '2020', award: 'Google Hash Code — Ranked 1747/10724', org: 'Google' },
                { year: '2019', award: 'ACM Future of Computing Academy (FCA) Member', org: 'Association for Computing Machinery — 36 selected globally' },
              ].map(({ year, award, org }) => (
                <div key={award} className="flex items-start gap-4">
                  <span className="text-xs font-mono text-slate-500 pt-0.5 shrink-0 w-10">{year}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{award}</p>
                    <p className="text-xs text-slate-500">{org}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-white">{role}</h3>
          <p className="text-sm text-brand-light">{org}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-slate-400">{period}</p>
          <p className="text-xs text-slate-500">{location}</p>
          {highlight && (
            <span className="mt-1 inline-block text-xs font-semibold bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full">
              {highlight}
            </span>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand/60 shrink-0" />
            <span className="text-sm text-slate-400 leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
      <div>
        <h3 className="text-sm font-bold text-white">{degree}</h3>
        <p className="text-sm text-brand-light">{institution}</p>
        {note && <p className="text-xs text-slate-500 mt-0.5">{note}</p>}
      </div>
      <div className="text-left sm:text-right shrink-0">
        <p className="text-xs text-slate-400">{period}</p>
        <p className="text-xs text-slate-500">{location}</p>
      </div>
    </div>
  )
}

function SkillGroup({
  label,
  items,
  color,
}: {
  label: string
  items: string[]
  color: string
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <h3
        className="text-xs font-bold uppercase tracking-wider mb-3"
        style={{ color }}
      >
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
