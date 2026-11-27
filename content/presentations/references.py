"""Sources cited in the talk. `anchor` is the link text shown on the slide."""

from __future__ import annotations

import os
from dataclasses import dataclass

from edtrace.reference import Reference


@dataclass(frozen=True)
class Cite(Reference):
    anchor: str = ""

    @property
    def label(self) -> str:
        return self.anchor


FRENCH = os.environ.get("TALK_LANG") == "fr"

JOSHI = Cite(
    anchor="[Joshi et al. 2020 — The State and Fate of Linguistic Diversity in NLP]",
    title="The State and Fate of Linguistic Diversity and Inclusion in the NLP World",
    authors=["Pratik Joshi", "Sebastin Santy", "Amar Budhiraja", "Kalika Bali", "Monojit Choudhury"],
    organization="ACL 2020",
    date="2020-04-20",
    url="https://arxiv.org/abs/2004.09095",
)

SENNRICH_BPE = Cite(
    anchor="[Sennrich, Haddow & Birch 2016 — Subword units (BPE)]",
    title="Neural Machine Translation of Rare Words with Subword Units",
    authors=["Rico Sennrich", "Barry Haddow", "Alexandra Birch"],
    organization="ACL 2016",
    date="2015-08-31",
    url="https://arxiv.org/abs/1508.07909",
)

ATTENTION = Cite(
    anchor="[Vaswani et al. 2017 — Attention Is All You Need]",
    title="Attention Is All You Need",
    authors=["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "et al."],
    organization="NeurIPS 2017",
    date="2017-06-12",
    url="https://arxiv.org/abs/1706.03762",
)

TIKTOKEN = Cite(
    anchor="[tiktoken — OpenAI’s tokenizer library (o200k_base)]",
    title="tiktoken",
    authors=["OpenAI"],
    organization="Open-source BPE tokenizer",
    date="2022-12-01",
    url="https://github.com/openai/tiktoken",
)

BLEU = Cite(
    anchor="[Papineni et al. 2002 — BLEU]",
    title="Bleu: a Method for Automatic Evaluation of Machine Translation",
    authors=["Kishore Papineni", "Salim Roukos", "Todd Ward", "Wei-Jing Zhu"],
    organization="ACL 2002",
    date="2002-07-07",
    url="https://aclanthology.org/P02-1040/",
)

CHRF = Cite(
    anchor="[Popović 2015 — chrF]",
    title="chrF: character n-gram F-score for automatic MT evaluation",
    authors=["Maja Popović"],
    organization="WMT 2015",
    date="2015-09-17",
    url="https://aclanthology.org/W15-3049/",
)

OLLAMA = Cite(
    anchor="[Ollama — run open models locally]",
    title="Ollama",
    authors=["Ollama"],
    organization="Open-source runtime for local models",
    date="2023-07-01",
    url="https://ollama.com",
)

LLAMA_CPP = Cite(
    anchor="[llama.cpp — LLM inference in C/C++]",
    title="llama.cpp",
    authors=["ggml-org contributors"],
    organization="Open source",
    date="2023-03-10",
    url="https://github.com/ggml-org/llama.cpp",
)

LORA = Cite(
    anchor="[Hu et al. 2021 — LoRA]",
    title="LoRA: Low-Rank Adaptation of Large Language Models",
    authors=["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "et al."],
    organization="ICLR 2022",
    date="2021-06-17",
    url="https://arxiv.org/abs/2106.09685",
)

RAG = Cite(
    anchor="[Lewis et al. 2020 — Retrieval-Augmented Generation]",
    title="Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors=["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "et al."],
    organization="NeurIPS 2020",
    date="2020-05-22",
    url="https://arxiv.org/abs/2005.11401",
)

LATENT_SPACE = Cite(
    anchor="[Latent Space 2023 — The Rise of the AI Engineer]",
    title="The Rise of the AI Engineer",
    authors=["swyx"],
    organization="Latent Space",
    date="2023-06-30",
    url="https://www.latent.space/p/ai-engineer",
)

MENLO_2024 = Cite(
    anchor="[Menlo Ventures 2024 — State of Generative AI in the Enterprise]",
    title="2024: The State of Generative AI in the Enterprise",
    authors=["Menlo Ventures"],
    organization="Menlo Ventures",
    date="2024-11-20",
    url="https://menlovc.com/2024-the-state-of-generative-ai-in-the-enterprise/",
)

RA_DIT = Cite(
    anchor="[Lin et al. 2024 — RA-DIT: training retrieval and model]",
    title="RA-DIT: Retrieval-Augmented Dual Instruction Tuning",
    authors=["Xi Victoria Lin", "et al."],
    organization="ICLR 2024",
    date="2023-10-02",
    url="https://arxiv.org/abs/2310.01352",
)

TOOLFORMER = Cite(
    anchor="[Schick et al. 2023 — Toolformer]",
    title="Toolformer: Language Models Can Teach Themselves to Use Tools",
    authors=["Timo Schick", "et al."],
    organization="NeurIPS 2023",
    date="2023-02-09",
    url="https://arxiv.org/abs/2302.04761",
)

MCP = Cite(
    anchor="[Model Context Protocol — specification]",
    title="Model Context Protocol",
    authors=["MCP contributors"],
    organization="Open standard, introduced by Anthropic",
    date="2024-11-25",
    url="https://modelcontextprotocol.io",
)

AGENT_SKILLS = Cite(
    anchor="[Agent Skills — open format]",
    title="Agent Skills",
    authors=["Agent Skills contributors"],
    organization="Open format, introduced by Anthropic",
    date="2025-10-16",
    url="https://agentskills.io",
)

MASAKHANE = Cite(
    anchor="[Nekoto et al. 2020 — Masakhane: participatory research]",
    title="Participatory Research for Low-resourced Machine Translation: A Case Study in African Languages",
    authors=["Wilhelmina Nekoto", "Vukosi Marivate", "Salomon Kabongo", "et al."],
    organization="Findings of EMNLP 2020",
    date="2020-11-16",
    url="https://aclanthology.org/2020.findings-emnlp.195/",
)

LISTRA = Cite(
    anchor="[Kabongo & Marivate — LiSTra: English–Lingala speech translation]",
    title="LiSTra: English-to-Lingala Automatic Speech Translation corpus and baseline",
    authors=["Salomon Kabongo", "Vukosi Marivate"],
    organization="Black in AI Workshop, NeurIPS 2021 — Spotlight",
    date="2021-12-07",
    url="https://github.com/dsfsi/2020-AMMI-salomon",
)

BIBLETTS = Cite(
    anchor="[Meyer et al. 2022 — BibleTTS: African speech corpus]",
    title="BibleTTS: a large, high-fidelity, multilingual, and uniquely African speech corpus",
    authors=["Josh Meyer", "et al.", "Salomon Kabongo"],
    organization="Interspeech 2022",
    date="2022-07-07",
    url="https://arxiv.org/abs/2207.03546",
)

IROKOBENCH = Cite(
    anchor="[Adelani et al. — IrokoBench: 17 African languages]",
    title="IrokoBench: A New Benchmark for African Languages in the Age of Large Language Models",
    authors=["David Ifeoluwa Adelani", "et al."],
    organization="NAACL 2025",
    date="2024-06-05",
    url="https://arxiv.org/abs/2406.03368",
)

INJONGO = Cite(
    anchor="[Yu et al. 2025 — INJONGO: 16 African languages]",
    title="INJONGO: A Multicultural Intent Detection and Slot-filling Dataset for 16 African Languages",
    authors=["Hao Yu", "et al."],
    organization="ACL 2025",
    date="2025-07-27",
    url="https://aclanthology.org/2025.acl-long.464/",
)

AFRICA_AI_100 = Cite(
    anchor="[Oxford Global Think Tank — Africa AI 100 (2026)]",
    title="Africa AI 100 (2026) — Portrait 24/100: \"Computing in Tshiluba\"",
    authors=["Oxford Global Think Tank"],
    organization="Oxford Global Think Tank",
    date="2026-11-01",
    url="https://www.oxfordthinktank.org/publications/africa-ai-100-2026",
)

DARAKILI = Cite(
    anchor="[DarAkili — darakili.com]",
    title="DarAkili — Learn STEM, Programming & AI in African Languages",
    authors=["Salomon Kabongo, PhD"],
    organization="SALELA BONGO LLC",
    date="2026-01-01",
    url="https://darakili.com",
)

BLOG_CONDITIONAL_PROBABILITY = (
    Cite(
        anchor="[Les LLM sont des machines à probabilité conditionnelle — drkabongo.com]",
        title="Les LLM sont des machines à probabilité conditionnelle",
        authors=["Salomon Kabongo, PhD"],
        organization="drkabongo.com",
        date="2026-11-01",
        url="https://drkabongo.com/fr/blog/conditional-probability-machines",
    )
    if FRENCH
    else Cite(
        anchor="[LLMs Are Conditional Probability Machines — drkabongo.com]",
        title="LLMs Are Conditional Probability Machines",
        authors=["Salomon Kabongo, PhD"],
        organization="drkabongo.com",
        date="2026-11-01",
        url="https://drkabongo.com/blog/conditional-probability-machines",
    )
)

BLOG_TWO_MEMORIES = (
    Cite(
        anchor="[Votre LLM a deux mémoires — drkabongo.com]",
        title="Votre LLM a deux mémoires. Vous n'en utilisez qu'une.",
        authors=["Salomon Kabongo, PhD"],
        organization="drkabongo.com",
        date="2026-11-13",
        url="https://drkabongo.com/fr/blog/llm-two-memories",
    )
    if FRENCH
    else Cite(
        anchor="[Your LLM Has Two Memories — drkabongo.com]",
        title="Your LLM Has Two Memories. You’re Only Using One.",
        authors=["Salomon Kabongo, PhD"],
        organization="drkabongo.com",
        date="2026-11-13",
        url="https://drkabongo.com/blog/llm-two-memories",
    )
)
