/**
 * Multilingual EdTrace presentation source for:
 * "Learning in the Era of LLM: Crawl, Walk, Run, Fly — Shortcuts vs. Foundations"
 * Deep Learning IndabaX D.R. Congo 2026 — Université Nouveaux Horizons (Lubumbashi)
 * Friday, 27 November 2026 · Salomon Kabongo, PhD (SALELA BONGO LLC · DarAkili)
 */

export const PRESENTATION_META = {
  courseId: 'talks',
  lessonId: 'learning_in_the_llm_era',
  sourcePath: 'talks/learning_in_the_llm_era.py',
  courseTitles: {
    en: 'Invited Talks & University Lectures',
    fr: 'Conférences invitées et cours universitaires',
    ln: 'Masolo pe mateya ya université',
    lua: 'Miyuki ne malongesha a ku université',
  },
  lessonTitles: {
    en: 'Learning in the Era of LLM: Crawl, Walk, Run, Fly — Shortcuts vs. Foundations',
    fr: "Apprendre à l'ère des LLM : Ramper, marcher, courir, voler — Raccourcis vs Fondations",
    ln: 'Koyekola na tango ya ba LLM : Kolanda, kotambola, kopota, kopumbwa — Nzela ya mokuse vs Miboko',
    lua: 'Kulongesha mu tshikondo tshia ba LLM : Kulandakana, kuenda, kunyema, kubuka — Njila wa tshikoso vs Miboko',
  },
  languages: [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ln', label: 'Lingála' },
    { code: 'lua', label: 'Tshiluba' },
  ],
  functionNames: {
    en: {},
    fr: {
      main: 'principal',
      table_of_contents: 'table_des_matieres',
      the_rise_of_llms_and_history: 'essor_des_llm_et_lecon_de_l_histoire',
      crawl_walk_run_fly: 'ramper_marcher_courir_voler',
      conditional_probability_machines: 'machines_a_probabilite_conditionnelle',
      bpe_and_the_tokenization_tax: 'bpe_et_taxe_de_tokenisation',
      embeddings_across_all_modalities: 'embeddings_a_travers_les_modalites',
      two_memories_and_congolese_speech: 'deux_memoires_et_parole_congolaise',
      recognition_darakili_and_building_together: 'reconnaissance_darakili_et_batir_ensemble',
    },
    ln: {
      main: 'mosala_monene',
      table_of_contents: 'ndimbu_ya_malako',
      the_rise_of_llms_and_history: 'komata_ya_ba_llm_pe_lisolo',
      crawl_walk_run_fly: 'kolanda_kotambola_kopota_kopumbwa',
      conditional_probability_machines: 'ba_machine_ya_probabilite_conditionnelle',
      bpe_and_the_tokenization_tax: 'bpe_pe_mpako_ya_tokenisation',
      embeddings_across_all_modalities: 'ba_embeddings_na_ba_modalite_nionso',
      two_memories_and_congolese_speech: 'ba_memoire_mibale_pe_mongongo',
      recognition_darakili_and_building_together: 'lokumu_darakili_pe_kotonga_elongo',
    },
    lua: {
      main: 'mudimu_munene',
      table_of_contents: 'mukanda_wa_bintu',
      the_rise_of_llms_and_history: 'dibanda_dia_ba_llm_ne_muyuki',
      crawl_walk_run_fly: 'kulandakana_kuenda_kunyema_kubuka',
      conditional_probability_machines: 'ba_machine_ba_probabilite_conditionnelle',
      bpe_and_the_tokenization_tax: 'bpe_ne_mulambu_wa_tokenisation',
      embeddings_across_all_modalities: 'ba_embeddings_mu_ba_modalite_yonso',
      two_memories_and_congolese_speech: 'ba_memoire_ibidi_ne_diyi',
      recognition_darakili_and_building_together: 'buneme_darakili_ne_kuibaka_pamue',
    },
  },
  inspectMath: {
    p_max_general: 'P(\\text{Max})',
    p_max_given_puppy: 'P(\\text{Max}\\mid\\text{puppy})',
    p_max_given_startup: 'P(\\text{Max}\\mid\\text{startup})',
    p_puppy_given_max: 'P(\\text{puppy}\\mid\\text{Max})',
    chain_reliability: 'P(y&#95;{1:t}\\text{ valid})=p^{t}',
    merge_step: 'm',
    pair_count: '\\max&#95;{(a,b)}\\mathrm{count}(a,b)',
    vocab_size: '|V&#95;{m}|',
    total_tokens: 'N&#95;{\\mathrm{tokens}}',
    fertility_en: 'f&#95;{\\mathrm{en}}=\\frac{T&#95;{\\mathrm{en}}}{W&#95;{\\mathrm{en}}}',
    fertility_fr: 'f&#95;{\\mathrm{fr}}=\\frac{T&#95;{\\mathrm{fr}}}{W&#95;{\\mathrm{fr}}}',
    fertility_sw: 'f&#95;{\\mathrm{sw}}=\\frac{T&#95;{\\mathrm{sw}}}{W&#95;{\\mathrm{sw}}}',
    fertility_ln: 'f&#95;{\\mathrm{ln}}=\\frac{T&#95;{\\mathrm{ln}}}{W&#95;{\\mathrm{ln}}}',
    fertility_lua: 'f&#95;{\\mathrm{lua}}=\\frac{T&#95;{\\mathrm{lua}}}{W&#95;{\\mathrm{lua}}}',
    token_tax_lua: '\\tau&#95;{\\mathrm{lua}}=\\frac{T&#95;{\\mathrm{lua}}}{T&#95;{\\mathrm{en}}}',
    attention_cost_lua: '\\mathcal{C}&#95;{\\mathrm{attn}}=\\tau&#95;{\\mathrm{lua}}^{2}',
    sim_to_anchor: '\\cos(\\theta)=\\frac{\\mathbf{u}\\cdot\\mathbf{v}}{\\|\\mathbf{u}\\|\\|\\mathbf{v}\\|}',
    sim_unadapted_mayi: '\\cos(\\theta)&#95;{\\mathrm{BPE\\text{-}shattered}}',
    sim_aligned_mayi: '\\cos(\\theta)&#95;{\\mathrm{aligned}}',
    full_params: 'd\\times k',
    lora_params: 'r(d+k)',
    compression_ratio: '\\frac{dk}{r(d+k)}',
    cascade_retention: 'R&#95;{\\mathrm{cascade}}=(1-e&#95;{\\mathrm{ASR}})(1-e&#95;{\\mathrm{MT}})',
    direct_st_retention: 'R&#95;{\\mathrm{direct}}',
  },
}

export function getReferences(langCode) {
  const isFr = langCode === 'fr'
  const blogPrefix = isFr ? 'https://drkabongo.com/fr/blog' : 'https://drkabongo.com/blog'

  return {
    stanford_ai_index: {
      anchor: '[Stanford HAI — AI Index Report & Top-Venue Submission Trends]',
      external_link: {
        title: 'AI Index Report (Stanford Institute for Human-Centered AI)',
        authors: ['Stanford HAI AI Index Steering Committee'],
        organization: 'Stanford University',
        date: '2025-04-07',
        url: 'https://hai.stanford.edu/ai-index',
        description:
          'Annual empirical tracking of AI publications, top conference submissions (NeurIPS 2025: 21,575; ICLR 2025: 11,600+; ACL 2024: 4,407), and LLM research concentration (>20% of top ML papers).',
      },
    },
    sensor_tower_ai_apps: {
      anchor: '[Sensor Tower 2025 — State of Mobile & Generative AI Apps]',
      external_link: {
        title: 'State of Mobile / Generative AI Apps on Apple App Store & Google Play',
        authors: ['Sensor Tower Research'],
        organization: 'Sensor Tower',
        date: '2025-12-01',
        url: 'https://sensortower.com',
        description:
          'Global GenAI app downloads grew from ~1.5B (2024) to 3.8B (2025), while annual in-app consumer spend surged from $455M (2023) to $1.3B (2024) and $5B+ (2025).',
      },
    },
    appfigures_ai_apps: {
      anchor: '[Appfigures 2024/2025 — AI App Publishing on App Store & Google Play]',
      external_link: {
        title: 'AI App Publishing & Wrapper Market Breakdown (iOS App Store & Google Play)',
        authors: ['Appfigures Intelligence'],
        organization: 'Appfigures',
        date: '2025-06-01',
        url: 'https://appfigures.com',
        description:
          'Tracks 1,000+ new AI apps published every month across Apple App Store and Google Play (29,000+ cumulative titles), with thin General Assistant wrappers capturing ~40% of top AI app spend.',
      },
    },
    grinsztajn_2022: {
      anchor: '[Grinsztajn, Oyallon & Varoquaux — NeurIPS 2022 (Tree Models vs. Deep Learning)]',
      external_link: {
        title: 'Why do tree-based models still outperform deep learning on tabular data?',
        authors: ['Léo Grinsztajn', 'Edouard Oyallon', 'Gaël Varoquaux'],
        organization: 'NeurIPS 2022 Datasets and Benchmarks',
        date: '2022-07-18',
        url: 'https://arxiv.org/abs/2207.08815',
        description:
          'Benchmark across 45 tabular datasets proving that Random Forests and Gradient Boosted Trees (XGBoost/HistGBT) still outperform deep neural networks in accuracy and speed.',
      },
    },
    africa_ai_100: {
      anchor: '[Oxford Global Think Tank 2026 — Africa AI 100]',
      external_link: {
        title: 'Africa AI 100 (2026) — Portrait 24/100: "Computing in Tshiluba" (The Languages)',
        authors: ['Oxford Global Think Tank'],
        organization: 'Oxford Global Think Tank',
        date: '2026-11-01',
        url: 'https://www.oxfordthinktank.org/publications/africa-ai-100-2026',
        description:
          'Inaugural recognition highlighting 100 researchers, engineers, and builders shaping artificial intelligence across Africa and its languages.',
        notes: 'Portrait 24/100 · Field: The Languages ("Giving African voices a place in the machine").',
      },
    },
    blog_cond_prob: {
      anchor: isFr
        ? '[Kabongo 2026 — Les LLM sont des machines à probabilité conditionnelle (drkabongo.com)]'
        : '[Kabongo 2026 — LLMs Are Conditional Probability Machines (drkabongo.com)]',
      external_link: {
        title: isFr
          ? 'Les LLM sont des machines à probabilité conditionnelle'
          : 'LLMs Are Conditional Probability Machines',
        authors: ['Salomon Kabongo, PhD'],
        organization: 'drkabongo.com',
        date: '2026-11-01',
        url: `${blogPrefix}/conditional-probability-machines`,
        description:
          'Interactive essay with live probability labs showing why "next-token predictor" only tells half the story: conditioning narrows the world before recounting, and P(A|B) != P(B|A).',
      },
    },
    blog_two_memories: {
      anchor: isFr
        ? "[Kabongo 2026 — Votre LLM a deux mémoires. Vous n'en utilisez qu'une (drkabongo.com)]"
        : '[Kabongo 2026 — Your LLM Has Two Memories. You’re Only Using One (drkabongo.com)]',
      external_link: {
        title: isFr
          ? "Votre LLM a deux mémoires. Vous n'en utilisez qu'une."
          : 'Your LLM Has Two Memories. You’re Only Using One.',
        authors: ['Salomon Kabongo, PhD'],
        organization: 'drkabongo.com',
        date: '2026-11-13',
        url: `${blogPrefix}/llm-two-memories`,
        description:
          'Part 1 of 2 on p_theta(answer | context): why freezing weights (theta) and pushing everything into the context binder stops systems from learning.',
      },
    },
    blog_beyond_context: {
      anchor: isFr
        ? '[Kabongo 2026 — Au-delà de la fenêtre de contexte : entraîner les poids (drkabongo.com)]'
        : '[Kabongo 2026 — Beyond the Context Window: Teaching the Model Your Domain (drkabongo.com)]',
      external_link: {
        title: 'Beyond the Context Window: Context Rot, LoRA, and Why Open Weights Matter',
        authors: ['Salomon Kabongo, PhD'],
        organization: 'drkabongo.com',
        date: '2026-11-12',
        url: `${blogPrefix}/llm-two-memories-part-2`,
        description:
          'Part 2 of 2: O(n^2) context rent, transient rank-1 updates T_W(c, x) = T_{W+dW}(x), LoRA economics, and deciding which knowledge belongs in context vs. weights.',
      },
    },
    nldb_2024: {
      anchor: '[Kabongo, D’Souza & Auer 2024 — Context Selection in LLMs]',
      external_link: {
        title: 'Effective Context Selection in LLM-based Leaderboard Generation: An Empirical Study',
        authors: ['Salomon Kabongo', "Jennifer D'Souza", 'Sören Auer'],
        organization: 'NLDB 2024',
        date: '2024-07-02',
        url: 'https://arxiv.org/abs/2407.02409',
        description:
          'Empirical proof that "holding is not using": feeding 500 targeted words beat feeding the full 5,900-word paper on F1 and accuracy.',
      },
    },
    masakhane_2020: {
      anchor: '[Nekoto, Marivate, Kabongo+ 2020 — Masakhane]',
      external_link: {
        title: 'Participatory Research for Low-resourced Machine Translation: A Case Study in African Languages',
        authors: [
          'Wilhelmina Nekoto',
          'Vukosi Marivate',
          'Salomon Kabongo',
          'Jade Abbott',
          'Kathleen Siminyu',
          'Bonaventure F. P. Dossou',
          'Masakhane Community',
        ],
        organization: 'Findings of EMNLP 2020',
        date: '2020-11-16',
        url: 'https://aclanthology.org/2020.findings-emnlp.195/',
        description:
          'Community-led participatory machine translation across over 30 African languages.',
        notes: 'Masakhane means "We build together."',
      },
    },
    listra_2022: {
      anchor: '[Kabongo & Marivate 2021/2022 — LiSTra Speech Translation]',
      external_link: {
        title: 'LiSTra: First English-to-Lingala Automatic Speech Translation Corpus and Baseline',
        authors: ['Salomon Kabongo', 'Vukosi Marivate'],
        organization: 'NeurIPS Black in AI Spotlight & Interspeech',
        date: '2021-12-07',
        url: 'https://github.com/dsfsi/2020-AMMI-salomon',
        description:
          'End-to-end and cascaded speech translation pipelines and open corpus creation protocol for low-resource Congolese languages.',
      },
    },
    irokobench_2025: {
      anchor: '[Adelani, Kabongo+ 2025 — IrokoBench]',
      external_link: {
        title: 'IrokoBench: A New Benchmark for African Languages in the Age of Large Language Models',
        authors: ['David Ifeoluwa Adelani', 'Salomon Kabongo', 'Masakhane Collaborators'],
        organization: 'NAACL 2025',
        date: '2025-04-29',
        url: 'https://aclanthology.org/2025.naacl-long.139/',
        description:
          'Human-translated evaluation of knowledge, natural-language inference, and mathematical reasoning across 17 African languages.',
      },
    },
    injongo_2025: {
      anchor: '[Yu, Kabongo+ 2025 — INJONGO]',
      external_link: {
        title: 'INJONGO: A Multicultural Intent Detection and Slot-filling Dataset for 16 African Languages',
        authors: ['S. Yu', 'Salomon Kabongo', 'Masakhane Collaborators'],
        organization: 'ACL 2025',
        date: '2025-07-27',
        url: 'https://aclanthology.org/2025.acl-long.464/',
        description:
          'Culturally grounded conversational NLU benchmark across 16 African languages including Lingala and Swahili.',
      },
    },
    darakili: {
      anchor: '[DarAkili · SALELA BONGO LLC — darakili.com]',
      external_link: {
        title: 'DarAkili — Learn STEM, Programming & AI in African Languages',
        authors: ['Salomon Kabongo, PhD', "N'Dah Jean Kouagou, PhD"],
        organization: 'SALELA BONGO LLC',
        date: '2026-01-01',
        url: 'https://darakili.com',
        description:
          'Audio-first multilingual STEM and AI education platform teaching in Lingala, Tshiluba, and Swahili so language is never a gate to knowledge.',
      },
    },
  }
}

export const COPY = {
  en: {
    s1_title: 'Learning in the Era of LLM: Crawl, Walk, Run, Fly — Shortcuts vs. Foundations',
    s1_venue:
      '**Deep Learning IndabaX D.R. Congo 2026** · **Université Nouveaux Horizons (UNH), Lubumbashi** · Friday, 27 November 2026',
    s1_speaker:
      '**Salomon Kabongo, PhD** — AI Researcher & Lead Software Engineer · Founder, **SALELA BONGO LLC** · Co-builder of **DarAkili**',
    s1_poster_caption:
      'IndabaX D.R. Congo 2026 at Université Nouveaux Horizons, Lubumbashi (26–28 November 2026) — "AI and Congolese Languages: Building Open Digital Resources."',
    s1_wave_title: 'The LLM Wave Has Reshaped Research and Software Overnight',
    s1_research_boom:
      '**1. Research Publication Volume Exploded:** Across top AI venues, paper submissions have doubled in just a few cycles — **NeurIPS 2025 hit 21,575 submissions**, **ICLR jumped from ~7,400 (2024) to 11,600+ (2025)**, and **ACL reached 4,407 main-conference submissions in 2024** (+536% over a decade). Roughly **1 in 5 papers (>20%)** at top ML conferences now explicitly feature *"LLM"* in their titles or abstracts.',
    s1_plot_title: 'Top AI Venue Submissions Surge (Verified Conference Counts)',
    s1_appstore_boom:
      '**2. Mobile App Stores Flooded With AI Wrappers:** On the **Apple App Store & Google Play**, **1,000+ new AI apps** are published *every single month* (crossing ~29,000+ cumulative AI titles, per Appfigures). Worldwide generative AI app downloads jumped from **1.5 billion (2024)** to **3.8 billion (2025)**, and annual in-app consumer spend surged from **USD 455M (2023) → USD 1.3B (2024) → USD 5B+ (2025)** (Sensor Tower) — with thin *"General Assistant"* wrappers capturing ~40% of top AI app spend.',
    s1_history_title: 'We Have Seen This Movie Before: Deep Learning vs. Classical ML',
    s1_history_body:
      'When Deep Learning surged in 2012–2018, many students rushed to abandon **Classical ML** — **Linear & Logistic Regression, Decision Trees, Random Forests, and XGBoost** — calling them "old-fashioned."\n\nThen **Grinsztajn, Oyallon & Varoquaux (NeurIPS 2022)** benchmarked 45 real-world tabular datasets and proved a humbling truth: **Random Forests and Gradient Boosted Trees STILL outperform Deep Learning on tabular data** — faster, cheaper, and more accurate! And the researchers who actually *invented* Transformers and LoRA were the ones who mastered linear algebra, probability, and classical ML first.',
    s1_history_takeaway:
      '**THE LESSON FOR TODAY:** Just as abandoning Random Forests and regression during the Deep Learning wave was a mistake, abandoning **probability, tokenization, embeddings, and classical ML** during the LLM wave is the exact same trap.',
    s1_note: 'Hit the room immediately with verified numbers from NeurIPS/ICLR/ACL and App Store/Google Play, then draw the Deep Learning vs. Random Forest historical parallel.',

    s2_title: 'Crawl, Walk, Run, Fly: Shortcuts vs. Foundations',
    s2_paradox:
      'Execution has never been faster. Today, ten lines of Python download an open-weights Transformer and fine-tune it on your dataset, or wire an API into an agent.',
    s2_shortcut_nuance:
      '**Let us be honest and practical:** taking an existing pretrained architecture and tuning it on local data **is** today’s biggest shortcut — and **that shortcut is genuinely valuable!** In engineering, shipping a strong baseline fast matters.',
    s2_trap:
      '**The trap for students and researchers** is mistaking that shortcut for mastery. The temptation today is to jump straight to **autonomous agents, giant frontier Transformers, and multimodal wrappers** — **trying to fly before learning to crawl and walk**.',
    s2_stages_table: [
      ['Stage', 'Mathematical Core', 'Why Skipping It Hurts You'],
      ['1. Crawl', 'Conditional Probability & Tokens', 'You treat prompts as magic spells instead of conditioning distributions'],
      ['2. Walk', 'Embeddings (R^d) & Attention', 'You cannot diagnose broken representations across languages or modalities'],
      ['3. Run', 'Two Memories: Weights vs. Context', 'You pay O(n^2) context rent forever and never teach the model your domain'],
      ['4. Fly', 'New Tokenizers, Speech & Agents', 'You build wings designed for Congolese languages, low-resource audio & reality'],
    ],
    s2_takeaway:
      '**THESIS:** Crawling and walking are the mathematical muscles that let you **run** and **fly**. Let us walk through the four foundational pillars live in code.',
    s2_note: 'Acknowledge fine-tuning as valuable for execution, then pivot into the 4 technical pillars.',

    s3_title: 'Pillar 1: LLMs Are Conditional Probability Machines',
    s3_intro:
      'People often say *"LLMs are just next-token predictors."* Technically true — yet it misses the word that gives you control. I prefer a more exact name: **conditional probability machines**.',
    s3_bar_intuition:
      'When an LLM predicts its next token $x_t$, it is not asking *"what word usually comes next?"* It is asking *"what token comes next, **given** everything before the vertical bar `|`?"*',
    s3_narrow_world:
      '**What "given" (`|`) means mathematically:** Conditioning means **narrowing the world, then recounting**. Out of all $N$ possible conversations, throw away every world where condition $B$ is false, and recount how often $A$ happens inside what remains:',
    s3_trace_intro:
      '**Live Trace Demo #1 — Same Prompt, Three Different Worlds:** Watch the Environment panel (`🅴`) as we keep the user request fixed (*"Suggest a name"*) over **200 conversations** and change **only the condition** $B$:',
    s3_plot_title: 'P(name | condition): Same Request, Different Conditioned Worlds',
    s3_bayes_trap:
      'Notice two laws in the inspected numbers:\n1. `"Max"` is **12%** likely in general, **34%** given a *puppy*, and **1%** given a *cybersecurity startup*. The model never changed; **the condition did**.\n2. **$P(A \\mid B) \\neq P(B \\mid A)$:** $P(\\text{Max} \\mid \\text{puppy}) = 0.34$, whereas $P(\\text{puppy} \\mid \\text{Max}) = 0.71$!',
    s3_snowball_intro:
      '**Autoregressive Snowballing — Why Multi-Step Agents Fail Quickly:** Every token the model generates crosses the bar `|` and becomes *given* for the next step. Step through this 6-step loop (`→` or `j` to step over) when single-step accuracy is $p = 0.85$:',
    s3_takeaway:
      '> **"Next-token prediction" describes what the model does. "Conditional probability" describes what you control.** *(Interactive labs at drkabongo.com)*',

    s4_title: 'Pillar 2: BPE From Scratch & the Hidden Tokenization Tax',
    s4_intro:
      'Look inside $P&#95;{\\theta}(x&#95;{t} \\mid x&#95;{1}, \\dots, x&#95;{t-1})$: what are the $x&#95;{i}$? Before any matrix multiplication, a **tokenizer** maps raw text into integer IDs from a finite vocabulary $V$. Most modern LLMs use **Byte-Pair Encoding (BPE)**.',
    s4_bpe_how:
      '**Live Trace Demo #2 — How BPE Learns Merges Step-by-Step:** BPE starts with individual characters and repeatedly merges the single **most frequent adjacent pair**. Step through 4 merges on a tiny Tshiluba root corpus (`"kulonga"`, `"kulongesha"`):',
    s4_tax_question:
      '**Now ask the crucial question:** What happens when those merge rules were learned on **90% English text**, and we apply that frozen tokenizer to **Tshiluba**, **Lingala**, or **Swahili**?',
    s4_tax_demo_intro:
      'Let us measure **Fertility** ($f_L = T_L / W_L$ tokens per word) and **Quadratic Self-Attention Cost** ($\\mathcal{C} \\propto T_L^2$) on the exact same sentence — *"Language should never be a gate to knowledge"*:',
    s4_plot_title: 'Tokenization Fertility & Quadratic Attention Multiplier (vs. English)',
    s4_table_headers: ['Language', 'Words (W)', 'BPE Tokens (T)', 'Fertility (T/W)', 'Attention FLOPs (vs EN)'],
    s4_bantu_title: 'Can We Build Something Better Than Naive BPE for Bantu Languages?',
    s4_bantu_body:
      'Tshiluba, Lingala, Swahili, and Kikongo are **agglutinative Bantu languages**: words assemble cleanly as `prefix + root + extension + final vowel`:\n- **Tshiluba (`-long-` = learn):** `ku-long-a` *(to learn)* · `ku-long-esh-a` *(to teach)* · `mu-long-esh-i` *(teacher)*\n- **Lingala (`-yekol-` = learn):** `ko-yekol-a` *(to learn)* · `ko-yekol-is-a` *(to teach)* · `mo-yekol-i` *(student)*\n\nEnglish BPE slices `kulongesha` into `["ku", "lo", "ng", "es", "ha"]` — destroying the shared root `-long-` and charging a **5.44x attention tax**!',
    s4_research:
      '**OPEN STUDENT THESIS DIRECTIONS ON TOKENIZATION:**\n1. **Adapting a pretrained model without retraining from zero:** Extend $V$ with high-utility Bantu morphemes + initialize new embedding rows via constituent subword averages or cross-lingual alignment (FOCUS / WECHSEL).\n2. **Beyond BPE:** Morpheme-aware **Unigram LM** segmentation, or **Byte Latent Transformers (BLT)** that group bytes dynamically by entropy rather than English frequency tables.',

    s5_title: 'Pillar 3: What Is an Embedding — Across Text, Image, Audio & Video?',
    s5_intro:
      'Token IDs like `t = 1482` are arbitrary labels: ID `1483` is no closer in meaning to `1482` than ID `9`. To do calculus and reasoning, we map every discrete unit into a continuous vector space $\\mathbb{R}^d$. **That vector is an embedding.**',
    s5_math_intuition:
      '**The Simple Mathematical Idea:** An embedding function $\\phi : \\mathcal{X} \\to \\mathbb{R}^d$ assigns each input $d$ coordinates so that **semantic similarity becomes geometric angle** (cosine similarity):',
    s5_modalities_title: 'Why Embeddings Are the Universal Bridge Across Every Modality',
    s5_modalities_table: [
      ['Modality', 'Raw Signal X', 'Basic Unit ("Token")', 'Projection into Shared R^d'],
      ['Text', 'Characters / Unicode', 'Subword / Morpheme ID t', 'Lookup row: e = E[t] in R^d'],
      ['Image', 'Pixel grid H x W x 3', '2D Patch (e.g. 16x16 pixels)', 'Linear patch projection: e = W_img * patch + pos'],
      ['Audio', '1D Waveform p(t)', 'Log-Mel frame / acoustic unit', 'Conv + Encoder projection: e = f_aud(frame) in R^d'],
      ['Video', 'Frames T x H x W x 3', '3D Spatiotemporal tubelet', 'Tubelet projection: e = W_vid * tubelet + pos_3d'],
    ],
    s5_trace_intro:
      '**Live Trace Demo #3 — One Shared Geometry Across 4 Modalities:** Contrastive training pulls matching concepts together ($\\cos\\theta \\to 1$) and pushes unrelated concepts apart ($\\cos\\theta \\to 0$). Step through this cross-modal loop around **"Water / Mâyi / Mai"**:',
    s5_plot_title: 'Shared Multimodal & Multilingual Embedding Space in R^2 (Projection)',
    s5_why_walk_first:
      '**Look at what just happened in the Environment panel:**\n- Aligned Tshiluba text `"mâyi"`, Lingala speech `"mai"`, a Congo River image patch, and a pouring-water video tubelet all align at **cosine similarity 0.89–0.96**!\n- Meanwhile, unadapted BPE-shattered `"mâyi"` sits at **0.19** — geometric noise! With embeddings, **Text, Images, Audio, and Video all speak the exact same linear algebra.**',

    s6_title: 'Pillar 4: Your LLM Has Two Memories — Weights vs. Context & Speech',
    s6_intro:
      'Now write the conditional probability distribution with its learned parameters $\\theta$ explicit: **$p_\\theta(\\text{answer} \\mid \\text{context})$**. There are **only two places** where knowledge can live:',
    s6_two_memories_explain:
      '1. **Non-parametric memory (`context`, right of `|` — *the binder*):** RAG, GraphRAG, MCP, tools, agent memory. Strip away the buzzwords and **every single one pastes tokens into the context window**. You pay $\\mathcal{O}(n^2)$ rent on every call, long contexts suffer *Context Rot* (in our NLDB 2024 study, 500 targeted words beat full 5,900-word papers!), and reading is transient: $T&#95;{W}(c, x) = T&#95;{W + \\Delta W}(x)$ discards $\\Delta W$ the instant the call ends.\n2. **Parametric memory ($\\theta$, *the weights*):** Updated via gradient descent or **LoRA** ($W\' = W + BA$, $r \\ll \\min(d,k)$). **Context holds what you can write on a page; weights hold skills, grammar, and phonology you can only learn from examples.**',
    s6_lora_trace:
      '**Live Trace Check — Why Open Weights + LoRA Changed Student Economics:** Let us compute the exact trainable parameter ratio for a $4096 \\times 4096$ Transformer projection with rank $r = 8$:',
    s6_speech_title: 'Low-Resource Congolese Speech Recognition (ASR) & Speech Translation',
    s6_speech_body:
      'Why do **open weights ($\\theta$)** matter so deeply in the DRC? Because millions of Congolese communicate primarily **by voice** in Lingala, Tshiluba, Swahili, and Kikongo — and you cannot teach tonal speech acoustics by pasting a prompt into a closed API!\n\nIn **LiSTra** (first English-to-Lingala speech translation baseline), we showed how cascaded pipelines (`Audio → ASR → Text → MT`) compound errors when orthography is scarce, whereas direct acoustic encoders map speech frames straight into shared semantic embeddings:',
    s6_speech_frontier:
      '**Wide-Open Speech Research for UNH Students:** Standard discrete speech tokenizers (HuBERT / w2v-BERT $k$-means units) trained on English discard **pitch and tone contours** that distinguish words and verb tenses in Bantu languages. Building **tone-preserving speech encoders** + human-verified benchmarks (**IrokoBench**, **INJONGO**) is frontier science you can lead right here.',

    s7_title: 'Where I Am Up To: Africa AI 100, SALELA BONGO LLC & DarAkili',
    s7_homecoming:
      'Coming home to **Lubumbashi** — where my own BSc in Mathematics and Computer Science began — to share these foundations with you at **Université Nouveaux Horizons** means everything to me.',
    s7_recognition_body:
      'This month, I was honoured to be recognised in the inaugural **Africa AI 100 (2026)** by the **Oxford Global Think Tank** — **Portrait 24/100: *"Computing in Tshiluba"*** in *The Languages* field, alongside heroes, mentors, and colleagues **Vukosi Marivate**, **Moustapha Cisse**, **Jade Abbott**, **Kathleen Siminyu**, **Bonaventure F. P. Dossou**, and **Deborah Dormah Kanubala**.\n\nAs a native **Tshiluba** speaker from **Kananga**, my path started with **Masakhane** (*"we build together"*) on participatory machine translation (2020) and **LiSTra** (English-to-Lingala speech translation).',
    s7_core_question:
      '**THE QUESTION THAT DRIVES WHAT I BUILD TODAY:** The Africa AI 100 report describes our field as *"giving African voices a place in the machine."* The next question is ours: **once machines speak our languages, who gets to learn how to build them?**',
    s7_darakili:
      'Most Africans speak at least two languages — often because our mother tongue alone rarely opens the door to university or work. **Language should never be a gate to knowledge.**\n\nThat is why, through my company **SALELA BONGO LLC**, I have been building **DarAkili** (`darakili.com`) with my friend **N\'Dah Jean Kouagou, PhD**. We teach STEM, programming — and next, **AI and Machine Learning** — directly in **Lingala, Tshiluba, and Swahili**.',
    s7_audio_human:
      '**Audio-First, Built by Humans:** Lessons on DarAkili are primarily audio + clear visuals so researchers and engineers in Lubumbashi, Kinshasa, Kananga, and the diaspora can contribute without heavy video production. **Only humans can do this work today** — even frontier LLMs still cannot teach accurately in most Congolese languages.',
    s7_closing:
      '**FOUR COMMITMENTS AS YOU LEAVE THIS HALL AT UNH LUBUMBASHI:**\n1. **Crawl & Walk with Mathematical Rigor:** Master $P(y \\mid x)$, BPE, embeddings in $\\mathbb{R}^d$, and classical ML alongside deep learning.\n2. **Design Better Conditions & Train Both Memories:** Use context for fast-changing facts and open weights ($\\theta$, LoRA) for Congolese language & speech capabilities.\n3. **Own Foundational Research:** Better Bantu tokenizers beyond BPE, tone-aware speech translation, and clean open benchmarks.\n4. **Build Together (*Masakhane*):** Contribute open digital resources at **IndabaX DRC** and lessons on **DarAkili** (`darakili.com` · **SALELA BONGO LLC**) — so youth across Congo **build** the machines of tomorrow. *Tuasakidila · Matondo · Aksanti · Thank you!*',
  },

  fr: {
    s1_title: "Apprendre à l'ère des LLM : Ramper, marcher, courir, voler — Raccourcis vs Fondations",
    s1_venue:
      '**Deep Learning IndabaX R.D. Congo 2026** · **Université Nouveaux Horizons (UNH), Lubumbashi** · Vendredi 27 novembre 2026',
    s1_speaker:
      '**Salomon Kabongo, PhD** — Chercheur en IA & Lead Software Engineer · Fondateur de **SALELA BONGO LLC** · Co-créateur de **DarAkili**',
    s1_poster_caption:
      'IndabaX R.D. Congo 2026 à l’Université Nouveaux Horizons, Lubumbashi (26–28 novembre 2026) — « Intelligence artificielle et langues congolaises : Construire des ressources numériques ouvertes ».',
    s1_wave_title: "La vague des LLM a transformé la recherche et le logiciel en un éclair",
    s1_research_boom:
      "**1. Explosion du volume de publications scientifiques :** Dans les grandes conférences d'IA, les soumissions ont doublé en quelques cycles — **NeurIPS 2025 a atteint 21 575 soumissions**, **ICLR est passé d'environ 7 400 (2024) à plus de 11 600 (2025)**, et **ACL a atteint 4 407 soumissions principales en 2024** (+536 % en dix ans). Près d'**1 article sur 5 (>20 %)** dans les grandes conférences de ML porte désormais explicitement « LLM » dans son titre ou son résumé.",
    s1_plot_title: 'Explosion des soumissions dans les grandes conférences IA',
    s1_appstore_boom:
      "**2. Raz-de-marée sur l'App Store et Google Play :** Plus de **1 000 nouvelles applications IA** sont publiées *chaque mois* sur Apple App Store et Google Play (~29 000+ titres cumulés selon Appfigures). Les téléchargements mondiaux d'apps d'IA générative sont passés de **1,5 milliard (2024)** à **3,8 milliards (2025)**, et les dépenses in-app de **455 M USD (2023) → 1,3 Md USD (2024) → 5 Md+ USD (2025)** (Sensor Tower) — dont ~40 % captés par de simples interfaces « wrappers ».",
    s1_history_title: "L'histoire se répète : souvenez-vous du Deep Learning face au ML classique",
    s1_history_body:
      "Lorsque le Deep Learning a explosé (2012–2018), beaucoup d'étudiants ont abandonné le **Machine Learning classique** — **régression linéaire/logistique, arbres de décision, Random Forests et XGBoost** — jugés « dépassés ».\n\nPourtant, **Grinsztajn, Oyallon & Varoquaux (NeurIPS 2022)** ont évalué 45 jeux de données tabulaires et prouvé une réalité solide : **les Random Forests et Gradient Boosted Trees surpassent encore le Deep Learning sur les données tabulaires** — plus rapides, moins coûteux et plus précis ! Et les chercheurs qui ont *inventé* les Transformers et LoRA maîtrisaient d'abord l'algèbre linéaire, les probabilités et le ML classique.",
    s1_history_takeaway:
      "**LA LEÇON D'AUJOURD'HUI :** Abandonner les probabilités, la tokenisation, les embeddings et le ML classique sous prétexte que les LLM sont partout serait exactement la même erreur.",
    s1_note: "Ouvrir fort avec les chiffres vérifiés (NeurIPS/ICLR/ACL, App Store/Google Play) puis le parallèle historique Deep Learning vs Random Forest.",

    s2_title: 'Ramper, marcher, courir, voler : Raccourcis vs Fondations',
    s2_paradox:
      "L'exécution technique n'a jamais été aussi rapide : dix lignes de Python suffisent pour télécharger un Transformer ouvert et le fine-tuner sur vos données, ou brancher un agent.",
    s2_shortcut_nuance:
      "**Soyons pragmatiques :** prendre une architecture pré-entraînée et l'adapter (*fine-tuning*) sur nos données est le grand raccourci actuel — et **ce raccourci a une vraie valeur !** En ingénierie, livrer vite une bonne base est essentiel.",
    s2_trap:
      "**Le piège pour les étudiants et chercheurs**, c'est de confondre ce raccourci avec la maîtrise. La tentation aujourd'hui est de sauter directement aux **agents autonomes, aux Transformers géants et au multimodal** — **vouloir voler avant d'apprendre à ramper et marcher**.",
    s2_stages_table: [
      ['Étape', 'Socle Mathématique', 'Ce que vous perdez en la sautant'],
      ['1. Ramper', 'Probabilité conditionnelle & Tokens', 'Les prompts ressemblent à de la magie au lieu de distributions conditionnées'],
      ['2. Marcher', 'Embeddings (R^d) & Attention', 'Impossible de diagnostiquer des représentations cassées entre langues/modalités'],
      ['3. Courir', 'Deux Mémoires : Poids vs Contexte', 'Vous payez un loyer O(n^2) en contexte sans jamais faire apprendre le modèle'],
      ['4. Voler', 'Tokeniseurs, Parole & Agents', 'Vous concevez des architectures adaptées aux langues congolaises et à la voix'],
    ],
    s2_takeaway:
      "**THÈSE :** Ramper et marcher construisent les muscles mathématiques qui permettent de **courir** puis de **voler**. Explorons ces quatre piliers en direct dans le code.",
    s2_note: 'Enchaîner directement sur le moteur probabiliste des LLM.',

    s3_title: 'Pilier 1 : Les LLM sont des machines à probabilité conditionnelle',
    s3_intro:
      'On entend souvent : *« Les LLM ne sont que des prédicteurs du mot suivant. »* Techniquement vrai, mais cela oublie le mot essentiel : **conditionnelle**.',
    s3_bar_intuition:
      "Quand un modèle prédit le token $x_t$, il ne demande pas *« quel mot vient d'habitude après ? »* mais *« quel token vient après, **sachant** tout ce qui se trouve à droite de la barre verticale `|` ? »*",
    s3_narrow_world:
      "**Ce que « sachant » (`|`) veut vraiment dire :** Conditionner, c'est **réduire le monde, puis recompter**. Parmi toutes les conversations possibles, on écarte celles où la condition $B$ est fausse, et on recompte $A$ dans ce qu'il reste :",
    s3_trace_intro:
      "**Démo Trace n°1 — Même requête, trois mondes différents :** Regardez le panneau Environnement (`🅴`) lorsque la requête reste identique (*« Suggère un nom »*) sur **200 conversations** et que **seule la condition $B$ change** :",
    s3_plot_title: 'P(nom | condition) : Même question, trois mondes conditionnés',
    s3_bayes_trap:
      'Deux lois fondamentales apparaissent en direct :\n1. `"Max"` vaut **12 %** en général, **34 %** sachant un *chiot (puppy)*, et **1 %** sachant une *startup cyber*. Le modèle n’a pas changé ; **la condition a changé**.\n2. **$P(A \\mid B) \\neq P(B \\mid A)$ :** $P(\\text{Max} \\mid \\text{puppy}) = 0,34$, mais $P(\\text{puppy} \\mid \\text{Max}) = 0,71$ !',
    s3_snowball_intro:
      "**Effet boule de neige autorégressif — Pourquoi les agents déraillent vite :** Chaque mot généré passe à droite de la barre `|` et devient *acquis* pour l'étape suivante. Parcourez cette boucle de 6 étapes avec une fiabilité unitaire $p = 0,85$ :",
    s3_takeaway:
      '> **« Prédiction du token suivant » décrit ce que fait le modèle. « Probabilité conditionnelle » décrit ce que vous contrôlez.** *(Laboratoires interactifs sur drkabongo.com)*',

    s4_title: 'Pilier 2 : BPE de zéro et la taxe cachée de tokenisation',
    s4_intro:
      "Regardons $P&#95;{\\theta}(x&#95;{t} \\mid x&#95;{1}, \\dots, x&#95;{t-1})$ : que sont les $x&#95;{i}$ ? Avant tout calcul matriciel, un **tokeniseur** découpe le texte en identifiants entiers d'un vocabulaire $V$. L'algorithme dominant est **Byte-Pair Encoding (BPE)**.",
    s4_bpe_how:
      '**Démo Trace n°2 — Comment BPE fusionne les paires étape par étape :** BPE part des caractères individuels et fusionne à chaque tour la **paire adjacente la plus fréquente**. Exécutons 4 fusions sur des racines bantoues (`"kulonga"`, `"kulongesha"`) :',
    s4_tax_question:
      "**La question décisive :** Que se passe-t-il quand ces fusions ont été apprises à **90 % sur de l'anglais**, et qu'on applique ce tokeniseur figé au **tshiluba**, au **lingala** ou au **swahili** ?",
    s4_tax_demo_intro:
      'Mesurons la **fertilité** ($f_L = T_L / W_L$ tokens par mot) et le **coût quadratique de l’attention** ($\\mathcal{C} \\propto T_L^2$) sur la même phrase — *« La langue ne doit jamais être une barrière au savoir »* :',
    s4_plot_title: 'Fertilité BPE & Multiplicateur quadratique d’attention (vs Anglais)',
    s4_table_headers: ['Langue', 'Mots (W)', 'Tokens BPE (T)', 'Fertilité (T/W)', 'Coût Attention (vs EN)'],
    s4_bantu_title: 'Peut-on faire mieux que BPE naïf pour les langues bantoues ?',
    s4_bantu_body:
      'Le tshiluba, le lingala, le swahili et le kikongo sont **agglutinants** (`préfixe + racine + extension + voyelle finale`) :\n- **Tshiluba (`-long-` = apprendre) :** `ku-long-a` *(apprendre)* · `ku-long-esh-a` *(enseigner)* · `mu-long-esh-i` *(enseignant)*\n- **Lingala (`-yekol-` = apprendre) :** `ko-yekol-a` *(apprendre)* · `ko-yekol-is-a` *(enseigner)* · `mo-yekol-i` *(étudiant)*\n\nBPE découpe `kulongesha` en `["ku", "lo", "ng", "es", "ha"]` — brisant la racine `-long-` et infligeant une **taxe d’attention de 5,44x** !',
    s4_research:
      "**SUJETS DE MÉMOIRE & RECHERCHE POUR L'UNH :**\n1. **Adapter un LLM pré-entraîné sans repartir de zéro :** Étendre $V$ avec des morphèmes bantous + initialiser les nouveaux embeddings par alignement interlingue (FOCUS / WECHSEL).\n2. **Au-delà de BPE :** Segmentation morphologique + **Unigram LM**, ou **Byte Latent Transformers (BLT)** guidés par l'entropie.",

    s5_title: "Pilier 3 : Qu'est-ce qu'un Embedding — Texte, Image, Audio & Vidéo ?",
    s5_intro:
      "Un identifiant `t = 1482` n'est qu'une étiquette arbitraire. Pour calculer et raisonner, on projette chaque unité discrète dans un espace vectoriel continu $\\mathbb{R}^d$. **Ce vecteur est un embedding.**",
    s5_math_intuition:
      "**L'intuition mathématique simple :** Une fonction d'embedding $\\phi : \\mathcal{X} \\to \\mathbb{R}^d$ attribue $d$ coordonnées à chaque objet pour que **la proximité de sens devienne un angle géométrique** (similarité cosinus) :",
    s5_modalities_title: 'Pourquoi les Embeddings unifient toutes les modalités',
    s5_modalities_table: [
      ['Modalité', 'Signal brut X', 'Unité de base (« Token »)', 'Projection vers R^d partagé'],
      ['Texte', 'Caractères Unicode', 'Sous-mot / Morphème t', 'Table E : e = E[t] dans R^d'],
      ['Image', 'Grille de pixels HxWx3', 'Patch 2D (ex. 16x16 pixels)', 'Projection linéaire : e = W_img * patch + pos'],
      ['Audio', 'Onde sonore 1D p(t)', 'Trame log-Mel / unité vocale', 'Conv + Encodeur : e = f_aud(trame) dans R^d'],
      ['Vidéo', 'Flux T x H x W x 3', 'Tubelet spatio-temporel 3D', 'Projection 3D : e = W_vid * tubelet + pos_3d'],
    ],
    s5_trace_intro:
      '**Démo Trace n°3 — Une même géométrie pour les 4 modalités :** L’apprentissage contrastif rapproche dans $\\mathbb{R}^d$ le texte, l’image, l’audio et la vidéo d’un même concept ($\\cos\\theta \\to 1$). Parcourez cette boucle autour de **« Eau / Mâyi / Mai »** :',
    s5_plot_title: 'Espace d’embeddings multimodal et multilingue partagé dans R^2',
    s5_why_walk_first:
      "**Observez le résultat dans l'Environnement :**\n- Le texte tshiluba aligné `« mâyi »`, l'audio lingala `« mai »`, le patch photo du fleuve Congo et la vidéo d'eau versée s'alignent tous à **similarité cosinus 0,89–0,96** !\n- À l'inverse, `« mâyi »` brisé par un BPE non adapté plafonne à **0,19**. Avec les embeddings, **texte, image, audio et vidéo parlent exactement la même algèbre linéaire.**",

    s6_title: 'Pilier 4 : Les deux mémoires des LLM — Poids vs Contexte & Parole',
    s6_intro:
      "Écrivons maintenant les paramètres $\\theta$ explicitement : **$p_\\theta(\\text{réponse} \\mid \\text{contexte})$**. Il n'existe que **deux mémoires** modifiables :",
    s6_two_memories_explain:
      "1. **Mémoire non-paramétrique (`contexte`, à droite de `|` — *le classeur*) :** RAG, GraphRAG, MCP, outils, mémoire d'agent. Retirez les étiquettes : **tous finissent par coller des tokens dans la fenêtre de contexte**. Vous payez un loyer $\\mathcal{O}(n^2)$ à chaque appel, les longs contextes se dégradent (*Context Rot* — dans notre étude NLDB 2024, 500 mots ciblés battaient l'article entier de 5 900 mots !), et $T&#95;{W}(c,x) = T&#95;{W+\\Delta W}(x)$ oublie $\\Delta W$ sitôt l'appel terminé.\n2. **Mémoire paramétrique ($\\theta$, *les poids*) :** Mise à jour par descente de gradient ou **LoRA** ($W' = W + BA$, $r \\ll \\min(d,k)$). **Le contexte retient ce qui s'écrit sur une fiche ; les poids retiennent la grammaire, les tons et le savoir-faire appris par l'exemple.**",
    s6_lora_trace:
      "**Vérification en direct — L'économie de LoRA sur GPU unique :** Calculons la réduction de paramètres entraînables pour une matrice $4096 \\times 4096$ avec un rang $r = 8$ :",
    s6_speech_title: 'Reconnaissance (ASR) et traduction vocales peu dotées en RDC',
    s6_speech_body:
      "Pourquoi l'accès aux **poids ouverts ($\\theta$)** est-il vital au Congo ? Parce que nos langues se vivent d'abord **à l'oral**, et qu'on ne peut pas enseigner l'acoustique tonale du lingala ou du tshiluba dans un prompt !\n\nAvec **LiSTra** (traduction vocale anglais-lingala), nous avons montré comment la cascade (`Audio → ASR → Texte → MT`) multiplie les erreurs quand l'orthographe varie, alors qu'un encodeur acoustique direct projette la voix vers le sens :",
    s6_speech_frontier:
      "**Frontière de recherche à l'UNH :** Les unités acoustiques discrètes (HuBERT / w2v-BERT) entraînées sur l'anglais écrasent **les tons lexicaux et grammaticaux** essentiels aux langues bantoues. Créer des **encodeurs vocaux sensibles aux tons** et des benchmarks rigoureux (**IrokoBench**, **INJONGO**) est une opportunité scientifique majeure.",

    s7_title: 'Ce que je construis aujourd’hui : Africa AI 100, SALELA BONGO LLC & DarAkili',
    s7_homecoming:
      "Revenir à **Lubumbashi** — où mon propre parcours universitaire en mathématiques et informatique a commencé — pour partager ces fondations avec vous à l'**Université Nouveaux Horizons** compte énormément pour moi.",
    s7_recognition_body:
      "Ce mois-ci, j'ai eu l'honneur d'être distingué dans la liste inaugurale **Africa AI 100 (2026)** de l'**Oxford Global Think Tank** — **Portrait 24/100 : *« Computing in Tshiluba »*** (*The Languages*), aux côtés de mentors et collègues admirés : **Vukosi Marivate**, **Moustapha Cisse**, **Jade Abbott**, **Kathleen Siminyu**, **Bonaventure F. P. Dossou** et **Deborah Dormah Kanubala**.\n\nLocuteur natif du **tshiluba** originaire de **Kananga**, mon chemin a débuté avec **Masakhane** (*« nous construisons ensemble »*, 2020) et **LiSTra** (traduction vocale anglais-lingala).",
    s7_core_question:
      "**LA QUESTION QUI GUIDE MES PROJETS AUJOURD'HUI :** Le rapport Africa AI 100 parle de *« donner aux voix africaines une place dans la machine »*. La question suivante est la nôtre : **une fois que les machines parlent nos langues, qui a accès au savoir pour les construire ?**",
    s7_darakili:
      "La plupart des Africains parlent deux à quatre langues — souvent parce que notre langue maternelle seule ouvre rarement les portes de l'université. **La langue ne doit jamais être une barrière au savoir.**\n\nC'est pourquoi, au sein de mon entreprise **SALELA BONGO LLC**, je développe **DarAkili** (`darakili.com`) avec mon ami **N'Dah Jean Kouagou, PhD**. Nous y enseignons les STEM, la programmation — et bientôt **l'IA et le Machine Learning** — en **lingala, tshiluba et swahili**.",
    s7_audio_human:
      "**Audio d'abord, porté par l'humain :** Les leçons DarAkili sont centrées sur l'audio et des visuels clairs afin que les experts à Lubumbashi, Kinshasa, Kananga et dans la diaspora puissent contribuer sans studio vidéo. **Seuls les humains peuvent transmettre cela aujourd'hui.**",
    s7_closing:
      "**QUATRE ENGAGEMENTS EN QUITTANT CETTE SALLE À L'UNH LUBUMBASHI :**\n1. **Ramper et marcher avec rigueur :** Maîtrisez $P(y \\mid x)$, BPE, les embeddings dans $\\mathbb{R}^d$ et le ML classique aux côtés du Deep Learning.\n2. **Soignez la condition et utilisez les deux mémoires :** Le contexte pour les faits du jour, les poids ouverts ($\\theta$, LoRA) pour nos langues et nos données.\n3. **Menez une recherche fondamentale utile :** Tokeniseurs bantous au-delà de BPE, traduction vocale tonale et benchmarks ouverts.\n4. **Bâtissons ensemble (*Masakhane*) :** Contribuez à **IndabaX RDC** et rejoignez **DarAkili** (`darakili.com` · **SALELA BONGO LLC**) pour que la jeunesse congolaise **construise** ces technologies. *Tuasakidila · Matondo · Aksanti · Merci !*",
  },

  ln: {
    s1_title: 'Koyekola na tango ya ba LLM : Kolanda, kotambola, kopota, kopumbwa — Nzela ya mokuse vs Miboko',
    s1_venue:
      '**Deep Learning IndabaX R.D. Congo 2026** · **Université Nouveaux Horizons (UNH), Lubumbashi** · Misato ya mitano 27 novembre 2026',
    s1_speaker:
      '**Salomon Kabongo, PhD** — Chercheur na AI & Lead Software Engineer · Mokeli ya **SALELA BONGO LLC** · Motongi ya **DarAkili**',
    s1_poster_caption:
      'IndabaX R.D. Congo 2026 na Université Nouveaux Horizons, Lubumbashi (26–28 novembre 2026).',
    s1_wave_title: 'Mbonge ya ba LLM ebongoli recherche pe logiciel mbala moko',
    s1_research_boom:
      '**1. Bapublication ya recherche emati mingi :** **NeurIPS 2025 ezwaki ba soumissions 21,575**, **ICLR emataki uta ~7,400 (2024) tii 11,600+ (2025)**, pe **ACL 2024 ezwaki 4,407** (+536% na mbula zomi). Pene ya **article 1 likolo ya 5 (>20%)** na ba conférences minene ezali na « LLM » na titre (Stanford HAI AI Index).',
    s1_plot_title: 'Komata ya ba soumissions na ba conférences minene ya AI',
    s1_appstore_boom:
      '**2. Apple App Store & Google Play :** Ba apps ya AI koleka **1,000 ya sika** ezali kobima *sanza nionso* (Appfigures). Ba téléchargements emataki uta **1.5 milliard (2024)** tii **3.8 milliards (2025)** pe mbongo uta **455M USD (2023) → 1.3Md USD (2024) → 5Md+ USD (2025)** (Sensor Tower).',
    s1_history_title: 'Tala lisolo ya kala : Deep Learning liboso ya ML ya kala',
    s1_history_body:
      'Tango Deep Learning eyaki (2012–2018), bato mingi batikaki **Régression, Random Forests pe XGBoost**. Kasi **Grinsztajn et al. (NeurIPS 2022)** balakisaki na ba datasets 45 ete **Random Forests pe XGBoost eleki Deep Learning na ba données tabulaires** ! Kotika miboko lelo mpo na ba LLM ezali libunga moko.',
    s1_history_takeaway:
      '**LITEA :** Koyeba miboko (probabilité, tokens, embeddings, ML ya kala) nde ebatelaka yo.',
    s1_note: 'Banda na mituya ya solo ya NeurIPS/ICLR/App Store pe bokokanisi na Random Forest.',

    s2_title: 'Kolanda, kotambola, kopota, kopumbwa : Nzela ya mokuse vs Miboko',
    s2_paradox: 'Lelo kosalela Transformer ekomi mbangu mingi na milongo zomi ya Python.',
    s2_shortcut_nuance:
      '**Bosolo :** kozwa modèle oyo esilaki koteyama pe kosala *fine-tuning* na ba données na biso ezali nzela ya mokuse ya motuya mingi ! Kasi moyekoli asengeli kosuka wana te.',
    s2_trap:
      '**Motambo :** koluka kolobela mbala moko **ba agents pe multimodal** kozanga koyeba probabilité conditionnelle, tokens, embeddings pe gradients.',
    s2_stages_table: [
      ['Etape', 'Moboko ya Math', 'Litomba na yango'],
      ['1. Kolanda', 'Probabilité conditionnelle & Tokens', 'Kososola P(y | contexte) pe ndenge BPE ekabolaka maloba'],
      ['2. Kotambola', 'Ba Embeddings (R^d) & Attention', 'Koyeba géométrie ya makomi, elili, mongongo pe vidéo'],
      ['3. Kopota', 'Ba Mémoires Mibale : Poids vs Contexte', 'Kokesenisa contexte (RAG) pe ba poids theta (LoRA)'],
      ['4. Kopumbwa', 'Ba Architectures ya Sika', 'Ba tokeniseurs ya Bantu, mongongo ya ton pe agents ya solo'],
    ],
    s2_takeaway: '**MOBOKO :** Miboko ya mathématiques nde epesaka mapapu ya kopumbwa.',
    s2_note: 'Kokota sikoyo na probabilité conditionnelle.',

    s3_title: 'Moboko 1 : Ba LLM ezali ba machines ya probabilité conditionnelle',
    s3_intro: 'Ba LLM ezali kaka « next-token predictors » te — ezali **ba machines ya probabilité conditionnelle**.',
    s3_bar_intuition: 'Elembo `|` elingi koloba **« na kotalela »** (*given*) : modèle etalaka nionso oyo ezali liboso na kati ya contexte.',
    s3_narrow_world: '**Ndimbola ya `|` :** Kokitisa mokili kaka epai condition $B$ ezali solo, sima kotanga lisusu :',
    s3_trace_intro: '**Démo Trace 1 — Motuna moko, mikili misato :** Tala ndenge $P(\\text{Max} \\mid B)$ ebongwanaka na Environnement (`🅴`) :',
    s3_plot_title: 'P(kombo | condition) : Motuna moko, contexte ekeseni',
    s3_bayes_trap: 'Simba mibeko mibale : `"Max"` ezali **12%** na général, **34%** na *puppy*, pe **1%** na *startup* ; mpe **$P(A \\mid B) \\neq P(B \\mid A)$** ($0.34 \\neq 0.71$) !',
    s3_snowball_intro: '**Libunga moko ebotaka mabunga :** Soki étape moko ezali na $p = 0.85$, sima ya étapes 6 ekiti na **37.7%** :',
    s3_takeaway: '> **« Probabilité conditionnelle » elakisaka eloko oyo yo nde okambaka.** *(drkabongo.com)*',

    s4_title: 'Moboko 2 : BPE kobanda ebandeli pe mpako ya lokota',
    s4_intro: 'Liboso ya calcul ya vecteurs, **Byte-Pair Encoding (BPE)** ekabolaka maloba na mituya.',
    s4_bpe_how: '**Démo Trace 2 — Ndenge BPE esangisaka ba paires étape na étape :** Tomeka ba fusions 4 likolo ya `"kulonga"` pe `"kulongesha"` :',
    s4_tax_question: 'Nini esalemaka tango BPE eteyamaki na Lingelesi pe tosaleli yango na **Tshiluba**, **Lingala** to **Swahili** ?',
    s4_tax_demo_intro: 'Tomeka **fertilité** ($T_L / W_L$) pe **ntalo ya attention** ($T_L^2$) na fraze moko :',
    s4_plot_title: 'Fertilité BPE pe ntalo ya Attention (vs Anglais)',
    s4_table_headers: ['Lokota', 'Maloba (W)', 'Tokens BPE (T)', 'Fertilité (T/W)', 'Attention (vs EN)'],
    s4_bantu_title: 'Tokoki kosala malamu koleka BPE mpo na minoko ya Bantu ?',
    s4_bantu_body: 'Minoko ya Bantu ezali na `préfixe + ntina + suffixe` (`ko-yekol-a`, `ko-yekol-is-a`, `mo-yekol-i` ; `ku-long-a`, `ku-long-esh-a`). BPE epanzaka ntina ya liloba pe ematisaka ntalo ya attention na **5.44x** !',
    s4_research: '**RECHERCHE MPO NA UNH :** Kobakisa morphèmes ya Bantu na vocabulaire, **Unigram LM**, to **Byte Latent Transformers**.',

    s5_title: 'Moboko 3 : Embedding ezali nini — Makomi, Elili, Mongongo pe Vidéo ?',
    s5_intro: '**Embedding** ezali vecteur $\\mathbf{e} \\in \\mathbb{R}^d$ epai boyokani ya ndimbola ekomaka angle géométrique ($\\cos\\theta$).',
    s5_math_intuition: '**Likanisi ya pɛtɛɛ :** $\\phi : \\mathcal{X} \\to \\mathbb{R}^d$ etie eloko nionso na espace moko mpo totanga $\\cos(\\theta)$ :',
    s5_modalities_title: 'Ndenge Modalité nionso ekomaka Embedding na R^d',
    s5_modalities_table: [
      ['Modalité', 'Signal X', 'Eteni (« Token »)', 'Projection na R^d'],
      ['Makomi', 'Makomi Unicode', 'Token ID t', 'e = E[t]'],
      ['Elili (Image)', 'Pixels HxWx3', 'Patch 16x16', 'e = W_img * patch + pos'],
      ['Mongongo (Audio)', 'Onde p(t)', 'Trame log-Mel', 'e = f_aud(trame)'],
      ['Vidéo', 'Frames TxHxWx3', 'Tubelet 3D', 'e = W_vid * tubelet + pos_3d'],
    ],
    s5_trace_intro: '**Démo Trace 3 — Makomi, Elili, Mongongo pe Vidéo na espace moko :** Tala boyokani $\\cos(\\theta)$ mpo na **« Mai / Mâyi / Water »** :',
    s5_plot_title: 'Espace ya Embeddings Multimodal pe Multilingue na R^2',
    s5_why_walk_first: 'Makomi `"mâyi"`, mongongo `"mai"`, elili ya ebale Congo pe vidéo ya mai ezali nionso na **0.89–0.96** ! Na ba embeddings, ba modalités nionso elobaka algèbre linéaire moko.',

    s6_title: 'Moboko 4 : Ba mémoires mibale ya LLM — Poids vs Contexte & Mongongo',
    s6_intro: 'Na **$p_\\theta(\\text{eyano} \\mid \\text{contexte})$**, boyebi efandaka na bisika mibale kaka :',
    s6_two_memories_explain: '1. **Contexte (classeur) :** RAG, MCP, agents — ofutaka $\\mathcal{O}(n^2)$ tango nionso pe modèle ebosanaka sima ya appel.\n2. **Ba poids $\\theta$ (LoRA $W\' = W + BA$) :** efandisaka lokota, morphologie pe mongongo na kati ya modèle.',
    s6_lora_trace: '**Calcul ya LoRA :** Matrice $4096 \\times 4096$ na $r = 8$ ekitisaka paramètres na **256x** :',
    s6_speech_title: 'Mongongo (ASR) pe Traduction ya mongongo na RDC',
    s6_speech_body: 'Na **LiSTra** (Lingelesi-Lingala), tomonisaki ndenge cascade ebakisaka mabunga, nzoka nde encodeur directe ebatelaka mongongo :',
    s6_speech_frontier: '**Sujet ya recherche :** Kobatela **ton ya mongongo ya Bantu** na ba unités acoustiques pe kosala ba benchmarks ya solo (**IrokoBench**, **INJONGO**).',

    s7_title: 'Mosala na ngai lelo : Africa AI 100, SALELA BONGO LLC & DarAkili',
    s7_homecoming: 'Kozonga na **Lubumbashi** — engumba epai boyekoli na ngai ya université ebandaki — mpo na kosolola na bino na **Université Nouveaux Horizons** ezali esengo monene.',
    s7_recognition_body:
      "Sanza oyo nazwaki lokumu ya kotangama na **Africa AI 100 (2026)** ya **Oxford Global Think Tank** — **Portrait 24/100 : *« Computing in Tshiluba »*** pembeni ya **Vukosi Marivate**, **Moustapha Cisse**, **Jade Abbott**, **Kathleen Siminyu**, **Bonaventure F. P. Dossou** pe **Deborah Dormah Kanubala**, sima ya mobembo na **Masakhane** (2020) pe **LiSTra**.",
    s7_core_question: '**MOTUNA YA NTINA :** **Tango ba machine ekoloba minoko na biso, nani akozwa boyebi ya kotonga yango ?**',
    s7_darakili:
      '**Lokota esengeli kozala epekiseli ya boyebi te.** Na nzela ya **SALELA BONGO LLC**, nazali kotonga **DarAkili** (`darakili.com`) elongo na **N\'Dah Jean Kouagou, PhD**, mpo na kolakisa STEM, code pe **AI** na **Lingala, Tshiluba pe Swahili**.',
    s7_audio_human: '**Mateya ya mongongo :** Bayebi ya Lubumbashi, Kinshasa, Kananga pe diaspora bakoki kopesa mateya na monoko na bango. **Kaka bato nde bakoki kosala yango lelo.**',
    s7_closing:
      '**BILAKA MINEI NA UNH LUBUMBASHI :**\n1. Boyekola miboko ($P(y\\mid x)$, BPE, embeddings, ML ya kala).\n2. Bosalela ba mémoires mibale (contexte + ba poids ouverts LoRA).\n3. Bobunda na recherche ya minoko pe mongongo ya Congo.\n4. Totonga elongo na **IndabaX DRC**, **Masakhane** pe **DarAkili** (`darakili.com` · **SALELA BONGO LLC**). *Matondo · Tuasakidila · Aksanti !*',
  },

  lua: {
    s1_title: 'Kulongesha mu tshikondo tshia ba LLM : Kulandakana, kuenda, kunyema, kubuka — Njila wa tshikoso vs Miboko',
    s1_venue:
      '**Deep Learning IndabaX R.D. Congo 2026** · **Université Nouveaux Horizons (UNH), Lubumbashi** · Ditanu 27 novembre 2026',
    s1_speaker:
      '**Salomon Kabongo, PhD** — Mukebuludi mu AI & Lead Software Engineer · Mufuki wa **SALELA BONGO LLC** · Muibaki wa **DarAkili**',
    s1_poster_caption:
      'IndabaX R.D. Congo 2026 ku Université Nouveaux Horizons, Lubumbashi (26–28 novembre 2026).',
    s1_wave_title: 'Mbonge wa ba LLM udi mushintulula recherche ne logiciel lubilu',
    s1_research_boom:
      '**1. Bapublication bia recherche biakabanda :** **NeurIPS 2025 yakapeta ba soumissions 21,575**, **ICLR yakabanda fuma ~7,400 (2024) too 11,600+ (2025)**, ne **ACL 2024 yakapeta 4,407** (+536% mu bidimu dikumi). **Article 1 pa 5 (>20%)** mu ba conférences banene udi ne « LLM » mu titre (Stanford HAI AI Index).',
    s1_plot_title: 'Dibanda dia ba soumissions mu ba conférences banene ba AI',
    s1_appstore_boom:
      '**2. Apple App Store & Google Play :** Ba apps ba AI bapita **1,000 bia mushya** bidi bipatuka *ngondo yonso* (Appfigures). Ba téléchargements biakabanda fuma **1.5 milliard (2024)** too **3.8 milliards (2025)** ne makuta fuma **455M USD (2023) → 1.3Md USD (2024) → 5Md+ USD (2025)** (Sensor Tower).',
    s1_history_title: 'Tangila muyuki wa kale : Deep Learning kumpala kua ML wa kale',
    s1_history_body:
      'Padi Deep Learning mukuya (2012–2018), bantu ba bungi bakalekela **Régression, Random Forests ne XGBoost**. Kadi **Grinsztajn et al. (NeurIPS 2022)** bakaleja pa ba datasets 45 ne **Random Forests ne XGBoost badi bapita Deep Learning pa ba données tabulaires** ! Kulekela miboko lelu bua ba LLM kudi tshilema tshimue.',
    s1_history_takeaway:
      '**DILONGESHA :** Kumanya miboko (probabilité, tokens, embeddings, ML wa kale) nde kudi kukukolesha.',
    s1_note: 'Banga ne bungi bua bushuwa bia NeurIPS/ICLR/App Store ne bokokanisi ne Random Forest.',

    s2_title: 'Kulandakana, kuenda, kunyema, kubuka : Njila wa tshikoso vs Miboko',
    s2_paradox: 'Lelu kuenza fine-tuning wa Transformer kudi kuangata milongo dikumi ya Python patupu.',
    s2_shortcut_nuance:
      '**Bulelela :** kuangata modèle mupunga ne kuenza *fine-tuning* pa données yetu kudi njila wa tshikoso wa mushinga ! Kadi mulongi kena ne bua kuimana apu to.',
    s2_trap:
      '**Buteyi :** kusua kuakula diakamue bua **ba agents ne multimodal** kakuyi kumanya probabilité conditionnelle, tokens, embeddings ne gradients.',
    s2_stages_table: [
      ['Etape', 'Muboko wa Math', 'Mushinga wende'],
      ['1. Kulandakana', 'Probabilité conditionnelle & Tokens', 'Kumvua P(y | contexte) ne mushindu BPE ukosolola miaku'],
      ['2. Kuenda', 'Ba Embeddings (R^d) & Attention', 'Géométrie wa mifundu, tshimfuanyi, dîyi ne vidéo'],
      ['3. Kunyema', 'Ba Mémoires Ibidi : Poids vs Contexte', 'Kushilangana kua contexte (RAG) ne ba poids theta (LoRA)'],
      ['4. Kubuka', 'Ba Architectures Mipiamipia', 'Ba tokeniseurs ba Bantu, dîyi dia ton ne agents ya bushuwa'],
    ],
    s2_takeaway: '**MUBOKO :** Miboko ya mathématiques nde idi ikupesha mapapu a kubuka.',
    s2_note: 'Kubuela mu probabilité conditionnelle.',

    s3_title: 'Muboko 1 : Ba LLM badi ba machines ba probabilité conditionnelle',
    s3_intro: 'Ba LLM ki anu « next-token predictors » patupu to — badi **ba machines ba probabilité conditionnelle**.',
    s3_bar_intuition: 'Tshimanyinu `|` tshidi tshiumvuija **« bilondeshile »** (*given*) : modèle udi utangila bionso bidi mu contexte.',
    s3_narrow_world: '**Umvuija wa `|` :** Kukepesha buloba anu muaba udi condition $B$ muikale wa bushuwa, pashishe kubala kabidi :',
    s3_trace_intro: '**Démo Trace 1 — Lukonko lumue, maloba asatu :** Tangila mushindu $P(\\text{Max} \\mid B)$ ushintuluka mu Environnement (`🅴`) :',
    s3_plot_title: 'P(dîna | condition) : Lukonko lumue, contexte mushilangane',
    s3_bayes_trap: 'Lama mikenji ibidi : `"Max"` udi **12%** mu général, **34%** ne *puppy*, ne **1%** ne *startup* ; ne **$P(A \\mid B) \\neq P(B \\mid A)$** ($0.34 \\neq 0.71$) !',
    s3_snowball_intro: '**Tshilema tshimue tshidi tshivudija bilema :** Bikala étape umue ne $p = 0.85$, panyima pa étapes 6 udi upueka ku **37.7%** :',
    s3_takeaway: '> **« Probabilité conditionnelle » udi uleja tshiudi wewe ulombola.** *(drkabongo.com)*',

    s4_title: 'Muboko 2 : BPE kubanga ku zéro ne mulambu wa muakulu',
    s4_intro: 'Kumpala kua calcul wa vecteurs, **Byte-Pair Encoding (BPE)** udi ukosolola miaku mu bungi.',
    s4_bpe_how: '**Démo Trace 2 — Mushindu BPE usangisha ba paires étape ku étape :** Tutete ba fusions 4 pa `"kulonga"` ne `"kulongesha"` :',
    s4_tax_question: 'Tshinyi tshidi tshienzeka padi BPE mulongeshibue pa Anglais ne tumusadila pa **Tshiluba**, **Lingala** anyi **Swahili** ?',
    s4_tax_demo_intro: 'Tupime **fertilité** ($T_L / W_L$) ne **mushinga wa attention** ($T_L^2$) pa muaku umue :',
    s4_plot_title: 'Fertilité BPE ne mushinga wa Attention (vs Anglais)',
    s4_table_headers: ['Muakulu', 'Miaku (W)', 'Tokens BPE (T)', 'Fertilité (T/W)', 'Attention (vs EN)'],
    s4_bantu_title: 'Tudi mua kuenza bimpe kupita BPE bua miakulu ya Bantu anyi ?',
    s4_bantu_body: 'Miakulu ya Bantu idi ne `préfixe + muji + suffixe` (`ku-long-a`, `ku-long-esh-a`, `mu-long-esh-i`). BPE udi utayisha muji `-long-` ne ubandisha mushinga wa attention ku **5.44x** !',
    s4_research: '**DIKEBULULA BUA UNH :** Kukumbaja morphèmes ya Bantu mu vocabulaire, **Unigram LM**, anyi **Byte Latent Transformers**.',

    s5_title: 'Muboko 3 : Embedding ntshinyi — Mifundu, Tshimfuanyi, Dîyi ne Vidéo ?',
    s5_intro: '**Embedding** udi vecteur $\\mathbf{e} \\in \\mathbb{R}^d$ muaba udi diumvuangana dia umvuija dilua angle géométrique ($\\cos\\theta$).',
    s5_math_intuition: '**Lungenyi lua pɛpɛlɛ :** $\\phi : \\mathcal{X} \\to \\mathbb{R}^d$ udi uteka tshintu tshionso mu espace umue bua kubala $\\cos(\\theta)$ :',
    s5_modalities_title: 'Mushindu Modalité yonso ulua Embedding mu R^d',
    s5_modalities_table: [
      ['Modalité', 'Signal X', 'Tshipese (« Token »)', 'Projection mu R^d'],
      ['Mifundu', 'Mifundu Unicode', 'Token ID t', 'e = E[t]'],
      ['Tshimfuanyi', 'Pixels HxWx3', 'Patch 16x16', 'e = W_img * patch + pos'],
      ['Dîyi (Audio)', 'Onde p(t)', 'Trame log-Mel', 'e = f_aud(trame)'],
      ['Vidéo', 'Frames TxHxWx3', 'Tubelet 3D', 'e = W_vid * tubelet + pos_3d'],
    ],
    s5_trace_intro: '**Démo Trace 3 — Mifundu, Tshimfuanyi, Dîyi ne Vidéo mu espace umue :** Tangila $\\cos(\\theta)$ bua **« Mâyi / Mai / Water »** :',
    s5_plot_title: 'Espace wa Embeddings Multimodal ne Multilingue mu R^2',
    s5_why_walk_first: 'Mifundu `"mâyi"`, dîyi `"mai"`, tshimfuanyi tshia musulu wa Congo ne vidéo ya mâyi bidi bionso ku **0.89–0.96** ! Ne ba embeddings, ba modalités yonso idi yakula algèbre linéaire umue.',

    s6_title: 'Muboko 4 : Ba mémoires ibidi ba LLM — Poids vs Contexte & Dîyi',
    s6_intro: 'Mu **$p_\\theta(\\text{diandamuna} \\mid \\text{contexte})$**, dimanya didi dishala mu miaba ibidi kaka :',
    s6_two_memories_explain: '1. **Contexte (classeur) :** RAG, MCP, agents — udi ufuta $\\mathcal{O}(n^2)$ misangu yonso ne modèle udi upua muoyo panyima pa appel.\n2. **Ba poids $\\theta$ (LoRA $W\' = W + BA$) :** udi ulama muakulu, morphologie ne dîyi munda mua modèle.',
    s6_lora_trace: '**Calcul wa LoRA :** Matrice $4096 \\times 4096$ ne $r = 8$ udi ukepesha paramètres ku **256x** :',
    s6_speech_title: 'Dîyi (ASR) ne Traduction wa dîyi mu RDC',
    s6_speech_body: 'Mu **LiSTra** (Anglais-Lingala), tuakaleja mushindu cascade uvudija bilema, pende encodeur directe ulama umvuija wa dîyi :',
    s6_speech_frontier: '**Mudimu wa dikebulula :** Kulama **ton wa dîyi dia Bantu** mu ba unités acoustiques ne kuenza ba benchmarks ba bushuwa (**IrokoBench**, **INJONGO**).',

    s7_title: 'Mudimu wanyi lelu : Africa AI 100, SALELA BONGO LLC & DarAkili',
    s7_homecoming: 'Kupingana ku **Lubumbashi** — tshimenga tshivua dilonga dianyi dia université dibange — bua kuyukila nenu ku **Université Nouveaux Horizons** kudi ne mushinga munene kundi.',
    s7_recognition_body:
      "Ngondo eu ndi muangate buneme mu **Africa AI 100 (2026)** kudi **Oxford Global Think Tank** — **Portrait 24/100 : *« Computing in Tshiluba »*** pamue ne **Vukosi Marivate**, **Moustapha Cisse**, **Jade Abbott**, **Kathleen Siminyu**, **Bonaventure F. P. Dossou** ne **Deborah Dormah Kanubala**, panyima pa **Masakhane** (2020) ne **LiSTra**.",
    s7_core_question: '**LUKONKO LUA MUSHINGA :** **Padi ba machine bakula miakulu yetu, nganyi udi upeta dimanya dia kuyibaka ?**',
    s7_darakili:
      '**Muakulu kawena ne bua kuikala tshibikilu tshia dimanya to.** Mu kompanyi wanyi **SALELA BONGO LLC**, ndi ngibaka **DarAkili** (`darakili.com`) pamue ne **N\'Dah Jean Kouagou, PhD**, bua kulongesha STEM, code ne **AI** mu **Lingala, Tshiluba ne Swahili**.',
    s7_audio_human: '**Malongesha a dîyi kumpala :** Bamanyi ba ku Lubumbashi, Kinshasa, Kananga ne diaspora badi mua kufila malongesha mu muakulu wabu. **Anu bantu nde badi mua kuenza mudimu eu lelu.**',
    s7_closing:
      '**MALU ANAYI A KULAMA KU UNH LUBUMBASHI :**\n1. Longayi miboko ($P(y\\mid x)$, BPE, embeddings, ML wa kale).\n2. Sadilayi ba mémoires ibidi (contexte + ba poids ouverts LoRA).\n3. Kuatayi dikebulula dia miakulu ne dîyi bia mu Congo.\n4. Tuibakayi pamue ku **IndabaX DRC**, **Masakhane** ne **DarAkili** (`darakili.com` · **SALELA BONGO LLC**). *Tuasakidila · Matondo · Aksanti !*',
  },
}
