# Spec 001: Architecture

## Stack

- **Astro**, static output (`output: "static"`), no UI framework, one island at most (the copy button, plain script).
- **TypeScript strict** for the config and the content loaders.
- **Node 24**, same as the core. `npm run validate` is the single verdict, as in the core.
- Fonts (Inter, JetBrains Mono) self-hosted from `public/fonts/`, subset to the glyphs the site uses.
- No CSS framework: one stylesheet of tokens and a few component rules, in the product's design language.

## Layout

```
sowel-site/
├── astro.config.mjs            # site, i18n (en default, fr), static output
├── src/
│   ├── content/
│   │   ├── en.ts               # every string of the page, one entry per section
│   │   └── fr.ts               # same keys; the parity check compares the two
│   ├── layouts/Base.astro      # head, hreflang, canonical, Open Graph, JSON-LD, theme
│   ├── components/             # Header, Hero, Home, Rooms, Recipes, Privacy, Install, Community, Footer, Page
│   ├── pages/
│   │   ├── index.astro         # language picker (JS redirect + noscript links)
│   │   ├── en/index.astro
│   │   ├── fr/index.astro
│   │   └── 404.astro
│   └── styles/tokens.css       # colours, spacing, radii, sizes from the product
├── public/
│   ├── fonts/  media/          # self-hosted fonts; film (mp4), poster, captions (vtt)
│   ├── og/                     # social card
│   └── CNAME                   # sowel.org
├── scripts/
│   ├── check-i18n-parity.mjs   # same keys in en.ts and fr.ts, no empty value
│   ├── check-external-requests.mjs  # built HTML/CSS reference only this origin
│   └── check-links.mjs         # internal links and anchors resolve
├── specs/NNN-name/{spec,architecture,plan}.md
├── .github/workflows/          # ci.yml, deploy.yml (Pages), gitleaks.yml
└── CLAUDE.md  .claude/skills/  # tooled like the core and the demo repos
```

## Content model

`en.ts` and `fr.ts` export the same typed object (`SiteCopy`): one key per section, each with its title, body
paragraphs, list items and image alt text. Components receive the object for the page's language and contain no
text. The TypeScript type makes a missing key a compile error; the parity script also rejects an empty string.

## Language handling

Astro i18n routing, `en` default. `/` is a tiny page: an inline script reads `navigator.language` and calls
`location.replace`; the `<noscript>` block links both languages. No cookie, no `localStorage`. Every page declares
`<link rel="alternate" hreflang>` for both languages and `x-default`.

## Film

Files in `public/media/`: `sowel-launch-720p.mp4`, `sowel-launch-poster.jpg`, `sowel-launch.en.vtt`,
`sowel-launch.fr.vtt` (when available). Markup: `<video controls preload="none" poster playsinline>` with a
`<track>` per language and a fallback `<a>` to the mp4. The file is committed once; replacing it adds its size
again to the history, so the film is revised rarely and deliberately.

## Build, checks, deploy

| Step                  | What                                                                                                            |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `npm run validate`    | typecheck (`astro check`), lint, `format:check`, i18n parity, `astro build`, external-request check, link check |
| CI (`ci.yml`)         | `validate`, then Lighthouse CI on the built site, mobile profile, budgets of 95 and the weight limits           |
| Deploy (`deploy.yml`) | on push to `main`: build, upload the Pages artifact, deploy. No branch publishes                                |
| Secrets               | gitleaks in CI and pre-commit, like the other repos                                                             |
| Ruleset               | `main-protection`: PR required, linear history, required checks named as the CI jobs                            |

## DNS and domain (by the maintainer)

- Apex `sowel.org`: records pointing at GitHub Pages (Cloudflare CNAME flattening or the four GitHub `A`/`AAAA`
  records), proxy status **DNS only** so GitHub can issue and renew the certificate.
- `www.sowel.org`: CNAME to the Pages host, redirected to the apex by Pages.
- `docs.sowel.org` is untouched.
- Until the DNS change, the site is reachable at its GitHub Pages address; all internal links are relative.
- Enforce HTTPS in the Pages settings once the certificate exists.

## Security and privacy

- No third-party script, font, image, frame or analytics. The external-request check reads the built output and
  fails on any absolute URL whose host is not on a short allow-list (the site itself, `github.com` and
  `docs.sowel.org` for plain links, which are navigation, not loaded resources).
- Plain `<a href>` links to GitHub and the manual are fine. Nothing is fetched from them.
- Headers GitHub Pages cannot set (CSP) are replaced by a `<meta http-equiv="Content-Security-Policy">`
  restricting everything to `'self'`.
- Copy button uses the Clipboard API on user click only.

## Boundaries with the core

- The site never calls the Sowel API or reads the registry at runtime. Any figure (stars, releases) is typed by
  hand at build time or omitted; v1 shows none.
- The logo and tokens are copied from the core (`docs/assets/logo-master.svg`, `design-system/tokens.md`) with the
  source and date noted in `src/styles/tokens.css`; a change of identity is a copy, not a link.
- Screenshots come from the core's `docs/assets/readme/`, copied.

## File changes in the core repository (later, not in this spec's first PRs)

- Retire `docs/stylesheets/extra.css` landing rules and `docs/javascripts/landing.js`; `docs/index*.md` become a
  plain manual home. That is its own PR and spec amendment in `sowel`, after the site is live.
