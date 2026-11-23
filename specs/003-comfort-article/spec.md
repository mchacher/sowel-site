# Spec 003: Article on comfort, knowledge of the home and recipes

**Status**: Approved by the maintainer (text reviewed in six rounds, 2026-11-23)
**Parent**: sowel spec 209 (launch plan)
**Depends on**: spec 002 (articles)

## Context

The first article explains the energy arbiter. The second explains the other original part of Sowel: the platform
organises knowledge of the home (equipment, zones, aggregation along the topology), and each use is handed to a recipe,
a proven automation that encapsulates the complexity and that the user configures. It closes on the arbiter and links to
the first article.

## Goals

- One article, "Simply optimise the comfort of your home" / « Optimiser simplement le confort de votre maison », at
  `/en/articles/simply-optimise-the-comfort-of-your-home/` and
  `/fr/articles/optimiser-simplement-le-confort-de-votre-maison/`, dated 2026-11-23.
- The text is the maintainer's, reviewed in a local review page over six rounds, then a style pass; the English is a
  translation of the approved French.
- Running example: the « Lumière dimmable sur mouvement » / "Motion Light (Dimmable)" recipe in the living room of the
  demo house. Every behaviour the article lists is in that recipe's code (aggregated motion, timer armed when the room
  empties, lux threshold with a 10% hysteresis, inactive by day, three brightness slots, manual override until the room
  is empty, timers kept across a restart, safety auto-off, activity log).
- Figures: a topology scheme (zones and the values computed for each), the ground floor strip capture, a pipeline scheme
  (devices, then the room, then the recipe), the recipe form scheme, the living room activity capture, and a closing
  scheme of the three layers (knowledge, recipes, arbiter).
- A line under the lead of the home page's Recipes section links to the article, as the Energy section does for the first.
- The article joins the registry: index pages, Docs menu, sitemap and checks pick it up.

## Non-goals

- No new capture: the strip and activity views already exist in both languages.
- No change to the first article.

## Requirements

- New block kinds, typed and compared by the parity check: `topology`, `pipeline`, `form`, `layers` (each named by a
  `label` and captioned), list items with a bold lead, and links inside a paragraph.
- A scheme is an HTML element `role="img"` named by its label and described by its caption; the built-html check counts
  the figures of each article from its blocks and requires a name on every scheme and an alt text on every capture.
- No third-party request, no script added. Amber is used only for the « Allumées » / "On" state of the sconces.
- Wording rules (spec 209): no « unique », no em dash, no middle dot. French non-breaking spaces.

## Maintainer decisions

- The section « Écrire une recette est devenu simple » says that an AI coding assistant writes a complete recipe today,
  for whoever develops, because Sowel exposes its knowledge through simple interfaces. This is about writing code with an
  AI, not the no-code AI recipe tool, which stays « coming soon » on the home page; the article does not mention that
  tool. Decided by the maintainer on 2026-11-23.
- The French manual has no recipes page yet: the closing link points at the English chapter and says so.

## Approval

The maintainer approved the French text in the review page and asked for the translation, the merge and the push
(2026-11-23).
