import { contextBuilder } from '../context.builder';
import { expect } from 'vitest';
import { z } from 'zod';

describe('ContextBuilder', () => {
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

  it('should have a JsonLdContext', () => {
    expect(builder.toJsonLdContext()).toStrictEqual({
      '@context': {
        annotation: 'http://localhost:3000/',
        example: 'annotation:example',
        id: '@id',
        type: '@type',
        label: 'annotation:label',
        register: {
          '@id': 'annotation:register',
          '@type': '@id',
        },
      },
    });
  });

  it('should have a JsonForm', () => {
    expect(builder.toJsonSchema()).toStrictEqual({
      $schema: 'http://json-schema.org/draft-07/schema#',
      additionalProperties: true,
      type: 'object',
      properties: {
        type: { type: 'string' },
        register: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            label: { type: 'string' },
          },
          required: ['id', 'label'],
        },
      },
      required: ['type', 'register'],
    });
  });

  it('should parse valid data', () => {
    expect(
      builder.parse({
        type: 'example',
        register: { id: 'id-1', label: 'label' },
      }),
    ).toBeDefined();
  });
  it('should NOT parse INvalid data', () => {
    const safeParse = builder.safeParse({
      test: 'abc',
      register: { id: 'id-1', label: 1234 },
    });
    expect(safeParse.success).toBe(false);
    expect(safeParse.error).toBeDefined();
    expect(safeParse.data).toBeUndefined();
  });

  it('should create an annotation body', () => {
    const body = builder.toAnnotationBody(
      {
        type: 'example',
        register: { id: 'id-1', label: 'label' },
      },
      'example',
    );

    expect(body).toStrictEqual({
      purpose: 'example',
      type: 'example',
      register: { id: 'id-1', label: 'label' },
    });
  });
});
