# Plan 05 — `ExternalEventSender.sendEvent` mutates the cached annotation

**Status:** steps 1, 3 and the unit tests of step 5 done (shallow spread instead of `merge`, `send-event.spec.ts`). Step 2: option A, the return value is still the cached object. Not done: step 4 (is consumer input aliased?) and the aborted-drag integration test.
**Severity:** high — silent state corruption on every drag frame; leaves the cache holding coordinates that were never committed.
**Estimated effort:** ~2 hours including tests.
**Related plans:** [06 — Drag/edit lifecycle](./06-drag-edit-lifecycle.md). The two bugs compound and are best fixed together — this one is *why* an aborted drag leaves visible damage rather than just doing nothing.

---

## 1. The bug

`libs/core/src/lib/events/send-event.ts:29-36`:

```ts
const fullAnnotation = this.annotationAdapter.getAnnotation(annotationUuid);

const isNew = NEW_EVENTS.includes(event);
const hasChanged = CHANGED_EVENTS.includes(event);

const annotation = this.annotationAdapter.format(
  merge(
    fullAnnotation,
    (additionalData as any).annotation,
  ) as TextAnnotation,
  isNew,
  hasChanged,
);
```

`merge` is `lodash-es`'s `merge`, which **mutates its first argument** and returns it. `fullAnnotation` comes straight from `AnnotationAdapter.getAnnotation()` → `AnnotationCache`, i.e. it is the live stored object, not a copy.

So every call to `sendEvent` that passes `additionalData.annotation` writes those fields into the cache.

Note also line 48: `return fullAnnotation;` — the method returns the same mutated object, and `EventAnnotation.hover()` (`compute/draw/annotations/EventAnnotation.ts:52`) passes it to `this.annotationAdapter.hover(fullAnnotation)`. So the mutated object also escapes to consumer-supplied adapter code.

### 1.1 The hot caller

`libs/core/src/lib/compute/draw/annotations/abstract-annotation-event.edit.ts:146-152`:

```ts
this.internalEventListener.sendEvent('send-event--annotation', {
  event,
  annotationUuid: annotation.id || '',
  additionalData: {
    annotation: {
      start: this.dummyAnnotation?.start ?? annotation.start,
      end: this.dummyAnnotation?.end ?? annotation.end,
    },
    ...
```

`sendExternalEvent` is called from `move()` (line 62) on **every drag frame**, with the *dummy* annotation's `start`/`end`. Each frame therefore overwrites the real annotation's `start` and `end` in the cache with the in-flight drag coordinates.

### 1.2 Concrete failure scenario

Given annotation `A = { id: 'a1', start: 10, end: 20 }`:

1. User grabs `A`'s end handle and drags right. `move()` fires ~60×/sec; each call merges `{start: 10, end: 27}`, `{start: 10, end: 31}`, … into the cached `A`.
2. Cache now holds `A.end = 31` even though nothing has been committed — `annotation--update` has not been sent, no `annotation-edit--end` has fired.
3. User releases the mouse **over a non-text region**, or drags back so the snapper yields `end <= start`. `drawDummyAnnotation` returns `undefined` (`abstract-annotation-event.edit.ts:118` or `:126`), so `this.dummyAnnotation` was never assigned, so `end()` bails at line 69 before doing anything.
4. **Result:** the cache holds `A = { start: 10, end: 31 }`. No update event was emitted, so the consumer's own store still has `{10, 20}`. The next `recalculate()` renders `A` at 10–31.

The component's internal state and the consumer's state have silently diverged, with no event to reconcile from.

### 1.3 Second-order effects

- **`_render` and `_style` are merged too.** `merge` is a deep merge. If `additionalData.annotation` ever carries partial `_render` (nothing does today, but the type is `Partial<TextAnnotation>`), it deep-writes into the shared render metadata that `AnnotationWeight` and `Draw` rely on.
- **Weight ordering.** `AnnotationCache.ts:49` sorts by `b._render.weight! - a._render.weight!`. Not directly hit by this bug, but it's the same class of "shared mutable `_render`" fragility.
- **A library shouldn't mutate its inputs.** Annotations originate from the consumer via `setAnnotations`. Whether `AnnotationAdapter.parse` produces fresh objects or holds references to the caller's is worth confirming (§3 step 4) — if it holds references, this bug reaches all the way out into the consumer's own array.

### 1.4 Why this hasn't been noticed

`libs/core/src/lib/events/send-event.ts` has **no test file**, and neither does any of the drag/edit code (`abstract-annotation-event.edit.ts`, `drag.annotations.ts`, `edit.annotations.ts`). The e2e suite exercises successful drags, where the final `annotation--update` overwrites the corrupted state with the correct value — masking the bug entirely. It only manifests on *aborted* drags.

---

## 2. Goal

`sendEvent` never mutates cached state. An aborted drag leaves the cache byte-identical to before the drag started.

---

## 3. Steps

### Step 1 — The one-line fix

`libs/core/src/lib/events/send-event.ts`:

```diff
   const annotation = this.annotationAdapter.format(
-    merge(
-      fullAnnotation,
-      (additionalData as any).annotation,
-    ) as TextAnnotation,
+    merge(
+      {},
+      fullAnnotation,
+      (additionalData as any).annotation,
+    ) as TextAnnotation,
     isNew,
     hasChanged,
   );
```

`merge({}, a, b)` builds a fresh object. This is the minimal correct change.

**Caveat — it's a shallow-ish guarantee.** `merge` deep-*clones* plain objects and arrays into the target, but for the nested `_render.lines[].element` (DOM node references) it will copy the reference, not the node. That's what we want. But nested plain objects reached by `merge` are recursively merged into new objects, which means `_render` and `_style` get deep-copied on **every drag frame** — see step 3.

### Step 2 — Don't return the mutable cache object either

Line 48 returns `fullAnnotation`, which after step 1 is no longer mutated by `merge` — good. But it is still the live cache object, handed to consumer code via `annotationAdapter.hover(fullAnnotation)` (`EventAnnotation.ts:52`).

Decide deliberately:

- **Option A (minimal):** leave it. `hover()` is documented as read-only and a consumer mutating it is their bug. Cheap, but the type says `TextAnnotation`, not `Readonly<TextAnnotation>`, so nothing communicates the contract.
- **Option B (recommended):** return the merged copy — `return annotation;` — since that's what was actually dispatched to listeners and is what the caller most plausibly wants. Check the two call sites first:
  - `EventAnnotation.sendEvent()` (line 36-42) → used by `hover()` (line 52) to feed `annotationAdapter.hover()`.
  - Any others: `grep -rn "externalEventSender.sendEvent\|\.sendEvent({" libs/core/src`

  For the hover path, `annotation` and `fullAnnotation` are identical in content (hover passes no `additionalData`), so Option B is behaviour-neutral there and strictly safer elsewhere.

Also widen the signature to `Readonly<TextAnnotation>` on the return if it doesn't cascade badly. If it does, skip — not worth a large diff.

### Step 3 — Stop the per-frame deep clone (performance, do it in the same PR)

With step 1, every drag frame does a full deep merge of `_render` (which contains a `lines` array with per-line geometry) and `_style`. That's allocation churn at 60 fps, and it compounds with the `cloneDeep(annotation)` already happening in `drawDummyAnnotation` (`abstract-annotation-event.edit.ts:100`).

The merge only ever needs `start` and `end`. Replace the generic deep merge with an explicit shallow spread:

```ts
const patch = (additionalData as any).annotation;
const annotation = this.annotationAdapter.format(
  (patch ? { ...fullAnnotation, ...patch } : fullAnnotation) as TextAnnotation,
  isNew,
  hasChanged,
);
```

`{ ...a, ...b }` is a shallow copy: `_render` and `_style` are shared by reference (which is correct — they're internal render state, not part of the event payload), and `start`/`end` are overwritten. No deep walk, no allocation of the geometry arrays.

**Check before doing this:** is any caller relying on the *deep* merge semantics? Grep for everything that reaches `sendEvent` with `additionalData`:

```bash
grep -rn "send-event--annotation" libs/core/src
grep -rn "additionalData" libs/core/src
```

Today the only producer is `abstract-annotation-event.edit.ts:146-152`, which passes exactly `{ start, end }` plus `annotationUuid` and `moveId` (the latter two are read separately by the internal listener, not merged). So shallow is sufficient. If a future caller needs deep-patching, it should say so explicitly rather than relying on `merge`'s behaviour.

If there's any doubt, ship step 1 alone (correct but slower) and do step 3 as a follow-up with the perf work.

### Step 4 — Confirm whether consumer input is aliased

Separate but adjacent question: does `AnnotationAdapter.parse` return fresh objects, or does it hand back the consumer's own objects with `_render`/`_style` attached?

```bash
sed -n '80,105p' libs/core/src/lib/adapter/annotation/AnnotationAdapter.ts
```

`parse` runs `textAnnotationSchema.parse({ ...annotation, ... })` — zod's `.parse` on an object schema returns a **new** object, so the top level is fresh. But nested objects that zod passes through unvalidated (via `.passthrough()` or `z.any()` fields) may be aliased. Worth 10 minutes to confirm, and worth a test asserting that `setAnnotations(input)` followed by any interaction leaves `input` deep-equal to a pre-captured snapshot. If it turns out the consumer's objects *are* aliased, that's a separate finding to log — not in scope for this plan.

### Step 5 — Tests

New file `libs/core/src/lib/events/__tests__/send-event.spec.ts`:

```ts
describe('ExternalEventSender', () => {
  it('does not mutate the cached annotation when merging additionalData', () => {
    // arrange: adapter stub whose getAnnotation returns a known object
    const cached = { id: 'a1', start: 10, end: 20, _render: {}, _style: {} };
    // act: sendEvent with additionalData.annotation = { start: 10, end: 31 }
    // assert
    expect(cached.end).toBe(20);
  });

  it('dispatches the merged values to listeners', () => {
    // assert the payload the listener received has end === 31
  });

  it('shares _render by reference rather than deep-copying it', () => {
    // guards step 3 — the perf property, stated as a test
  });
});
```

Then the regression test that actually matters, as an integration spec (this one belongs to [plan 06](./06-drag-edit-lifecycle.md) but is listed here because it's what proves *this* fix):

```ts
it('leaves the cache untouched after an aborted drag', () => {
  // 1. setAnnotations([{ id: 'a1', start: 10, end: 20 }])
  // 2. snapshot = structuredClone(getAnnotation('a1'))
  // 3. simulate: drag start → 3× move → end with no valid dummy
  // 4. expect(getAnnotation('a1')).toEqual(snapshot)
});
```

Both suites need a way to drive `AbstractAnnotationEventEdit` without a real browser. `jsdom` is already the vitest environment (`libs/core/vite.config.ts:52`). The DI container (`libs/core/src/lib/di/container.ts`) makes stubbing `annotationAdapter` and `internalEventListener` tractable — register test doubles in a scoped container rather than constructing the whole module. See [plan 06](./06-drag-edit-lifecycle.md) §4 for the harness; build it once and use it for both.

---

## 4. Verification checklist

- [ ] `merge({}, …)` or explicit spread in `send-event.ts` — no mutation of `fullAnnotation`
- [ ] Return value decision made and recorded (Option A or B)
- [ ] `send-event.spec.ts` exists and covers: no mutation, correct dispatched payload, `_render` shared by reference
- [ ] Aborted-drag integration test passes and **fails** against the unfixed code (verify by reverting the one-line change)
- [ ] `pnpm nx run core:test` green
- [ ] `pnpm nx run e2e:e2e` green — successful drags must still commit correctly
- [ ] Manual check in the docs playground: drag an annotation's handle back onto itself so the snapper rejects it, release, then trigger any re-render (resize the window). The annotation must be back where it started.
- [ ] Step 4's question answered: does consumer input get aliased? Log a separate finding if yes.

## 5. Risks

**Low for step 1.** Removing an unintended mutation cannot break a caller that wasn't depending on it — and nothing should be depending on a side channel through the cache. The one thing to watch: if any code path currently *relies* on the cache being updated during drag (i.e. treats the mutation as the commit mechanism), fixing this would make a successful drag stop persisting. Rule it out by confirming `end()` sends `annotation--update` with the dummy (`abstract-annotation-event.edit.ts:76-78`) and that the internal listener writes that to the cache — which is the intended path. The e2e suite covers this.

**Medium for step 3** if a caller did rely on deep-merge semantics. The grep in step 3 settles it; today it does not.

## 6. Why fix this before the performance work

Several items on the performance list involve caching and reusing objects across frames rather than rebuilding them. Every one of those becomes harder to reason about while a shared object is being mutated behind the scenes. Fixing the mutation first makes the object-lifetime story honest, which is a precondition for the drag hot-path optimisation in [plan 06](./06-drag-edit-lifecycle.md) §3d.
