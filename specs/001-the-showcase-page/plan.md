# Spec 001: Plan

## Steps

- [x] 1. Repository: create `mchacher/sowel-site` (public), tool it like the core: `CLAUDE.md`, `site-feature` and
      `site-release` skills, CI, gitleaks, husky, Prettier, specs completeness check, `main-protection` ruleset
- [x] 2. Scaffold Astro, tokens, fonts, base layout (head, hreflang, theme), `validate` script, empty pages `/en/` `/fr/` `/`
- [x] 3. Content files and the sections, EN then FR, (no comparison section: dropped on 2026-11-21)
- [x] 4. The film: 720p file, poster, fallback, captions when the text exists
- [ ] 5. Checks: i18n parity, external requests, links, Lighthouse CI budgets
- [ ] 6. Deploy to GitHub Pages, then the DNS change by the maintainer, then HTTPS enforced
- [ ] 7. In `sowel`: README points to `sowel.org`; plan of spec 209 ticks step 2 (the landing retirement is a later PR)

Each step is one PR in `sowel-site`, one commit family, merged on the maintainer's go.

## Gates

- Any claim about another product is published only with a source and a date, and after the maintainer has read it. The comparison section was dropped on 2026-11-21; this gate applies if one comes back.
- The promise wording is read by about five people before the launch (step 4 of spec 209), not before this build.
- `sowel.org` is switched only when `/en/` and `/fr/` pass every check at the Pages address.

## Test Plan

### Modules to test

- `scripts/check-i18n-parity.mjs`, `check-external-requests.mjs`, `check-links.mjs`
- The content loaders and the `SiteCopy` type
- The language picker script on `/`
- The built output (budgets)

### Scenarios

| Module                  | Scenario                                            | Expected                                      |
| ----------------------- | --------------------------------------------------- | --------------------------------------------- |
| check-i18n-parity       | `fr.ts` lacks a key present in `en.ts`              | exits non-zero, names the key                 |
| check-i18n-parity       | a value is an empty string                          | exits non-zero                                |
| check-i18n-parity       | both files carry the same keys                      | exits zero                                    |
| check-external-requests | built HTML loads `https://fonts.googleapis.com/...` | exits non-zero, names the file and host       |
| check-external-requests | an `<a href="https://github.com/...">` only         | exits zero (navigation, not a load)           |
| check-external-requests | a `<script src>` or `<img src>` on a foreign host   | exits non-zero                                |
| check-links             | an internal anchor that does not exist              | exits non-zero                                |
| check-links             | every internal link and `hreflang` target resolves  | exits zero                                    |
| language picker         | `navigator.language` = `fr-FR`                      | replaces location with `/fr/`                 |
| language picker         | `navigator.language` = `de-DE`                      | replaces location with `/en/`                 |
| language picker         | script disabled                                     | both language links are in the HTML           |
| built output            | page without the film                               | under 500 KB transferred, JS under 20 KB      |
| built output            | `<video>` markup                                    | `preload="none"`, a `poster`, a fallback link |
| Lighthouse CI           | mobile profile on `/en/` and `/fr/`                 | each of the four categories 95 or more        |

Manual: read both languages end to end on a phone and a laptop, light and dark; press play; copy the command and
run it on a clean Docker host.
