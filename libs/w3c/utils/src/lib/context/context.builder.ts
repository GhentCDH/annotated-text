import { z, type ZodObject } from 'zod';
import { buildJsonLdContext } from './context-helpers.jsonld';
import { buildJsonFormSchema } from './context.helpers.json';
import { toAnnotationBody } from './context.helpers';

/**
 * Ensure the prefix URI ends with `/` when it contains a protocol.
 * This normalizes base URLs like `"http://localhost:3000"` to `"http://localhost:3000/"`.
 */
const parsePrefix = (prefix: string, uri: string) => {
  return uri.includes('://') && !uri.endsWith('/') ? `${uri}/` : uri;
};

/**
 * A fluent builder for defining JSON-LD-aware Zod schemas.
 *
 * Given a Zod object schema and a namespace prefix, the builder can:
 * - Validate data with `.parse()` / `.safeParse()`
 * - Generate a JSON-LD `@context` with `.toJsonLdContext()`
 * - Generate a JSON Schema (draft-07) with `.toJsonSchema()`
 * - Wrap validated data as a W3C annotation body with `.toAnnotationBody()`
 *
 * @typeParam T - The Zod raw shape of the schema
 *
 * @example
 * ```ts
 * const builder = contextBuilder('annotation', 'http://localhost:3000');
 * builder.setType('annotation', 'example').parseZodSchema(
 *   z.object({
 *     type: z.string(),
 *     register: z.object({ id: z.string(), label: z.string() }),
 *   }),
 * );
 *
 * builder.parse({ type: 'example', register: { id: '1', label: 'test' } });
 * builder.toJsonLdContext();  // { '@context': { ... } }
 * builder.toJsonSchema();     // { type: 'object', properties: { ... } }
 * ```
 */
export class ContextBuilder<T extends z.ZodRawShape = z.ZodRawShape> {
  private prefixes: Record<string, string> = {};
  private _schema: ZodObject<T> | undefined;
  private type = 'unknown';
  private uri: string | undefined;

  /**
   * Add a namespace prefix mapping.
   * The URI is normalized to end with `/` when it contains a protocol.
   *
   * @param prefix - The short prefix name (e.g. `"myapp"`)
   * @param uri - The base URI (e.g. `"https://example.org/ns/"`)
   */
  addPrefix(prefix: string, uri: string): this {
    this.prefixes[prefix] = parsePrefix(prefix, uri);
    return this;
  }

  /**
   * Set the schema from a JSON Schema object.
   * Uses Zod's built-in `z.fromJSONSchema()` for conversion.
   *
   * @param schema - A JSON Schema object
   */
  parseJsonSchema(schema: any): this {
    this._schema = z.fromJSONSchema(schema) as ZodObject<T>;
    return this;
  }

  /**
   * Set the schema from a Zod object schema.
   *
   * @param schema - A `z.object()` schema
   */
  parseZodSchema(schema: ZodObject<T>): this {
    this._schema = schema;
    return this;
  }

  /**
   * Generate a JSON-LD `@context` object by introspecting the Zod schema.
   *
   * @returns A JSON-LD context with prefix mappings and property term definitions
   */
  toJsonLdContext() {
    return buildJsonLdContext(this.prefixes, this._schema);
  }

  /**
   * Generate a JSON Schema (draft-07) from the Zod schema.
   * Useful for integration with form generators like JSON Forms.
   *
   * @returns A JSON Schema object, or `null` if no schema is set
   */
  toJsonSchema() {
    if (!this._schema) {
      return null;
    }
    return buildJsonFormSchema(this._schema);
  }

  /** Get the underlying Zod schema, or `undefined` if not set */
  toZod() {
    return this._schema;
  }

  /**
   * Set the annotation type and register it as a prefixed term.
   *
   * @param prefix - The prefix to use (e.g. `"annotation"`)
   * @param type - The type name (e.g. `"example"`)
   */
  setType(prefix: string, type: string): this {
    this.type = type;
    this.prefixes[type] = `${prefix}:${type}`;
    return this;
  }

  /**
   * Parse and validate data against the Zod schema.
   * Throws a `ZodError` on invalid data.
   *
   * @param data - The data to validate
   * @returns The parsed and validated data
   */
  parse(data: unknown) {
    return this.toZod()?.parse(data) ?? null;
  }

  /**
   * Parse and validate data without throwing.
   *
   * @param data - The data to validate
   * @returns A result object with `success`, `data`, and `error` fields
   */
  safeParse(data: unknown) {
    const zod = this.toZod();
    if (!zod) return { success: true, data: null };
    return zod.safeParse(data);
  }

  /**
   * Validate data and wrap it as a W3C annotation body.
   * The builder's type is used as the body `type`.
   *
   * @param data - The data to validate and wrap
   * @param purpose - Optional annotation purpose (e.g. `"oa:tagging"`)
   * @returns A W3C annotation body object
   */
  toAnnotationBody(data: unknown, purpose?: string): Record<string, unknown> {
    const parsed = this.parse(data);
    return toAnnotationBody(parsed as any, this.type, purpose);
  }

  /** Get the context URI, or `undefined` if not set */
  getContextUri() {
    return this.uri;
  }

  /**
   * Set the context URI for this builder.
   *
   * @param uri - The full context URI
   */
  setContextUri(uri: string) {
    this.uri = uri;
    return this;
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Create a new context builder with a namespace prefix and base URL.
 *
 * @param prefix - The short prefix name (e.g. `"annotation"`)
 * @param baseUrl - The base URL for the prefix (e.g. `"http://localhost:3000"`)
 * @returns A new `ContextBuilder` instance
 *
 * @example
 * ```ts
 * const builder = contextBuilder('annotation', 'http://localhost:3000');
 * builder.setType('annotation', 'example').parseZodSchema(schema);
 * ```
 */
export const contextBuilder = (prefix: string, baseUrl: string) => {
  return new ContextBuilder().addPrefix(prefix, baseUrl);
};
