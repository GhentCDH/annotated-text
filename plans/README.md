# Improvement plans

Written 2026-08-21 from a codebase review of `@ghentcdh/annotated-text`. Each file is a standalone plan with problem statement (verified against source, with `file:line`), goal, steps, verification checklist and risks.

Findings not yet promoted to a plan live in project memory (`review_backlog_*`) — see the bottom of this file.

## Plans

| # | Plan | Severity | Effort | Depends on |
|---|---|---|---|---|
| 01 | [Fix the published npm artifacts](./01-packaging-artifacts.md) | high | ~1 day | — |
| 02 | [Accessibility: zero → keyboard & screen-reader usable](./02-accessibility.md) | high | 2–3 weeks, phased | 03 (phase 1), 06 (phase 3) |
| 03 | [`sideEffects` vs the SCSS entry, and the wrong CSS path](./03-css-side-effects.md) | high | ~2 h | ships with 01 |
| 04 | [Replace the `d3` barrel import](./04-d3-submodule-imports.md) | medium | ~1 h | 01 (for the consumer-side win) |
| 05 | [`sendEvent` mutates the cached annotation](./05-sendevent-input-mutation.md) | high | ~2 h | — |
| 06 | [Drag & edit: lifecycle, cancel, hot path, tests](./06-drag-edit-lifecycle.md) | high | ~1 week, phased | 05 |
| 07 | [Zoomable text with annotations that follow](./07-zoomable-text.md) | medium | ~4–5 days, phased | — |

## Suggested order

**Now — user-visible breakage, small diffs:**

1. **05** — one-line mutation fix + tests. No dependencies.
2. **06 phase 1** — the two deadlock bugs and the test harness. The harness is what makes everything after it cheap.
3. **01 PRs 1–2** + **03** — the packaging fixes. `formats`, `outDir`, `external`, dependency lists, `sideEffects`, CSS export path. Ship 01 PR 3 and 03 together as one minor release.
4. **04** — three import lines, once 01 has landed.

**Next:**

5. **06 phase 2** — `cancel()` and Escape. Needed by 02.
6. **02 phase 1** — SVG `aria-hidden`, wrapper role, live region, `_a11y.scss`. Two days, closes four WCAG criteria.

**Then, larger pieces:**

7. **06 phase 3** — drag hot path.
8. **02 phases 2–4** — semantic text layer, keyboard interaction, contrast tooling.

## Dependency notes

- **05 before 06** — phase 2 of 06 writes back to the annotation object; that is only safe once the mutation bug is gone.
- **03 before 02** — 02 adds `_a11y.scss`, which inherits the tree-shaking bug. An accessibility stylesheet that gets dropped is worse than one that was never shipped, because the work will look done.
- **01 with 03** — both edit the same `exports` block in `libs/core/package.json`.
- **01 before 04** — externalising deps is what turns the d3 change into a consumer-facing win rather than just a build-time one.
- **06 phase 1 before 06 phase 3** — the dummy-object reuse in phase 3 changes the meaning of a guard that phase 1's tests pin down.

## Cross-cutting themes

Three things show up in more than one plan and are worth treating as decisions rather than incidental fixes:

- **Exclusive-end as an invariant.** `selectText` (`adapter/text/utils/select-text.ts:15`) treats `end` as inclusive and `WordSnapper` (`WordSnapper.ts:44` vs `:90`) documents inclusive but computes exclusive, while validation, `createAnnotation` and the W3C spec are all exclusive. These must be settled together, not one at a time. See `review_backlog_correctness` in project memory and [06 §5d](./06-drag-edit-lifecycle.md).
- **One sentinel for "no weight".** The schema allows `undefined` and `null`; `AnnotationWeight` writes `null`, `weights.ts` leaves `undefined`. Source of a `NaN` comparator in `AnnotationCache.ts:49` and `NaN` SVG coordinates in the edit path. See [06 §5b](./06-drag-edit-lifecycle.md).
- **`safeParse` at the boundary, plain literals inside.** Throwing `.parse` sits on the annotation ingest path (`AnnotationAdapter.parse`, `W3CAnnotationAdapter._parse:124`) with no try/catch above it, so one malformed annotation aborts rendering of all of them — while `DefaultAnnotationAdapter._parse:17` correctly uses `safeParse`. Also a per-frame and per-annotation cost. See `review_backlog_correctness` and `review_backlog_performance`.

## Not yet planned

The rest of the review is in project memory, one file per theme, each with `file:line` evidence:

- `review_backlog_correctness` — exclusive-end invariant, `textSelection` silently dropped, markdown `startOffset`, undefined-weight `NaN`, invalid comparator in `sort.ts`, `getAnnotatedText` dead, unguarded zod on the ingest path, surrogate-pair hit-testing
- `review_backlog_performance` — memoizee misuse (13 sites, zero options), per-character forced layout, `Tag.drawAll` reflows, O(nodes×L) line lookup, 13 `recalculate()` call sites, `getLineHeight` measuring the whole document
- `review_backlog_architecture` — DI lifecycle leaks and no teardown, `document` captured at module load (breaks SSR), Nx tags permit everything, god classes, naming drift, dead files
- `review_backlog_dx_docs` — docs teach deprecated API, stale TSDoc on the main extension point, scaffold READMEs published to npm, missing subpath exports, no coverage gate, test-coverage gaps
