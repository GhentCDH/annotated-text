# Plan 02 — Accessibility: from zero to keyboard- and screen-reader-usable

**Status:** not started
**Severity:** high — for a text-annotation library this is the largest functional gap, and it blocks adoption by any publicly-funded or university project with a WCAG obligation.
**Estimated effort:** 2–3 weeks, phased. Phase 1 alone is ~2 days and removes the worst failures.

---

## 1. Current state

Repo-wide grep across `libs/`:

```
role=      → 0 hits
aria-      → 0 hits
tabindex   → 0 hits
```

(The `e2e/` hits are for `data-annotation-role`, a custom data attribute used as a test selector, not ARIA.)

### 1.1 The SVG is an unlabelled graphic prepended before the text

`libs/core/src/lib/compute/model/svg.types.ts:47-72` — `createModel()` builds the `<svg>` with only `class`, `width`, `height`. The three `<g>` groups (`annotations`, `tag`, `handles`) carry only `data-annotation-role`. No `role`, no `aria-hidden`, no `<title>`, no `<desc>`.

`libs/core/src/lib/compute/model/maincontainer.ts:64` — `setSvg()` does `this.element?.prepend(element)`. The SVG comes **before** the text div in DOM order. So a screen reader walking the document encounters the tag `<text>` labels first, out of reading order, with no indication of which text span each one belongs to — then reaches the actual text with no annotation information attached at all.

### 1.2 Everything is mouse-only

`libs/core/src/lib/compute/draw/annotations/EventAnnotation.ts:27-32`:

```ts
rect
  ?.on('mouseover', this.hover())
  .on('mouseleave', this.leave())
  .on('dblclick', this.doubleClick())
  .on('click', this.click());
```

Four mouse events, no `keydown`, no `focus`/`blur`, no `tabindex`. Editing is d3 `drag`:

- `libs/core/src/lib/compute/draw/annotations/drag-annotation.ts:36-39` — `drag().on('drag'|'start'|'end')`
- `libs/core/src/lib/compute/draw/annotations/edit.ts:60-83` — resize handles, same pattern

The handles are `<rect>` elements with `opacity: 0` (`edit.ts:70`) that become visible on `mouseenter` (`edit.ts:87-89`). They are unreachable by keyboard and invisible to assistive tech. **Annotations cannot be selected, inspected, created, moved or resized without a mouse.**

### 1.3 Native text selection is disabled

`libs/core/src/lib/style/_annotation.scss:38` — `pointer-events: none` on `.ghent-cdh-annotation-text`. This is needed so mouse events reach the SVG underneath, but it also kills browser-native text selection over the annotated text — which is the main non-mouse affordance a user would otherwise have.

### 1.4 No focus, contrast or motion handling in the stylesheet

`libs/core/src/lib/style/` is three files (`style.scss`, `_annotation.scss`, `_gutter.scss`) totalling ~90 lines. Absent:

- any `:focus` / `:focus-visible` rule
- `@media (forced-colors: active)` — Windows High Contrast will flatten the translucent fills to nothing
- `@media (prefers-contrast: more)`
- `@media (prefers-reduced-motion: reduce)`

The only interactive affordances are `cursor: col-resize` on `.handle` and `cursor: move` on `.move` (`_annotation.scss:11,16`) — both mouse-only signals.

### 1.5 Default colours have no contrast floor

`libs/core/src/lib/adapter/annotation/style/annotation.style.default.ts`: `backgroundOpacity: 0.3`, `borderOpacity: 0.6`. Tag text is `#000000` on `tagBackgroundColor: '#ffffff'` at `tagBackgroundOpacity: 0.1` — i.e. near-black text over whatever is behind the SVG, with no computed contrast check anywhere.

---

## 2. WCAG 2.1 AA failures this maps to

| Criterion | Level | Current status |
|---|---|---|
| 1.3.1 Info and Relationships | A | **Fail** — annotation↔text association exists only visually |
| 1.4.11 Non-text Contrast | AA | **Fail** — no contrast floor on borders/fills; handles at `opacity: 0` |
| 2.1.1 Keyboard | A | **Fail** — all interaction is mouse-only |
| 2.1.2 No Keyboard Trap | A | n/a — nothing is focusable |
| 2.4.3 Focus Order | A | **Fail** — SVG prepended before text |
| 2.4.7 Focus Visible | AA | **Fail** — no focus styles |
| 4.1.2 Name, Role, Value | A | **Fail** — no roles or accessible names on annotation graphics |

1.4.3 (Contrast Minimum) is arguably the consumer's responsibility since colours are configurable — but the shipped *defaults* should pass, and there should be a way to check.

---

## 3. Design decision: the parallel-DOM approach

There are two viable architectures. Pick one before writing code.

### Option A — Make the SVG accessible

Add `role="graphics-document"`, `role="graphics-symbol"` per annotation, `aria-label`, `tabindex` on the SVG shapes.

*Against:* SVG accessibility support is genuinely uneven across screen readers. The annotation shapes are geometric fragments — one annotation spanning three lines is three `<path>` elements — so there is no 1:1 mapping between a shape and a semantic annotation. And the SVG is in the wrong DOM position.

### Option B — Hide the SVG, annotate the text layer ✅ recommended

Mark the SVG `aria-hidden="true"` (it is pure decoration — every piece of information it conveys exists in the model), and expose the annotations by wrapping the *text* in semantic elements.

*For:* The text layer is already a DOM tree of lines and content spans (`_annotation.scss:31` — `.ghent-cdh-annotation-text` is a grid of `.content` elements). It is in correct reading order. `<mark>` is exactly the right element and has real screen-reader support. Focus lands on text, which is what the user cares about.

*Against:* Requires the text renderer to emit per-annotation wrapper elements, which it currently does not — annotation geometry is computed independently of the text DOM (`text-raster.ts` builds an R-tree of character rects; annotations are drawn as SVG over the top). This is the real work in this plan.

*Mitigation:* Phase 1 delivers most of the WCAG win without touching the text renderer at all (a descriptive summary + `aria-hidden` on the SVG). Phase 2 does the per-annotation wrapping.

**Decision: Option B, phased.**

---

## 4. Phased plan

### Phase 1 — Stop actively misleading assistive tech (~2 days)

Low risk, no architectural change, closes 4.1.2 and 2.4.3.

**1a. Hide the decorative SVG.**

`libs/core/src/lib/compute/model/svg.types.ts`, in `createModel()`:

```diff
     this.svg = select(svgEl)
       .attr('class', styles.svg)
+      .attr('aria-hidden', 'true')
+      .attr('focusable', 'false')
       .attr('width', textElementDimensions.original.width)
       .attr('height', textElementDimensions.original.height) as any;
```

(`focusable="false"` is for legacy IE/Edge SVG behaviour; harmless and cheap.)

**1b. Give the wrapper a landmark and a live summary.**

New file `libs/core/src/lib/a11y/announcer.ts` — a small class owned by `MainContainer`:

- Creates a visually-hidden `<div role="status" aria-live="polite" aria-atomic="true">` appended to the wrapper.
- Exposes `announce(message: string)`, debounced ~150ms to avoid flooding during drag.
- Owned and torn down by `MainContainer.destroy()`.

Hook it to the existing internal event bus (`libs/core/src/lib/events/internal/internal.event.listener.ts`) rather than calling it from the draw code — keeps a11y concerns out of the hot path.

Announce on: annotation added/updated/deleted, and a summary after each layout (`"12 annotations"`).

**1c. Describe the annotated region.**

On the wrapper element in `MainContainer.setMainElement()`:

```ts
this.element.setAttribute('role', 'group');
this.element.setAttribute('aria-roledescription', 'annotated text');
// aria-label supplied by consumer config, with a sensible default
```

Add an `a11y` block to the adapter config so consumers can supply real labels:

```ts
a11y?: {
  label?: string;              // e.g. "Transcription of MS Ghent 1234"
  annotationLabel?: (a: TextAnnotation) => string;  // for phase 2
  announcements?: boolean;     // default true
}
```

**1d. Add the missing media queries and focus styles.**

New file `libs/core/src/lib/style/_a11y.scss`, `@use`d from `style.scss`:

```scss
.ghent-cdh-annotation {
  &-text {
    :focus-visible {
      outline: 2px solid Highlight;
      outline-offset: 2px;
    }
  }
}

@media (forced-colors: active) {
  .ghent-cdh-annotation-svg {
    // translucent fills vanish in forced-colors; fall back to system colours
    path { forced-color-adjust: none; }
  }
}

@media (prefers-reduced-motion: reduce) {
  .ghent-cdh-annotation-svg * {
    transition: none !important;
    animation: none !important;
  }
}
```

The `forced-colors` block needs real testing in Windows High Contrast before it can be called done — the right fallback may be to swap fills for patterned strokes rather than `forced-color-adjust: none`.

**1e. Add the visually-hidden utility.** One `.ghent-cdh-annotation-visually-hidden` class in `_a11y.scss` (clip-rect pattern, not `display: none`, not `visibility: hidden`).

> **Note:** adding `_a11y.scss` interacts with [plan 03](./03-css-side-effects.md) — the `sideEffects` fix must be in place or bundlers may tree-shake the new stylesheet along with the existing one.

### Phase 2 — Semantic text layer (~1 week)

This is where annotations become discoverable and navigable.

**2a. Emit `<mark>` wrappers in the text renderer.**

`libs/core/src/lib/compute/draw/text/DrawText.ts` and `text.ts` currently render line content without annotation awareness. Extend so that, for each annotation intersecting a line, the covered character range is wrapped:

```html
<mark
  class="ghent-cdh-annotation-mark"
  data-annotation-uid="abc-123"
  tabindex="-1"
  aria-describedby="at-desc-abc-123"
>…text…</mark>
```

Overlapping annotations are the hard part. Nested `<mark>` is valid HTML and screen readers handle it, but deep nesting gets noisy. Suggested rule: wrap by the same weight ordering already computed in `compute/utils/annotation.weight.ts`, cap nesting depth at a configurable `a11y.maxMarkDepth` (default 3), and for annotations beyond the cap rely on the description list (2b) alone.

Styling: `<mark>` has a UA default yellow background. Reset it — `background: none; color: inherit;` — since the SVG provides the visuals.

**2b. Per-annotation descriptions.**

A visually-hidden `<dl>` inside the wrapper, one entry per annotation:

```html
<dl class="…visually-hidden">
  <dt id="at-desc-abc-123">Annotation</dt>
  <dd>Person — Jan van Eyck. Characters 120 to 133.</dd>
</dl>
```

Text comes from `a11y.annotationLabel(annotation)` with a default derived from the annotation's tag/label and range. This is what `aria-describedby` on the `<mark>` points at, and it is the piece that satisfies 1.3.1.

**2c. Reading-order fix.**

With the SVG `aria-hidden`, its DOM position no longer affects reading order — 2.4.3 is closed by phase 1b. Nothing more needed here, but verify with the screen-reader matrix in §5.

### Phase 3 — Keyboard interaction (~1 week)

**3a. Roving tabindex over annotations.**

One tab stop for the whole component (`tabindex="0"` on the first/active `<mark>`, `-1` on the rest), following the [APG composite-widget pattern](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/). Tabbing into the component lands on the active annotation; Tab again leaves. This avoids a 1363-tab-stop trap on the large document.

**3b. Key bindings.**

Mirror the existing mouse semantics rather than inventing new ones:

| Key | Action | Maps to existing |
|---|---|---|
| `Tab` / `Shift+Tab` | enter / leave component | — |
| `→` / `←` | next / previous annotation | — |
| `Home` / `End` | first / last annotation | — |
| `Enter` | activate | `click` event |
| `F2` or `Enter` on focused | enter edit mode | `annotation-edit--start` |
| `Shift+→` / `Shift+←` | in edit mode: move end boundary | `annotation-edit--move` |
| `Ctrl+→` / `Ctrl+←` | in edit mode: move start boundary | `annotation-edit--move` |
| `Enter` | in edit mode: commit | `annotation-edit--end` |
| `Escape` | in edit mode: cancel and restore | *(no equivalent — see below)* |

**Escape has no current implementation path.** `AbstractAnnotationEventEdit` (`compute/draw/annotations/abstract-annotation-event.edit.ts`) has `start`/`move`/`end` but no `cancel()`. It stores `originalStartEnd` in the constructor (line 25-28), so the data is there — a `cancel()` that restores from `originalStartEnd`, removes the dummy draw and unblocks events is straightforward. **This should be built as part of [plan 06](./06-drag-edit-lifecycle.md)**, which is already touching the block/unblock lifecycle, and then reused here. Mouse users get Escape-to-cancel-drag for free, which is a good thing independently.

**3c. Keyboard boundary movement must go through the snapper.**

`Shift+→` should snap the same way a drag does, via `annotationModule.getSnapper().fixOffset()`. Reuse `AbstractAnnotationEventEdit.move()` with a synthetic position rather than duplicating the logic — this is the argument for refactoring `move(position, target, event)` to accept a target *offset* instead of a pixel `Position`, with the mouse path converting pixels→offset before calling in. That refactor also simplifies [plan 06](./06-drag-edit-lifecycle.md).

**3d. Creating an annotation by keyboard.**

Lower priority. The natural route is native text selection + a key (`Ctrl+Enter`), but `pointer-events: none` (§1.3) currently prevents selection. Options: scope `pointer-events: none` to only the elements that need it, or add an explicit "selection mode" toggled by a key that temporarily restores pointer events. Needs a design decision — flag as open.

### Phase 4 — Contrast tooling (~2 days)

**4a. Ship defaults that pass.** Compute the effective contrast of the shipped defaults over both white and black backgrounds; adjust `backgroundOpacity` / `borderOpacity` / tag colours until border-vs-background clears 3:1 (1.4.11) and tag text clears 4.5:1 (1.4.3).

**4b. Give consumers a checker.** Export a dev-mode helper:

```ts
export const checkAnnotationContrast = (
  style: AnnotationStyleParams,
  backgroundColor: string,
) => ({ ratio: number; passesAA: boolean; passesAAA: boolean });
```

Call it from `Debugger`-gated code in the style pipeline so a consumer running in dev gets a console warning for a failing palette, with no production cost. This pairs naturally with the existing `Debugger` singleton.

---

## 5. Verification

### Automated

- **axe-core in the e2e suite.** `e2e/` is already a Playwright project. Add `@axe-core/playwright` and a spec that runs axe against each docs example page. Gate on zero violations of `wcag2a`/`wcag2aa`.
- **Unit tests** for the announcer (debouncing, teardown) and for `<mark>` emission with overlapping annotations (nesting depth, correct character ranges).
- **A keyboard-navigation e2e spec** — tab in, arrow through all annotations, F2, Shift+Arrow, Enter, verify the emitted events match what a mouse drag emits. This doubles as a regression test for [plan 06](./06-drag-edit-lifecycle.md).

### Manual (cannot be skipped)

axe catches maybe 40% of real issues. Test matrix:

| Screen reader | Browser | OS | What to check |
|---|---|---|---|
| NVDA | Firefox | Windows | reading order, `<mark>` announcement, `<dl>` descriptions |
| NVDA | Chrome | Windows | same |
| JAWS | Chrome | Windows | same, plus virtual-cursor behaviour over nested marks |
| VoiceOver | Safari | macOS | `role="group"` + `aria-roledescription` handling |
| VoiceOver | Safari | iOS | touch exploration |
| Narrator | Edge | Windows | forced-colors interaction |

Plus: Windows High Contrast mode with the SVG visible, 200% browser zoom, and a full keyboard-only pass with the mouse physically unplugged.

Worth budgeting for one external audit before claiming AA conformance publicly.

---

## 6. Deliverables checklist

- [ ] Phase 1: SVG `aria-hidden`, wrapper role + label, live-region announcer, `_a11y.scss`
- [ ] `a11y` config block documented in `docs/components/api-references/`
- [ ] Phase 2: `<mark>` wrappers with `aria-describedby`, hidden `<dl>` descriptions
- [ ] Phase 3: roving tabindex, key bindings, `cancel()` on the edit lifecycle
- [ ] Phase 4: passing default palette, `checkAnnotationContrast` export
- [ ] axe-core gate in CI
- [ ] Keyboard e2e spec
- [ ] Manual screen-reader matrix signed off
- [ ] New docs page: `docs/components/accessibility.md` — what conforms, keyboard reference, what consumers must supply (labels!), known gaps

## 7. Open questions

1. **Keyboard annotation creation** (3d) — how to reconcile with `pointer-events: none`?
2. **Nesting cap for overlapping marks** — is 3 the right default? Needs testing with the 1363-annotation demo.
3. **Does the gutter renderer need separate treatment?** `_gutter.scss` renders annotations in a margin column; those may want `role="list"` semantics rather than `<mark>`.
4. **Do consumers get an opt-out?** The `<mark>` wrappers change the text DOM, which could break consumers doing their own DOM queries against it. Probably needs `a11y.semanticMarkup: boolean` defaulting to `true`, with a changelog note.
