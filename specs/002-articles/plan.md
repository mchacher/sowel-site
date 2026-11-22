# Spec 002: Plan

## Steps

- [x] 1. Spec
- [x] 2. Typed content, one module per language; parity check and tests
- [x] 3. Article page, header and base props, sitemap, link from the Energy section
- [x] 4. English captures of the two views, French ones copied
- [x] 5. Built-html checks, validate, render review, Lighthouse
- [x] 6. Rename (title and addresses) and the Articles section of the home page, footer link
- [x] 7. Docs menu in the header replaces the Articles zone; footer link to the article
- [x] 8. Articles index per language, Docs menu capped at three with « All articles », footer and breadcrumb to the
      index; checks and a test with a registry of six articles
- [ ] 9. The maintainer reviews the rendered pages, then merge

## Test Plan

| Module                 | Scenario                                                            | Expected                           |
| ---------------------- | ------------------------------------------------------------------- | ---------------------------------- |
| compareArticles        | same blocks in both languages                                       | no problem                         |
| compareArticles        | a block, a list item or a bold run is missing                       | the difference is named            |
| compareArticles        | blocks in another order, a figure without alt text                  | reported                           |
| checkPage (Article)    | complete page; no alt, no pull quote, no date                       | none; each one reported            |
| checkSitemap           | both pages of a pair listed; one missing                            | none; the missing path is named    |
| compareRegistry        | complete entry; no French; bad path, reused path                    | none; each one reported            |
| compareRegistry        | no opening paragraph                                                | reported                           |
| compareDocsMenu        | same pages, right prefixes; entry missing, wrong prefix, other page | none; each one reported            |
| checkDocsMenu          | complete menu EN, FR, current article                               | no problem                         |
| checkDocsMenu          | no menu, wrong name, unnamed or uncontrolled panel                  | reported                           |
| checkDocsMenu          | missing article, wrong current, wrong manual links                  | reported                           |
| checkFooterArticles    | link to the article; to the old #articles anchor                    | none; reported                     |
| checkNoArticlesZone    | a link to #articles, an id="articles"                               | reported                           |
| articleList, byYear    | registry of six fake articles over two years                        | six entries, newest first, by year |
| menuArticles           | registry of six fake articles; of two                               | the three newest; both             |
| checkArticlesIndex     | complete index; an article missing, no year heading, unnamed entry  | none; each one reported            |
| checkDocsMenu          | capped menu with « All articles »; one too many; no « All » row     | none; each one reported            |
| checkDocsMenu          | current on the index; an article outside the three is current       | « All » marked; nothing marked     |
| checkFooterArticles    | link to the index of the language                                   | none                               |
| checkBreadcrumb        | Sowel / Articles link / title; no link to the index                 | none; reported                     |
| checkSitemap           | the index pair listed                                               | none                               |
| Built site, Playwright | index pages 390/768/1280/1440, light and dark                       | no horizontal scroll               |
| Built site, Playwright | menu open/closed, 390/768/1280/1440, four pages                     | no horizontal scroll, panel inside |
| Built site, Playwright | Enter, Space, Escape, Tab out, click outside, no JS                 | opens, closes, focus back          |
| Built site, Playwright | 1280 and 390 px, light and dark, EN and FR                          | no horizontal scroll, figures load |
