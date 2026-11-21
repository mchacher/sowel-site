# sowel-site

The showcase site of [Sowel](https://github.com/mchacher/sowel), served at `sowel.org`: one page, in English and in French, that says what Sowel is, shows it and lets a visitor install it.

Static (Astro), no third-party request, no cookie. The manual lives on [docs.sowel.org](https://docs.sowel.org).

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run validate   # what CI runs
```

## Change the text

All copy is in `src/content/en.ts` and `src/content/fr.ts`, one entry per section. Components hold no text. A key present in one language and missing in the other fails `npm run lint:i18n`.

## Deploy

Every push to `main` publishes the site to GitHub Pages (`.github/workflows/deploy.yml`), at https://mchacher.github.io/sowel-site/ until the DNS of sowel.org points at GitHub. The workflow header says how to switch to sowel.org.

## Specs

`specs/NNN-name/{spec,architecture,plan}.md`. Start with `specs/001-the-showcase-page/`. Working notes for AI agents: `CLAUDE.md`.

## Licence

AGPL-3.0, like Sowel.
