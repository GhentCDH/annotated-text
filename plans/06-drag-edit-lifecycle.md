# Plan 06 — Drag & edit: lifecycle bugs, missing cancel, hot-path cost, zero test coverage

**Status:** not started
**Severity:** high — two of these bugs deadlock the component from ordinary user actions, and the whole subsystem has no unit tests.
**Estimated effort:** ~1 week. Phase 1 (the two deadlock bugs + harness) is ~2 days and is the urgent part.
**Related plans:** [05 — sendEvent mutation](./05-sendevent-input-mutation.md) — same code path; the two bugs compound and the test harness is shared. [02 — Accessibility](./02-accessibility.md) phase 3 needs the `cancel()` built here and benefits from the offset-based `move()` refactor.

---

## 1. The four problems

### 1.1 An aborted drag freezes the component permanently 🔴

`libs/core/src/lib/compute/draw/annotations/abstract-annotation-event.edit.ts`:

```ts
start(position, target, event) {
  if (!this.annotationAdapter.edit) return;
  if (this.internalEventListener.isBlocking) return;
  this.internalEventListener.blockEvents('annotation-edit--start');   // line 34 — unconditional
  ...
}

end(event) {
  if (!this.dummyAnnotation) return;                                   // line 69 — bails first
  this.internalEventListener.unBlockEvents('ending annotation edit');  // line 70 — never reached
  ...
}
```

`blockEvents` is set unconditionally in `start()`. The only `unBlockEvents` sits *after* a guard on `this.dummyAnnotation`.

`this.dummyAnnotation` is assigned only in `move()` (line 58), and only when `drawDummyAnnotation()` returns a value. That method returns `undefined` in two ordinary cases:

- line 118 — `if (fixed.end <= fixed.start) return;` — the snapper collapsed the range
- line 126 — `if (prevPosition && fixed.start === prevPosition.start && fixed.end === prevPosition.end) return;` — no change since last frame

**Reproduction:** grab a resize handle, drag within the same word (the word-snapper snaps back to the same boundaries, so every frame hits line 126), release. `dummyAnnotation` is `undefined` → `end()` returns at line 69 → `internalEventListener.isBlocking` stays `true` forever.

Everything downstream then silently no-ops, because they all guard on `isBlocking`:

- `AbstractAnnotationEventEdit.start` (line 33) — no further edits possible
- `EventAnnotation.hover/leave/click/doubleClick` (`EventAnnotation.ts:50,60,68,74`) — all mouse events dead
- `CreateAnnotation.startCreate` (`create.annotation.ts:30`) — cannot create annotations

The component looks alive and responds to nothing. Only a remount fixes it.

### 1.2 `DragAnnotation.onStart` throws on a non-null assertion 🔴

`libs/core/src/lib/compute/draw/annotations/drag.annotations.ts:29-32`:

```ts
const draws = this.annotation!._drawMetadata.draws;

this.startDimensions = draws.find((d) => d.draggable.start)!.draggable
  ?.start as Dimensions;
this.endDimensions = draws.find((d) => d.draggable.end)!.draggable
  ?.end as Dimensions;
```

Note the commented-out guard immediately below (line 34): `// if (!startDimensions || !endDimensions) return;` — someone already saw this.

`find()` returns `undefined` when no draw has a draggable start/end. That happens for: an annotation with an empty `draws` array, a gutter annotation, an annotation whose range falls outside the rendered line limit, or any annotation after `Draw.clearDraws()`. Also `d.draggable.start` itself dereferences `d.draggable` without a check, while `edit.ts:20` explicitly guards `if (!draw.draggable) return;` — so the two call sites disagree about whether `draggable` is optional.

**Compounding:** this throws inside the d3 `start` handler, which runs *after* `AbstractAnnotationEventEdit.start()` already called `blockEvents` (line 34). So the exception leaves the component in exactly the frozen state of §1.1, and the stack trace surfaces in the console rather than through `eventListener.sendError`.

### 1.3 There is no way to cancel an in-progress edit 🟡

`AbstractAnnotationEventEdit` has `start`, `move`, `end` — and no `cancel`. There is no Escape handling anywhere:

```
grep -rn "Escape\|keydown\|key ===" libs/core/src   →  0 hits
```

The data needed for a cancel is already captured: `originalStartEnd` is stored in the constructor (lines 25-28) from the annotation's pre-edit `start`/`end`. So a `cancel()` that restores from it, removes the dummy draw, unblocks events and emits nothing is straightforward — the pieces are all there, they're just not wired.

This matters three ways: mouse users can't back out of a drag they've started; it's the natural fix for the `end()` guard problem in §1.1 (an abort is a cancel, not a no-op); and [plan 02](./02-accessibility.md) phase 3 needs it for keyboard editing.

### 1.4 The drag hot path is expensive 🟡

Per `move()` — i.e. up to 60×/second:

**a. Deep clone + zod parse.** `abstract-annotation-event.edit.ts:99-104`:

```ts
const dummyAnnotation = textAnnotationSchema.parse({
  ...cloneDeep(annotation),
  ...startEnd,
  id: DUMMY_UID,
});
```

`cloneDeep` walks `_render` (including `lines[]` with per-line geometry and DOM element references) and `_style`. Then `textAnnotationSchema.parse` re-validates the whole thing. Both allocate; neither is needed — only `start` and `end` change between frames.

**b. `NaN` from the weight bump.** Line 106: `dummyAnnotation._render.weight = annotation._render.weight! + 1;`

`weight` is `undefined` for any annotation `calculateGutterAnnotationWeightsAndEnrich` skipped (`compute/utils/weights.ts:31`) → `undefined + 1` = `NaN`, which propagates into the SVG `y` coordinate. And `AnnotationWeight` sets `null` in some paths (`compute/utils/annotation.weight.ts:26`) → `null + 1` = `1`, silently wrong rather than loudly wrong. The schema has `weight` as `.optional().nullish()`, so both are legal values.

**c. Two snapper passes, each O(W).** Lines 110-116 call `snapper.fixOffset(dummyAnnotation)` once, then possibly again. Inside `WordSnapper`:

- `hasWordInRange` (`WordSnapper.ts:273`) — linear scan over all words
- `findClosestWord` / `findClosestWordStart` (lines 211, 247) — linear scans
- `findNextWord` / `findPreviousWord` (lines 194, 204) — `this.words.indexOf(word)`, another linear scan

An rbush tree is already built at `WordSnapper.ts:76` and goes unused by these methods.

**d. Compounding with the mutation bug.** `sendExternalEvent` → `ExternalEventSender.sendEvent` currently deep-merges into the cached annotation on every frame. Covered in [plan 05](./05-sendevent-input-mutation.md); mentioned here because the two allocations stack.

**e. Behaviour re-creation per draw.** Not in `move()`, but adjacent: `compute/draw/annotations.ts:76-94` constructs a new `DragAnnotation` + d3 `drag()` behaviour per annotation per draw, twice (lines 91, 93), plus `EventAnnotation` (2 DI injects each) and up to 2 `EditAnnotation` + `drag()` per annotation via `drawAnnotationHandles`. For the 1363-annotation demo that's ~7k drag behaviours rebuilt on every `recalculate()`. Logged here for context; the fix (one delegated listener set on the `annotations` group) is a larger refactor and belongs with the broader performance work.

### 1.5 Zero test coverage

No test file exists for any of:

```
compute/draw/annotations/abstract-annotation-event.edit.ts   (151 L)
compute/draw/annotations/drag.annotations.ts
compute/draw/annotations/edit.annotations.ts
compute/draw/annotations/create.annotation.ts               (142 L)
compute/draw/annotations/drag-annotation.ts
compute/draw/annotations/edit.ts
compute/draw/annotations/EventAnnotation.ts
events/send-event.ts
events/event.listener.ts
events/internal/internal.event.listener.ts
```

The e2e suite exercises *successful* drags, which is why §1.1 and §1.2 — both abort-path bugs — went unnoticed. Neither needs a browser to reproduce; both are pure state-machine bugs.

---

## 2. Goal

- No user action can leave `internalEventListener.isBlocking === true`.
- Escape cancels an in-progress edit and restores the original range.
- `move()` allocates nothing beyond what it must.
- The drag/edit state machine has unit tests that fail against today's code.

---

## 3. Phase 1 — Stop the deadlocks (~2 days, ship first)

### 3a. Make unblocking unconditional

`abstract-annotation-event.edit.ts`, rewrite `end()`:

```ts
end(event: MouseEvent) {
  // Always release the block, whatever else happens.
  this.internalEventListener.unBlockEvents('ending annotation edit');

  if (!this.dummyAnnotation) {
    // Nothing was ever drawn — the edit was a no-op or was rejected by the
    // snapper. Treat it as a cancel so no event is emitted.
    this.cleanup();
    return;
  }

  this.draw.annotation.removeDraw(this.dummyAnnotation.id);

  if (this.annotation) this.dummyAnnotation.id = this.annotation.id;

  this.internalEventListener.sendEvent('annotation--update', {
    annotation: this.dummyAnnotation,
  });

  this.sendExternalEvent('annotation-edit--end', this.dummyAnnotation.id);
  this.cleanup();
}
```

Where `cleanup()` clears `dummyAnnotation`, resets the `move` CSS class (`draw.annotation.setClass(id, '')` — `DragAnnotation.onStart:38` sets it and nothing clears it on the abort path), and restores the tag that `start()` removed at line 41.

**Belt-and-braces:** also wrap the d3 handlers so an exception cannot skip the unblock. In `drag-annotation.ts` and `edit.ts`, the `on('end', …)` callbacks should be `try { … } finally { … }`, or better — have `AbstractAnnotationEventEdit` expose a single `handleDragEnd()` that is itself `try/finally`. Prefer fixing it once in the base class over three call sites.

Consider whether `InternalEventListener.blockEvents` should also carry a safety valve: a token-based API (`const release = blockEvents('reason')`) makes it structurally impossible to lose the unblock, and removes the "who is holding the lock" ambiguity. That's a slightly bigger change to `events/internal/internal.event.listener.ts` — worth doing if it's small, but not a blocker for the fix above.

### 3b. Guard `DragAnnotation.onStart`

`drag.annotations.ts`:

```ts
protected override onStart(position: Position) {
  const draws = this.annotation?._drawMetadata?.draws ?? [];

  const startDraw = draws.find((d) => d.draggable?.start);
  const endDraw = draws.find((d) => d.draggable?.end);

  if (!startDraw?.draggable?.start || !endDraw?.draggable?.end) {
    Debugger.debug('DragAnnotation', 'not draggable, aborting', this.annotation?.id);
    return;   // dragBusy stays false → onDrag returns null → end() cleans up
  }

  this.startDimensions = startDraw.draggable.start;
  this.endDimensions = endDraw.draggable.end;

  const result = this.getCharacterFromTextNodesAtPoint(position);
  if (!result) return;

  this.pickupIndex = result.characterPos;
  this.textStart = this.minStartPosition;

  this.internalEventListener.blockEvents('starting annotation drag');
  this.dragBusy = true;
  this.draw.annotation.setClass(this.annotation!.id, 'move');
}
```

Note the existing double-block: the base class `start()` calls `blockEvents` at line 34, then `onStart` calls it again (`drag.annotations.ts:41`). Check `InternalEventListener` — if `blockEvents` is not re-entrant/counted, the second call is redundant at best and confusing at worst. Resolve it: either make blocking counted, or drop the call in `onStart`.

Delete the commented-out guard at `drag.annotations.ts:34` once the real one is in.

Also add the same `draggable?.` optional chaining in the two `find` predicates — `edit.ts:20` already guards `if (!draw.draggable) return;`, so making `drag.annotations.ts` consistent removes a genuine type inconsistency, not just a crash.

### 3c. Route errors through the event listener

An exception in a d3 handler currently reaches the console. `libs/core/src/lib/events/errors.ts` and `eventListener.sendError` exist for this. Wrap the drag entry points so a consumer can see and report failures. (Aside: `INVALID_LINE` in `errors.ts:3` is declared but never emitted — worth checking whether it should be.)

### 3d. Build the test harness

This is the deliverable that makes everything after it cheap. `jsdom` is already the vitest environment (`libs/core/vite.config.ts:52`), and the DI container makes stubbing tractable.

New file `libs/core/src/lib/compute/draw/annotations/__tests__/_harness.ts`:

- Builds a scoped container (`di/container.ts`) with test doubles for `AnnotationAdapter`, `TextAdapter`, `Draw`, `DrawText`, `SvgModel`, and a real `InternalEventListener`.
- Exposes `simulateDrag({ from, to, steps })` and `simulateHandleDrag({ target: 'start'|'end', … })` that call `start`/`move`/`end` directly with synthetic `Position` values — no real DOM geometry needed, because `getCharacterFromTextNodesAtPoint` is injected as a lambda in both `drag-annotation.ts:19` and `edit.ts:47`. **That injection point is what makes this testable without a browser** — stub it to map a position to a character index.
- Exposes `isBlocking()` and a recorded list of emitted events.

Then `__tests__/abstract-annotation-event.edit.spec.ts`, using the repo's `it.each` tagged-template convention (per `CLAUDE.md`):

```ts
it.each`
  scenario                          | dummyDrawn
  ${'snapper collapses the range'}  | ${false}
  ${'no change between frames'}     | ${false}
  ${'onStart finds no draggable'}   | ${false}
  ${'normal successful drag'}       | ${true}
`('unblocks events after "$scenario"', ({ scenario, dummyDrawn }) => {
  // ...
  expect(harness.isBlocking()).toBe(false);
});
```

Plus:

- `it('does not throw when _drawMetadata.draws is empty')`
- `it('emits annotation--update only when a dummy was drawn')`
- the aborted-drag cache-integrity test from [plan 05](./05-sendevent-input-mutation.md) §3 step 5

**Every one of these must fail against the current code.** Verify that before considering the phase done — a test that passes on unfixed code is testing the wrong thing.

---

## 4. Phase 2 — Add cancel (~1 day)

### 4a. `cancel()` on the base class

```ts
cancel() {
  this.internalEventListener.unBlockEvents('cancelling annotation edit');

  if (this.dummyAnnotation) {
    this.draw.annotation.removeDraw(this.dummyAnnotation.id);
  }

  if (this.annotation) {
    // originalStartEnd was captured in the constructor
    this.annotation.start = this.originalStartEnd.start;
    this.annotation.end = this.originalStartEnd.end;
    this.draw.annotation.setClass(this.annotation.id, '');
  }

  this.cleanup();
  this.sendExternalEvent('annotation-edit--cancel', this.annotation?.id);
}
```

**Two things to settle:**

1. **Is `annotation-edit--cancel` a new public event type?** It should be — consumers need to know an edit they saw start has been abandoned. That means adding it to `events/events.ts` alongside `annotation-edit--start|move|end`, and to `CHANGED_EVENTS`/`NEW_EVENTS` membership as appropriate (probably neither). Additive, so not breaking. Document it.
2. **Writing back to `this.annotation` is a mutation.** Given [plan 05](./05-sendevent-input-mutation.md)'s findings, check whether `this.annotation` is the cached object. If it is, restoring `start`/`end` is *correcting* state rather than corrupting it — but only if the mutation bug is already fixed, otherwise the frames already wrote wrong values elsewhere. **Land plan 05 first.**

### 4b. Escape key binding

`MainContainer.setMainElement()` currently sets up a `ResizeObserver`; add a `keydown` listener on the wrapper element, torn down in `destroy()` (which already calls `stopObserving()` — extend it).

Route Escape through the internal event bus (`internalEventListener.sendEvent('edit--cancel', …)`) rather than reaching into the active edit object directly, so there's one place that knows which edit is in flight. That currently doesn't exist — `AbstractAnnotationEventEdit` instances are created per-annotation, per-draw, and nothing holds "the active one". Simplest fix: have `blockEvents` record the blocking edit instance (or an `onCancel` callback) alongside the reason. That's the same change suggested in §3a's token-based API note — good reason to do it there.

### 4c. Also wire cancel to the abort path

`end()` with no dummy (§3a) should call `cancel()` rather than a bare `cleanup()`, so the CSS class reset, tag restoration and cancel event all go through one path.

---

## 5. Phase 3 — Hot path (~2 days)

Do this **after** phases 1–2 and after [plan 05](./05-sendevent-input-mutation.md), so the object-lifetime story is honest.

### 5a. Reuse one dummy object

Replace the per-frame `cloneDeep` + `textAnnotationSchema.parse` (lines 99-104) with a single dummy allocated once in `start()` and mutated in `move()`:

```ts
// in onStart / start:
this.dummyAnnotation = textAnnotationSchema.parse({
  ...cloneDeep(this.annotation),
  id: DUMMY_UID,
});
this.dummyAnnotation._render.weight = (this.annotation._render.weight ?? 0) + 1;

// in drawDummyAnnotation, per frame:
this.dummyAnnotation.start = fixed.start;
this.dummyAnnotation.end = fixed.end;
```

One clone and one parse per drag instead of per frame. Note this changes `dummyAnnotation` from "assigned only when a valid dummy was drawn" to "always present after `start()`" — which means the §1.1 guard semantics change. Introduce a separate `hasDrawnDummy: boolean` flag so `end()` can still distinguish "committed something" from "nothing happened". **The phase-1 tests will catch it if this is got wrong** — which is the point of building them first.

### 5b. Fix the weight arithmetic

`(annotation._render.weight ?? 0) + 1` — handles both `undefined` and `null`.

Separately, settle on **one** sentinel across the codebase. `renderSchema.weight` is `.optional().nullish()`, `AnnotationWeight` writes `null` (`annotation.weight.ts:26`), and `weights.ts` leaves it `undefined`. Two representations of "no weight" is the root cause here and of the `NaN` comparator in `AnnotationCache.ts:49`. Pick `undefined`, tighten the schema, and fix the writers. That's a small, separate PR worth doing.

Also fix the broken guard at `weights.ts:47` while in there — `if (!x === undefined)` is always false, and it carries its own `eslint-disable no-constant-binary-expression`, which is the lint rule correctly telling the truth.

### 5c. Make `WordSnapper` lookups sub-linear

- Store a `wordIndex: number` on each `WordPosition` when the word list is built, so `findNextWord`/`findPreviousWord` become O(1) instead of `indexOf`.
- Use the existing rbush tree (`WordSnapper.ts:76`) — or a binary search over the already-sorted `words` array — for `hasWordInRange`, `findClosestWord` and `findClosestWordStart`.

Binary search is probably the better fit: the array is sorted by offset and these are 1-D range queries, where a `lowerBound` is simpler and faster than an R-tree search. If so, the tree at line 76 may be redundant — check what else uses it before removing.

### 5d. Fix the `end` inclusivity comment

`WordSnapper.ts:44` documents `end` as inclusive; line 90 computes it exclusive (`pos + text.length + offsetStart`). Consequently `findWordContaining` (line 217) uses `position <= word.end`, matching the character *after* the word, and the boundary fallbacks at lines 167 (`word.end + 1`) and 190 (`word.start - 1`) are each one off. These are usually rescued by the midpoint fallback (lines 130-140), which is why it works in practice — but it's latent and it interacts with the `selectText` inclusivity bug logged in project memory. **Do not fix this in isolation** — the two must be settled together with a decision on exclusive-end as the invariant, and `WordSnapper.spec.ts` already exists and encodes current behaviour, so it will need updating. Flag as a dependency, not a task here.

---

## 6. Out of scope (logged, not fixed here)

- **§1.4e — behaviour re-creation per draw.** ~7k d3 `drag()` instances rebuilt per `recalculate()`. The fix is one delegated listener on the `annotations` group dispatching by `data-annotation-uid`, which is a real refactor of `compute/draw/annotations.ts`. Belongs with the broader render-performance work.
- **The 13 `recalculate()` call sites.** Every add/update/delete and every style setter triggers a full re-layout. Separate concern.
- **Keyboard editing.** [Plan 02](./02-accessibility.md) phase 3, which depends on `cancel()` from phase 2 here and benefits from an offset-based rather than pixel-based `move()`.

---

## 7. Verification checklist

**Phase 1**
- [ ] `_harness.ts` exists; can drive start/move/end without a browser
- [ ] Every new test fails against unfixed code (verified by stashing the fix)
- [ ] `isBlocking === false` after: snapper-collapse, no-change, no-draggable, exception-in-handler, normal drag
- [ ] `DragAnnotation.onStart` with empty `draws` does not throw
- [ ] Double-`blockEvents` resolved (counted, or the redundant call removed)
- [ ] Errors go through `eventListener.sendError`, not `console`
- [ ] `move` CSS class and removed tag are both restored on the abort path

**Phase 2**
- [ ] `cancel()` restores `originalStartEnd` and removes the dummy draw
- [ ] Escape cancels an in-flight drag; verified manually in the docs playground
- [ ] `annotation-edit--cancel` added to the public event types and documented
- [ ] Keydown listener torn down in `MainContainer.destroy()` — no leak across remounts

**Phase 3**
- [ ] One `cloneDeep` + one `parse` per drag, not per frame (assert with a spy call count)
- [ ] No `NaN` reaches SVG coordinates for an annotation with `weight: undefined` or `null`
- [ ] One sentinel for "no weight" across schema, `AnnotationWeight` and `weights.ts`
- [ ] `weights.ts:47` guard fixed and the `eslint-disable` removed
- [ ] `findNextWord`/`findPreviousWord` are O(1); range lookups are O(log W)
- [ ] Drag on the 1363-annotation demo is measurably smoother (use the existing `console.log('TIMER', …)` in `docs/demo/examples/large-text.ts`)

**Throughout**
- [ ] `pnpm nx run core:test` green
- [ ] `pnpm nx run e2e:e2e` green — successful drag and handle-resize must still commit correctly
- [ ] Manual: drag within one word and release; drag a gutter annotation; drag then press Escape; drag off the text and release. Component still responds after each.

## 8. Risks

- **Phase 1 is low-risk and high-value** — it only adds guards and moves one line earlier. Ship it on its own.
- **Phase 3's dummy reuse is the riskiest change here**, because it alters the meaning of `this.dummyAnnotation` being set, which §1.1's guard depends on. Do not attempt it before phase 1's tests exist.
- **Interaction with plan 05.** Phase 2's write-back to `this.annotation` is only safe once the mutation bug is fixed. Order: 05 → 06 phase 1 → 06 phase 2 → 06 phase 3.
- **`WordSnapper` changes are behaviour-visible** — snapping is what users feel. `WordSnapper.spec.ts` exists (289 L of source, with tests), so there is a safety net, but it encodes current behaviour including the off-by-one in §5d. Read it before changing anything there.
