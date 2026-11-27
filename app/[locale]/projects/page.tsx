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
  description: Record<string, string>
  tags: string[]
  github?: string
  demo?: string
  paper?: string
  youtube?: string
  highlight?: Record<string, string>
}

const pick = (copy: Record<string, string>, locale: string) => copy[locale] ?? copy.en

const PROJECTS: Project[] = [
  {
    name: 'DarAkili',
    description: {
      en: "Built under SALELA BONGO LLC alongside N'Dah Jean Kouagou, PhD: an audio-first multilingual STEM and AI education platform where African professionals share free mini-courses in Lingala, Tshiluba, and Swahili so language is never a gate to knowledge.",
      fr: "Construit au sein de SALELA BONGO LLC avec N'Dah Jean Kouagou, PhD : une plateforme éducative multilingue centrée sur l'audio pour les STEM et l'IA, où des professionnels africains partagent des mini-cours gratuits en lingala, tshiluba et swahili afin que la langue ne soit jamais une barrière au savoir.",
      sw: "Imejengwa chini ya SALELA BONGO LLC pamoja na N'Dah Jean Kouagou, PhD: jukwaa la elimu ya STEM na AI la lugha nyingi linalotanguliza sauti ambapo wataalamu wa Kiafrika hushiriki kozi fupi za bure kwa Kilingala, Kitshiluba, na Kiswahili ili lugha isiwe kamwe kikwazo cha maarifa.",
      ln: "Etongami na kati ya SALELA BONGO LLC elongo na N'Dah Jean Kouagou, PhD: plateforme ya mateya ya STEM mpe AI na minoko mingi oyo ezali liboso ya mongongo, epai bato ya mayele ya Afrika bakabolaka mateya ya ofele na Lingala, Tshiluba mpe Swahili mpo lokota ezala mokolo moko te epekiseli ya boyebi.",
      lua: "Muibaka mu SALELA BONGO LLC pamue ne N'Dah Jean Kouagou, PhD: plateforme wa dilongesha STEM ne AI wa miakulu ya bungi udi utangila diyi kumpala, muaba udi bena mudimu ba mayele ba mu Afrika babanya malongesha a tshianana mu Lingala, Tshiluba ne Swahili bua muakulu kawikadi tshibikilu tshia dimanya to.",
    },
    tags: ['STEM & AI Education', 'African Languages', 'Audio-First', 'SALELA BONGO LLC'],
    demo: 'https://darakili.com',
    youtube: 'https://www.youtube.com/@DarAkili',
    highlight: {
      en: 'SALELA BONGO LLC · STEM & AI education platform',
      fr: "SALELA BONGO LLC · Plateforme d'éducation aux STEM et à l'IA",
      sw: 'SALELA BONGO LLC · Jukwaa la elimu ya STEM na AI',
      ln: 'SALELA BONGO LLC · Plateforme ya mateya ya STEM mpe AI',
      lua: 'SALELA BONGO LLC · Plateforme wa dilongesha STEM ne AI',
    },
  },
  {
    name: 'IrokoBench',
    description: {
      en: 'A human-translated benchmark for evaluating natural-language inference, mathematical reasoning, and knowledge-based question answering across 17 African languages.',
      fr: "Un benchmark traduit par des humains pour évaluer l'inférence en langage naturel, le raisonnement mathématique et les questions-réponses fondées sur les connaissances dans 17 langues africaines.",
      sw: 'Kipimo (benchmark) kilichotafsiriwa na binadamu cha kutathmini mantiki ya lugha asilia, fikra za kihisabati, na kujibu maswali ya maarifa katika lugha 17 za Kiafrika.',
      ln: 'Benchmark oyo bato babongoli mpo na komeka bososoli ya lokota, makanisi ya mathématiques mpe biyano na mituna ya boyebi na minoko 17 ya Afrika.',
      lua: 'Benchmark mukudimuna kudi bantu bua kupima diumvua dia muakulu, lungenyi lua mathématiques ne diandamuna dia nkonko ya dimanya mu miakulu 17 ya Afrika.',
    },
    tags: ['LLM Evaluation', 'African Languages', 'Reasoning', 'Multilingual NLP'],
    paper: 'https://aclanthology.org/2025.naacl-long.139/',
    highlight: {
      en: 'NAACL 2025 · Long Papers',
      fr: 'NAACL 2025 · Articles longs',
      sw: 'NAACL 2025 · Makala Marefu',
      ln: 'NAACL 2025 · Articles longs',
      lua: 'NAACL 2025 · Articles longs',
    },
  },
  {
    name: 'INJONGO',
    description: {
      en: 'A culturally grounded, open benchmark for intent detection and slot filling, created with native-speaker utterances across 16 African languages.',
      fr: "Un benchmark ouvert et ancré culturellement pour la détection d'intention et le remplissage d'emplacements, créé à partir d'énoncés de locuteurs natifs dans 16 langues africaines.",
      sw: 'Kipimo huria chenye mizizi ya kitamaduni cha kutambua dhamira (intent detection) na ujazaji wa nafasi (slot filling), kilichoundwa kwa kauli za wazungumzaji asilia katika lugha 16 za Kiafrika.',
      ln: 'Benchmark ya polele oyo ekangami na mimeseno mpo na koyeba mokano (intent detection) mpe slot filling, esalemi na maloba ya bato ya minoko 16 ya Afrika.',
      lua: 'Benchmark wa patoke mukangama ku bilele bua kumanya tshipatshila (intent detection) ne slot filling, muenza ne mêyi a bena miakulu 16 ya Afrika.',
    },
    tags: ['Intent Detection', 'Slot Filling', 'African Languages', 'LLM Evaluation'],
    paper: 'https://aclanthology.org/2025.acl-long.464/',
    highlight: {
      en: 'ACL 2025 · Long Papers',
      fr: 'ACL 2025 · Articles longs',
      sw: 'ACL 2025 · Makala Marefu',
      ln: 'ACL 2025 · Articles longs',
      lua: 'ACL 2025 · Articles longs',
    },
  },
  {
    name: 'Masakhane Web Platform',
    description: {
      en: 'A Mozilla-funded web platform that makes community-built translation models for African languages available through an accessible interface.',
      fr: 'Une plateforme web financée par Mozilla qui rend accessibles, via une interface simple, les modèles de traduction construits par la communauté pour les langues africaines.',
      sw: 'Jukwaa la mtandao lililofadhiliwa na Mozilla linalofanya modeli za tafsiri za lugha za Kiafrika zilizojengwa na jamii zipatikane kupitia kiolesura rahisi kutumia.',
      ln: 'Plateforme ya internet oyo Mozilla efutaki mpo na kopesa nzela ya pete ya kosalela ba modèles ya libongoli oyo lisanga etongi mpo na minoko ya Afrika.',
      lua: 'Plateforme wa ku internet uvua Mozilla mufute bua kupesha mushindu mupepele wa kusadila ba modèles ba dikudimuna bibaka kudi tshisumbu bua miakulu ya Afrika.',
    },
    tags: ['NLP', 'Machine Translation', 'African Languages', 'Web'],
    demo: 'http://translate.masakhane.io/',
    highlight: {
      en: 'Mozilla Open Source Support Award',
      fr: 'Prix Mozilla Open Source Support',
      sw: 'Tuzo ya Mozilla Open Source Support',
      ln: 'Mbano ya Mozilla Open Source Support',
      lua: 'Tshisaka tshia Mozilla Open Source Support',
    },
  },
  {
    name: 'Masakhane Initiative',
    description: {
      en: 'A participatory research community where African researchers collaborate on datasets, models, and methods for African-language technology. Masakhane means "We Build Together" in isiZulu.',
      fr: 'Une communauté de recherche participative où des chercheurs africains collaborent sur des jeux de données, des modèles et des méthodes pour les technologies des langues africaines. Masakhane signifie « Nous construisons ensemble » en isiZulu.',
      sw: 'Jamii shirikishi ya utafiti ambapo watafiti wa Kiafrika hushirikiana kujenga seti za data, modeli, na mbinu za teknolojia za lugha za Kiafrika. Masakhane ina maana ya "Tunajenga Pamoja" kwa Kizulu.',
      ln: 'Lisanga ya bolukiluki ya elongo epai balukiluki ya Afrika basalaka elongo mpo na ba données, ba modèles mpe ba méthodes ya minoko ya Afrika. Masakhane elingi koloba « Totonga elongo » na isiZulu.',
      lua: 'Tshisumbu tshia makebulula a pamue muaba udi bakebulula ba mu Afrika benza mudimu pamue pa ba données, ba modèles ne ba méthodes bua miakulu ya Afrika. Masakhane udi umvuija « Tuibakayi pamue » mu isiZulu.',
    },
    tags: ['NLP', 'African Languages', 'Community', 'Research'],
    github: 'https://github.com/masakhane-io/masakhane',
    demo: 'https://www.masakhane.io/home',
    highlight: {
      en: 'EMNLP Findings 2020 · Community research',
      fr: 'EMNLP Findings 2020 · Recherche communautaire',
      sw: 'EMNLP Findings 2020 · Utafiti wa kijamii',
      ln: 'EMNLP Findings 2020 · Bolukiluki ya lisanga',
      lua: 'EMNLP Findings 2020 · Makebulula a tshisumbu',
    },
  },
  {
    name: 'ORKG Leaderboards',
    description: {
      en: 'Engineered the Leaderboards feature for the Open Research Knowledge Graph (ORKG) to automatically track and visualize state-of-the-art progress across scientific publications using Knowledge Graphs.',
      fr: "Conception de la fonctionnalité Leaderboards de l'Open Research Knowledge Graph (ORKG) pour suivre et visualiser automatiquement l'état de l'art dans les publications scientifiques à l'aide de graphes de connaissances.",
      sw: 'Niliunda kipengele cha Leaderboards kwa Open Research Knowledge Graph (ORKG) ili kufuatilia na kuonyesha moja kwa moja maendeleo ya juu zaidi katika machapisho ya kisayansi kwa kutumia Grafu za Maarifa.',
      ln: 'Natongaki eteni ya Leaderboards mpo na Open Research Knowledge Graph (ORKG) mpo na kolanda mpe kolakisa bokoli ya makomi ya science na kosalela ba graphes ya boyebi.',
      lua: 'Ngakibaka tshitupa tshia Leaderboards bua Open Research Knowledge Graph (ORKG) bua kulonda ne kuleja dituluka dia mifundu ya science ne ba graphes bia dimanya.',
    },
    tags: ['Knowledge Graphs', 'NLP', 'Scholarly IE', 'Python'],
    github: 'https://github.com/Kabongosalomon/task-dataset-metric-nli-extraction',
    paper: 'https://arxiv.org/pdf/2109.13089.pdf',
    highlight: {
      en: 'ICADL 2021 Best Paper Award',
      fr: 'Prix du meilleur article ICADL 2021',
      sw: 'Tuzo ya Makala Bora ya ICADL 2021',
      ln: 'Mbano ya Article ya malamu koleka ICADL 2021',
      lua: 'Tshisaka tshia Article muimpe kupita ICADL 2021',
    },
  },
  {
    name: 'LiSTra Speech Translation',
    description: {
      en: 'The first English-to-Lingala automatic speech translation dataset and baseline. Released a full pipeline for constructing similar datasets in other low-resource languages.',
      fr: "Le premier jeu de données et système de référence de traduction vocale automatique anglais-lingala, accompagné d'un pipeline complet pour créer des ressources similaires dans d'autres langues peu dotées.",
      sw: 'Seti ya kwanza ya data na modeli ya msingi ya tafsiri ya sauti ya moja kwa moja kutoka Kiingereza kwenda Kilingala, pamoja na mchakato kamili wa kujenga seti kama hizo kwa lugha nyingine zenye rasilimali chache.',
      ln: 'Jeu de données mpe système ya liboso ya libongoli ya mongongo uta Anglais kino Lingala, elongo na nzela mobimba ya kotonga ba données ya ndenge wana mpo na minoko mosusu oyo ezali na ba ressources moke.',
      lua: 'Jeu de données ne système wa kumpala wa dikudimuna dia diyi kufuma ku Anglais kuya ku Lingala, pamue ne njila mujima wa kuibaka ba données bia nanku bua miakulu mikuabu idi ne ba ressources mikese.',
    },
    tags: ['ASR', 'Speech Translation', 'Lingala', 'Low-Resource NLP'],
    github: 'https://github.com/dsfsi/2020-AMMI-salomon',
    paper: '/archive/posterBiai2021.pdf',
    highlight: {
      en: 'NeurIPS 2021 Black in AI Workshop',
      fr: 'Atelier Black in AI · NeurIPS 2021',
      sw: 'Warsha ya Black in AI · NeurIPS 2021',
      ln: 'Atelier Black in AI · NeurIPS 2021',
      lua: 'Atelier Black in AI · NeurIPS 2021',
    },
  },
]

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'projects' })

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:pr-[9.5rem]">
        <p className="eyebrow">{t('section_label')}</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-balance text-ink sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-2">{t('subtitle')}</p>

        <ul className="mt-14 space-y-10">
          {PROJECTS.map((project) => (
            <li key={project.name} className="border-t border-rule pt-5">
              {project.highlight && <p className="eyebrow">{pick(project.highlight, locale)}</p>}

              <h2 className="mt-2 font-serif text-lg font-medium text-balance text-ink">
                {project.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
                {pick(project.description, locale)}
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
