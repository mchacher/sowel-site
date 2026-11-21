# Spec 001: The showcase page

**Status**: Draft, waiting for the maintainer's approval
**Parent**: sowel spec 209 (launch plan), step 2
**Depends on**: the pitch and the message rules of spec 209 (`specs/209-launch-plan/spec.md`, « Message architecture »)

## Context

Sowel has a manual (`docs.sowel.org`), a GitHub storefront (README, topics, description) and a film. It has no
place that says in one screen what Sowel is, shows it and lets a visitor install it. `docs.sowel.org` does four
jobs at once and sells a mechanism (recipes) instead of a result. This repository is that place: a small static
site at `sowel.org`.

It reads public facts only and adds nothing to the product.

## Goals

- A visitor understands the promise in ten seconds: **Sowel knows your home, so it runs itself, is set up in a
  few clicks, and your data stays at home.**
- The film plays on the page, from the site itself.
- The install command is one click away, and works.
- FR and EN are the same page, written once each, kept in step by a check.
- The site practises what it promises: no third-party request, no cookie, no tracker.

## Non-goals

| Not here                                   | Where                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| The manual, the API, plugin docs, specs    | `docs.sowel.org`, in the core repository                                        |
| The public demo                            | `sowel-showroom`, second wave                                                   |
| « The Sowel Method » article and the case  | Step 3 of spec 209; this spec leaves a menu slot and a route for it             |
| A blog, a changelog, search                | Not planned. Release notes stay on `docs.sowel.org`                             |
| Any endpoint, telemetry or change in Sowel | Forbidden by spec 209. A need of the site that the product lacks becomes an issue |
| A short `sowel.org/install.sh`             | Dropped in spec 209 (2026-11-21). The long command stays                        |

## Functional requirements

### Pages and routes

- `/en/` and `/fr/`: the same single page, one per language.
- `/`: picks a language from `navigator.language` (French if it starts with `fr`, English otherwise) with a
  `<noscript>` link to both. No cookie, no storage.
- A language switch in the header links to the same section in the other language.
- `/404.html` in both languages.
- Reserved, not built: `/en/method/` and `/fr/method/` (step 3).

### Sections, in this order

1. **Hero**: the promise, the install command with a copy button, the film (see below).
2. **Everything starts from your home**: topology (zones in zones), equipment (what is in the room, resting on
   one or more devices), the data model (about thirty equipment types). One screenshot of the living room.
3. **Rooms that know**: what a room computes alone (temperature, presence, open windows, lights, power) and the
   modes over the whole home.
4. **Recipes**: ready-made, placed on a room, each a real program; one example per row (thermostat, watering,
   ventilation, safety). The AI line: « possible today with an AI assistant ».
5. **Energy** (hidden until step 3 supplies one real, numbered case): the arbiter sends the solar surplus to the
   water heater then the car.
6. **Your data stays at home**: runs on your hardware, no account, no Sowel cloud, no telemetry, plugins checked
   before install.
7. **Install**: the one command, three short steps after it, link to the manual.
8. **Honest comparison** with Home Assistant and Jeedom (see below).
9. **Community**: GitHub, Discussions, the manual, the release notes. A chat channel only if the maintainer decides one.
10. **Footer**: AGPL licence, GitHub, `docs.sowel.org`.

### The film

- Self-hosted: an mp4 in this repository, served by GitHub Pages. The 720p file (1:43, about 9 MB) is the default.
- `<video controls preload="none" poster>`: nothing downloads before the visitor presses play.
- Captions: a WebVTT track in each language. If the spoken lines are not yet available as text, the film ships
  without captions and the gap is a tracked item, not a silent omission.
- If it fails to load, the poster stays and a plain link to the file is shown.

### The comparison

An honest table, not a score: what each of Sowel, Home Assistant and Jeedom starts from, who it suits, what it
asks of you. Rules:

- Every claim about another product is checked against its documentation on the day it is written, and the page
  carries the date.
- Sowel's weaknesses are stated (younger, smaller community, fewer integrations, no hosted option).
- No claim of being unique or better. « Natively, with nothing to configure » is allowed where it was verified.

### Wording

The copy follows the rules of spec 209: promise as fixed on 2026-11-15, « about twenty integrations », « no Sowel
cloud, no telemetry, your data stays at home », plugins « hash-checked and scoped », never « sandboxed ». The
texts live in two content files (EN, FR), one entry per section, so a wording change is one edit and the parity
check catches a missing translation.

### Visual identity

The product's: Inter for text, JetBrains Mono for the command only, ocean blue `#1A4F6E`, amber `#F2C035` for
« on, running now » only, sentence-case labels, the master-weight logo from the core repository. Fonts are
self-hosted. Light and dark follow the visitor's system setting.

## Non-functional requirements

| Requirement   | Target                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------- |
| Weight        | Page without the film: under 500 KB transferred, JavaScript under 20 KB                         |
| Speed         | Lighthouse performance, accessibility, best practices and SEO each 95 or more, on mobile        |
| Privacy       | Zero request to a host other than the site's own. Checked in CI on the built HTML and CSS       |
| Accessibility | Keyboard reachable, visible focus, contrast checked in both themes, captions, alt text, `lang`  |
| Works without JS | Everything readable and the film playable; only the copy button and the root redirect need JS |
| SEO           | `hreflang` pairs, canonical URLs, one `h1` per page, Open Graph and social card, `SoftwareApplication` JSON-LD |

## Edge cases

- Visitor with JavaScript off lands on `/`: sees two language links.
- Visitor on a slow link: the page is usable before any media; the film never loads on its own.
- The install command is selected by hand: it is one line, with no hidden characters.
- A language misses a string: the parity check fails the build.
- `sowel.org` not yet pointing at GitHub: the site works at its GitHub address, with relative links only.

## Open points

- **Analytics.** Spec 209 allows « a privacy-friendly page counter ». Recommended default: none in v1, public
  counters only (stars, pulls, release downloads), decided again after the launch.
- **Promise wording.** Read by about five people before the launch. The copy sits in content files, so it can
  change after approval of this spec without touching it.
- **Chat channel.** Discord or none, the maintainer decides; the community section works without it.

## Acceptance criteria

- [ ] `/en/` and `/fr/` render the ten sections in order (section 5 hidden until a real case exists)
- [ ] The film plays from the site, with `preload="none"`, a poster and the fallback link
- [ ] The install command copies in one click and is exactly the documented command
- [ ] The comparison cites its sources and carries a date
- [ ] CI fails on: a missing translation, a broken internal link, a request to a foreign host, Lighthouse under 95
- [ ] `sowel.org` serves the site over HTTPS; the `/` redirect and the language switch work
- [ ] Page weight and JavaScript budgets met

## Docs delta

- This repository: `README.md` (what it is, how to run it, how to change the copy), `CLAUDE.md`.
- Core repository, in the PR that retires the scroll-flip landing (later, step 2 end): `docs/index.md` and
  `docs/index.fr.md` become the manual's home; the README points to `sowel.org`.
- No change to a page of the manual in this spec's own PRs.
