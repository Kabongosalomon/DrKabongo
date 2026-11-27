"""Helpers for the talk. You rarely need to edit this file.

The talk itself uses the plain EdTrace calls: text(), image(), link(), plot().
This file only adds two things:

    with together():      everything inside appears on screen in one click
    t(key, english)       the translation of `key` in <talk>.<lang>.md, else the English
"""

from __future__ import annotations

import inspect
import os
import re
import sys
from contextlib import contextmanager
from pathlib import Path

LANG = os.environ.get("TALK_LANG", "en")
HERE = Path(__file__).resolve().parent
_KEY = re.compile(r"^<!--\s*@([a-z0-9_]+)\s*-->\s*$", re.MULTILINE)
_cache: dict[str, dict[str, str]] = {}


@contextmanager
def together():
    """Show everything in the block at once. The build merges its lines into one step."""
    yield


def load_translations(path: Path) -> dict[str, str]:
    """Read `<!-- @key -->` blocks from a translation file."""
    if not path.exists():
        return {}
    parts = _KEY.split(path.read_text(encoding="utf-8"))
    return {key: body.strip() for key, body in zip(parts[1::2], parts[2::2])}


def t(key: str, english: str) -> str:
    """The translation of `key` for the language being built, else the English."""
    talk = Path(sys._getframe(1).f_code.co_filename).stem
    if talk not in _cache:
        _cache[talk] = load_translations(HERE / f"{talk}.{LANG}.md")
    return _cache[talk].get(key, inspect.cleandoc(english))


# ── Code the talk demonstrates ───────────────────────────────────────────────


def bpe_step(corpus: list[list[str]], vocab: set[str]):
    """Merge the most frequent adjacent pair; updates `corpus` and `vocab` in place."""
    # 1. count every pair of neighbouring pieces, in all words
    counts: dict[tuple[str, str], int] = {}
    for tokens in corpus:
        for pair in zip(tokens, tokens[1:]):
            counts[pair] = counts.get(pair, 0) + 1
    # 2. take the most frequent pair
    (left, right), pair_count = max(counts.items(), key=lambda item: item[1])
    # 3. glue it into one piece in every word, and add it to the vocabulary
    for tokens in corpus:
        i = 0
        while i < len(tokens) - 1:
            if tokens[i] == left and tokens[i + 1] == right:
                tokens[i : i + 2] = [left + right]
            i += 1
    vocab.add(left + right)
    sample = [" · ".join(tokens) for tokens in corpus[1:3]]
    return (
        f"{left} + {right} -> {left + right}",
        pair_count,
        len(vocab),
        sum(len(tokens) for tokens in corpus),
        sample,
    )


def cosine(u: list[float], v: list[float]) -> float:
    dot = sum(a * b for a, b in zip(u, v))
    return round(dot / (sum(a * a for a in u) ** 0.5 * sum(b * b for b in v) ** 0.5), 4)


def chrf_score(reference: str, answer: str, max_n: int = 3, beta: int = 2) -> float:
    """chrF (Popović 2015), simplified: character 1–3-grams, F-score with β = 2."""

    def grams(s: str, n: int) -> dict[str, int]:
        s = s.replace(" ", "")
        found: dict[str, int] = {}
        for i in range(len(s) - n + 1):
            found[s[i : i + n]] = found.get(s[i : i + n], 0) + 1
        return found

    precision = recall = 0.0
    for n in range(1, max_n + 1):
        ref, hyp = grams(reference, n), grams(answer, n)
        overlap = sum(min(count, ref.get(g, 0)) for g, count in hyp.items())
        precision += overlap / max(sum(hyp.values()), 1)
        recall += overlap / max(sum(ref.values()), 1)
    precision, recall = precision / max_n, recall / max_n
    if precision + recall == 0:
        return 0.0
    return round((1 + beta**2) * precision * recall / (beta**2 * precision + recall), 4)


# ── Measured data, tables and charts ─────────────────────────────────────────

# "Language should never be a gate to knowledge" and its translations, counted
# with tiktoken `o200k_base`. Re-measure if a sentence changes.
TOKEN_COUNTS = [
    ("English", 8, 9),
    ("Français", 10, 12),
    ("Kiswahili", 7, 16),
    ("Lingála", 7, 16),
    ("Tshiluba", 9, 20),
]
MODEL_SIZES_B = [1, 3, 8, 70]
CHART_INK = "#77716a"  # readable on both the light and the dark background


def token_tax_table(header: str) -> str:
    """`header` is one Markdown table row, e.g. "| Language | Words | ... |"."""
    columns = header.strip().strip("|").count("|") + 1
    english = TOKEN_COUNTS[0][2]
    rows = [
        f"| {name} | {words} | {tokens} | {tokens / english:.2f}× | {(tokens / english) ** 2:.2f}× |"
        for name, words, tokens in TOKEN_COUNTS
    ]
    return "\n".join([header.strip(), "|" + " --- |" * columns, *rows])


def _grouped_bars(title, values, groups, series, y_title, colors, number_format):
    x = {"field": "group", "type": "nominal", "sort": groups, "title": None, "axis": {"labelAngle": 0}}
    y = {"field": "value", "type": "quantitative", "title": y_title}
    offset = {"field": "series", "sort": series}
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": {"text": title, "fontSize": 22, "anchor": "start", "color": CHART_INK, "offset": 14},
        "background": "transparent",
        "width": 1040,
        "height": 340,
        "config": {
            "axis": {
                "labelFontSize": 18,
                "titleFontSize": 18,
                "labelColor": CHART_INK,
                "titleColor": CHART_INK,
                "gridColor": "rgba(128,128,128,0.22)",
            },
            "legend": {"labelFontSize": 18, "labelColor": CHART_INK, "labelLimit": 320, "symbolSize": 200},
            "view": {"stroke": None},
        },
        "data": {"values": values},
        "layer": [
            {
                "mark": {"type": "bar", "cornerRadiusTopLeft": 4, "cornerRadiusTopRight": 4},
                "encoding": {
                    "x": x,
                    "y": y,
                    "xOffset": offset,
                    "color": {
                        "field": "series",
                        "type": "nominal",
                        "title": None,
                        "scale": {"domain": series, "range": colors},
                        "legend": {"orient": "top"},
                    },
                },
            },
            {
                "mark": {"type": "text", "dy": -10, "fontSize": 16, "color": CHART_INK},
                "encoding": {
                    "x": x,
                    "y": y,
                    "xOffset": offset,
                    "text": {"field": "value", "type": "quantitative", "format": number_format},
                },
            },
        ],
    }


def token_tax_chart(title: str, tokens_label: str, attention_label: str) -> dict:
    english = TOKEN_COUNTS[0][2]
    values = []
    for name, _, tokens in TOKEN_COUNTS:
        values.append({"group": name, "series": tokens_label, "value": round(tokens / english, 2)})
        values.append({"group": name, "series": attention_label, "value": round((tokens / english) ** 2, 2)})
    return _grouped_bars(
        title, values, [row[0] for row in TOKEN_COUNTS], [tokens_label, attention_label],
        "×", ["#2f6f8f", "#b4472f"], ".2f",
    )


def memory_chart(title: str, full_label: str, quantised_label: str) -> dict:
    values = []
    for size in MODEL_SIZES_B:
        values.append({"group": f"{size} B", "series": full_label, "value": size * 2})
        values.append({"group": f"{size} B", "series": quantised_label, "value": size * 0.5})
    return _grouped_bars(
        title, values, [f"{size} B" for size in MODEL_SIZES_B], [full_label, quantised_label],
        "GB", ["#8a8278", "#0b7f78"], ".1f",
    )
