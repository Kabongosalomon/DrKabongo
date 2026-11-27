"""Learning in the Era of LLM — IndabaX D.R. Congo 2026. How to edit: see README.md."""

# fmt: off
# Keep this layout: a code formatter would move the `# @inspect` comments off their
# lines, and the live values would disappear from the slides.
from __future__ import annotations

from edtrace import image, link, plot, text
from references import (
    AFRICA_AI_100,
    AGENT_SKILLS,
    ATTENTION,
    BIBLETTS,
    BLEU,
    BLOG_CONDITIONAL_PROBABILITY,
    BLOG_TWO_MEMORIES,
    CHRF,
    DARAKILI,
    INJONGO,
    IROKOBENCH,
    JOSHI,
    LATENT_SPACE,
    LISTRA,
    LLAMA_CPP,
    LORA,
    MASAKHANE,
    MCP,
    MENLO_2024,
    OLLAMA,
    RA_DIT,
    RAG,
    SENNRICH_BPE,
    TIKTOKEN,
    TOOLFORMER,
)
from talk_kit import (
    bpe_step,
    chrf_score,
    cosine,
    memory_chart,
    t,
    together,
    token_tax_chart,
    token_tax_table,
)


def table_of_contents() -> None:
    most_inventions_answer_a_limit()
    how_our_languages_became_low_resource()
    models_learn_by_counting()
    the_tokenization_tax()
    embeddings_and_cosine_similarity()
    metrics_that_miss_our_languages()
    local_llms_on_your_own_machine()
    masakhane_we_build_together()
    darakili_life_in_our_languages()
    a_science_behind_every_limit()


def most_inventions_answer_a_limit() -> None:
    with together():
        image("images/indabax-drc-2026.jpg", style={"float": "right"}, width="38%")
        text(t("title", """
            # Learning in the Era of LLM

            **How did our languages become “low-resource”?**

            **Dr. Kabongo** · Deep Learning IndabaX D.R. Congo 2026 · UNH Lubumbashi · 27 November 2026
        """))
        image(t("talk_qr_image", "images/qr-talk-en.png"), width="24%")
        text(t("scan_title", """
            **Scan to get and access this presentation**  
            [drkabongo.com/speaking/learning-in-the-llm-era](https://drkabongo.com/speaking/learning-in-the-llm-era)
        """))
    text(t("inventions", """
        ## Most invention is engineering’s answer to a limit

        | The limit | The engineering answer | The science underneath |
        | --- | --- | --- |
        | A voice does not carry far | Telephone, radio | Electromagnetism |
        | We compute slowly | Computers | Logic, semiconductor physics |
        | Too many rules to write by hand | Machine learning | Probability, optimisation |
        | Our languages are missing online | Open digital resources | Linguistics, statistics |
    """))
    text(t("three_questions", """
        ### Three questions for every new buzzword

        1. Which **limit** does it answer?
        2. What is the **engineering** move?
        3. What **science** is underneath?
    """))
    with together():
        text(t("llm_era", """
            ### The same pattern in the LLM era

            | Name | The problem | Engineering solution |
            | --- | --- | --- |
            | RAG | Knowledge is frozen; your documents are missing | Search, then paste into the context |
            | Tools | A model only writes text; it cannot act | The model writes a request, your code runs it |
            | MCP | Every app needs its own connector to every tool | One open protocol |
            | Skills, plugins, custom GPTs | We repeat instructions; the context is limited | Saved instructions and files, loaded when needed |
        """))
        link(RAG)
        link(RA_DIT)
        link(TOOLFORMER)
        link(MCP)
        link(AGENT_SKILLS)
    text(t("roadmap", """
        | Stage | Learn |
        | --- | --- |
        | Crawl | Probability, linear algebra, code |
        | Walk | Tokens, embeddings, evaluation |
        | Run | Local models, RAG, adaptation |
        | Fly | Build resources and models for our languages |

        **Skipping the foundation is not a good idea.**
    """))
    
    text(t("people_title", r"""
            ## Understanding Large Language Models
    
            An LLM’s answer depends on two things you can change:
    
            $$p_{\theta}(\text{answer} \mid \text{context})$$
        """))
    text(t("levers", """
        |  | The context (right of the bar) | The weights θ |
        | --- | --- | --- |
        | Whose job | Engineering: an API, a database, a pipeline | Machine learning: data, loss curves, evaluation |
        | Names | RAG, tools, MCP, skills | Training, fine-tuning, LoRA |
    """))
    
    with together():
        text(t("where_the_people_were", """
            > **The progress of the last three years happened where the people were.**

            And most people are engineers: about **50 million software engineers** for **5,000 LLM researchers** (a rough 2023 estimate). In a 2024 survey of 600 US enterprise leaders, **51%** had adopted **RAG**, while only **9%** of production models were **fine-tuned**.

            The engineering is remarkable. But the weights side received little of the effort, so the next big gain is more likely to come from there.
        """))
        link(LATENT_SPACE)
        link(MENLO_2024)
        link(BLOG_TWO_MEMORIES)
    text(t("our_languages", """
        For our languages this is decisive: RAG needs documents and tools need tests, but **none of them teaches a model Swahili, Lingala, Kikongo, Tshiluba or creates language data**. That takes data and people who can work on the weights. **That can be you.**
    """))

def how_our_languages_became_low_resource() -> None:
    text(t("low_resource", """
        ## How did our languages become “low-resource”?

        **Not because nobody speaks them.** Millions of people dream, argue, pray, trade and raise children in Lingala, Tshiluba, Swahili and hundreds of other languages.
    """))
    with together():
        text(t("data_classes", """
            In AI, “low-resource” does not mean few speakers. It means **little digital data**, and the two do not track each other:

            > **88%** of the world’s languages, spoken by about **1 billion people**, are still “left behind” by language technology.
        """))
        link(JOSHI)
    text(t("where_we_wrote", """
        Why? For generations, the “serious” parts of life happened in French, English or Portuguese: school, science, government, business and now the internet. Our languages stayed at home, in the market, at church, on the phone.

        > **Spoken, not stored. Lived, not digitised.**
    """))
    text(t("where_machines_learn", """
        | Where machines learn | French or English | Our languages |
        | --- | --- | --- |
        | Books and libraries | Many | Few |
        | School and university | The default | Rare |
        | Administration and law | The default | Rare |
        | Websites | Billions of pages | Very few |
    """))
    text(t("daily_life_online", """
        English is not high-resource because someone funded a dataset. It is high-resource because **daily life happens online in English**: lessons, forums, banking apps, recipes, arguments in the comments.

        **AI learns from that trace.**
    """))
    with together():
        text(t("beyond_data", """
            In 2020, with Masakhane, we argued that this is not only about data:

            > ‘Low-resourced’-ness is a complex problem going beyond data availability and **reflects systemic problems in society**.

            I still believe that.
        """))
        link(MASAKHANE)
    text(t("low_digitised", """
        > **Low-resource means low-digitised, not low-value.** That is a limit engineering can fix.
    """))


def models_learn_by_counting() -> None:
    text(t("counting", r"""
        ## Why it matters: pre-training learns frequencies

        During **pre-training**, an LLM does not store a literal count table—it updates its weights $\theta$ by minimizing next-token cross-entropy loss:

        $$\mathcal{L}(\theta) = -\frac{1}{N}\sum_{t=1}^{N} \log p_{\theta}(w_t \mid w_{<t})$$

        For a context $c$ that comes back many times, the loss is lowest when $p_{\theta}$ matches the frequencies in the training text. Shared weights only get close to this, and they also generalise to contexts never seen:

        $$p_{\theta}(w \mid c) \approx \hat{p}(w \mid c) = \frac{\mathrm{count}(c,\ w)}{\mathrm{count}(c)} = \frac{k}{n}$$
    """))
    text(t("counting_example", r"""
        Take the everyday **Swahili** context $c =$ *“Niko naenda ku …”* (*“I am going to …”*). Suppose a small pre-training corpus contains this context $n = 10$ times:

        | Next word $w$ | Meaning | Count $k$ | $\hat{p} = k / n$ |
        | --- | --- | --- | --- |
        | `nyumba` | home | 2 | $2/10 = 0.20$ |
        | `masomo` | school | 3 | $3/10 = 0.30$ |
        | `kazi` | work | 3 | $3/10 = 0.30$ |
        | `soko` | market | 2 | $2/10 = 0.20$ |

        More parameters do not create more evidence: related text helps a model generalise, but it cannot replace Swahili examples. *(Here we show whole words for clarity; in practice $w_t$ is a subword **token**—which brings us to tokenization next.)*
    """))
    text(t("how_sure", r"""
        **How reliable is $\hat{p} = k/n$?** If *“nyumba”* truly follows *“Niko naenda ku”* with probability $p = 0.2$, then $k \sim \mathrm{Binomial}(n, p)$, so $\mathrm{Var}(\hat{p}) = \frac{p(1 - p)}{n}$ and:

        $$\mathrm{SE}(\hat{p}) = \sqrt{\frac{p(1 - p)}{n}}, \qquad \text{relative error} = \frac{\mathrm{SE}(\hat{p})}{p} = \sqrt{\frac{1 - p}{n\,p}}$$

        *Note: this assumes each occurrence is independent. Web text repeats itself (copied pages, one phrase many times in a document), so the true error is **usually larger**.*

        Because the error shrinks as $1/\sqrt{n}$, **cutting the error in half requires $4\times$ more data** (and $10\times$ less error requires $100\times$ more data):
    """))
    p = 0.2  # true P("nyumba" | "Niko naenda ku")
    for n in (10, 100, 10_000, 1_000_000):
        std_error = (p * (1 - p) / n) ** 0.5  # @inspect n std_error  # @latex n=n std_error=\sqrt{p(1-p)/n}
        relative_error = std_error / p        # @inspect relative_error  # @latex relative_error=\mathrm{SE}/p
    text(t("zero_counts", r"""
        **When counts are tiny or zero:** even for a valid word with true probability $p$, the chance of never seeing it in $n$ examples is $P(k = 0) = (1 - p)^n$ (at $n = 10$, $\approx 11\%$ for $p = 0.2$, and $\approx 60\%$ for a rarer word like *“hospitali”* (hospital) at $p = 0.05$).

        If the context itself has **never** been seen ($n = 0$), $\frac{0}{0}$ has no value. The model still answers by generalising from similar contexts, and with little data it can drift into French or Standard East African Swahili, or invent words.
    """))
    with together():
        text(t("counting_takeaway", """
            > **A model knows a language as well as it has counted it.**
        """))
        link(BLOG_CONDITIONAL_PROBABILITY)


def the_tokenization_tax() -> None:
    with together():
        text(t("token_tax", """
            ## The tokenization tax

            Before counting, text is cut into **tokens**. BPE starts from characters and merges the most frequent pair, again and again.
        """))
        link(SENNRICH_BPE)
    text(t("bpe_inside", """
        ### Inside one `bpe_step`

        `bpe_step` is **not a package**: it is a short function written for this talk (`talk_kit.py`), after Sennrich et al. Its core, simplified:

        ```python
        # 1. count every pair of neighbouring pieces, in all words
        for word in corpus:
            for pair in zip(word, word[1:]):
                counts[pair] = counts.get(pair, 0) + 1
        # 2. take the most frequent pair (first merge: k + o, seen 7 times)
        left, right = max(counts, key=counts.get)
        # 3. glue it into one piece in every word, and add it to the vocabulary
        corpus = merge(corpus, left, right)
        vocab.add(left + right)
        ```
    """))
    corpus = [list(w) for w in ["koyekola", "koyekola", "koyekolisa", "moyekoli"]]
    vocab = {c for word in corpus for c in word}
    for merge_step in range(1, 5):
        pair, pair_count, vocab_size, total_tokens, words = bpe_step(corpus, vocab)  # @inspect merge_step pair pair_count vocab_size total_tokens words  # @latex merge_step=m pair_count=\mathrm{count}(a^{\ast},b^{\ast}) vocab_size=|V_{m}| total_tokens=N_{\mathrm{tokens}}
    with together():
        text(t("same_sentence", """
            Our sentence, *“Language should never be a gate to knowledge”*, now with a real tokenizer: `o200k_base`, the one **OpenAI** uses for **GPT-4o**, from its `tiktoken` library. Other model families split text differently.
        """))
        link(TIKTOKEN)
    text(token_tax_table(
        t("tax_headers", "| Language | Words | Tokens | vs. English | Attention work (∝ T²) |"),
    ))
    with together():
        text(t("why_square", r"""
            **Why $T^2$?** It comes from the attention formula in *Attention Is All You Need*:

            $$\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^{\top}}{\sqrt{d_k}}\right) V, \qquad Q, K \in \mathbb{R}^{T \times d_k}$$

            $QK^{\top}$ compares every token with every token: a grid of $T \times T$ scores, $9 \times 9 = 81$ for English, $20 \times 20 = 400$ for Tshiluba.

            $$\frac{400}{81} = \left(\frac{20}{9}\right)^2 \approx 4.94$$
        """))
        link(ATTENTION)
    plot(token_tax_chart(
        t("tax_chart_title", "Tokens and attention work, relative to English"),
        t("tax_chart_tokens", "Tokens"),
        t("tax_chart_attention", "Attention work"),
    ))
    text(t("what_it_costs", """
        `koyekolisa` (to teach, Lingala), split by two tokenizers:

        | Tokenizer | Merges learned from | Pieces | Root **-yekol-** |
        | --- | --- | --- | --- |
        | Our toy BPE, 4 merges | 4 Lingala words | `ko · yekol · i · s · a` | one piece |
        | `o200k_base` | OpenAI’s training text (mix not published) | `k · oy · ek · ol · isa` | cut across three |

        A tokenizer keeps whole what was **frequent in its training text**. *Ours is a toy; real ones learn about 200,000 pieces from bytes.*

        Same message in Tshiluba with `o200k_base`: **2.2× the tokens**, so **2.2× the price** where you pay per token, **2.2× less** text in the context, and slower answers. *One sentence is an illustration; measure a corpus before you conclude.*
    """))
    text(t("tax_open", """
        **Open problem:** tokenizers that respect Bantu morphology (`prefix + root + extension + final vowel`).
    """))


def embeddings_and_cosine_similarity() -> None:
    text(t("embeddings", r"""
        ## Embeddings and cosine similarity

        A token ID has no meaning. An **embedding** gives each word or sentence a vector; closeness in meaning becomes a small angle:

        $$\mathbf{e} = \phi(x) \in \mathbb{R}^{d}, \qquad \cos(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|\,\|\mathbf{v}\|}$$
    """))
    text(t("theory_and_practice", """
        **In theory**, a Lingala sentence and its English translation get almost the same vector.

        **What we often see** in models that saw little Lingala (toy vectors, chosen to show the pattern):
    """))
    ln = [0.9, 0.3, 0.3]         # "Lokota esengeli kozala epekiseli ya boyebi te."
    en = [0.3, 0.9, 0.3]         # "Language should never be a gate to knowledge."
    ln_other = [0.85, 0.2, 0.45] # "Lelo mbula ezali konoka." (it is raining today)
    sim_translation = cosine(ln, en)     # @inspect sim_translation  # @latex sim_translation=\cos(\text{ln},\text{en})
    sim_unrelated = cosine(ln, ln_other) # @inspect sim_unrelated  # @latex sim_unrelated=\cos(\text{ln},\text{ln}')
    text(t("embedding_limits", """
        - Sentences can cluster by **language**, not by **meaning**: a search in Lingala then returns Lingala text, not the right answer.
        - A score of 0.8 does not mean the same thing in Tshiluba as in English: thresholds tuned on English break.
    """))
    text(t("embedding_open", """
        **Open problem:** measure and align embeddings for our languages, with sentence pairs checked by speakers.
    """))


def metrics_that_miss_our_languages() -> None:
    with together():
        text(t("metrics", """
            ## Metrics that miss our languages

            Translation is often scored by overlap with a reference: **BLEU** compares sequences of words, **chrF** sequences of characters.
        """))
        link(BLEU)
        link(CHRF)
    text(t("two_answers", """
        Two answers in Tshiluba, scored against the reference:
    """))
    cases = [("mâyi", "mayi"), ("kulongesha", "kulonga")]  # (reference, answer)
    for reference, answer in cases:
        exact = int(reference == answer)      # @inspect reference answer exact  # @latex exact=\text{exact match}
        chrf = chrf_score(reference, answer)  # @inspect chrf  # @latex chrf=\text{chrF}
    text(t("wrong_answer_wins", """
        - `mayi` for `mâyi` (water): **right meaning**, other spelling, low chrF.
        - `kulonga` (to learn) for `kulongesha` (to teach): **wrong meaning**, higher chrF.

        **The metric prefers the wrong answer.**

        *The live values are a simplified chrF (1–3 characters). The standard version (1–6) agrees: 0.49 for the wrong answer, 0.27 for the right one.*
    """))
    text(t("why_metrics_fail", """
        - Spelling is not standardised (*â* or *a*, *ɛ* or *e*, tone marks or not).
        - One long word carries a whole sentence: one wrong affix loses the whole word in BLEU.
        - An LLM judge that is weak in Tshiluba cannot grade Tshiluba.
    """))
    with together():
        text(t("metrics_open", """
            **Open problem:** test sets written from our own content, metrics aware of morphology and spelling, and evaluation by native speakers.
        """))
        link(IROKOBENCH)


def local_llms_on_your_own_machine() -> None:
    text(t("local_llms", """
        ## Local LLMs: run a model on your own machine

        - **Sovereignty:** your data stays with you, in your country
        - **Offline:** works without a good connection
        - **No per-token bill:** the token tax becomes compute you own
        - **Open weights:** you can adapt the model to our languages
    """))
    text(t("memory_rule", """
        **How much memory?** Weights take about **parameters × bits ÷ 8** bytes, plus room for the context (often 1–2 GB, more for long ones):
    """))
    for params_b in (1, 3, 8, 70):  # billions of parameters
        gb_16bit = params_b * 16 / 8  # @inspect params_b gb_16bit  # @latex params_b=N_{\text{params}}(10^9) gb_16bit=\text{GB at 16 bits}
        gb_4bit = params_b * 4 / 8    # @inspect gb_4bit  # @latex gb_4bit=\text{GB at 4 bits}
    plot(memory_chart(
        t("memory_chart_title", "Memory needed for the weights"),
        t("memory_chart_full", "16 bits"),
        t("memory_chart_quantised", "4 bits (quantised)"),
    ))
    text(t("what_fits", """
        | Your machine | Models that fit (4 bits, rule of thumb) |
        | --- | --- |
        | Laptop, 8 GB RAM | Up to about 3–4 B parameters |
        | Laptop, 16 GB RAM | Up to about 8 B |
        | GPU, 24 GB | Up to about 30 B |
        | 48 GB or more | About 70 B |
    """))
    text(t("tools_to_run", """
        | Tool | Best for |
        | --- | --- |
        | Ollama | One command to download and chat, plus a local API |
        | LM Studio | A graphical app, no terminal |
        | llama.cpp | Full control, runs on CPU, phones, small boards |
    """))
    with together():
        text(t("try_tonight", """
            ```bash
            ollama run llama3.2:3b        # downloads ~2 GB once, then works offline

            curl http://localhost:11434/api/generate -d '{
              "model": "llama3.2:3b", "stream": false,
              "prompt": "Translate into Lingala: Language should never be a gate to knowledge."
            }'
            ```
        """))
        link(OLLAMA)
        link(LLAMA_CPP)
    with together():
        text(t("adapt_with_lora", r"""
            **Adapt it to our languages with LoRA:** keep $W$ frozen and train two thin matrices instead.

            $$W' = W + BA, \qquad B \in \mathbb{R}^{d \times r},\quad A \in \mathbb{R}^{r \times k},\quad r \ll \min(d, k)$$
        """))
        link(LORA)
    d, k, r = 4096, 4096, 8
    full_params = d * k                      # @inspect full_params  # @latex full_params=d{\times}k
    lora_params = r * (d + k)                # @inspect lora_params  # @latex lora_params=r(d+k)
    compression = full_params / lora_params  # @inspect compression  # @latex compression=\frac{dk}{r(d+k)}
    text(t("be_honest", """
        **Observation:** small open models are still weak in Lingala and Tshiluba. Adapting and evaluating them is open work, and it needs our data.
    """))


def masakhane_we_build_together() -> None:
    with together():
        text(t("masakhane", """
            ## Masakhane: we build together

            **Masakhane** (*“we build together”* in isiZulu) is a community of African researchers building datasets, models and methods for African languages, in the open. I sat on the board of the **Masakhane Research Foundation** from 2021 to mid-2026.
        """))
        link(MASAKHANE)
    with together():
        text(t("my_work", """
            - **2020:** participatory machine translation for 30+ African languages
            - **LiSTra:** English-to-Lingala speech translation corpus and baseline
            - **BibleTTS, IrokoBench, INJONGO:** speech data and benchmarks for African languages
        """))
        link(LISTRA)
        link(BIBLETTS)
        link(INJONGO)
    text(t("what_i_learned", """
        **What I learned:** one-off datasets matter: they gave us our first benchmarks and models. But **a dataset is a snapshot; a language people actually use online grows every day.** And funding is slow and ends.
    """))


def darakili_life_in_our_languages() -> None:
    text(t("darakili", """
        ## DarAkili: let us live in our languages

        We became low-resource because life in our languages was spoken, not stored. So the fix is:
    """))
    text(t("live_in_our_languages", """
        > **Bring our everyday habits in our languages into the digital space:** learn, teach, write, record and discuss in Lingala, Tshiluba and Swahili.
    """))
    with together():
        text(t("what_we_build", """
            In my free time, I work on **DarAkili** (**SALELA BONGO LLC**): STEM, digital skills and soon AI lessons, taught in **Lingala, Tshiluba, Swahili** and more to come.

            The lessons are **mostly audio**, because that is how many of us actually use our languages. Learning science should never be gated by English or French.
        """))
        link(DARAKILI)
    text(t("why_it_works", """
        Every lesson taught in our languages is **new digital text and speech** in our languages, made by living in them, not by a one-off project.

        > **Remittances send money home. DarAkili sends knowledge home.**
    """))
    with together():
        text(t("your_part", """
            **Your part:** teach one lesson in your language, write your notes in it, and publish them so others can reuse them.

            **Diaspora professionals:** if you can teach something in your mother tongue, I would love to hear from you.
        """))
        link(DARAKILI)


def a_science_behind_every_limit() -> None:
    text(t("not_magic", """
        ## Behind every limit, a science to learn

        | Limit | Answer | Science |
        | --- | --- | --- |
        | Our languages are not digital | Live, learn, publish in them | Linguistics, data |
        | Few examples | More text, better counting | Probability |
        | Tokens cut our words | Morphology-aware tokenizers | Compression |
        | Vectors miss our meaning | Aligned embeddings | Linear algebra |
        | Metrics miss our languages | Native-speaker evaluation | Statistics |
        | Cloud cost, no control | Local LLMs, LoRA | Low-rank algebra |
        | Few people work on the weights | Learn machine learning, not only APIs | Statistics, optimisation |
    """))
    text(t("open_problems", """
        ### Open problems to keep in mind

        1. A Lingala or Tshiluba test set written from local content
        2. Tokenizers that keep Bantu roots whole
        3. A small open model adapted to one Congolese language, and evaluated honestly
        4. Tone-aware speech recognition
    """))
    with together():
        text(t("your_turn", """
            **Your turn:** pick one new AI tool and answer the three questions we started with:

            1. Which **limit** does it answer?
            2. What is the **engineering** move?
            3. What **science** is underneath?

            Then teach one thing in your language.
        """))
        link(AFRICA_AI_100)
    text(t("take_it_with_you", """
        ### Take it with you

        | This presentation | DarAkili · Android | DarAkili · iPhone |
        |:---:|:---:|:---:|
        | ![QR: This presentation](/edtrace/images/talks/qr-talk-en.png) | ![QR: DarAkili, Google Play](/edtrace/images/talks/qr-darakili-android.png) | ![QR: DarAkili, App Store](/edtrace/images/talks/qr-darakili-ios.png) |
        | drkabongo.com | Google Play | App Store |
    """))
    text(t("thank_you", """
        ## Tuasakidila · Matondo · Aksanti · Merci · Thank you
    """))


def main() -> None:
    table_of_contents()


if __name__ == "__main__":
    main()
