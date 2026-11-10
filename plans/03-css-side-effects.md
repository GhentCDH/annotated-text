# Plan 03 — `sideEffects: false` vs the SCSS entry import, and the wrong documented CSS path

**Status:** not started
**Severity:** high — a bundler is entitled to drop the library's entire stylesheet, and two of three documented import paths don't resolve.
**Estimated effort:** ~2 hours plus verification.
**Related plans:** [01 — Packaging](./01-packaging-artifacts.md) — step 7 there edits the same `exports` block; ship these together. [02 — Accessibility](./02-accessibility.md) adds `_a11y.scss`, which inherits this bug.

---

## 1. Problem

### 1.1 `sideEffects: false` contradicts the library entry point

`libs/core/src/index.ts:1`:

```ts
import './lib/style/style.scss';
```

That is a side-effect-only import — it has no bindings, and its entire purpose is to inject CSS.

`libs/core/package.json`:

```json
"sideEffects": false
```

`sideEffects: false` is a promise to the bundler that *no module in this package does anything observable on import*, so any module whose exports are unused may be dropped entirely. The SCSS import has no exports, so it is unconditionally droppable.

Whether it actually gets dropped today depends on the consumer's bundler and version:

- **Vite / Rollup** — the `.scss` is transformed to a CSS asset before tree-shaking, and Rollup generally preserves the emitted asset. Usually survives.
- **webpack 5** — honours `sideEffects: false` aggressively and *will* drop side-effect-only imports from a flagged package. This is the documented failure mode.
- **esbuild** — respects the flag; behaviour varies by version.

So it works for the docs site (VuePress → Vite) and is silently broken for webpack consumers. That is the worst kind of bug: it looks fine in-house.

`libs/markdown/package.json` also declares `sideEffects: false`, but `libs/markdown/src/index.ts` has no style import, so that one is correct. `libs/w3c/utils/package.json` likewise declares it, correctly.

### 1.2 Two of three documented CSS import paths don't exist

`libs/core/package.json` exports exactly one CSS path:

```json
"./annotated-text.css": "./index.css"
```

But the docs say otherwise:

| File | Line | Says | Resolves? |
|---|---|---|---|
| `README.md` | 47 | `@use '@ghentcdh/annotated-text/style.css' as *;` | ❌ not in `exports` |
| `docs/README.md` | 47 | same | ❌ |
| `libs/core/README.md` | 47 | same | ❌ — and this is the npm landing page |
| `docs/components/-getting-started/_quikstart.md` | 37 | `@import '@ghentcdh/annotated-text/annotated-text.css';` | ✅ |

Two problems compounded:

1. `./style.css` is not an export → hard resolution failure. (The *root* `package.json` does declare a `"./style.css"` export — but the root package is not what consumers install, and its target `./dist/annotated-text.css` doesn't exist either. See [plan 01](./01-packaging-artifacts.md) §1.7.)
2. `@use '<file>.css' as *` is meaningless — Sass `@use` with `as *` is for forwarding Sass members (variables, mixins, functions). A plain CSS file exports none. Even if the path resolved, the `as *` is noise at best.

### 1.3 Ancillary: the emitted filename is opaque

Vite emits the stylesheet as `index.css` (following `lib.fileName: 'index'`), and the export maps `annotated-text.css` → `index.css`. Not a bug, but a consumer who bypasses the export map — or reads the tarball — sees `index.css` and no obvious link to the documented name.

---

## 2. Goal

1. The stylesheet survives tree-shaking in webpack, Vite, Rollup and esbuild.
2. Exactly one documented CSS import path, and it resolves.
3. A CI check so neither can silently regress.

---

## 3. Steps

### Step 1 — Replace `sideEffects: false` with an explicit allowlist

`libs/core/package.json`:

```diff
-  "sideEffects": false,
+  "sideEffects": [
+    "**/*.css",
+    "**/*.scss"
+  ],
```

This keeps the tree-shaking benefit for all the JS (which genuinely is side-effect-free) while telling the bundler that style imports must be preserved.

Leave `libs/markdown` and `libs/w3c/utils` at `sideEffects: false` — verified correct, neither entry imports a stylesheet. Add a one-line comment in each? No — `package.json` can't carry comments. Instead note it in the verification checklist so a future reviewer doesn't "fix" them by copying core.

> **Alternative considered and rejected:** dropping the SCSS import from `index.ts` and requiring consumers to import the CSS themselves. That is arguably the cleaner library design (it removes the implicit side effect entirely and lets consumers control CSS ordering), but it is a **breaking change** for every existing consumer, and the docs already establish the current contract. If the project ever wants this, it belongs in a 2.0 with a migration note — not here. Worth recording as a deliberate decision rather than an oversight.

### Step 2 — Add `./style.css` as an alias export

`libs/core/package.json` `exports` — final shape (this is the same block [plan 01](./01-packaging-artifacts.md) step 7 edits; coordinate):

```json
"exports": {
  ".": {
    "types": "./index.d.ts",
    "import": "./index.js",
    "require": "./index.cjs"
  },
  "./style.css": "./index.css",
  "./annotated-text.css": "./index.css",
  "./index.css": "./index.css",
  "./package.json": "./package.json"
}
```

Three aliases to the same file. Rationale: `./style.css` is what the docs and the README have told people to use (and is the conventional name in the ecosystem — `vue/dist/vue.css`, `swiper/css` etc.), `./annotated-text.css` is what currently works and must keep working, and `./index.css` is what someone reading the tarball will reach for. All are one line and cost nothing.

Also verify `"*.css"` is in the `files` array — it is (`libs/core/package.json` `files: ["*.js", "*.cjs", "*.d.ts", "*.css", ...]`), so `index.css` is packed. Good.

### Step 3 — Pick one documented path and fix all four docs

**Canonical: `@ghentcdh/annotated-text/style.css`.**

Fix these, dropping the bogus Sass syntax:

`README.md:47`, `docs/README.md:47`, `libs/core/README.md:47`:

```diff
-@use '@ghentcdh/annotated-text/style.css' as *;
+import '@ghentcdh/annotated-text/style.css';
```

`docs/components/-getting-started/_quikstart.md:37`:

```diff
-@import '@ghentcdh/annotated-text/annotated-text.css';
+import '@ghentcdh/annotated-text/style.css';
```

Note the change from a CSS/Sass `@import` to a **JS** `import`. Both work, but the JS import is what the surrounding code samples are (they're TS/JS setup snippets), and it's what a bundler consumer actually writes. If a Sass-specific example is genuinely wanted, add it separately and clearly labelled as "if you're using Sass" — but plain CSS `@import` of a node package path only works with a resolver-aware Sass setup, so it's a footgun in a quickstart.

Then sweep for any others:

```bash
grep -rn "annotated-text.css\|annotated-text/style" \
  --include='*.md' --include='*.ts' --include='*.vue' \
  . | grep -v node_modules | grep -v '.vuepress/.temp'
```

Check `docs/.vuepress/` config and `e2e/` fixtures too — if they import the CSS by a relative path or an alias they'll keep working regardless, but they're worth aligning.

While in `libs/core/README.md`: this file is the npm landing page (`files` includes `*.md`, and `nxCopyAssetsPlugin(['*.md'])` copies it into `dist`). It's worth a look beyond line 47 — the root `README.md` has an empty `## Usage` heading and tells users to run `pnpm run docs:build`, which is not among the root scripts. Fix if trivial; otherwise log it as a docs task.

### Step 4 — Prove the fix with a real webpack consumer

This is the step that actually validates the change; `publint` will not catch a dropped stylesheet.

Create `tools/verify-css-side-effects.mjs` (or a small fixture under `tools/`):

```
tools/fixtures/webpack-consumer/
  package.json      # deps: webpack, webpack-cli, mini-css-extract-plugin, the packed tarball
  webpack.config.mjs  # mode: 'production' — tree-shaking on
  src/index.js      # import { createAnnotatedText } from '@ghentcdh/annotated-text'
```

Then:

```bash
pnpm nx build core
cd dist/libs/core && npm pack
cd tools/fixtures/webpack-consumer
npm i ../../../dist/libs/core/ghentcdh-annotated-text-*.tgz
npx webpack --mode production
# assert the emitted CSS bundle is non-empty and contains a known selector
grep -q 'ghent-cdh-annotation' dist/*.css
```

The assertion — a known selector present in production-mode webpack output — is the whole test. Run it once against `sideEffects: false` first to confirm it *fails*, otherwise the test proves nothing.

Repeat with a Vite consumer and an esbuild consumer if time allows; webpack is the one that actually exhibits the bug.

### Step 5 — Wire it into CI

Add to the existing `build` job in `.github/workflows/merge-request.yml`:

```yaml
      - name: Verify stylesheet survives tree-shaking
        run: node tools/verify-css-side-effects.mjs
```

Also worth a cheap static guard so the two files can't drift again — a tiny vitest spec in `libs/core`:

```ts
// libs/core/src/__tests__/package-shape.spec.ts
import pkg from '../../package.json';
import entry from '../index.ts?raw';   // or read the file with fs

describe('package shape', () => {
  it('declares style side effects if the entry imports a stylesheet', () => {
    const importsStyle = /import\s+['"].*\.s?css['"]/.test(entry);
    if (importsStyle) {
      expect(pkg.sideEffects).not.toBe(false);
      expect(pkg.sideEffects).toEqual(
        expect.arrayContaining([expect.stringContaining('css')]),
      );
    }
  });

  it('exports every documented css path', () => {
    for (const p of ['./style.css', './annotated-text.css']) {
      expect(pkg.exports).toHaveProperty([p]);
    }
  });
});
```

This runs in `nx run core:test`, costs nothing, and catches the regression at the point someone reintroduces it rather than at publish time. Reading `src/index.ts` as raw text needs `?raw` support or a plain `fs.readFileSync` — the latter is simpler in a vitest/node environment.

---

## 4. Verification checklist

- [ ] `libs/core/package.json` `sideEffects` is `["**/*.css", "**/*.scss"]`
- [ ] `libs/markdown` and `libs/w3c/utils` left at `sideEffects: false` (verified: no style imports in their entries)
- [ ] `exports` includes `./style.css`, `./annotated-text.css`, `./index.css`, all → `./index.css`
- [ ] `dist/libs/core/index.css` exists and is non-empty after `nx build core`
- [ ] webpack production build of the fixture emits CSS containing `ghent-cdh-annotation`
- [ ] The same fixture test **fails** when `sideEffects: false` is restored (proves the test is real)
- [ ] Zero remaining references to `annotated-text/style.css` used with `@use ... as *`
- [ ] `grep -rn "annotated-text.css" docs/ *.md libs/*/README.md` returns only the intended canonical path
- [ ] `libs/core/README.md` line 47 fixed — this is the npm landing page
- [ ] `package-shape.spec.ts` passes and fails appropriately
- [ ] CI step added

## 5. Risks

- **Low overall.** Widening `sideEffects` can only *reduce* tree-shaking, never break behaviour. The bundle-size cost is the stylesheet, which consumers are supposed to be getting anyway.
- Adding export aliases is purely additive — no existing path is removed, so no consumer breaks.
- The one thing to get right is **not** accidentally "fixing" `libs/markdown`/`libs/w3c/utils` to match core. They're correct as-is; the checklist covers it.

## 6. Follow-up worth noting

Once [plan 02](./02-accessibility.md) adds `libs/core/src/lib/style/_a11y.scss`, it is pulled in via `style.scss`'s `@use` chain and inherits whatever this plan settles. That is another reason to land this one first — an accessibility stylesheet that gets tree-shaken away is worse than not shipping it, because the a11y work will look done.
