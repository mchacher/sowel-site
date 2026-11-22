# Spec 002: Architecture

## Content

```
src/content/articles/
├── types.ts               # Article and Block (p, h2, list, figure, pull, links)
├── sun-arbiter.en.ts      # the English article
└── sun-arbiter.fr.ts      # the French article, same blocks
```

A paragraph is a list of runs (plain or bold). A figure carries its image (source, alt text, size) and its caption.
Each article states its own path and the path of its twin (`otherPath`).

## Pages and components

- `src/pages/{en,fr}/articles/<slug>/index.astro` pass the site copy and the article to `ArticlePage.astro`.
- `ArticlePage.astro` renders the blocks and holds the reading styles. It builds the Article JSON-LD.
- `Base.astro` takes an optional `page` (meta, alternates, JSON-LD) for inner pages; without it the home page is unchanged.
- `Header.astro` takes an optional `inner` (home path, twin path): the section anchors and the brand point at the home
  page, the language switch at the twin article.

## The exergue

A `blockquote` of the article column, wider than the text (up to 64rem) on large screens and the full width on a
phone, with a 2px accent rule above and Inter at weight 800, tight, in the accent ink (readable in both themes).
No script.

## Figures

The flow view is the width of the column. The arbiter table is wide: it breaks out of the column on large screens
and scrolls sideways inside its frame (focusable, labelled by its caption) on a phone. Images are
`public/img/{en,fr}/article-{flow,arbiter}.webp`, captured from the demo stack in each language.

## Checks

- `scripts/lib/parity.mjs` `compareArticles`, run by `scripts/check-i18n-parity.mjs`.
- `scripts/lib/html.mjs` `checkPage` with `type: "Article"` and `checkSitemap`, run by `scripts/check-built-html.mjs`.
