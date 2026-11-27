#!/usr/bin/env python3
"""Run each talk in `content/presentations/` through the EdTrace tracer.

Run: `npm run presentations`. Writes one trace per language to
`public/edtrace/traces/<course_id>/<lang>/<talk>.json`.
"""

from __future__ import annotations

import ast
import hashlib
import inspect
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = ROOT / "content" / "presentations"
OUTPUT = ROOT / "public" / "edtrace" / "traces"
TRANSLATION_KEY = re.compile(r"^<!--\s*@([a-z0-9_]+)\s*-->\s*$", re.MULTILINE)
LATEX_ALIAS = re.compile(r"(\w+)=(.*?)(?=\s+\w+=|$)")
MATH = re.compile(r"(```.*?```|`[^`\n]*`)|(\$\$.+?\$\$)|(\$[^$\n]+\$)", re.DOTALL)
# `content/presentations/images` is a link to this folder, which the viewer serves.
IMAGES = ROOT / "public" / "edtrace" / "images" / "talks"


def trace_talk(name: str, language: str) -> dict:
    with tempfile.TemporaryDirectory() as out:
        env = {
            **os.environ,
            "TALK_LANG": language,
            "PYTHONPATH": str(SOURCES),
            "PYTHONDONTWRITEBYTECODE": "1",
        }
        run = subprocess.run(
            [sys.executable, "-m", "edtrace.execute", "-m", name, "-o", out],
            cwd=SOURCES,
            env=env,
            capture_output=True,
            text=True,
        )
        if run.returncode != 0:
            sys.exit(f"{run.stdout[-3000:]}\n{run.stderr}\nCould not build {name} ({language}).")
        for line in run.stdout.splitlines():
            if line.startswith("WARNING"):
                print(f"  {line}")
        return json.loads((Path(out) / f"{name}.json").read_text(encoding="utf-8"))


def protect_math(markdown: str) -> str:
    """Let authors write plain LaTeX: keep Markdown away from `_` and `\\`."""

    def fix(match: re.Match) -> str:
        code, display, inline = match.groups()
        if code:
            return code
        if display:
            return display.replace("_", "&#95;")
        return inline.replace("\\", "\\\\").replace("_", "&#95;")

    return MATH.sub(fix, markdown)


def prepare(rendering: dict) -> None:
    """Adapt what `text()` and `image()` recorded to the web viewer."""
    style = rendering.get("style") or {}
    if rendering["type"] == "markdown" and style.get("whiteSpace") != "pre":
        # Indented triple-quoted strings would otherwise show as code blocks.
        rendering["data"] = protect_math(inspect.cleandoc(rendering["data"]))
    elif rendering["type"] == "image":
        file = SOURCES / rendering["data"]
        if rendering["data"].startswith("var/files/"):  # image("https://...")
            # The cached name keeps the address with `.` turned into `_`.
            suffix = re.search(r"_(png|jpe?g|webp|gif|svg)(?=_|$)", file.name, re.IGNORECASE)
            name = f"{file.name[:38]}.{suffix.group(1).lower() if suffix else 'png'}"
            shutil.copyfile(file, IMAGES / name)
        else:
            try:
                name = file.resolve().relative_to(IMAGES).as_posix()
            except ValueError:
                sys.exit(f"Put {rendering['data']} in content/presentations/images/.")
        rendering["data"] = f"images/talks/{name}"
        if "width" in style:  # The viewer overrides `width`; the site's CSS reads this.
            width = style.pop("width")
            style["--et-width"] = f"{width}px" if isinstance(width, int) else width
        rendering["style"] = style


def is_together(node: ast.AST) -> bool:
    return isinstance(node, ast.With) and any(
        isinstance(item.context_expr, ast.Call)
        and getattr(item.context_expr.func, "id", "") == "together"
        for item in node.items
    )


def tidy(trace: dict, path: str) -> None:
    """Make multi-line calls and `with together():` blocks one step, and hide the plumbing.

    The tracer works line by line. A `text(...)` spread over many lines must show
    only its result, in a single step, and the imports at the top and `main()`
    are not part of the talk.
    """
    source = trace["files"][path]
    lines = source.split("\n")
    tree = ast.parse(source)
    start_of: dict[int, int] = {}
    hidden = set(trace["hidden_line_numbers"][path])

    statements = (ast.Expr, ast.Assign, ast.AugAssign, ast.AnnAssign)
    blocks = [n for n in ast.walk(tree) if isinstance(n, statements)]
    blocks += [n for n in ast.walk(tree) if is_together(n)]  # last, so they win
    for node in blocks:
        inside = lines[node.lineno - 1 : node.end_lineno]
        if (
            isinstance(node, statements)
            and len(inside) > 1
            and any(re.search(r"#\s*@(inspect|latex) ", line) for line in inside)
        ):
            sys.exit(
                f"{path} line {node.lineno}: put this statement and its `# @inspect` comment "
                "on one line (a code formatter may have split it)."
            )
        if node.end_lineno > node.lineno:
            for number in range(node.lineno, node.end_lineno + 1):
                start_of[number] = node.lineno
            hidden.update(range(node.lineno + 1, node.end_lineno + 1))

    functions = {n.name: n for n in tree.body if isinstance(n, ast.FunctionDef)}
    if "table_of_contents" not in functions or "main" not in functions:
        sys.exit(f"{path} needs both table_of_contents() and main().")
    hidden.update(range(1, functions["table_of_contents"].lineno))
    hidden.update(range(functions["main"].lineno, len(lines) + 1))

    steps: list[dict] = []
    for step in trace["steps"]:
        for frame in step["stack"]:
            if frame["path"] == path and frame["line_number"] in start_of:
                frame["line_number"] = start_of[frame["line_number"]]
                frame["code"] = lines[frame["line_number"] - 1].strip()
        last = step["stack"][-1]["line_number"]
        if steps and last in start_of and steps[-1]["stack"] == step["stack"]:
            steps[-1]["renderings"] += step["renderings"]
            steps[-1]["env"].update(step["env"])
        else:
            steps.append(step)

    trace["steps"] = steps
    trace["hidden_line_numbers"][path] = sorted(hidden)


def inspect_math(source: str) -> dict[str, str]:
    """`# @inspect x  # @latex x=\\hat{x}` shows the value of `x` under that formula."""
    aliases: dict[str, str] = {}
    for line in source.split("\n"):
        if "# @latex " in line:
            for name, tex in LATEX_ALIAS.findall(line.split("# @latex ", 1)[1].strip()):
                # The viewer renders labels through Markdown, which would eat `_` and `\`.
                aliases[name] = tex.replace("\\", "\\\\").replace("_", "&#95;")
    return aliases


def fingerprint(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]


def check_translations(name: str, source: str, languages: list[str]) -> None:
    """Report translations that are missing, unused, or older than the English.

    A translation wins over the English, so an English edit does not show on the
    other languages' pages. `<talk>.lock.json` remembers which English each
    translation was written for, to say so.
    """
    english: dict[str, tuple[int, str]] = {}
    for node in ast.walk(ast.parse(source)):
        if (
            isinstance(node, ast.Call)
            and getattr(node.func, "id", "") == "t"
            and len(node.args) > 1
            and all(isinstance(arg, ast.Constant) for arg in node.args[:2])
        ):
            english[node.args[0].value] = (node.lineno, inspect.cleandoc(node.args[1].value))

    lock_file = SOURCES / f"{name}.lock.json"
    lock = json.loads(lock_file.read_text(encoding="utf-8")) if lock_file.exists() else {}
    outdated: dict[str, list[str]] = {}
    for language in languages:
        file = SOURCES / f"{name}.{language}.md"
        parts = TRANSLATION_KEY.split(file.read_text(encoding="utf-8")) if file.exists() else [""]
        have = {key: body.strip() for key, body in zip(parts[1::2], parts[2::2])}
        if english.keys() - have.keys():
            missing = ", ".join(sorted(english.keys() - have.keys()))
            print(f"  {file.name}: shown in English (no translation): {missing}")
        if have.keys() - english.keys():
            unused = ", ".join(sorted(have.keys() - english.keys()))
            print(f"  {file.name}: unused, safe to delete: {unused}")
        known = lock.setdefault(language, {})
        for key in english.keys() & have.keys():
            now = [fingerprint(english[key][1]), fingerprint(have[key])]
            if key not in known or known[key][1] != now[1]:  # new or re-translated
                known[key] = now
            elif known[key][0] != now[0]:
                outdated.setdefault(key, []).append(language)
    lock_file.write_text(json.dumps(lock, indent=1, sort_keys=True) + "\n", encoding="utf-8")

    for key, behind in sorted(outdated.items(), key=lambda item: english[item[0]][0]):
        files = ", ".join(f"{name}.{language}.md" for language in behind)
        print(
            f"\n  NOT UPDATED: you changed the English of '{key}' ({name}.py line "
            f"{english[key][0]}),\n  but these pages still show the old text. Edit "
            f"<!-- @{key} --> in: {files}\n"
        )


def build(config_path: Path) -> None:
    name = config_path.stem
    config = tomllib.loads(config_path.read_text(encoding="utf-8"))
    labels = config["language_labels"]
    path = f"{name}.py"
    source = (SOURCES / path).read_text(encoding="utf-8")
    check_translations(name, source, [code for code in labels if code != "en"])

    for language, label in labels.items():
        trace = trace_talk(name, language)
        tidy(trace, path)
        for step in trace["steps"]:
            for rendering in step["renderings"]:
                prepare(rendering)
        trace["metadata"] = {
            "schema_version": 2,
            "course": {"id": config["course_id"], "title": config["course_titles"][language]},
            "lesson": {"id": name, "title": config["lesson_titles"][language]},
            "language": {"code": language, "label": label},
            "supported_languages": [{"code": c, "label": v} for c, v in labels.items()],
            "function_names": config.get("function_names", {}).get(language, {}),
            "videos": [],
            "inspect_math": inspect_math(source),
        }
        target = OUTPUT / config["course_id"] / language / f"{name}.json"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(trace, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        print(f"Built {language}/{name}.json ({len(trace['steps'])} steps)")


if __name__ == "__main__":
    for config_path in sorted(SOURCES.glob("*.toml")):
        build(config_path)
