import { z } from 'zod';

// ---------------------------------------------------------------------------
// JSON-LD metadata
// ---------------------------------------------------------------------------

/** JSON-LD metadata for a property (@id and/or @type) */
export const JsonLdMeta = z.object({
  '@id': z.string().optional(),
  '@type': z.string().optional(),
});

export type JsonLdMeta = z.infer<typeof JsonLdMeta>;

// ---------------------------------------------------------------------------
// JSON-LD context output
// ---------------------------------------------------------------------------

/** JSON-LD @context object */
export type JsonLdContext = {
  '@context': Record<string, unknown>;
};

/** JSON Schema with optional x-jsonld-* annotations */
export type JsonSchema = Record<string, unknown>;
