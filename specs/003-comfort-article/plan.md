# Spec 003: Plan

## Steps

- [x] 1. Text written and reviewed with the maintainer in a local review page (six rounds), then a style pass
- [x] 2. Spec
- [x] 3. Types, parity and built-html checks, word count, and their tests
- [x] 4. `Scheme.astro`, article page rendering, link under the Recipes section
- [x] 5. French and English article modules, registry
- [x] 6. Validate, agent review
- [ ] 7. PR, merge on the maintainer's go

## Test Plan

| Module              | Scenario                                                                   | Expected                       |
| ------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| compareArticles     | spec 003 blocks (link run, bold-lead list, four schemes) in both languages | no problem                     |
| compareArticles     | a bold lead in one language only; a scheme without label                   | both reported                  |
| compareArticles     | a topology zone with another level; a pipeline row with another pill       | both reported                  |
| compareArticles     | a link run without its target                                              | reported                       |
| checkPage (Article) | a scheme figure named and captioned, with the right figure count           | no problem                     |
| checkPage (Article) | the wrong figure count; a scheme without name                              | both reported                  |
| wordCount           | link runs, list leads and scheme captions                                  | counted; scheme labels are not |
| check-built-html    | both comfort pages built                                                   | metadata, figures, links pass  |
| lint:i18n           | the two comfort modules                                                    | same blocks, same shape        |
