# Talks

A talk is an ordinary [EdTrace](https://github.com/percyliang/edtrace) lesson: a Python file
built from `text()`, `image()`, `link()` and `plot()`. Edit it, then:

```bash
npm run presentations   # rebuild the slides (needs uv)
npm run dev             # then reload the talk page
```

Commit the rebuilt files in `public/edtrace/traces/talks/` with your change.

| File | What it holds |
| --- | --- |
| `learning_in_the_llm_era.py` | **The talk, in English.** Edit this one. |
| `images/` | Pictures for the slides (a link to `public/edtrace/images/talks/`) |
| `references.py` | Sources you cite more than once |
| `learning_in_the_llm_era.{fr,ln,lua}.md` | Translations (optional) |
| `learning_in_the_llm_era.toml` | Titles, languages, translated function names |
| `talk_kit.py` | `together()`, `t()`, charts and demo functions |

## The calls

**One call is one click.**

```python
text("A sentence. **Markdown** works, and $x_1^2$ too.")

text("""
    ## A heading

    - first point
    - second point
""")

image("images/photo.jpg", width="60%")          # or width=600, or an https:// address

link(title="DarAkili", url="https://darakili.com")   # shows [DarAkili]
link(JOSHI)                                          # a source from references.py
```

Use `r"""` when the text contains a backslash, as in `$$\frac{a}{b}$$`.

**To show several things in one click**, indent them under `with together():`.

```python
with together():
    image("images/poster.jpg", style={"float": "right"}, width="38%")  # beside the text
    text("# My title")
    link(title="Event page", url="https://example.org")
```

Any other Python line is shown to the audience and run. `# @inspect x` shows the value of `x`;
keep it on the same line as a one-line statement. The `# fmt: off` at the top of a talk stops code
formatters (Black on save) from splitting those lines, so leave it there.

## Sections

A section is a function, and `table_of_contents()` lists them in order.

```python
def table_of_contents() -> None:
    first_part()
    second_part()


def first_part() -> None:
    text("## First part")
```

- **Reorder:** reorder the calls in `table_of_contents()`.
- **Merge two:** move the lines of one function into the other, then delete the empty function
  and its call.
- **Add one:** write the function and call it. Start it with a `##` heading so the contents
  menu can name it.

## Translations (optional)

`text("...")` shows the same words in every language. To translate a slide, name it:

```python
text(t("welcome", "Welcome"))
```

and add a block to each `.md` file:

```markdown
<!-- @welcome -->
Bienvenue
```

**A translation wins over the English.** After you change an English slide, the French, Lingala
and Tshiluba pages keep their old text until you edit the `.md` files too. The build says which
blocks are behind (`NOT UPDATED`), using `<talk>.lock.json`; commit that file with the rest. If an
old translation is still right after a small English fix, delete the lock file and rebuild.

## A new talk

Create `my_talk.py` (with `table_of_contents()` and `main()`) and `my_talk.toml` (copy the
existing one and change the titles), run `npm run presentations`, then add the talk to
`content/talks.ts`.

`npm run test:edtrace` checks this talk's section list and key slides, so update the test when
you change them.
