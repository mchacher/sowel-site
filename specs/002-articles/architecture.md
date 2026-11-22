# Spec 002: Architecture

## Content

```
src/content/articles/
├── types.ts               # Article and Block (p, h2, list, figure, pull, links)
├── index.ts              # the registry: each article in both languages, its thumbnail, the cards
├── energy-brain.en.ts    # the English article
└── energy-brain.fr.ts    # the French article, same blocks
```

A paragraph is a list of runs (plain or bold). A figure carries its image (source, alt text, size) and its caption.
Each article states its own path and the path of its twin (`otherPath`).

## Pages and components

- `src/pages/{en,fr}/articles/[slug]/index.astro` build one page per registry entry (`getStaticPaths`, the slug is the
  last segment of the article's `path`) and pass the site copy and the article to `ArticlePage.astro`.
- `src/pages/sitemap.xml.ts` lists every registry pair.
- `ArticlePage.astro` renders the blocks and holds the reading styles. It builds the Article JSON-LD.
- `Base.astro` takes an optional `page` (meta, alternates, JSON-LD) for inner pages; without it the home page is unchanged.
- `Header.astro` takes an optional `inner` (home path, twin path): the section anchors and the brand point at the home
  page, the language switch at the twin article.

## The exergue

A `blockquote` a little wider than the text (up to 46rem), with a 3px accent rule on its left, a Lucide quote mark in a
lighter accent, and Inter at weight 730 in the accent ink (readable in both themes).

## Reading interface

- `src/lib/article.ts`: heading ids (slug, made unique), word count and reading time (200 words a minute, rounded up),
  the date in the language (`Intl.DateTimeFormat`). Tested by `scripts/article.test.mjs`.
- `SiteCopy.articlePage`: eyebrow, breadcrumb, contents title, reading time (`{n}`), anchor label (`{h}`).
- From 1100px the page is a grid: contents (sticky), text column, and room on the right for the wide figure. An inline
  script (IntersectionObserver) sets `aria-current` on the current section's link.
- The progress line is `animation-timeline: scroll(root)` behind `@supports`, off under reduced motion.

## Figures

Both sit on the soft well of the home page. The flow view is the width of the column. The arbiter table is wide (up to
56rem): it extends to the right of the column on large screens
and scrolls sideways inside its frame (focusable, labelled by its caption) on a phone. Images are
`public/img/{en,fr}/article-{flow,arbiter}.webp`, captured from the demo stack in each language.

## The Articles section

- `src/components/Articles.astro`, between Privacy and Install in `Page.astro`, a `section--band`. Copy in
  `SiteCopy.articles` (eyebrow, title, accent, lead, the card's link label); the reading time reuses
  `articlePage.readingTime`.
- `articleCards(lang)` in the registry gives slug, href, title, standfirst (the first paragraph), date, reading time
  (`readingMinutes`, as the article page) and thumbnail, most recent first.
- The card is a single `<a>` with `aria-labelledby` on its `h3` and `aria-describedby` on the standfirst; the
  thumbnail is decorative (`alt=""`). The list is `repeat(auto-fit, minmax(min(100%, 22rem), 1fr))`; each item is a
  size container and the card lies down at `@container (min-width: 680px)`.
- The footer link is `withBase("/{lang}/#articles")` in `footer.links`.

## Checks

- `scripts/lib/parity.mjs` `compareArticles` and `compareRegistry` (both languages, `/{lang}/articles/<slug>/` paths,
  no path twice, a sized thumbnail, an opening paragraph), run by `scripts/check-i18n-parity.mjs`.
- `scripts/lib/html.mjs` `checkPage` with `type: "Article"` (heading ids, contents anchors, reading time, date, named
  nav landmarks, in-page anchors), `checkArticlesSection` (one card link per article in `#articles`, named by its
  title, a lazy sized thumbnail), `checkFooterArticles` (every page) and `checkSitemap`, run by
  `scripts/check-built-html.mjs` over the registry. `scripts/check-links.mjs` resolves the card links and the footer
  anchor.
