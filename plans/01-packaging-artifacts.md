# Plan 01 — Fix the published npm artifacts

**Status:** steps 2–5, 7 and 11 done: `formats: ['es', 'cjs']`, w3c `outDir`, every declared dependency external (read from each `package.json`), core dependency list, `exports` with `types`/`import`/`require`, ESM + CJS smoke test from packed tarballs (run by hand). Step 6 and 9 were already done (one `zod` specifier, `moduleResolution: bundler`). Step 8 partly: the root `package.json` is `private` and lost `exports`/`style`/`files`, it keeps its name and dependencies. Not done: step 10 (publint/attw in CI), `index.d.cts` for the `require` types (the one remaining publint warning), `./markdown` and `./w3c` subpaths.
**Severity:** high — the published packages are very likely unusable for CJS consumers, and `@ghentcdh/w3c-utils` may be publishing an empty directory.
**Estimated effort:** ~1 day including verification tooling.
**Related plans:** [03 — CSS export & sideEffects](./03-css-side-effects.md) (must ship in the same release), [04 — d3 submodule imports](./04-d3-submodule-imports.md) (reduces bundle once `external` is fixed).

---

## 1. Problem statement

Nothing here is a style preference — each item is a concrete resolution failure for a consumer.

### 1.1 `format` is not a Vite option (the key is `formats`)

All three lib configs use the wrong key, so the option is silently ignored:

| File | Line | Value |
|---|---|---|
| `libs/core/vite.config.ts` | 42 | `format: ['cjs', 'esm', 'es']` |
| `libs/markdown/vite.config.mts` | 41 | `format: ['cjs', 'esm', 'es']` |
| `libs/w3c/utils/vite.config.mts` | 40 | `format: ['cjs', 'esm', 'es']` |

Vite's library mode option is `build.lib.formats`, and `'esm'` is not a valid value (the valid set is `'es' | 'cjs' | 'umd' | 'iife'`). Because the key is unrecognised, Vite falls back to its default for a named lib entry — `['es', 'umd']` — emitting `index.js` and `index.umd.cjs`.

Consequence: **`index.cjs` is never produced**, yet all three `package.json` files declare `"main": "./index.cjs"`, and `libs/markdown/package.json` declares `"exports"."."."require": "./index.cjs"`.

### 1.2 `exports.require` points at the ESM file

`libs/core/package.json` and `libs/w3c/utils/package.json`:

```json
"type": "module",
"main": "./index.cjs",
"exports": { ".": { "require": "./index.js", "import": "./index.js" } }
```

`require('@ghentcdh/annotated-text')` resolves to `index.js`, which Node treats as ESM because of `"type": "module"` → `ERR_REQUIRE_ESM`. `libs/markdown` gets the correct path but the file doesn't exist (see 1.1) → `MODULE_NOT_FOUND`.

There is also no `"types"` condition inside any `exports` entry, so `moduleResolution: "bundler" | "node16" | "nodenext"` consumers fall back to the top-level `"types"` field, which works today but breaks as soon as subpath exports are added.

### 1.3 `w3c-utils` build output and publish root disagree

- `libs/w3c/utils/vite.config.mts:27` → `outDir: '../../../dist/w3c/utils'` → resolves to `<root>/dist/w3c/utils`
- `libs/w3c/utils/project.json` → `outputPath` / `nx-release-publish.packageRoot` → `dist/libs/w3c/utils`

`libs/core` and `libs/markdown` resolve correctly (`../../dist/libs/<name>`); only w3c is wrong. So `nx release publish` reads a directory the build never wrote. `libs/core` hard-depends on `@ghentcdh/w3c-utils`, so this breaks core too.

Same file also has cosmetic drift worth fixing while in there: `project.json:5` `sourceRoot: "w3c/utils/src"` and `package.json` `repository.directory: "w3c/utils"` both omit the `libs/` prefix. `libs/markdown/project.json:5` has the same `sourceRoot` problem.

### 1.4 `rollupOptions.external: []` inlines every dependency

`libs/core/vite.config.ts:46` and `libs/w3c/utils/vite.config.mts:44` both set `external: []`. (`libs/markdown/vite.config.mts:45` correctly externalises `@ghentcdh/annotated-text` and nothing else.)

Two distinct consequences:

1. **Double-shipping.** `@ghentcdh/w3c-utils` is declared as a `dependency` of core *and* inlined into `dist/libs/core/index.js`. A consumer installing core gets the W3C builder and its `zod` twice — once bundled, once from node_modules. Same for `d3`, `lodash-es`, `memoizee`, `tokenizr`.
2. **It masks undeclared dependencies.** Because everything is inlined, the build succeeds even though `libs/core/package.json` never declares packages the source imports.

### 1.5 `libs/core` dependency list is wrong

Declared (`libs/core/package.json`): `@ghentcdh/w3c-utils`, `d3`, `lodash-es`, `memoizee`, `tokenizr`.

Actually imported but **not declared**:

| Package | Example import sites |
|---|---|
| `rbush` | `compute/utils/annotation.overlap.ts`, `compute/draw/text/text-raster.ts`, `adapter/snapper/word-snapper/WordSnapper.ts` |
| `uuid` | `adapter/annotation/AnnotationAdapter.ts`, `adapter/annotation/renderer/SvgAnnotationRender.ts`, `adapter/annotation/renderer/GutterAnnotationRender.ts`, `model/line.model.ts` |
| `zod` (as `zod/v4`) | `model/annotation.model.ts:1` |
| `d3-selection` | `compute/model/svg.types.ts:1`, `compute/draw/annotations.ts:1` |

Also: `tokenizr` is pinned `1.7.0` in core vs `2.1.0` in the root `package.json`.

**Two zod entrypoints.** Core imports `from 'zod/v4'`; `libs/w3c/utils` imports `from 'zod'` (`annotation/annotation.schema.ts:1`, `context/context.builder.ts:1`). Two schema runtimes and two structurally-unrelated `z.infer` type universes across a boundary that is crossed by `adapter/annotation/w3c/W3CAnnotationAdapter.ts`.

### 1.6 `vitest` is a runtime dependency

`libs/markdown/package.json` and `libs/w3c/utils/package.json` both list `"vitest": "4.0.9"` under `dependencies`. Every consumer install pulls the whole test runner. It is already in the root `devDependencies`.

### 1.7 Root `package.json` is publishable and unbuildable

- No `"private": true`.
- `"name": "@ghentcdh/annotated-text"` — the **same npm name** as `libs/core`, at `"version": "1.0.1"` vs core's `1.0.10`.
- `exports` point at `./dist/annotated-text.js` / `.cjs` and `types: ./dist/types/index.d.ts`. No target produces those paths; builds land in `dist/libs/*`.
- No `build` script (only `prepare` and `release`).
- Declares 8 runtime `dependencies` (`d3`, `lodash-es`, `markdown-it`, `memoizee`, `rbush`, `tokenizr`, `uuid`, `zod`) and `peerDependencies: { vue: "^3.0.0" }` — where no shipped source lives.

`nx.json` `release.projects` does contain `"!@ghentcdh/annotated-text"`, which excludes it from `nx release`. So this is latent rather than actively broken — but a stray `npm publish` at the root would ship a package whose entry points don't exist and clobber the real one.

Related: `peerDependencies: { vue: "^3.0.0" }` at the root is dead. `grep -r "from 'vue'" libs/` returns zero hits and there are no `.vue` files in `libs/`. Vue appears only in `docs/` demos and `e2e/`.

### 1.8 Missing / dead subpath exports

- No `./markdown` or `./w3c` subpath on core. Consumers must know the separate package names, one of which is `@ghentcdh/annotated-text--markdown` (double hyphen).
- Only `libs/w3c/utils/package.json` sets `publishConfig.access: "public"`. Core and markdown are scoped packages and will fail to publish as restricted unless the org default is public — `publish.yml:34` passes `--access public` to `nx release publish`, which currently covers it, but the per-package config should not disagree.
- `libs/w3c/utils/package.json` exports `"./annotated-text.css": "./index.css"` although the package contains no SCSS — a dead export.

---

## 2. Goal

`npm pack` output for all three packages passes `publint` and `arethetypeswrong` clean, for both `import` and `require`, and contains no inlined third-party code.

---

## 3. Steps

### Step 1 — Capture the current (broken) state as a baseline

Do this **first** so every later change is measurable.

```bash
pnpm nx run-many -t build
ls -la dist/libs/core dist/libs/markdown dist/libs/w3c/utils dist/w3c/utils
```

Record: which files exist, which don't, and the size of `dist/libs/core/index.js`.

Add the two verification tools as root devDependencies:

```bash
pnpm add -Dw publint @arethetypeswrong/cli
```

Baseline report (expect failures — that's the point):

```bash
pnpm publint dist/libs/core
pnpm attw --pack dist/libs/core
```

### Step 2 — Fix `formats` in all three vite configs

```diff
-      format: ['cjs', 'esm', 'es'],
+      formats: ['es', 'cjs'],
```

Sites: `libs/core/vite.config.ts:42`, `libs/markdown/vite.config.mts:41`, `libs/w3c/utils/vite.config.mts:40`.

Also delete the two stale comment lines above each (`// Change this to the formats...`, `// formats: ["es" as const],`) so the next reader isn't misled.

Verify `dist/libs/core/index.cjs` now exists. Note that with `formats: ['es','cjs']` and `fileName: 'index'`, Vite emits `index.js` + `index.cjs` — matching what the package.json files already claim.

### Step 3 — Fix `outDir` for w3c-utils

`libs/w3c/utils/vite.config.mts:27`:

```diff
-    outDir: '../../../dist/w3c/utils',
+    outDir: '../../../dist/libs/w3c/utils',
```

While here, correct the `sourceRoot` paths:

- `libs/w3c/utils/project.json:5` → `"libs/w3c/utils/src"`
- `libs/markdown/project.json:5` → `"libs/markdown/src"`
- `libs/w3c/utils/package.json` → `repository.directory: "libs/w3c/utils"`

Verify `dist/w3c/` no longer appears after a clean build, and `dist/libs/w3c/utils/index.js` does.

### Step 4 — Externalise runtime dependencies

Replace `external: []` with a predicate so new deps can't silently get inlined.

`libs/core/vite.config.ts:46`:

```ts
external: (id) =>
  [
    '@ghentcdh/w3c-utils',
    'lodash-es',
    'memoizee',
    'rbush',
    'tokenizr',
    'uuid',
    'zod',
  ].includes(id) ||
  id.startsWith('d3-') ||
  id === 'd3' ||
  id.startsWith('zod/') ||
  id.startsWith('lodash-es/'),
```

`libs/w3c/utils/vite.config.mts:44`: same shape, list `['zod']` + `id.startsWith('zod/')`.

> Consider factoring this into a small shared helper (e.g. `tools/vite/external.ts`) that reads the package's own `dependencies` + `peerDependencies` and externalises all of them. That makes step 5 self-enforcing: forget to declare a dep and the build inlines it, which `publint` then flags.

### Step 5 — Correct the dependency lists

`libs/core/package.json` `dependencies`:

```json
{
  "@ghentcdh/w3c-utils": "^1.0.10",
  "d3-drag": "^3.0.0",
  "d3-selection": "^3.0.0",
  "lodash-es": "^4.17.21",
  "memoizee": "^0.4.17",
  "rbush": "4.0.1",
  "tokenizr": "2.1.0",
  "uuid": "13.0.0",
  "zod": "4.3.6"
}
```

(`d3-drag` / `d3-selection` instead of `d3` assumes [plan 04](./04-d3-submodule-imports.md) lands with this. If 04 slips, keep `"d3": "7.9.0"` here and revisit.)

`libs/markdown/package.json` and `libs/w3c/utils/package.json`: **remove `vitest`** from `dependencies`.

Bump `@ghentcdh/w3c-utils` in core to `^1.0.10` to match what is actually released.

### Step 6 — Pick one zod entrypoint

Decide `zod/v4` (matches the installed 4.x and is explicit) or bare `zod` (4.x resolves to v4 by default anyway). Then make it uniform:

```bash
grep -rn "from 'zod" libs/ --include=*.ts | grep -v node_modules
```

Sites to align: `libs/core/src/lib/model/annotation.model.ts:1`, `libs/w3c/utils/src/lib/annotation/annotation.schema.ts:1`, `libs/w3c/utils/src/lib/context/context.builder.ts:1` (plus anything else the grep surfaces).

Add an ESLint `no-restricted-imports` rule for the losing specifier so this can't regress.

### Step 7 — Fix `exports` maps

`libs/core/package.json`:

```json
"exports": {
  ".": {
    "types": "./index.d.ts",
    "import": "./index.js",
    "require": "./index.cjs"
  },
  "./annotated-text.css": "./index.css",
  "./style.css": "./index.css",
  "./package.json": "./package.json"
}
```

(The `./style.css` alias is covered in [plan 03](./03-css-side-effects.md) — noted here so the two plans don't fight over the same block.)

`libs/w3c/utils/package.json`: same shape, and **delete** the dead `"./annotated-text.css"` entry.

`libs/markdown/package.json`: add the `"types"` condition.

Add `"publishConfig": { "access": "public" }` to core and markdown for consistency with w3c-utils.

### Step 8 — Neutralise the root package.json

```json
{
  "name": "@ghentcdh/annotated-text-workspace",
  "private": true,
  "license": "MIT",
  "type": "module",
  ...
}
```

Delete from the root: `version`, `exports`, `style`, `files`, `dependencies`, `peerDependencies`. Keep `devDependencies`, `scripts`, `engines`, `packageManager`, `lint-staged`, `husky`, `nx`.

The 8 runtime deps move to whichever `libs/*/package.json` actually imports them (they already need to be listed there per step 5, so this is a deletion, not a move). `markdown-it` belongs to `libs/markdown` only — confirm with:

```bash
grep -rn "markdown-it" libs/core/src libs/w3c/utils/src | grep -v node_modules
```

`vue` moves to `devDependencies` (it is needed by `docs/` and `e2e/`), and the `peerDependencies` block goes away entirely.

Renaming the root package means `nx.json` `release.projects` no longer needs the `"!@ghentcdh/annotated-text"` exclusion — but leave it in for one release cycle rather than changing two things at once.

### Step 9 — Modernise `moduleResolution`

`tsconfig.base.json` currently uses `"moduleResolution": "node"` (node10), which ignores `exports` maps entirely — so TypeScript never validates the thing this plan is fixing.

```diff
-    "moduleResolution": "node",
+    "moduleResolution": "bundler",
```

Expect fallout: node10 resolution is permissive about extensionless relative imports and about importing from paths not listed in `exports`. Run `pnpm nx run-many -t typecheck` and fix what surfaces. If the fallout is large, do this as a **separate follow-up PR** — it is the one step here that can cascade.

While in this file, delete the stale path mapping:

```diff
-      "@ghentcdh/annotated-text-vue-component": ["./libs/vue-component/src/index.ts"],
```

(`libs/vue-component/` does not exist.)

### Step 10 — Wire verification into CI

Add to `.github/workflows/merge-request.yml`, as a step in the existing `build` job (which already runs `nx run-many -t build -c production`):

```yaml
      - name: Validate published package shape
        run: |
          for p in core markdown w3c/utils; do
            npx publint "dist/libs/$p"
            npx attw --pack "dist/libs/$p" --ignore-rules no-resolution
          done
```

Start with `--ignore-rules` for anything you consciously accept, and remove entries as they get fixed. A red `publint` should fail the PR.

### Step 11 — Smoke-test both module systems for real

`publint` is static analysis. Add a genuine dual-format consumer test:

```bash
mkdir -p /tmp/consume-esm /tmp/consume-cjs
cd dist/libs/core && npm pack
# ESM
cd /tmp/consume-esm && npm init -y && npm i <path-to-tgz>
node --input-type=module -e "import * as m from '@ghentcdh/annotated-text'; console.log(Object.keys(m).length)"
# CJS
cd /tmp/consume-cjs && npm init -y && npm i <path-to-tgz>
node -e "const m = require('@ghentcdh/annotated-text'); console.log(Object.keys(m).length)"
```

Both must print a non-zero key count. Worth promoting to a scripted `tools/verify-package.mjs` and running it in CI — the local Verdaccio setup (`.verdaccio/`) already exists and could host this.

---

## 4. Suggested PR breakdown

| PR | Contents | Risk |
|---|---|---|
| 1 | Steps 1, 2, 3 — `formats`, `outDir`, `sourceRoot`. Add publint/attw as devDeps, report only. | low |
| 2 | Steps 4, 5, 6 — `external`, dependency lists, single zod entrypoint. | medium — bundle contents change |
| 3 | Steps 7, 8 — `exports` maps, root package.json. Ship together with [plan 03](./03-css-side-effects.md). | medium — consumer-visible |
| 4 | Step 9 — `moduleResolution: bundler`. | medium, isolated |
| 5 | Steps 10, 11 — CI gates. | low |

PRs 2 and 3 change what consumers receive. They should go out as one **minor** version (1.1.0) with a changelog note, not a patch — a consumer currently relying on the bundled-everything behaviour will start needing real peer installs. There is no `MIGRATION.md` in the repo; consider adding one, since this release also coincides with the `setTextAdapter` → `setTextAdapterParams` deprecation.

---

## 5. Verification checklist

- [ ] `dist/libs/{core,markdown,w3c/utils}/index.cjs` all exist after `nx run-many -t build`
- [ ] `dist/w3c/` does not exist after a clean build
- [ ] `publint` clean for all three packages
- [ ] `attw --pack` clean for all three packages
- [ ] `dist/libs/core/index.js` no longer contains inlined d3/lodash/zod (check size drop and `grep -c "function memoize" dist/libs/core/index.js`)
- [ ] ESM and CJS smoke tests both import successfully
- [ ] Root `package.json` has `"private": true` and no `exports`
- [ ] `grep -rn "vitest" libs/*/package.json libs/w3c/utils/package.json` returns nothing under `dependencies`
- [ ] One zod specifier across the workspace
- [ ] `pnpm nx run-many -t lint,test,build` green

## 6. Risks

- **Externalising deps is consumer-visible.** Anyone who currently gets `d3` for free from the bundle will now need it installed. Correct behaviour, but it is a breaking-ish change — hence the minor bump.
- **`moduleResolution: bundler`** can surface a long tail of import errors. Keep it in its own PR so it can be reverted independently.
- **Undeclared transitive deps.** Once `external` is real, a missing declaration becomes a runtime `ERR_MODULE_NOT_FOUND` for consumers rather than a silently-fat bundle. Step 11's smoke test is what catches this before publish — don't skip it.
