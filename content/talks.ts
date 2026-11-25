/**
 * Talks, university lectures, keynotes, and interactive EdTrace presentations.
 *
 * Talks with an `edtrace` descriptor get their own dedicated interactive
 * presentation route at `/[locale]/speaking/[slug]` powered by the full-screen
 * EdTrace viewer, while also appearing in the chronological speaking record.
 */

export interface InteractiveTalkSpec {
  /** URL slug under `/speaking/[slug]` (e.g. `learning-in-the-llm-era`). */
  slug: string
  /** Directory under `public/edtrace/traces/<courseId>/<lang>/<lessonId>.json`. */
  courseId: string
  /** Trace filename stem (e.g. `learning_in_the_llm_era`). */
  lessonId: string
  /** Localized talk titles keyed by locale code. */
  titles: Record<string, string>
  /** Localized short abstracts shown on the Talks hub & talk page header. */
  summaries: Record<string, string>
  /** Localized venue / event context lines. */
  venues: Record<string, string>
  /** Event theme or track, if part of a themed symposium/IndabaX. */
  eventTheme?: Record<string, string>
  /** Location city/country. */
  location: string
  /** Affiliated organization / venture noted on the presentation header. */
  affiliation?: string
}

export interface Talk {
  title: string
  venue: string
  /** ISO date or `YYYY-MM` when only the month is known. */
  date: string
  /** Highlighted at the top of `/speaking` and the homepage Talks section. */
  featured?: boolean
  /**
   * When `true`, the talk is visible locally (`npm run dev` or `SHOW_DRAFT_TALKS=1`)
   * and excluded from `dev`/`prod` static builds until ready to publish.
   */
  draft?: boolean
  /** YouTube ID — renders a "Watch recording" link. */
  videoId?: string
  slides?: string
  poster?: string
  /** Present when this talk has an interactive EdTrace deck hosted on-site. */
  edtrace?: InteractiveTalkSpec
}

export const TALKS: Talk[] = [
  {
    title: 'Learning in the Era of LLM: Crawl, Walk, Run, Fly — Shortcuts vs. Foundations',
    venue: 'Deep Learning IndabaX D.R. Congo 2026 · Université Nouveaux Horizons, Lubumbashi',
    date: '2026-11-27',
    featured: true,
    draft: true,
    poster: '/images/talks/indabax-drc-2026.jpg',
    edtrace: {
      slug: 'learning-in-the-llm-era',
      courseId: 'talks',
      lessonId: 'learning_in_the_llm_era',
      location: 'Lubumbashi, D.R. Congo',
      affiliation: 'SALELA BONGO LLC · DarAkili',
      titles: {
        en: 'Learning in the Era of LLM: Crawl, Walk, Run, Fly — Shortcuts vs. Foundations',
        fr: "Apprendre à l'ère des LLM : Ramper, marcher, courir, voler — Raccourcis vs Fondations",
        ln: 'Koyekola na tango ya ba LLM : Kolanda, kotambola, kopota, kopumbwa — Nzela ya mokuse vs Miboko',
        lua: 'Kulongesha mu tshikondo tshia ba LLM : Kulandakana, kuenda, kunyema, kubuka — Njila wa tshikoso vs Miboko',
        sw: 'Kujifunza katika Enzi ya LLM: Tambaa, Tembea, Kimbia, Paa — Njia za Mkato vs Misingi',
      },
      summaries: {
        en: 'Why fast execution makes deep fundamentals more valuable than ever: tokenization taxes beyond BPE on Congolese languages, embeddings before agents and multimodal hype, low-resource speech translation, and building open STEM & AI education through DarAkili (SALELA BONGO LLC).',
        fr: "Pourquoi la rapidité d'exécution rend la maîtrise des fondamentaux indispensable : la taxe de tokenisation au-delà de BPE sur les langues congolaises, les embeddings avant les agents et le multimodal, la traduction vocale peu dotée, et l'éducation ouverte avec DarAkili (SALELA BONGO LLC).",
        ln: 'Mpo na nini koyeba miboko ya AI ezali na ntina koleka: mokakatano ya tokenisation (BPE) na minoko ya Congo, ba embeddings liboso ya ba agents, traduction ya mongongo, pe mosala ya DarAkili (SALELA BONGO LLC).',
        lua: 'Bua tshinyi kumanya miboko ya AI kudi ne mushinga: lutatu lua tokenisation (BPE) mu miakulu ya mu Congo, ba embeddings kumpala kua ba agents, traduction wa dîyi, ne mudimu wa DarAkili (SALELA BONGO LLC).',
        sw: 'Kwa nini kuelewa misingi ya AI ni muhimu zaidi leo: changamoto za tokenisation (BPE) kwa lugha za Kiafrika, embeddings kabla ya mawakala, tafsiri ya sauti, na elimu huria kupitia DarAkili (SALELA BONGO LLC).',
      },
      venues: {
        en: 'Deep Learning IndabaX D.R. Congo 2026 · Université Nouveaux Horizons (UNH)',
        fr: 'Deep Learning IndabaX R.D. Congo 2026 · Université Nouveaux Horizons (UNH)',
        ln: 'Deep Learning IndabaX R.D. Congo 2026 · Université Nouveaux Horizons (UNH)',
        lua: 'Deep Learning IndabaX R.D. Congo 2026 · Université Nouveaux Horizons (UNH)',
        sw: 'Deep Learning IndabaX D.R. Congo 2026 · Université Nouveaux Horizons (UNH)',
      },
      eventTheme: {
        en: 'AI and Congolese Languages: Building Open Digital Resources (26–28 Nov 2026)',
        fr: 'Intelligence artificielle et langues congolaises : Construire des ressources numériques ouvertes (26–28 nov. 2026)',
        ln: 'Intelligence artificielle pe minoko ya Congo : Kotonga ba ressources numériques ya polele (26–28 nov. 2026)',
        lua: 'Intelligence artificielle ne miakulu ya mu Congo : Kuibaka ba ressources numériques patoke (26–28 nov. 2026)',
        sw: 'Akiliunde na Lugha za Kikongo: Kujenga Rasilimali Huria za Kidijitali (26–28 Nov 2026)',
      },
    },
  },
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
