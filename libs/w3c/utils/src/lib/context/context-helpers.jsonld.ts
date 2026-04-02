import { type z, type ZodArray, type ZodObject, type ZodTypeAny } from 'zod';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** An IRI string, e.g. `"mela:label"` or `"https://example.org/ns/label"` */
type IriString = string;

/** A compact JSON-LD term value: simple IRI string */
type JsonLdSimpleTerm = IriString;

/** A JSON-LD keyword alias (`@id` or `@type`) */
type JsonLdIdAlias = '@id' | '@type';

/** An expanded JSON-LD term definition with `@id`, optional `@type` and `@container` */
type JsonLdExpandedTermDefinition = {
  '@id': IriString | '@id' | '@type';
  '@type'?: '@id' | '@vocab' | IriString;
  '@container'?: '@set' | '@list' | '@language' | '@index';
};

/** Any value that can appear in a JSON-LD `@context` for a term */
type JsonLdTermValue =
  | JsonLdSimpleTerm
  | JsonLdIdAlias
  | JsonLdExpandedTermDefinition;

/** JSON-LD `@context` wrapper */
type JsonLdContext = {
  '@context': Record<string, unknown>;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a JSON-LD `@context` object by introspecting a Zod object schema.
 *
 * The generated context:
 * - Includes all prefix mappings
 * - Maps `id` to `@id` and `type` to `@type`
 * - Maps scalar properties to compact IRIs (e.g. `"label": "prefix:label"`)
 * - Maps nested objects to expanded terms with `@type: '@id'`
 * - Maps arrays of objects to expanded terms with `@container: '@set'`
 *
 * @param prefixes - Namespace prefix mappings (e.g. `{ myapp: 'https://example.org/ns/' }`)
 * @param schema - The Zod object schema to introspect
 * @returns A JSON-LD context object
 */
export const buildJsonLdContext = <T extends z.ZodRawShape = z.ZodRawShape>(
  prefixes: Record<string, string>,
  schema: ZodObject<T> | undefined,
): JsonLdContext => {
  const defaultPrefix = Object.keys(prefixes)[0] ?? '';
  const context: Record<string, JsonLdTermValue> = { ...prefixes };

  context['id'] = '@id';
  context['type'] = '@type';

  if (schema) {
    processShape(schema.shape, context, defaultPrefix, '');
  }

  return { '@context': context };
};

// ---------------------------------------------------------------------------
// Zod introspection helpers
// ---------------------------------------------------------------------------

/** Recursively unwrap Zod wrappers (optional, nullable, default, etc.) to get the inner schema */
const unwrap = (schema: ZodTypeAny): ZodTypeAny => {
  const s = schema as any;
  if (typeof s.unwrap === 'function') return unwrap(s.unwrap());
  if (s._def?.innerType) return unwrap(s._def.innerType);
  if (s._def?.schema) return unwrap(s._def.schema);
  return schema;
};

/** Check if the (unwrapped) schema is a ZodObject */
const isZodObject = (
  schema: ZodTypeAny,
): schema is ZodObject<z.ZodRawShape> => {
  const s = unwrap(schema) as any;
  return s.shape !== undefined && typeof s.shape === 'object';
};

/** Check if the (unwrapped) schema is a ZodArray */
const isZodArray = (schema: ZodTypeAny): schema is ZodArray<ZodTypeAny> => {
  const s = unwrap(schema) as any;
  return s.element !== undefined;
};

/** Extract the shape from a ZodObject (after unwrapping) */
const getObjectShape = (schema: ZodTypeAny): z.ZodRawShape =>
  (unwrap(schema) as any).shape;

/** Extract the element schema from a ZodArray (after unwrapping) */
const getArrayElement = (schema: ZodTypeAny): ZodTypeAny =>
  (unwrap(schema) as any).element;

// ---------------------------------------------------------------------------
// Shape processing
// ---------------------------------------------------------------------------

/**
 * Recursively walk a Zod object shape and populate the JSON-LD context.
 *
 * - `id` and `type` fields are skipped (they are mapped globally to `@id` / `@type`)
 * - Scalar fields become compact IRIs: `"label": "prefix:label"`
 * - Nested objects become expanded terms: `{ "@id": "prefix:register", "@type": "@id" }`
 * - Arrays of objects add `@container: "@set"` and recursively lift nested terms
 * - Arrays of scalars add `@container: "@set"` without `@type`
 */
const processShape = (
  shape: z.ZodRawShape,
  ctx: Record<string, JsonLdTermValue>,
  prefix: string,
  parentPath: string,
): void => {
  for (const [key, rawSchema] of Object.entries(shape)) {
    if (key === 'id' || key === 'type') continue;

    const fieldPath = parentPath ? `${parentPath}.${key}` : key;
    const iri = `${prefix}:${key}`;
    const schema = unwrap(rawSchema as any);

    if (isZodArray(schema)) {
      const element = unwrap(getArrayElement(schema));
      if (isZodObject(element)) {
        ctx[key] = { '@id': iri, '@type': '@id', '@container': '@set' };
        processShape(getObjectShape(element), ctx, prefix, fieldPath);
      } else {
        ctx[key] = { '@id': iri, '@container': '@set' };
      }
    } else if (isZodObject(schema)) {
      ctx[key] = { '@id': iri, '@type': '@id' };
      processShape(getObjectShape(schema), ctx, prefix, fieldPath);
    } else {
      ctx[key] = iri;
    }
  }
};