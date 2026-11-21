---
name: site-feature
description: |
  Implements a change to the Sowel showcase site (sowel-site). Use when:
  - User asks to add or change a section, a page, the copy, the film or the design
  - User says "ajouter une section", "modifier le site", "changer le texte"
  Same workflow as the Sowel core (sowel-feature): spec with gates, branch, tests, agent review, PR, explicit merge approval.
disable-model-invocation: true
argument-hint: "[description du changement]"
---

# sowel-site: feature workflow

Change request: $ARGUMENTS

Follow EVERY phase IN ORDER. Each phase has a GATE. Do NOT skip gates. Do NOT combine phases.

Conventions live in `CLAUDE.md`. The message rules live in the core repository, `specs/209-launch-plan/spec.md`, « Message architecture ».

## Phase 1: Understand

1.1 Read `CLAUDE.md` and the specs under `specs/` (a spec may already cover this).
1.2 Ask clarifying questions, one at a time, with a recommendation each, until a spec can be written without assumptions.

> **GATE 1**: requirements clear.

## Phase 2: Spec

Small copy or style changes inside an existing section amend the existing spec (a line in `spec.md`). A new section, page or behaviour gets a new `specs/NNN-name/` with `spec.md`, `architecture.md`, `plan.md` (including a test plan: module, scenario, expected). Present a summary and ask « Voulez-vous que j'implémente ? ».

> **GATE 2**: spec written, user said « oui » / « go ».

## Phase 3: Branch and implement

```bash
git checkout main && git pull
git checkout -b feat/<name>
```

Order: copy (`en.ts`, then `fr.ts`), types, components, styles, scripts and their tests. English and French change together. A visual change is shown as screenshots (desktop and mobile, light and dark) before it is considered done.

> **GATE 3**: on a feature branch, both languages updated, every planned scenario has a test.

## Phase 4: Validate

```bash
npm run validate
```

Zero errors: this is exactly what CI runs.

> **GATE 4**: validate is green.

## Phase 5: Agent review

Spawn a review agent on `git diff main...HEAD` with the spec as intent. Checklist: correctness, both languages, wording rules, no third-party request, accessibility, scope. Fix blocking findings, re-run Phase 4.

> **GATE 5**: no unresolved blocking finding.

## Phase 6: Commit and PR

Conventional commits, no `Co-Authored-By`. `gh pr create` with a Summary, Changes, Test plan and screenshots.

> **GATE 6**: PR URL shared with the user.

## Phase 7: Wait for merge approval

**Never merge without an explicit « oui » / « merge » / « go ».** Then `gh pr merge <n> --squash --delete-branch`.
