# Spec 004: Architecture

## Content

- `src/content/articles/knowledge.fr.ts` and `knowledge.en.ts`: same blocks, same order. Registered in
  `src/content/articles/index.ts`.
- Images: `public/img/{fr,en}/devices.webp` (cropped from the core's `docs/screenshots/devices-*.png`),
  `living-room.webp` (already present), `knowledge-map.webp` (the overall scheme captured from the built page, light
  theme, 1600x900).

## Types (`src/content/articles/types.ts`)

- `Run` gains `{ code }`.
- `FigureId` gains `devices` and `room`.
- `Block` gains `knowledge` (heads, rows of devices, data and equipment, zones by tier), `chain` (steps) and `stack`
  (a base label and items on two tiers, uses and layers).
- `DiagramIcon` gains `list`, `package`, `layout-grid`, `map`.

## Rendering

- `Scheme.astro` renders the three new kinds and gives the pipeline a column count from its stages (`pipe--2`). The
  knowledge scheme is a seven-column grid on wide screens (rows of devices, data and equipment; the zones span the rows)
  and three columns on phones, the zones below.
- `ArticlePage.astro` renders `code` runs, routes the new kinds to `Scheme.astro` and gives them, and the two new
  capture frames, the wide width.

## Checks

- `scripts/lib/parity.mjs`: the new kinds are compared whole (texts blanked; icons, pills, tiers and accents kept),
  every text filled, the main list non-empty.
- `src/lib/article.ts`: `SCHEME_KINDS` lists every scheme; `wordCount` reads their captions and `code` runs.
- `scripts/check-built-html.mjs`: the new kinds count as figures.
