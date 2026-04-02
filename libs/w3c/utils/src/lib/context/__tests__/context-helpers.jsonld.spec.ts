import { expect } from 'vitest';
import { z } from 'zod';
import { buildJsonLdContext } from '../context-helpers.jsonld';

describe('buildJsonLdContext', () => {
  it('should always map id to @id and type to @type', () => {
    const result = buildJsonLdContext({}, undefined);

    expect(result).toStrictEqual({
      '@context': {
        id: '@id',
        type: '@type',
      },
    });
  });

  it('should include prefix mappings in the context', () => {
    const result = buildJsonLdContext(
      { app: 'http://example.org/ns/' },
      undefined,
    );

    expect(result['@context']['app']).toBe('http://example.org/ns/');
  });

  it('should include multiple prefix mappings', () => {
    const result = buildJsonLdContext(
      {
        app: 'http://example.org/ns/',
        oa: 'http://www.w3.org/ns/oa#',
      },
      undefined,
    );

    expect(result['@context']['app']).toBe('http://example.org/ns/');
    expect(result['@context']['oa']).toBe('http://www.w3.org/ns/oa#');
  });

  it('should map scalar properties to compact IRIs using the first prefix', () => {
    const schema = z.object({
      label: z.string(),
      count: z.number(),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['label']).toBe('app:label');
    expect(result['@context']['count']).toBe('app:count');
  });

  it('should skip id and type fields from the schema shape', () => {
    const schema = z.object({
      id: z.string(),
      type: z.string(),
      label: z.string(),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['id']).toBe('@id');
    expect(result['@context']['type']).toBe('@type');
    expect(result['@context']['label']).toBe('app:label');
  });

  it('should map nested objects to expanded terms with @type: @id', () => {
    const schema = z.object({
      register: z.object({
        id: z.string(),
        label: z.string(),
      }),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['register']).toStrictEqual({
      '@id': 'app:register',
      '@type': '@id',
    });
  });

  it('should recursively lift nested object properties into the context', () => {
    const schema = z.object({
      register: z.object({
        label: z.string(),
        description: z.string(),
      }),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['label']).toBe('app:label');
    expect(result['@context']['description']).toBe('app:description');
  });

  it('should treat arrays of objects as nested objects', () => {
    const schema = z.object({
      items: z.array(
        z.object({
          name: z.string(),
        }),
      ),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['items']).toStrictEqual({
      '@id': 'app:items',
      '@type': '@id',
    });
  });

  it('should recursively lift properties from array element objects', () => {
    const schema = z.object({
      items: z.array(
        z.object({
          title: z.string(),
        }),
      ),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['title']).toBe('app:title');
  });

  it('should map arrays of scalars as compact IRIs', () => {
    const schema = z.object({
      tags: z.array(z.string()),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['tags']).toBe('app:tags');
  });

  it('should unwrap optional properties', () => {
    const schema = z.object({
      label: z.string().optional(),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['label']).toBe('app:label');
  });

  it('should unwrap nullable properties', () => {
    const schema = z.object({
      label: z.string().nullable(),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['label']).toBe('app:label');
  });

  it('should unwrap optional nested objects', () => {
    const schema = z.object({
      register: z
        .object({
          label: z.string(),
        })
        .optional(),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['register']).toStrictEqual({
      '@id': 'app:register',
      '@type': '@id',
    });
    expect(result['@context']['label']).toBe('app:label');
  });

  it('should unwrap optional arrays of objects', () => {
    const schema = z.object({
      items: z
        .array(
          z.object({
            name: z.string(),
          }),
        )
        .optional(),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['items']).toStrictEqual({
      '@id': 'app:items',
      '@type': '@id',
    });
    expect(result['@context']['name']).toBe('app:name');
  });

  it('should handle deeply nested objects', () => {
    const schema = z.object({
      level1: z.object({
        level2: z.object({
          value: z.string(),
        }),
      }),
    });

    const result = buildJsonLdContext({ ns: 'http://example.org/' }, schema);

    expect(result['@context']['level1']).toStrictEqual({
      '@id': 'ns:level1',
      '@type': '@id',
    });
    expect(result['@context']['level2']).toStrictEqual({
      '@id': 'ns:level2',
      '@type': '@id',
    });
    expect(result['@context']['value']).toBe('ns:value');
  });

  it('should use empty string prefix when no prefixes are provided', () => {
    const schema = z.object({
      label: z.string(),
    });

    const result = buildJsonLdContext({}, schema);

    expect(result['@context']['label']).toBe(':label');
  });

  it('should handle a schema with no properties', () => {
    const schema = z.object({});

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result).toStrictEqual({
      '@context': {
        app: 'http://example.org/',
        id: '@id',
        type: '@type',
      },
    });
  });

  it('should handle boolean properties as scalars', () => {
    const schema = z.object({
      active: z.boolean(),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['active']).toBe('app:active');
  });

  it('should handle enum properties as scalars', () => {
    const schema = z.object({
      direction: z.enum(['ltr', 'rtl', 'auto']),
    });

    const result = buildJsonLdContext({ app: 'http://example.org/' }, schema);

    expect(result['@context']['direction']).toBe('app:direction');
  });
});