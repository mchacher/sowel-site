# Spec 004: Plan

## Steps

- [x] 1. Text written and reviewed with the maintainer in a local review page (four rounds)
- [x] 2. Spec
- [x] 3. Types, parity, word count, built-html check, and their tests
- [x] 4. `Scheme.astro` (knowledge, chain, stack, two-stage pipeline), article page rendering
- [x] 5. French and English article modules, registry, images and thumbnails
- [ ] 6. Validate, agent review
- [ ] 7. PR, merge on the maintainer's go

## Test Plan

| Module           | Scenario                                                              | Expected                    |
| ---------------- | --------------------------------------------------------------------- | --------------------------- |
| compareArticles  | spec 004 blocks (code run, knowledge, chain, stack) in both languages | no problem                  |
| compareArticles  | a raw name in one language only                                       | reported                    |
| compareArticles  | a knowledge row with a device missing, a zone on another tier         | reported                    |
| compareArticles  | a chain step with another accent, a stack item on another tier        | both reported               |
| compareArticles  | an empty stack base, an empty knowledge text, an empty chain          | all reported                |
| wordCount        | code runs and the captions of the new schemes                         | counted; labels are not     |
| check-built-html | both knowledge pages built                                            | metadata, figures, links ok |
| lint:i18n        | the two knowledge modules                                             | same blocks, same shape     |
