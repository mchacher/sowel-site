# Spec 002: Architecture

## Content

```
src/content/articles/
├── types.ts               # Article and Block (p, h2, list, figure, pull, highlight, links)
├── index.ts              # the registry: each article in both languages; articleLinks, articlesByYear, menuLinks
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
- `Header.astro` takes an optional `inner` (home path, twin path, current article path): the section anchors and the
  brand point at the home page, the language switch at the twin article, and the Docs menu marks the current article.

## The exergue

A `blockquote` a little wider than the text (up to 46rem), with a 3px accent rule on its left, a Lucide quote mark in a
lighter accent, and Inter at weight 730 in the accent ink (readable in both themes).

## The highlight

- Block `{ kind: "highlight"; text; accent }` in `types.ts`: `accent` is words of `text`, set in the accent ink. The
  diagram is a block of its own, `{ kind: "diagram"; illustration }` (`Diagram.astro`); `illustration` holds the diagram's title and description, the hub (name, tag, icon), the two inputs it reads (`meter`, `order`: name, tag), the recipe label, the
  appliances' tag and the appliances (name, icon, `ask`, `answer`, `state`: `granted` | `waiting` | `rest`, optional
  `detail`). Icons are the `DiagramIcon` Lucide names.
- `src/components/Diagram.astro` draws the card and two SVG layouts of the diagram, inlining the Lucide icons as
  nested SVG through `Icon.astro`. The card is a size container: from 600px of content the row layout shows, below it
  the column one (at most 26rem wide). The hidden layout is `display: none`, so only one image is in the
  accessibility tree. Colours are CSS variables (`--tile` for the hub, `--surface` and `--p-50` for the appliances).
- `ArticlePage.astro` places it like the exergue (up to 50rem). `wordCount` counts its sentence.
- Checks: `compareArticles` (text and accent filled, the accent inside the text, every label filled, same number of
  appliances and same icons in both languages, at least one appliance) and `checkPage` (an SVG with `role="img"` has a
  `title` and a `desc`, referenced by `aria-labelledby` and `aria-describedby`).

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

## The Docs menu (replaces the Articles section)

- In `Header.astro`: `<details data-docs>` with a `<summary aria-controls="docs-panel">` (book icon, label, chevron;
  the label is visually hidden below 640px) and `<nav id="docs-panel" aria-label>` holding two groups, each a muted
  `p.docs__group` heading and a `ul` labelled by it. Articles come from `articleLinks(lang)` (path, href, title, date,
  reading minutes, most recent first); manual entries from `SiteCopy.nav.docs.links` (icon, title, body, href).
- Why `<details>`: it opens without script and its expanded state is native. An inline script (CSP `'self'
'unsafe-inline'` unchanged) mirrors it in `aria-expanded` and closes on Escape, outside click and focus leaving.
- Copy: `SiteCopy.nav.docs` (label, menu name, the two group headings, links). `SiteCopy.articles` and the
  registry's thumbnails are gone with the section.
- Position: from 640px the panel is absolute under the button, right-aligned, 23rem; below, `.docs` is static and the
  panel is absolute to the sticky header, `left: 0; right: 0`. `max-height: calc(100dvh - ...)` with internal scroll.
- The footer link is the article's path in `footer.links` (a comment says it becomes an index page later).

## Checks

- `scripts/lib/parity.mjs` `compareArticles` and `compareRegistry` (both languages, `/{lang}/articles/<slug>/` paths,
  no path twice, an opening paragraph) and `compareDocsMenu` (same manual pages in both languages, English without and
  French under `/fr/`, same icons), run by `scripts/check-i18n-parity.mjs`.
- `scripts/lib/html.mjs` `checkPage` with `type: "Article"` (heading ids, contents anchors, reading time, date, named
  nav landmarks, in-page anchors), `checkDocsMenu` (the disclosure named « Docs », the named panel it controls, two
  group headings, one link per article with `aria-current` on the current one, the manual's links as in the copy,
  each on https://docs.sowel.org with the language's prefix), `checkFooterArticles` (the article of the language),
  `checkNoArticlesZone` (no `id="articles"`, no `#articles` link) on the four pages, and `checkSitemap`, run by
  `scripts/check-built-html.mjs`. `scripts/check-links.mjs` resolves the menu's and the footer's internal links.

## The index of the articles

- `src/lib/articles.ts`: pure functions over a list of entries, so a test can feed them a registry of its own:
  `articleList` (newest first, then by title), `menuArticles` (the first `MENU_ARTICLES`, 3), `byYear`, `indexPath`,
  `slugOf`, `standfirstOf`, `thumbnailOf` (the first figure). `src/content/articles/index.ts` applies them to the
  registry. Tested by `scripts/articles.test.mjs` with six fake articles over two years.
- `src/pages/{en,fr}/articles/index.astro` render `ArticlesIndexPage.astro`: breadcrumb, compact tag (the number of
  articles), H1, lead, then one `section[data-year]` per year with its h2 and a list of entries. An entry is an `a`
  named by its h3 (`aria-labelledby`) and described by its standfirst; the thumbnail sits in a frame of fixed ratio
  (2:1 on a phone, 4:3 beside the text when the entry's container is 680px wide), the first one eager, the others
  lazy. `Base` takes `page.ogType: "website"` and JSON-LD of type CollectionPage with an ItemList.
- The Docs menu reads `menuLinks(lang)` and ends the group on `a.docs__all[data-docs-all]`; `Header`'s
  `inner.current` is the index path on the index, so the row carries `aria-current="page"` there.
- Checks: `checkDocsMenu` takes the expected menu articles and the index (the row is present, last of the group, leads
  to the index, marked on the index only), `checkArticlesIndex` (every article once, newest first, year headings in
  order, each entry in its year, named, dated, sized thumbnail), `checkBreadcrumb` (Sowel, a link to the index, the
  title as current page), `checkFooterArticles` with the index path, `checkSitemap` with the index pair.
