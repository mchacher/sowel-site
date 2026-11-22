# Spec 002: Articles

**Status**: Draft, for the maintainer's review of the rendered page
**Parent**: sowel spec 209 (launch plan)
**Depends on**: spec 001 (the showcase page)

## Context

The showcase page says what Sowel is. Some ideas need more room than a section: the first is how the energy arbiter
shares the solar surplus. This spec adds a reading page for such texts, in English and French, on the same site.

## Goals

- One article, "Who decides how your sun gets used?" / "Qui décide d'utiliser votre soleil ?", at
  `/en/articles/who-decides-how-your-sun-gets-used/` and `/fr/articles/qui-decide-d-utiliser-votre-soleil/`.
- A reading layout in the site's design: the night header and the footer of the home page, a column of about 68
  characters, two figures with captions, and the key sentence set in exergue as a large display quote.
- The text is the maintainer's, used as written. The two languages carry the same blocks in the same order.
- The header's language switch leads to the same article in the other language. The section menu leads back to the
  home page of the same language.
- A line under the lead of the Energy section links to the article.

## Non-goals

- No article index, no tags, no feed, no comments.
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

## Approval

The maintainer reviews the rendered page before the merge. That review stands for the approval gate of this spec.
