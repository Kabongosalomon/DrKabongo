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
    title: 'Learning in the Era of LLM: How Did Our Languages Become “Low-Resource”?',
    venue: 'Deep Learning IndabaX D.R. Congo 2026 · Université Nouveaux Horizons, Lubumbashi',
    date: '2026-11-27',
    featured: true,
    draft: false,
    poster: '/images/talks/indabax-drc-2026.jpg',
    edtrace: {
      slug: 'learning-in-the-llm-era',
      courseId: 'talks',
      lessonId: 'learning_in_the_llm_era',
      location: 'Lubumbashi, D.R. Congo',
      affiliation: 'SALELA BONGO LLC · DarAkili',
      titles: {
        en: 'Learning in the Era of LLM: How Did Our Languages Become “Low-Resource”?',
        fr: "Apprendre à l'ère des LLM : Comment nos langues sont-elles devenues « peu dotées » ?",
        ln: 'Koyekola na tango ya ba LLM : Ndenge nini minoko na biso ekomaki « na mwa ba ressources » ?',
        lua: 'Kulongesha mu tshikondo tshia ba LLM : Mushindu kayi miakulu yetu milua « ne ba ressources bikese » ?',
        sw: 'Kujifunza katika Enzi ya LLM: Lugha Zetu Ziliwezaje Kuwa na “Rasilimali Chache”?',
      },
      summaries: {
        en: 'Why are African languages “low-resource”, and what can we do about it? Probability, the tokenization tax, embeddings and metrics that miss our languages, running open models locally, Masakhane, and DarAkili: bringing everyday life in our languages into the digital space.',
        fr: 'Pourquoi les langues africaines sont-elles « peu dotées », et que pouvons-nous y faire ? Probabilités, taxe de tokenisation, embeddings et métriques qui ratent nos langues, modèles ouverts en local, Masakhane, et DarAkili : faire entrer notre vie quotidienne, dans nos langues, dans l’espace numérique.',
        ln: 'Mpo na nini minoko ya Afrika ezali na « mwa ba ressources », mpe tokoki kosala nini? Probabilité, mpako ya tokenisation, ba embeddings pe ba métriques oyo eyebi minoko na biso te, ba modèles ya polele na ordinateur na yo, Masakhane, pe DarAkili: komema bomoi na biso na minoko na biso na numérique.',
        lua: 'Bua tshinyi miakulu ya mu Afrika idi ne « ba ressources bikese », ne tudi mua kuenza tshinyi? Probabilité, mulambu wa tokenisation, ba embeddings ne ba métriques kabayi bamanya miakulu yetu, ba modèles patoke mu ordinateur webe, Masakhane, ne DarAkili: kuambula muoyo wetu mu miakulu yetu mu numérique.',
        sw: 'Kwa nini lugha za Kiafrika zina “rasilimali chache”, na tunaweza kufanya nini? Uwezekano, kodi ya tokenization, embeddings na vipimo visivyozielewa lugha zetu, kuendesha modeli huria kwenye kompyuta yako, Masakhane, na DarAkili: kuleta maisha yetu ya kila siku kwa lugha zetu katika ulimwengu wa kidijitali.',
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
