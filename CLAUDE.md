# CLAUDE.md

Guidance for Claude Code (and any AI agent) working on `sowel-site`. First file to read. Same method as the Sowel core: spec with gates, feature branch, review, PR, explicit merge approval.

## What this is

The showcase site of Sowel, served at `sowel.org`: one bilingual page (`/en/`, `/fr/`) that says what Sowel is, shows it and lets a visitor install it. It reads public facts only and adds nothing to the product. The manual stays on `docs.sowel.org` (core repository).

| Repository               | Nature                       |
| ------------------------ | ---------------------------- |
| `sowel`                  | The product and its manual   |
| `sowel-site`             | This one, the showcase       |
| `sowel-showroom` and kin | The public demo, second wave |

The launch plan this site belongs to is spec 209 in the core: `specs/209-launch-plan/` in `mchacher/sowel`. The message rules (promise, wording, what never to say) are in its `spec.md`, « Message architecture ». Read them before writing any copy.

## Where to find context

| You want to know...                       | Read this                                                         |
| ----------------------------------------- | ----------------------------------------------------------------- |
| What the page contains and why            | `specs/001-the-showcase-page/spec.md`                             |
| Stack, layout, content model, deploy, DNS | `specs/001-the-showcase-page/architecture.md`                     |
| Steps and the test plan                   | `specs/001-the-showcase-page/plan.md`                             |
| The product's visual identity             | `src/styles/tokens.css` (copied from the core's `design-system/`) |
| The wording rules                         | core `specs/209-launch-plan/spec.md`, « Message architecture »    |

## Non-negotiable rules

- **No third-party request.** No script, font, image, frame or analytics from another host. `npm run lint:built` fails the build on one. Plain `<a href>` links are navigation, not loads.
- **No cookie, no storage, no tracker.** The site practises what it promises.
- **Copy lives in `src/content/en.ts` and `fr.ts` only**, typed by `SiteCopy`. Components hold no text. A key present in one language and not the other fails `npm run lint:i18n`.
- **Wording**: never « unique », never « sandboxed », never « no network traffic ». Say « about twenty integrations ». AI recipes are « coming soon »: the dedicated tool is not shipped, so never say it is possible today, never promise one click, and never ask anyone to read code (the audience is not developers). Privacy is « no Sowel cloud, no telemetry, your data stays at home ».
- **No em dash and no middle dot** in visible text. Sentence-case labels. In French, a non-breaking space before `:` `;` `?` `!` and inside « guillemets ».
- **Amber** is for « on, running now » only. Ocean blue `#1A4F6E` carries ink and fills.
- **Nothing about another product is published without a source and a date**, and the maintainer has read it.
- **The film is committed once, deliberately** (`public/media/`). Replacing it adds its size to the history again.
- **Never commit a credential.** Gitleaks runs on commit and in CI.

## Tech

Astro (static output), TypeScript strict, no UI framework, Node 24. Fonts self-hosted in `public/fonts/`.

```bash
npm install
npm run dev          # Astro dev server
npm run validate     # format, astro check, i18n parity, tests, build, built-output checks, specs completeness: what CI runs
```

## Git workflow

- Feature branches: `feat/`, `fix/`, `refactor/`, `docs/`. Main is protected (PR required, linear history, CI green).
- Conventional commits. Scopes: `site`, `content`, `i18n`, `media`, `ci`, `specs`, `docs`.
- **Never merge a PR without explicit user approval** ("oui", "merge", "go").
- **Never add `Co-Authored-By: Claude` lines** to commits or PR bodies.
- Every new `specs/NNN-name/` folder needs `spec.md`, `architecture.md` and `plan.md` (CI gate).
- The GitHub Pages deploy stays manual until the maintainer switches it on (spec 001, step 6). DNS is the maintainer's.

## Skills

| Skill          | When                                                             |
| -------------- | ---------------------------------------------------------------- |
| `site-feature` | A change to the site: spec, branch, tests, review, PR, merge go. |

## Answering the user

Short and ordered. One or two lines for the what, one bullet per finding or decision. French or English, whichever the user uses.
