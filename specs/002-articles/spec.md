# Spec 002: Articles

**Status**: Draft, for the maintainer's review of the rendered page
**Parent**: sowel spec 209 (launch plan)
**Depends on**: spec 001 (the showcase page)

## Context

The showcase page says what Sowel is. Some ideas need more room than a section: the first is how the energy arbiter
shares the solar surplus. This spec adds a reading page for such texts, in English and French, on the same site.

## Goals

- One article, "Optimise your solar power production" / « Optimiser votre production photovoltaïque », at
  `/en/articles/optimise-your-solar-power-production/` and `/fr/articles/optimiser-votre-production-photovoltaique/`.
- A reading layout in the site's design: the night header and the footer of the home page, a column of about 68
  characters, two figures with captions, and the key sentence set in exergue as a large display quote.
- The text is the maintainer's, used as written. The two languages carry the same blocks in the same order.
- The header's language switch leads to the same article in the other language. The section menu leads back to the
  home page of the same language.
- A line under the lead of the Energy section links to the article.

## Non-goals

- No tags, no feed, no comments, no pagination yet (see « Articles index » for when it becomes one).
- No JavaScript framework, no new dependency, no third-party request. One small inline script highlights the current
  section in the contents.

## Requirements

- Content is typed (`Article`, blocks of paragraph, heading, list, figure, pull quote, links), one module per language.
- `npm run lint:i18n` compares the two articles block by block: same kinds, same order, same counts.
- Each page has its own title and description, a canonical, absolute hreflang alternates, Open Graph and Twitter
  tags (the existing social card) and JSON-LD of type Article. Both pages are in the sitemap with their pairs.
- Lighthouse stays at 100 on mobile for the four categories.
- The publication date in the structured data (2026-11-22) is the maintainer's to confirm.

## Layout pass (maintainer's review, 2026-11-22)

« Moins gros, plus orienté article, une touche UI sympathique. » The page reads as an editorial article:

- Reading scale: body 18px on a 40rem column, H1 clamp(2rem, 1.5rem + 2vw, 2.75rem), H2 about 1.5rem to 1.625rem,
  the exergue clamp(1.5rem, 1.1rem + 1.5vw, 2.25rem) with an accent rule and a quotation mark, at most 46rem wide.
- An article header: breadcrumb (Sowel / Article), the compact « Article » tag, the title, the first paragraph as the
  standfirst, a byline row (house mark avatar, the byline, the date in the language, the reading time computed at build).
- Headings carry stable ids and a # anchor shown on hover and focus. Contents: a sticky side column from 1100px with the
  current section highlighted, a folded panel under the byline below.
- A reading-progress line under the header (CSS scroll-driven animation; none where unsupported or under reduced motion).
- The figures on the home page's soft well; the closing links as a card with one button and two quiet links.
- Interface strings live in `SiteCopy.articlePage`; the article's words are unchanged.

## Articles zone and rename (maintainer's review, 2026-11-22)

- The article is renamed « Le cerveau énergétique de la maison » / "The energy brain of your home" (title, `<title>`,
  Open Graph, JSON-LD headline, the Energy section's link). Nothing was online, so the addresses change with it. The
  text, the pull quote and the meta descriptions stay.
- A section « Articles » on both home pages, `id="articles"`, between Privacy and Install: the section tag (newspaper
  icon), the title « Les idées derrière Sowel » / "The ideas behind Sowel", a one-line lead, then one card per
  article. It is a light band: the dark Privacy block sits above it and the plain Install section below, so no two
  sections that look alike touch.
- A card is one link named by the article's title: the flow view on the soft well in a fixed frame (lazy, sized), the
  date and reading time as on the article page, the title, the first paragraph clamped to three lines, and « Lire
  l'article » with an arrow. One column on a phone, the picture beside the text once the card is about 680px wide
  (from about 760px of window), a grid that takes more cards later. A slight lift on hover, none under reduced motion.
- The footer gains « Articles », on every page. The section rail and the header menu are unchanged.

Superseded by the Docs menu below: the zone is removed.

## Docs menu (maintainer's review, 2026-11-22)

« Un menu en haut, sur docs, qui renvoie aux articles, aux user guide etc. » The Articles zone of the home page is
removed; a « Docs » menu in the header gives access to the articles and the manual.

- The header's « Manuel » / « Docs » link becomes a disclosure labelled « Docs » in both languages (book icon, chevron),
  from 640px between the language switch and GitHub; below 640px an icon-only book button (accessible name « Docs »)
  between the language switch and Install.
- The panel is a named `nav` with two groups: « Articles » (one entry per article of the registry, title and reading
  time, `aria-current="page"` on the article being read) and « Manuel » / « Manual », five entries of
  docs.sowel.org in the page's language (`/fr/` in French), in this order: Getting started (`user/getting-started/`),
  User guide (`user/`), Energy (`deep-dives/energy-tour/`), Technical guide (`technical/`), Release notes
  (`release-notes/`), each with an icon and a one-line description. The manual opens in the same tab.
- It is a `<details>` element, so it opens and closes without script; a small inline script adds `aria-expanded` and
  closes it on Escape (focus back on the button), on a click outside and when focus leaves it.
- Look: a night card under the button (23rem, 14px radius, soft border, restrained shadow, scrolling inside if too
  tall), the article row tinted with the accent; on a phone the panel hangs from the header across the screen width.
  A short fade and slide, none under reduced motion.
- The footer's « Articles » leads to the article of the language (one article today; an index page once there are
  several). The line under the Energy section's lead stays. Superseded by « Articles index » below.

## Articles index (maintainer's review, 2026-11-22)

« Je ne vois pas comment ça va marcher quand il y aura plein d'articles. » A menu that lists every article and a
footer link to the only article do not hold past a handful. The list moves to an index page per language; the menu
shows the latest few.

- An index page per language, `/en/articles/` and `/fr/articles/`: the night header and the footer, the compact
  section tag of the article page (newspaper icon, the number of articles), an H1 « Articles », a one-line lead
  (« Les idées derrière Sowel, une à la fois. » / "The ideas behind Sowel, one at a time."), then every article of
  the registry, newest first, under a heading per year (h2).
- An entry is one link named by the article's title: date and reading time as on the article page, the title, the
  first paragraph clamped to three lines, a thumbnail of the article's first figure in a fixed frame (lazy, sized, no
  layout shift) and « Lire l'article » / "Read the article" with an arrow. One column on a phone, the thumbnail beside
  the text from about 680px. A slight lift on hover, none under reduced motion.
- Its own title and description, canonical, hreflang alternates (the language switch leads to the other language's
  index), Open Graph and Twitter tags through the `page` prop of `Base`, JSON-LD of type CollectionPage. Both index
  pages are in the sitemap with their pair.
- The Docs menu's Articles group shows the three most recent articles (`MENU_ARTICLES`), then a last row « Tous les
  articles » / "All articles" with an arrow, always present, leading to the index. `aria-current="page"` marks the
  article being read when it is among the three, and the « All articles » row on the index. The panel keeps a bounded
  height whatever the number of articles.
- The footer's « Articles » leads to the index of the language. The line under the Energy section's lead still leads
  to its article.
- The article's breadcrumb becomes Sowel / Articles (a link to the index) / the article's title, cut with an ellipsis
  when it is long.
- Interface strings in `SiteCopy.articlesPage` and `SiteCopy.nav.docs.all`, the same keys in both languages.
- Rule for later: when the list passes about 20 entries, the index gets pagination or a filter, in a spec of its own.

## Title (maintainer's review, 2026-11-22)

« Nulle part on comprend qu'on parle de photovoltaïque. » The article is renamed « Optimiser votre production
photovoltaïque » / "Optimise your solar power production", short and naming the subject (title, `<title>`, Open Graph,
JSON-LD, the Energy section's link, the addresses). The text and the pull quote stay.

## Approval

The maintainer reviews the rendered page before the merge. That review stands for the approval gate of this spec.
