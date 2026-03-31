import { ZodObject } from 'zod';

/**
 * If a property has `anyOf: [{type: T}, {type: "null"}]` (produced by Zod's `.nullable()`),
 * collapse it to `{type: T}` so JSON Forms testers (e.g. `schemaTypeIs('string')`) match correctly.
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
