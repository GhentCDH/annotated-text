import { z, type ZodArray, type ZodObject, type ZodTypeAny } from 'zod';
import type { ContextBuilder } from './context.builder';
import type { JsonLdContext, JsonLdMeta, JsonSchema } from './context.schema';

type IriString = string;

type JsonLdSimpleTerm = IriString; // e.g. "mela:label"
type JsonLdIdAlias = '@id' | '@type';

interface JsonLdExpandedTermDefinition {
  '@id': IriString | '@id' | '@type';
  '@type'?: '@id' | '@vocab' | IriString;
  '@container'?: '@set' | '@list' | '@language' | '@index';
}

type JsonLdTermValue =
  | JsonLdSimpleTerm
  | JsonLdIdAlias
  | JsonLdExpandedTermDefinition;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PropertyMeta = {
  schema: z.ZodTypeAny;
  jsonld: JsonLdMeta;
  builder?: ContextBuilder;
};

// ---------------------------------------------------------------------------
// JSON-LD context
// ---------------------------------------------------------------------------

/** Build a JSON-LD @context object from prefixes and property metadata */
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

// ─── Zod introspection helpers ────────────────────────────────────────────────

function unwrap(schema: ZodTypeAny): ZodTypeAny {
  const s = schema as any;
  // Zod v4: .unwrap() is available on optional, nullable, default, etc.
  if (typeof s.unwrap === 'function') {
    return unwrap(s.unwrap());
  }
  // Zod v3 compat: _def.innerType or _def.schema
  if (s._def?.innerType) return unwrap(s._def.innerType);
  if (s._def?.schema) return unwrap(s._def.schema);
  return schema;
}

function isZodObject(schema: ZodTypeAny): schema is ZodObject<z.ZodRawShape> {
  const s = unwrap(schema) as any;
  return s.shape !== undefined && typeof s.shape === 'object';
}

function isZodArray(schema: ZodTypeAny): schema is ZodArray<ZodTypeAny> {
  const s = unwrap(schema) as any;
  return s.element !== undefined;
}

function getObjectShape(schema: ZodTypeAny): z.ZodRawShape {
  return (unwrap(schema) as any).shape;
}

function getArrayElement(schema: ZodTypeAny): ZodTypeAny {
  return (unwrap(schema) as any).element;
}

// ─── Per-field overrides ──────────────────────────────────────────────────────

const processShape = (
  shape: z.ZodRawShape,
  ctx: Record<string, JsonLdTermValue>,
  prefix: string,
  parentPath: string,
): void => {
  for (const [key, rawSchema] of Object.entries(shape)) {
    // skip built-in aliases — already mapped above
    if (key === 'id' || key === 'type') continue;
    const fieldPath = parentPath ? `${parentPath}.${key}` : key;
    const iri = `${prefix}:${key}`;
    const schema = unwrap(rawSchema as any);

    if (isZodArray(schema)) {
      const element = unwrap(getArrayElement(schema));
      if (isZodObject(element)) {
        //this._flattenNestedObjects) {
        // Array of objects → @container @set + lift nested terms
        ctx[key] = {
          '@id': iri,
          '@type': '@id',
          '@container': '@set',
        };
        processShape(getObjectShape(element), ctx, prefix, fieldPath);
      } else {
        ctx[key] = {
          '@id': iri,
          '@container': '@set',
        };
      }
    } else if (isZodObject(schema)) {
      // Nested object → node reference
      ctx[key] = {
        '@id': iri,
        '@type': '@id',
      };
      processShape(getObjectShape(schema), ctx, prefix, fieldPath);
    } else {
      // Plain literal
      ctx[key] = iri;
    }
  }
};
// ---------------------------------------------------------------------------
// JSON Schema annotation
// ---------------------------------------------------------------------------

/** Annotate a JSON Schema with x-jsonld-* metadata from the property map */
export const annotateJsonSchema = (
  schema: JsonSchema,
  id: string | undefined,
  type: string | undefined,
  properties: Map<string, PropertyMeta>,
): JsonSchema => {
  const result = { ...schema };

  if (id) result['x-jsonld-id'] = id;
  if (type) result['x-jsonld-type'] = type;

  const props = result['properties'];
  if (props && typeof props === 'object') {
    result['properties'] = Object.fromEntries(
      Object.entries(props as Record<string, JsonSchema>).map(
        ([key, value]) => {
          const meta = properties.get(key);
          const annotated = { ...value };

          if (meta?.jsonld['@id'])
            annotated['x-jsonld-id'] = meta.jsonld['@id'];
          if (meta?.jsonld['@type'])
            annotated['x-jsonld-type'] = meta.jsonld['@type'];

          if (meta?.builder && annotated['properties']) {
            return [key, meta.builder.toJsonSchema()];
          }

          return [key, annotated];
        },
      ),
    );
  }

  return result;
};

// ---------------------------------------------------------------------------
// Annotation body
// ---------------------------------------------------------------------------

/** Wrap parsed data as a W3C annotation body with type and optional purpose */
export const toAnnotationBody = (
  parsed: Record<string, unknown>,
  id: string | undefined,
  purpose?: string,
): Record<string, unknown> => ({
  type: id ?? 'unknown',
  ...(purpose ? { purpose } : {}),
  ...parsed,
});

// ---------------------------------------------------------------------------
// JSON Schema → Zod conversion
// ---------------------------------------------------------------------------

export type JsonSchemaProperty = {
  type?: string;
  enum?: unknown[];
  properties?: Record<string, JsonSchemaProperty>;
  items?: JsonSchemaProperty;
  required?: string[];
  additionalProperties?: boolean;
  'x-jsonld-id'?: string;
  'x-jsonld-type'?: string;
};

/** Convert a single JSON Schema property definition to a Zod schema */
export const jsonSchemaPropertyToZod = (
  prop: JsonSchemaProperty,
): z.ZodTypeAny => {
  if (prop.enum) {
    const literals = prop.enum.map((v) =>
      z.literal(v as string | number | boolean),
    );
    if (literals.length === 1) return literals[0];
    const [first, second, ...rest] = literals;
    return z.union([first, second, ...rest]);
  }

  switch (prop.type) {
    case 'string':
      return z.string();
    case 'number':
      return z.number();
    case 'integer':
      return z.number().int();
    case 'boolean':
      return z.boolean();
    case 'array':
      return z.array(
        prop.items ? jsonSchemaPropertyToZod(prop.items) : z.unknown(),
      );
    case 'object':
      return jsonSchemaObjectToZod(prop);
    default:
      return z.unknown();
  }
};

/** Convert a JSON Schema object definition to a Zod object schema */
export const jsonSchemaObjectToZod = (
  schema: JsonSchemaProperty,
): z.ZodTypeAny => {
  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);

  const shape: Record<string, z.ZodTypeAny> = {};
  for (const [name, prop] of Object.entries(properties)) {
    const zodProp = jsonSchemaPropertyToZod(prop);
    shape[name] = required.has(name) ? zodProp : zodProp.optional();
  }

  return z.object(shape);
};
