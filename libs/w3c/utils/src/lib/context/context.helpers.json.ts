import { type ZodObject } from 'zod';

/**
 * Simplify a Zod-generated `anyOf: [{type: T}, {type: "null"}]` (from `.nullable()`)
 * into a flat `{type: T}` so JSON Forms type testers match correctly.
 */
const simplifyNullableAnyOf = (property: Record<string, unknown>): void => {
  const anyOf = property['anyOf'];
  if (!Array.isArray(anyOf) || anyOf.length !== 2) return;

  const nonNull = anyOf.find(
    (s: Record<string, unknown>) => s['type'] !== 'null',
  );
  const hasNull = anyOf.some(
    (s: Record<string, unknown>) => s['type'] === 'null',
  );

  if (nonNull && hasNull) {
    delete property['anyOf'];
    Object.assign(property, nonNull);
  }
};

/**
 * Generate a JSON Schema (draft-07) from a Zod object schema.
 *
 * - Targets draft-07 for compatibility with JSON Forms
 * - Sets `additionalProperties: true` on the root schema
 * - Simplifies nullable `anyOf` patterns to flat type definitions
 *
 * @param schema - The Zod object schema to convert
 * @returns A JSON Schema object
 */
export const buildJsonFormSchema = (schema: ZodObject<any>) => {
  const jsonSchema = schema.toJSONSchema({
    unrepresentable: 'any',
    target: 'draft-07',
  });
  jsonSchema.additionalProperties = true;

  const properties = (jsonSchema as any).properties;
  if (properties) {
    for (const key of Object.keys(properties)) {
      simplifyNullableAnyOf(properties[key]);
    }
  }

  return jsonSchema as any;
};