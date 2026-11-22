# Spec 002: Plan

## Steps

- [x] 1. Spec
- [x] 2. Typed content, one module per language; parity check and tests
- [x] 3. Article page, header and base props, sitemap, link from the Energy section
- [x] 4. English captures of the two views, French ones copied
- [x] 5. Built-html checks, validate, render review, Lighthouse
- [x] 6. Rename (title and addresses) and the Articles section of the home page, footer link
- [ ] 7. The maintainer reviews the rendered pages, then merge

## Test Plan

| Module                 | Scenario                                           | Expected                           |
| ---------------------- | -------------------------------------------------- | ---------------------------------- |
| compareArticles        | same blocks in both languages                      | no problem                         |
| compareArticles        | a block, a list item or a bold run is missing      | the difference is named            |
| compareArticles        | blocks in another order, a figure without alt text | reported                           |
| checkPage (Article)    | complete page; no alt, no pull quote, no date      | none; each one reported            |
| checkSitemap           | both pages of a pair listed; one missing           | none; the missing path is named    |
| compareRegistry        | complete entry; no French; bad path, reused path   | none; each one reported            |
| compareRegistry        | no sized thumbnail; no opening paragraph           | reported                           |
| checkArticlesSection   | one named card; no section, no card, two cards     | none; each one reported            |
| checkArticlesSection   | card not named by its title, thumbnail not lazy    | reported                           |
| checkFooterArticles    | link to the same language; to the other language   | none; reported                     |
| Built site, Playwright | Articles section, 1280/768/390, light and dark     | card layout, no horizontal scroll  |
| Built site, Playwright | 1280 and 390 px, light and dark, EN and FR         | no horizontal scroll, figures load |
