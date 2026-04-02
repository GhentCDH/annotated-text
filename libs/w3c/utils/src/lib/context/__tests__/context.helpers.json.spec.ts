import { expect } from 'vitest';
import { z } from 'zod';
import { buildJsonFormSchema } from '../context.helpers.json';

describe('buildJsonFormSchema', () => {
  it('should generate a draft-07 JSON Schema from a Zod object', () => {
    const schema = z.object({
      name: z.string(),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.$schema).toBe('http://json-schema.org/draft-07/schema#');
    expect(result.type).toBe('object');
  });

  it('should set additionalProperties to true on the root', () => {
    const schema = z.object({
      name: z.string(),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.additionalProperties).toBe(true);
  });

  it('should map basic Zod types to JSON Schema types', () => {
    const schema = z.object({
      label: z.string(),
      count: z.number(),
      active: z.boolean(),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.properties).toStrictEqual({
      label: { type: 'string' },
      count: { type: 'number' },
      active: { type: 'boolean' },
    });
    expect(result.required).toStrictEqual(['label', 'count', 'active']);
  });

  it('should handle optional fields by excluding them from required', () => {
    const schema = z.object({
      name: z.string(),
      nickname: z.string().optional(),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.required).toStrictEqual(['name']);
    expect(result.properties.nickname).toStrictEqual({ type: 'string' });
  });

  it('should simplify nullable anyOf to a flat type', () => {
    const schema = z.object({
      value: z.string().nullable(),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.properties.value).toStrictEqual({ type: 'string' });
    expect(result.properties.value.anyOf).toBeUndefined();
  });

  it('should handle nested objects', () => {
    const schema = z.object({
      register: z.object({
        id: z.string(),
        label: z.string(),
      }),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.properties.register).toStrictEqual({
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { type: 'string' },
        label: { type: 'string' },
      },
      required: ['id', 'label'],
    });
  });

  it('should handle arrays', () => {
    const schema = z.object({
      tags: z.array(z.string()),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.properties.tags).toStrictEqual({
      type: 'array',
      items: { type: 'string' },
    });
  });

  it('should handle enums', () => {
    const schema = z.object({
      direction: z.enum(['ltr', 'rtl', 'auto']),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.properties.direction).toStrictEqual({
      type: 'string',
      enum: ['ltr', 'rtl', 'auto'],
    });
  });

  it('should not simplify anyOf when it has more than 2 entries', () => {
    const schema = z.object({
      value: z.union([z.string(), z.number(), z.null()]),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.properties.value.anyOf).toBeDefined();
  });

  it('should not simplify anyOf when there is no null entry', () => {
    const schema = z.object({
      value: z.union([z.string(), z.number()]),
    });

    const result = buildJsonFormSchema(schema);

    expect(result.properties.value.anyOf).toStrictEqual([
      { type: 'string' },
      { type: 'number' },
    ]);
  });

  it('should handle a schema with no properties', () => {
    const schema = z.object({});

    const result = buildJsonFormSchema(schema);

    expect(result.type).toBe('object');
    expect(result.additionalProperties).toBe(true);
  });
});