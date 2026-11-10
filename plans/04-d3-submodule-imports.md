# Plan 04 — Replace the `d3` barrel import with `d3-selection` / `d3-drag`

**Status:** done together with plan 01, except the ESLint guard (step 8) and the before/after build time.
**Severity:** medium — pure bundle-size and build-time win, no behaviour change.
**Estimated effort:** ~1 hour for the change, plus a build to measure the delta.
**Related plans:** [01 — Packaging](./01-packaging-artifacts.md) — step 4 there fixes `external: []`, which is what makes this win actually reach consumers. Step 5 there lists `d3-drag`/`d3-selection` as core dependencies. **Land 01 first or together.**

---

## 1. Problem

`libs/core` imports the whole `d3` meta-package for exactly two functions.

### 1.1 The three barrel imports

| File | Line | Import | Used for |
|---|---|---|---|
| `libs/core/src/lib/compute/model/svg.types.ts` | 2 | `import { select } from 'd3';` | `select(svgEl)` in `createModel()` |
| `libs/core/src/lib/compute/draw/annotations/drag-annotation.ts` | 1 | `import { drag } from 'd3';` | `drag().on('drag'\|'start'\|'end')` |
| `libs/core/src/lib/compute/draw/annotations/edit.ts` | 1 | `import { drag } from 'd3';` | same, for resize handles |

That's it — a repo-wide `grep -rn "from 'd3'" libs/` returns exactly these three lines. Two symbols: `select` and `drag`.

### 1.2 The submodules are already in use, which proves they resolve

`svg.types.ts:1` already does `import { type Selection } from 'd3-selection';`, and `compute/draw/annotations.ts:1` imports types from the same place. `@types/d3-selection` is an explicit root devDependency. So `d3-selection` is a real, resolvable, already-imported package — line 2 of the very same file goes through the barrel for no reason.

### 1.3 What the barrel actually costs

The `d3` meta-package is a re-export of ~30 packages: `d3-array`, `d3-axis`, `d3-brush`, `d3-chord`, `d3-color`, `d3-contour`, `d3-delaunay`, `d3-dispatch`, `d3-drag`, `d3-dsv`, `d3-ease`, `d3-fetch`, `d3-force`, `d3-format`, `d3-geo`, `d3-hierarchy`, `d3-interpolate`, `d3-path`, `d3-polygon`, `d3-quadtree`, `d3-random`, `d3-scale`, `d3-scale-chromatic`, `d3-selection`, `d3-shape`, `d3-time`, `d3-time-format`, `d3-timer`, `d3-transition`, `d3-zoom`. Roughly 270 kB minified for the full set; the two packages actually needed are ~15 kB combined.

**Two distinct costs, and they bite differently:**

**Build time (bites today).** Rollup must resolve and parse every module reachable from the barrel before it can tree-shake them away. This is unconditional — it happens on every `nx build core` regardless of `external`.

**Bundle size (bites once `external` is fixed).** Right now `libs/core/vite.config.ts:46` sets `external: []`, so *everything* is inlined. Whether the 270 kB of unused d3 survives into `dist/libs/core/index.js` depends on how well Rollup tree-shakes the barrel. Modern d3 packages are ESM with `sideEffects: false`, so tree-shaking mostly works — but "mostly" across 30 packages is worth eliminating rather than trusting. Measure it (§3 step 1) rather than assuming either way.

The more important interaction: [plan 01](./01-packaging-artifacts.md) makes deps external. At that point `libs/core/package.json` must declare its d3 dependency, and declaring `"d3": "7.9.0"` forces every consumer to install all 30 packages — ~270 kB of node_modules and, if they re-bundle without good tree-shaking, in their bundle too. Declaring `d3-selection` + `d3-drag` instead is a permanent, unconditional win for consumers.

### 1.4 A note on `d3-drag`'s own dependencies

`d3-drag` depends on `d3-dispatch` and `d3-selection`; `d3-selection` has no dependencies. So the real installed footprint is three small packages. Still an order of magnitude better than 30.

---

## 2. Goal

Zero imports from the `d3` barrel in `libs/`. `libs/core/package.json` declares `d3-selection` and `d3-drag`, not `d3`. Measured reduction in both build time and `dist/libs/core/index.js` size.

---

## 3. Steps

### Step 1 — Measure the baseline

Don't skip this; it's the only way to know whether the change was worth writing up.

```bash
pnpm nx reset
time pnpm nx build core --skip-nx-cache
ls -la dist/libs/core/index.js
```

Record wall-clock build time and byte size. Then check how much d3 actually survived tree-shaking:

```bash
# crude but informative — look for symbols only present in unused d3 modules
grep -c "geoAlbers\|scaleQuantile\|forceSimulation\|contourDensity" dist/libs/core/index.js
```

A non-zero count means dead d3 is being shipped and the bundle win is real. A zero count means Rollup tree-shook it fine and this plan is a build-time-and-consumer-install win only — still worth doing, but adjust expectations in the PR description.

`reportCompressedSize: true` is already set in `libs/core/vite.config.ts:30`, so the build output prints gzip sizes. Capture that line too.

### Step 2 — Install the submodules

```bash
pnpm add -w d3-selection d3-drag
pnpm add -Dw @types/d3-drag
```

`@types/d3-selection` is already a root devDependency. `@types/d3` (`7.4.3`) can stay for now — `docs/` may use it — but check:

```bash
grep -rn "from 'd3'" docs/ e2e/ tools/ | grep -v node_modules
```

If nothing outside `libs/` imports the barrel, `d3` and `@types/d3` can be dropped from the root entirely in step 5.

### Step 3 — Rewrite the three imports

`libs/core/src/lib/compute/model/svg.types.ts`:

```diff
-import { type Selection } from 'd3-selection';
-import { select } from 'd3';
+import { type Selection, select } from 'd3-selection';
```

Two lines become one — `select` and `Selection` come from the same package.

`libs/core/src/lib/compute/draw/annotations/drag-annotation.ts:1`:

```diff
-import { drag } from 'd3';
+import { drag } from 'd3-drag';
```

`libs/core/src/lib/compute/draw/annotations/edit.ts:1`:

```diff
-import { drag } from 'd3';
+import { drag } from 'd3-drag';
```

### Step 4 — Check the `as any` casts still hold

Both drag sites currently end with `as any`:

- `drag-annotation.ts:36-39` — `return drag().on(...).on(...).on(...) as any;`
- `edit.ts:71-76` — `.call(drag().on(...).on(...).on(...) as any)`

The types from `d3-drag` are identical to what `d3` re-exports (the barrel just forwards them), so these should compile unchanged. But the `as any` is hiding whatever type mismatch prompted it. **Opportunistic improvement:** with `@types/d3-drag` imported directly it may be possible to type these properly:

```ts
import { drag, type D3DragEvent, type SubjectPosition } from 'd3-drag';

type DragEvent = D3DragEvent<SVGRectElement, unknown, SubjectPosition>;
```

and replace the `(event: any)` handler params. If that turns into a rabbit hole, leave the `as any` and note it — this plan's value is the import change, not the typing cleanup. Don't let one block the other.

### Step 5 — Update the dependency declarations

`libs/core/package.json` `dependencies`:

```diff
-    "d3": "7.9.0",
+    "d3-drag": "^3.0.0",
+    "d3-selection": "^3.0.0",
```

Root `package.json`: `d3` is listed under `dependencies` there too. Per [plan 01](./01-packaging-artifacts.md) step 8 the root shouldn't declare runtime deps at all, so it gets deleted there. If plan 01 hasn't landed yet, just remove `d3` from the root `dependencies` and add `d3-selection`/`d3-drag` under root `devDependencies` (needed for the workspace install to resolve them for `libs/core`, which is how pnpm workspaces behave here).

`@types/d3` and `@types/d3-selection` in root `devDependencies`: drop `@types/d3` if step 2's grep came back empty, add `@types/d3-drag`.

### Step 6 — If `external` is already fixed, add the externals entry

If [plan 01](./01-packaging-artifacts.md) step 4 has landed, its predicate already handles this — it matches `id.startsWith('d3-')`. Verify:

```bash
grep -n "d3" libs/core/vite.config.ts
```

If plan 01 has *not* landed, this plan still works (everything stays inlined, but only the two needed packages get parsed) — just don't claim the consumer-side win yet.

### Step 7 — Re-measure

```bash
pnpm nx reset
time pnpm nx build core --skip-nx-cache
ls -la dist/libs/core/index.js
grep -c "geoAlbers\|scaleQuantile\|forceSimulation\|contourDensity" dist/libs/core/index.js  # expect 0
```

Put the before/after numbers in the PR description. If the bundle size barely moved, say so — the build-time and consumer-install wins stand on their own.

### Step 8 — Guard against regression

Add to `eslint.config.js`, in the block that applies to `libs/**/*.ts`:

```js
'no-restricted-imports': ['error', {
  paths: [{
    name: 'd3',
    message: "Import from the specific d3 submodule instead (e.g. 'd3-selection', 'd3-drag') — the barrel pulls ~30 packages.",
  }],
}],
```

Note: if the repo uses `eslint-plugin-import-x` (it's a devDependency), `import-x/no-restricted-paths` or the plugin's own rule may be the more idiomatic place. Either works; `no-restricted-imports` is built in and needs no extra config.

This is what makes the fix durable — otherwise the next person writing a d3 call reaches for `from 'd3'` because that's what autocomplete suggests.

---

## 4. Verification checklist

- [ ] `grep -rn "from 'd3'" libs/` returns zero results
- [ ] `pnpm nx run-many -t typecheck` green
- [ ] `pnpm nx run-many -t lint` green (and the new rule fires if you deliberately reintroduce a barrel import)
- [ ] `pnpm nx run core:test` green
- [ ] `pnpm nx run e2e:e2e` green — **this is the important one.** The drag/edit interaction is entirely untested at the unit level (see [plan 06](./06-drag-edit-lifecycle.md)), so the e2e suite is the only thing that will catch a broken `drag()` import.
- [ ] `libs/core/package.json` declares `d3-selection` + `d3-drag`, not `d3`
- [ ] `dist/libs/core/index.js` contains no symbols from unused d3 modules
- [ ] Before/after build time and bundle size recorded in the PR
- [ ] ESLint guard in place

## 5. Risks

**Low.** The `d3` barrel is a pure re-export — `import { select } from 'd3'` and `import { select } from 'd3-selection'` give the identical function object from the identical package (d3 depends on d3-selection; there is no separate copy). The only way this breaks is a version skew between the `d3` meta-package's pinned `d3-selection` and whatever range the new direct dependency resolves to. `d3@7.9.0` depends on `d3-selection@3`, so `^3.0.0` matches. Confirm with:

```bash
pnpm why d3-selection
```

after the install, and make sure there's only one version in the tree.

The one genuine hazard is that **drag behaviour has no unit test coverage**, so a subtle breakage would only show up in e2e or in production. Run the e2e suite, and interactively check dragging an annotation and dragging a resize handle in the docs playground before merging.

## 6. Why this is worth doing even though it's small

Three one-line import changes. But it's the difference between a consumer installing 3 packages or 30, it shortens every `nx build core` from now on, and the ESLint guard means the decision doesn't have to be remembered. Good ratio of durable benefit to risk — a reasonable first PR for someone new to the codebase, provided they run the e2e suite.
