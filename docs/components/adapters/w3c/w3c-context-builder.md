# W3C Context Builder

The `contextBuilder` provides a fluent API for defining JSON-LD-aware schemas. You provide a prefix and base URL, set a type, pass a Zod schema, and the builder automatically generates a JSON-LD context, JSON Schema, and validation — all from a single definition.

This is useful when your W3C annotations carry application-specific body data (custom bodies) that need both runtime validation and JSON-LD serialization.

```bash
npm install @ghentcdh/w3c-utils
```

## Defining a schema

Use `contextBuilder(prefix, baseUrl)` to create a builder, set a type, and provide a Zod schema. The builder automatically maps properties to JSON-LD terms using the prefix.

```typescript
import { z } from 'zod';
import { contextBuilder } from '@ghentcdh/w3c-utils';

const builder = contextBuilder('annotation', 'http://localhost:3000');

builder.setType('annotation', 'example').parseZodSchema(
  z.object({
    type: z.string(),
    register: z.object({
      id: z.string(),
      label: z.string(),
    }),
  }),
);
```

The builder automatically:

- Maps `id` to `@id` and `type` to `@type` in the JSON-LD context
- Maps scalar properties (e.g. `label`) to compact terms like `annotation:label`
- Maps nested objects (e.g. `register`) to expanded terms with `@type: '@id'`
- Normalizes the base URL (appends `/` if missing)

## Validating data

The builder wraps the Zod schema for validation. Use `.parse()` or `.safeParse()` to validate data.

```typescript
// Throws on invalid data
const parsed = builder.parse({
  type: 'example',
  register: { id: 'id-1', label: 'label' },
});

// Returns { success, data, error }
const result = builder.safeParse({
  test: 'abc',
  register: { id: 'id-1', label: 1234 },
});
if (!result.success) {
  console.error('Validation errors:', result.error);
}
```

## Creating annotation bodies

Use `.toAnnotationBody()` to wrap validated data as a W3C custom body. The builder's type is used as the body `type`.

```typescript
const body = builder.toAnnotationBody(
  {
    type: 'example',
    register: { id: 'id-1', label: 'label' },
  },
  'example', // optional purpose
);
```

This produces:

```json
{
  "purpose": "example",
  "type": "example",
  "register": { "id": "id-1", "label": "label" }
}
```

## Using with the annotation builder

The body produced by `.toAnnotationBody()` can be used directly with the [W3C Annotation Builder](/components/adapters/w3c/w3c-annotation-builder).

```typescript
import { w3cAnnotation } from '@ghentcdh/w3c-utils';

const body = builder.toAnnotationBody({
  type: 'example',
  register: { id: 'id-1', label: 'label' },
});

const annotation = w3cAnnotation()
  .setId('https://example.org/anno/1')
  .setTarget({
    type: 'SpecificResource',
    source: 'https://example.org/doc/1',
    selector: { type: 'TextPositionSelector', start: 0, end: 10 },
  })
  .setBody(body)
  .build();
```

## Generating a JSON-LD context

Use `.toJsonLdContext()` to produce the `@context` object for JSON-LD serialization. The builder automatically derives JSON-LD terms from the Zod schema shape:

- `id` and `type` are mapped to `@id` and `@type`
- Scalar properties become compact IRIs (e.g. `"label": "annotation:label"`)
- Nested objects use expanded term definitions with `@type: '@id'`
- Arrays of objects include `@container: '@set'`

```typescript
const jsonLdContext = builder.toJsonLdContext();
```

```json
{
  "@context": {
    "annotation": "http://localhost:3000/",
    "example": "annotation:example",
    "id": "@id",
    "type": "@type",
    "label": "annotation:label",
    "register": {
      "@id": "annotation:register",
      "@type": "@id"
    }
  }
}
```

## Generating a JSON Schema

Use `.toJsonSchema()` to produce a JSON Schema (draft-07) from the Zod schema. This is useful for integration with form generators like JSON Forms.

```typescript
const jsonSchema = builder.toJsonSchema();
```

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "additionalProperties": true,
  "type": "object",
  "properties": {
    "type": { "type": "string" },
    "register": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "id": { "type": "string" },
        "label": { "type": "string" }
      },
      "required": ["id", "label"]
    }
  },
  "required": ["type", "register"]
}
```

## From JSON Schema

You can also create a builder from an existing JSON Schema using `.parseFromJsonSchema()`:

```typescript
const builder = contextBuilder('annotation', 'http://localhost:3000');

builder.setType('annotation', 'example').parseFromJsonSchema({
  type: 'object',
  required: ['register'],
  properties: {
    register: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        label: { type: 'string' },
      },
    },
  },
});
```

## API reference

### Factory

| Function | Description |
|---|---|
| `contextBuilder(prefix, baseUrl)` | Create a new builder with a namespace prefix and base URL |

### Configuration

| Method | Description |
|---|---|
| `setType(prefix, type)` | Set the annotation type and register it as a prefixed term |
| `addPrefix(prefix, uri)` | Add a namespace prefix mapping |
| `setContextUri(uri)` | Set the context URI |
| `getContextUri()` | Get the context URI |

### Schema input

| Method | Description |
|---|---|
| `parseZodSchema(schema)` | Set a `z.object()` schema for validation and context generation |
| `parseFromJsonSchema(schema)` | Set a schema from a JSON Schema object |

### Outputs

| Method | Description |
|---|---|
| `toZod()` | Get the Zod schema |
| `toJsonSchema()` | Get a JSON Schema (draft-07) suitable for form generators |
| `toJsonLdContext()` | Get the `{ '@context': { ... } }` object for JSON-LD serialization |

### Parse / validate

| Method | Description |
|---|---|
| `parse(data)` | Validate and return parsed data (throws on error) |
| `safeParse(data)` | Validate and return `{ success, data }` or `{ success, error }` |
| `toAnnotationBody(data, purpose?)` | Validate, then wrap as a W3C custom body with `type` and optional `purpose` |