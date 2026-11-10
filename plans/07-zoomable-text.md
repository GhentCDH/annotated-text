# Plan 07 — Zoomable text with annotations that follow

**Status:** implemented in #210, except:
- step 4: resize does *not* do a full recompute. Instead the `ResizeObserver` now only redraws on width changes, and zoom must go through `setZoom()`. Setting `--annotated-text-zoom` by hand changes the font but leaves the line height stale.
- step 6: padding / border width don't scale with zoom yet. Revisit after users have tried it.
**Severity:** medium — user-facing usability gap for long, small-script texts (e.g. Syriac).
**Estimated effort:** ~4–5 days (phase 1 ~1 day, phase 3 controls ~2 days).
**Related plans:** [02 — Accessibility](./02-accessibility.md) — zoom without breaking the page is also WCAG 1.4.4 (Resize Text).

---

## 1. Problem

Users read a long text (e.g. Syriac) and cross-check it against an external edition. The script is hard to read at default size. Browser zoom scales the whole page, so the rest of the UI (toolbars, side panels, the edition next to it) becomes unusable.

They need to zoom **only the annotated text**, and the annotations (highlights, underlines, gutters, tags, handles) must stay aligned with the text.

## 2. How positioning works today (verified)

- Annotation geometry is measured from the DOM: `range.getClientRects()` in `compute/utils/ranges/get-range.ts:114` and `compute/draw/text/text-raster.ts:82`, made relative to the text element via `getScaledDimensions` (`compute/position/unscaled.ts:80`).
- `getUnscaledRect` (`compute/position/unscaled.ts:31`) already divides by `getBoundingClientRect().width / offsetWidth`, so a CSS `transform: scale()` on an ancestor is already compensated.
- `MainContainer` (`compute/model/maincontainer.ts:76`) has a `ResizeObserver` on the host element → `redraw-svg` → `CreateAnnotations.redrawSvg()` (`CreateAnnotations.ts:92`). **`redrawSvg` does not re-run `draw.initDraw`**, so text-derived state is not recomputed.
- Line height is measured by `getLineHeight` (`compute/draw/utils/line-height.ts:1`) on a `<span>` appended to **`document.body`**, called from `Draw.setText` (`compute/draw/Draw.ts:54`). It never sees the font size of the annotated-text wrapper. A font-size zoom therefore leaves `lineHeight` stale → wrong annotation heights and `minHeight` in `SvgAnnotationRender.ts:45`.
- Fixed px values that do not follow text size: `TextAdapter` `padding: 6`, `lineOffset: 2` (`adapter/text/TextAdapter.ts:27-28`), underline `borderWidth: 4` (`UnderLineAnnotationRender.ts:48`), tag `fontSize: 8` (`tag/TagRenderer.ts:66`).

## 3. Options

| Option | Reflows text | Annotations follow | Code needed | Verdict |
|---|---|---|---|---|
| A. Consumer wraps component in `transform: scale(n)` | no — box grows, horizontal scroll | yes (already compensated by `getUnscaledRect`) | none, docs only | workaround, not the fix |
| B. CSS `zoom` property | yes | `getBoundingClientRect` semantics under `zoom` differ per browser/version | small | rejected — fragile |
| **C. Font-size zoom via CSS var + `setZoom()` API** | **yes** | **yes, after full recompute** | **small** | **recommended** |

Option C: text wraps to the box width, no horizontal scroll, everything is re-measured, so annotation geometry is correct by construction.

## 4. Steps

### Phase 1 — font-size zoom (core)

1. **CSS var.** In `style/_annotation.scss`, on `&-text`:
   ```scss
   font-size: calc(var(--annotated-text-font-size, 1em) * var(--annotated-text-zoom, 1));
   ```
   Consumers can already zoom with pure CSS by setting `--annotated-text-zoom` — but then nothing recomputes (step 3).
2. **Measure line height in context.** `getLineHeight` must measure inside the wrapper element (or use `getLineHeightOnElement` on the text element) instead of `document.body`, so it inherits the zoomed font size. Also fixes the existing bug where consumer `font-size` on the wrapper is ignored.
3. **Public API.** `CreateAnnotations.setZoom(factor: number)`:
   - clamp (e.g. `0.5`–`4`), set `--annotated-text-zoom` on the wrapper,
   - call `recalculate()` (full `initDraw` + `redrawSvg`), not just `redraw-svg`.
   - `getZoom()` for UI state.
4. **Resize → full recompute.** Make the `ResizeObserver` path re-run `initDraw` too (or at least re-measure line height), so a pure-CSS zoom by the consumer also works. Debounce with `requestAnimationFrame` — font-size change triggers several resize callbacks.

### Phase 2 — reading position & proportional decorations

5. **Keep reading position.** Before zoom, find the first visible character offset in the scroll container; after recompute, scroll it back into view. Without this the user loses their place in a long text at every zoom step — the main complaint in the issue.
6. **Scale decorations (decide).** Multiply `padding`, `lineOffset`, `borderWidth` by the zoom factor so annotations keep their proportions. Tag `fontSize` probably should *not* scale (labels stay compact). Default: scale padding/border, keep tags fixed — revisit after a demo.

### Phase 3 — zoom controls (buttons, mouse, keyboard)

All opt-in through one config object, so existing consumers see no change:

```ts
setZoomControls({
  buttons: true,      // render − / % / + / reset overlay
  wheel: true,        // Ctrl/Cmd + wheel and trackpad pinch
  keyboard: true,     // Ctrl/Cmd + '+' / '-' / '0' while the text has focus
  min: 0.5, max: 4, step: 0.25,
})
```

7. **Zoom buttons.** Core renders a small toolbar inside the wrapper (plain DOM, core stays framework-agnostic): `−`, current `%` (click = reset to 100%), `+`.
   - Position: sticky top-right of the scroll box, so it stays visible while scrolling a long text. Class `ghent-cdh-annotation-zoom`, styled in `style/_zoom.scss`, overridable via CSS vars.
   - Real `<button>`s with `aria-label` ("Zoom in", "Zoom out", "Reset zoom") and `aria-live` on the % label (ties into [02](./02-accessibility.md)).
   - Disable `−`/`+` at `min`/`max`.
   - Consumers who want their own UI keep `buttons: false` and call `setZoom()`/`getZoom()` + listen to a new `zoom` event.
8. **Mouse wheel / pinch.** `wheel` listener on the wrapper, `{ passive: false }`:
   - Only when `event.ctrlKey || event.metaKey` → `preventDefault()` (stops page zoom) and zoom the text. Plain wheel keeps scrolling the text.
   - Trackpad pinch arrives as `wheel` with `ctrlKey: true` in Chrome, Edge and Firefox, so it's covered for free. Safari sends `gesturestart`/`gesturechange` instead → handle those too (`event.scale`).
   - **Zoom around the pointer:** remember the character offset under the cursor, after recompute scroll so that character is back under the cursor (same mechanism as step 5).
   - **Smooth preview, cheap commit:** a full `recalculate()` per wheel tick is too slow on long texts. During the gesture apply `transform: scale(target / current)` on the wrapper (instant, annotations already follow via `getUnscaledRect`); after ~150 ms idle, commit: drop the transform, set the font-size zoom, `recalculate()` once.
9. **Keyboard.** `Ctrl/Cmd +`/`-`/`0` only while focus is inside the text box; otherwise the browser's page zoom is untouched.
10. **Resizable box.** No code: consumer container with `resize: vertical; overflow: auto`. Existing `ResizeObserver` handles width changes. Add a docs example.
11. **Docs/demo.** Demo page with a long Syriac text in a fixed-height box with all controls enabled. Document `setZoom`, `setZoomControls`, the `zoom` event, `--annotated-text-zoom`, and option A as a zero-code alternative.

## 5. Verification

- [ ] Unit: `setZoom(2)` sets `--annotated-text-zoom: 2` on the wrapper and triggers `initDraw`; out-of-range values are clamped.
- [ ] Unit: `getLineHeight` returns a larger value when the wrapper has a larger font size.
- [ ] E2E (Playwright): for zoom `1`, `1.5`, `3`, every annotation `<rect>` bbox covers the client rects of its text range (tolerance ~1px) — highlight, underline, gutter, RTL text.
- [ ] E2E: resize/drag handles and create-by-selection still hit the right character offsets after zoom.
- [ ] E2E: zoom keeps the first visible line in view (phase 2).
- [ ] Unit: zoom buttons call `setZoom` with `±step`, are disabled at `min`/`max`, `%` label resets to 1.
- [ ] Unit: wheel without modifier is not prevented; wheel with `ctrlKey`/`metaKey` is prevented and changes zoom; many ticks → one `recalculate()` after idle.
- [ ] E2E: Ctrl + wheel over the text zooms the text only (page `devicePixelRatio` unchanged); the character under the pointer stays under the pointer.
- [ ] E2E: buttons are keyboard-reachable and announce the new zoom level.
- [ ] Manual: trackpad pinch in Chrome, Firefox and Safari.
- [ ] Manual: long Syriac text in a fixed-height scroll box, zoom 1 → 3 → 1, no drift, no horizontal scroll.
- [ ] Page-level browser zoom still works (no regression).

## 6. Risks

- **Recompute cost.** Full `recalculate()` on large texts is not cheap (see `review_backlog_performance`: per-character forced layout, 13 `recalculate()` sites). Zoom by buttons is fine; continuous zoom (slider / pinch) needs debouncing.
- **Memoized measurements.** `memoizee` caches in `unscaled.ts` are keyed on numbers only — fine — but check any cache keyed on line/character that survives a recompute.
- **Hijacking the browser.** Ctrl + wheel is the user's page-zoom gesture. Only intercept it over the text box and only when `wheel: true`; keep the default `false` until a demo confirms users expect it.
- **Safari gestures.** `gesture*` events are non-standard and Safari-only; feature-detect, don't sniff the UA.
- **Toolbar overlapping text.** A sticky overlay can cover the first characters of RTL lines (top-left) or LTR (top-right); place it on the side opposite the text direction, or reserve space with padding.
- **Drag in progress.** Zoom during an active edit/drag: block or cancel first (ties into [06](./06-drag-edit-lifecycle.md) `cancel()`).
