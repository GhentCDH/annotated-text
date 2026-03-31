import { z, type ZodObject } from 'zod';
import { buildJsonLdContext } from './context-helpers.jsonld';
import { buildJsonFormSchema } from './context.helpers.json';
import { toAnnotationBody } from './context.helpers';

const parsePrefix = (prefix: string, uri: string) => {
  return uri.includes('://') && !uri.endsWith('/') ? `${uri}/` : uri;
};

export class ContextBuilder<T extends z.ZodRawShape = z.ZodRawShape> {
  private prefixes: Record<string, string> = {};
  private _schema: ZodObject<T> | undefined;
  private type = 'unknown';

  /** Add a prefix mapping, e.g. addPrefix('myapp', 'https://example.org/ns/') */
  addPrefix(prefix: string, uri: string): this {
    this.prefixes[prefix] = parsePrefix(prefix, uri);
    return this;
  }

  parseJsonSchema(schema: any): this {
    console.warn('implement me');
    // this._schema = z.object(schema);
    this._schema = z.fromJSONSchema(schema) as ZodObject<T>;
    return this;
  }

  parseZodSchema(schema: ZodObject<T>): this {
    this._schema = schema;
    return this;
  }

  toJsonLdContext() {
    return buildJsonLdContext(this.prefixes, this._schema);
  }

  toJsonSchema() {
    if (!this._schema) {
      return null;
    }
    return buildJsonFormSchema(this._schema);
  }

  toZod() {
    return this._schema;
  }

  setType(prefix: string, type: string): this {
    this.type = type;
    this.prefixes[type] = `${prefix}:${type}`;
    return this;
  }

  /** Parse and validate data against the Zod schema. Throws on invalid data. */
  parse(data: unknown) {
    return this.toZod()?.parse(data);
  }

  /** Like parse() but returns a result object instead of throwing. */
  safeParse(data: unknown) {
    return this.toZod()?.safeParse(data);
  }

  /** Wrap parsed data as a W3C annotation body */
  toAnnotationBody(data: unknown, purpose?: string): Record<string, unknown> {
    const parsed = this.parse(data);
    return toAnnotationBody(parsed as any, this.type, purpose);
  }

  private uri: string | undefined;

  getContextUri() {
    return this.uri;
  }
  setContextUri(uri: string) {
    this.uri = uri;
  }
}

// ── Factory ──────────────────────────────────────────────────────────────────

export function contextBuilder(prefix: string, baseUrl: string) {
  return new ContextBuilder().addPrefix(prefix, baseUrl);
}
