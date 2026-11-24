# Spec 004: Article on how Sowel organises the knowledge of the home

**Status**: Approved by the maintainer (text reviewed in four rounds, 2026-11-24)
**Parent**: sowel spec 209 (launch plan)
**Depends on**: specs 002 (articles) and 003 (schemes drawn in HTML)

## Context

The article on comfort touches the knowledge of the home in passing. This one details it, since the rest of Sowel rests
on it: setting up home automation is hard because the user has to name, link and combine hundreds of data points, and
Sowel takes this work on in three layers.

## Goals

- One article, "Organise the knowledge of your home" / « Organiser la connaissance de votre maison », at
  `/en/articles/organise-the-knowledge-of-your-home/` and `/fr/articles/organiser-la-connaissance-de-votre-maison/`,
  dated 2026-11-24.
- The text is the maintainer's, reviewed in a local review page over four rounds; the English is a translation of the
  approved French.
- Structure: the problem (what an ordinary system sees), then the three layers: standardised and checked data (the
  common data model: category, unit and type, combining rule; quality checks), equipment (the type as a contract,
  several devices in one piece of equipment, hardware replaced without loss), zones (the hierarchy, aggregation rules,
  zone-wide orders); live propagation and history; what the organisation makes possible; a conclusion that opens on the
  MCP server Sowel will offer soon.
- Figures: an overall knowledge scheme (a lamp, a presence sensor and the garage door, from devices to zones, showing
  that a device can give several data points and a piece of equipment can join several devices), a flat-list versus
  Sowel scheme, the device list capture, a data model scheme, a garage door scheme, a topology scheme, the living room
  capture, a propagation chain and a closing stack.
- The article's card on the index uses a capture of the overall knowledge scheme, per language.
- The article joins the registry: index pages, Docs menu, sitemap and checks pick it up.

## Non-goals

- No link from a home page section (the article is reached from the index and the Docs menu).
- No change to the other articles.

## Requirements

- New block kinds, typed and compared whole by the parity check: `knowledge`, `chain`, `stack`. A raw name inside a
  paragraph is a `code` run. A pipeline may have two stages. Two capture frames: `devices` and `room`.
- Every scheme is an HTML element `role="img"` named by its label and described by its caption; the built-html check
  counts the new kinds as figures.
- No third-party request, no script added. Amber only for « 2 allumés sur 3 » / "2 of 3 on".
- Wording rules (spec 209): no « unique », no em dash, no middle dot, French non-breaking spaces. AI stays in the future
  tense (« proposera prochainement » / "will soon offer").

## Facts checked against the core

- About forty data categories (`DataCategory`, `src/shared/types.ts`).
- Freshness judged on each source's cadence and offline equipment left out of zone aggregation (specs 116, 175),
  low-battery alerts (spec 143), order outcome checked from the reported state and orders replayed once when an
  integration reconnects (specs 141, 188).
- History is tagged by equipment (`HistoryWriter`), so it survives a device swap.
- A garage door driven by a pulse on a relay is a `gate` equipment; the article does not name the type.

## Approval

The maintainer approved the French text in the review page and asked for publication on sowel.org (2026-11-24).
