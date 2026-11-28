# Spec 005: Tutorials, architecture

## Content

- `src/content/tutorials/{pi-install,light-on-motion}.{en,fr}.ts`: one `Article` per language, `type: "tutorial"`,
  `duration`, blocks. Generated once from the reviewed drafts, edited by hand from now on.
- `src/content/tutorials/index.ts`: the registry (`tutorials`, in reading order), `tutorialLinks(lang)` for the menu.
- `src/content/articles/types.ts`: new blocks `items` (runs per item, numbered or not), `code` (`cmd`, `output?`),
  `file` (`name`, `content`), `callout` (`tone`, `title`, `runs`), `table` (`head`, `rows` of runs), `shot` (image and
  caption). `Article` gains the optional `type` and `duration`.
- Copy: `nav.docs.tutorials` and `tutorialPage` (tag, trail, contents title, callout tags, copy labels) in `en.ts`
  and `fr.ts`.
- Screenshots in `public/img/fr/tutorials/`, used by both languages until the English ones exist.

## Rendering

- `ArticlePage.astro` renders a tutorial: the tag, the trail and the contents title come from `tutorialPage`, the
  byline shows the duration. The tutorial blocks go to `TutorialBlock.astro`; `Runs.astro` renders a run list.
- Copy buttons reuse the global `[data-copy]` handler of `Base.astro`. No new script on the page.
- Routes: `src/pages/en/tutorials/[slug]/index.astro`, `src/pages/fr/tutoriels/[slug]/index.astro`. The sitemap
  lists the pairs.

## Docs menu

`Header.astro`: the three groups are `section[data-docs-sec]` inside the panel, each keeping its `p.docs__group`
heading. A rail of buttons (`data-docs-tab`) precedes them, hidden until the inline script adds `docs--tabs`; it then
shows the pane named by the panel's `data-active` (the current page's group, else Articles). Mouse hover, click or
tap switch it; focus entering a pane selects it, so the keyboard reaches every entry. On a phone the rail is a row
of tabs above the pane.

## Checks

- `scripts/lib/parity.mjs`: the new blocks compared by shape; `compareRegistry` takes the folder per language.
- `scripts/lib/html.mjs`: `checkDocsMenu` accepts `tutorials` (a third group, each linked once, the current marked);
  `checkPage` accepts `tutorial` (no exergue, hreflang to tutorials).
- `scripts/check-built-html.mjs` checks the tutorial pages and their sitemap entries.
