# Spec 003: Architecture

## Content

```
src/content/articles/
├── types.ts           # widened: Run gains { link, href }, ListItem, FigureId, four scheme blocks
├── index.ts           # the registry gains the comfort article
├── comfort.en.ts      # the English article
└── comfort.fr.ts      # the French article, same blocks
```

- `Run = { text } | { bold } | { link; href }`: a link inside a paragraph.
- `ListItem = string | { lead; text }`: a bullet that opens on a bold lead.
- `FigureId = "flow" | "arbiter" | "strip" | "activity"`: `activity` is a tall capture kept 26rem wide and centred.
- Schemes, each `{ kind; label; caption; ... }`:
  - `topology`: zones with a `level` (0 to 2), an icon and values (`on` marks a presence, in the accent ink).
  - `pipeline`: stages with a name, tag, icon, rows (`key`, `value`, optional `pill`: `room` or `on`), `raw` for the
    mono face, `accent` for the outlined stage.
  - `form`: a title, a subtitle and rows (`{ label; value }` or `{ group }`).
  - `layers`: items with a name, body, note, icon, `accent`.
- `DiagramIcon` gains `radio`, `house`, `layers`, `door-closed`, `arrow-left-right` (Lucide, inlined at build).

## Components

- `src/components/Scheme.astro` renders the four schemes inside `<figure class="fig scheme scheme--<kind>">`, on the
  article's soft well, with the caption as `figcaption` (id referenced by `aria-describedby`). The image is the inner
  element `role="img"` named by `aria-label`. Cards, outlines and pills come from the site tokens; the pipeline and
  layers stack in one column under 700px, arrows turned down.
- `ArticlePage.astro` renders link runs (`.inline`), bold-lead lists (`.list--lead`), the schemes, and the activity
  figure. Its figure styles are global under `.prose` so the schemes share them; the pipeline and layers schemes take
  the wide measure of the arbiter figure.
- `Recipes.astro` shows `recipes.article` under its lead (`SiteCopy.recipes.article`, both languages).

## Checks

- `scripts/lib/parity.mjs` compares the new kinds: label and caption filled, same number of parts, the same shape part by
  part (levels, icons, pills, states, flags) with every text filled; list items with a bold lead in both languages or
  neither; link runs with a target.
- `scripts/lib/html.mjs` `checkPage` takes `figures`, the number of figure and scheme blocks of the article
  (`check-built-html.mjs` counts them); a capture needs an alt text, a scheme a name.
- `src/lib/article.ts` `wordCount` reads link runs, list leads and scheme captions; `runText` is shared with
  `standfirstOf`.
