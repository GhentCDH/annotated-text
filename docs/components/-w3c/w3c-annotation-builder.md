# W3C Annotation Builder

The `w3cAnnotation` builder provides a fluent API for creating and modifying [W3C Web Annotation](https://www.w3.org/TR/annotation-model/) objects. It validates the result against the W3C schema using Zod and ensures you produce spec-compliant annotations.

```bash
npm install @ghentcdh/w3c-utils
```

## Creating an annotation

Use `w3cAnnotation()` to start a new builder, chain methods, and call `.build()` to validate and produce the final annotation.

```typescript
import { w3cAnnotation } from '@ghentcdh/w3c-utils';

const annotation = w3cAnnotation()
  .setId('https://example.org/anno/1')
  .setContext('http://www.w3.org/ns/anno.jsonld')
  .setMotivation('oa:commenting')
  .addTarget({
    type: 'SpecificResource',
    source: 'https://example.org/document/1',
  })
  .updateTextPositionSelector(
    { start: 10, end: 25 },
    'https://example.org/document/1',
  )
  .updateTextualBody('This is a great passage!', 'oa:commenting')
  .setCreator({ type: 'Person', name: 'Jane Doe' })
  .touch()
  .build();
```

The `.build()` method validates the annotation against the W3C schema and throws an error if validation fails.

## Updating an existing annotation

Pass an existing annotation to `w3cAnnotation()` to create a builder seeded with a deep clone. The original is never mutated.

```typescript
const updated = w3cAnnotation(existingAnnotation)
  .updateTextPositionSelector(
    { start: 15, end: 30 },
    'https://example.org/document/1',
  )
  .updateTextualBody('Updated comment', 'oa:commenting')
  .touch()
  .build();
```

## Reading annotations

The builder also works as a reader — use it to extract selectors from annotations without modifying them.

```typescript
const builder = w3cAnnotation(existingAnnotation);

// Get all TextQuoteSelectors
const quotes = builder.getTextQuoteSelector();

// Get selectors scoped to a specific source
const positions = builder.getTextPositionSelector(
  'https://example.org/document/1',
);

// Peek at the current state without validating
const state = builder.peek();
```

## Safe building and validation

Use `.safeBuild()` for error handling without exceptions, or `.validate()` to check validity without producing output.

```typescript
// Returns { success: true, data } or { success: false, errors }
const result = w3cAnnotation()
  .setId('https://example.org/anno/1')
  .setMotivation('oa:tagging')
  .addTarget('https://example.org/document/1')
  .safeBuild();

if (result.success) {
  console.log('Valid annotation:', result.data);
} else {
  console.error('Validation errors:', result.errors);
}

// Just check for issues — returns an empty array if valid
const issues = w3cAnnotation()
  .setId('https://example.org/anno/1')
  .validate();
```

## API reference

### Identity

| Method | Description |
|---|---|
| `setId(id)` | Set the annotation IRI |
| `setContext(ctx)` | Set `@context` (string or array) |

### Motivation

| Method | Description |
|---|---|
| `setMotivation(motivation)` | Set motivation(s), replacing existing |
| `addMotivation(motivation)` | Add a motivation (deduplicates) |
| `removeMotivation(motivation)` | Remove a specific motivation |

### Target

| Method | Description |
|---|---|
| `setTarget(target)` | Set target(s), replacing existing |
| `addTarget(target)` | Add a target |
| `replaceTarget(sourceUri, target)` | Replace the target matching `sourceUri` |
| `removeTarget(sourceUri)` | Remove the target matching `sourceUri` |

### Selectors

All selector methods accept an optional `sourceUri` to scope the operation to a specific `SpecificResource` target. If omitted, the first `SpecificResource` target is used.

| Method | Description |
|---|---|
| `updateTextQuoteSelector(selector, sourceUri?)` | Upsert a TextQuoteSelector (`{ exact, prefix?, suffix? }`) |
| `updateTextPositionSelector(selector, sourceUri?)` | Upsert a TextPositionSelector (`{ start, end }`) |
| `updateFragmentSelector(selector, sourceUri?)` | Upsert a FragmentSelector (`{ value, conformsTo? }`) |
| `updateSvgSelector(selector, sourceUri?)` | Upsert an SvgSelector (`{ value?, id? }`) |
| `removeTextQuoteSelector(sourceUri?)` | Remove TextQuoteSelector |
| `removeTextPositionSelector(sourceUri?)` | Remove TextPositionSelector |
| `removeFragmentSelector(sourceUri?)` | Remove FragmentSelector |

### Body

| Method | Description |
|---|---|
| `setBody(body)` | Set body/bodies, replacing existing |
| `addBody(body)` | Add a body |
| `updateTextualBody(value, purpose?, extras?)` | Add or replace a TextualBody (matched by purpose) |
| `removeTextualBody(purpose?)` | Remove TextualBody (all, or by purpose) |
| `updatePurpose(purpose, currentPurpose?)` | Update purpose on TextualBodies |

### Provenance

| Method | Description |
|---|---|
| `setCreator(creator)` | Set the annotation creator |
| `setGenerator(generator)` | Set the annotation generator |
| `setCreated(date)` | Set the `created` timestamp |
| `setModified(date)` | Set the `modified` timestamp |
| `touch()` | Stamp `modified` with the current ISO timestamp |

### Styling

| Method | Description |
|---|---|
| `setStylesheet(stylesheet)` | Set a CSS stylesheet (object or IRI) |

### Read / inspect

| Method | Description |
|---|---|
| `getTextQuoteSelector(sourceUri?)` | Get all TextQuoteSelectors |
| `getTextPositionSelector(sourceUri?)` | Get all TextPositionSelectors |
| `getFragmentSelector(sourceUri?)` | Get all FragmentSelectors |
| `peek()` | Return a readonly snapshot of the current state |

### Build / validate

| Method | Description |
|---|---|
| `build()` | Validate and return the annotation (throws on error) |
| `safeBuild()` | Validate and return `{ success, data }` or `{ success, errors }` |
| `validate()` | Return validation issues (empty array = valid) |