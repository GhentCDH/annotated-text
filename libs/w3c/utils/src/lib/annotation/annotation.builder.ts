import type { z } from 'zod';
import {
  type W3CAgent,
  type W3CAnnotation,
  W3CAnnotation as W3CAnnotationSchema,
  type W3CAudience,
  type W3CBody,
  type W3CCssStylesheet,
  type W3CFragmentSelector as W3CFragmentSelectorSchema,
  type W3CMotivation,
  type W3CSelector,
  type W3CSpecificResource,
  type W3CSvgSelector as W3CSvgSelectorSchema,
  type W3CTarget,
  type W3CTextPositionSelector as W3CTextPositionSelectorSchema,
  type W3CTextQuoteSelector as W3CTextQuoteSelectorSchema,
  type W3CTextualBody
} from './annotation.schema';
import {
  getTextPositionSelectors,
  getTextQuoteSelectors,
  isW3CSpecificResource,
  isW3CTextualBody
} from './annotation-helpers'; // ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

type TextQuoteSelector = z.infer<typeof W3CTextQuoteSelectorSchema>;
type TextPositionSelector = z.infer<typeof W3CTextPositionSelectorSchema>;
type FragmentSelector = z.infer<typeof W3CFragmentSelectorSchema>;
type SvgSelector = z.infer<typeof W3CSvgSelectorSchema>;

type BuildResult =
  | { success: true; data: W3CAnnotation }
  | { success: false; errors: z.ZodIssue[] };

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

const deepClone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

const toArray = <T>(v: T | T[] | undefined): T[] =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

const normaliseTargets = (ann: Partial<W3CAnnotation>): W3CTarget[] =>
  toArray(ann.target as W3CTarget | W3CTarget[]);

const normaliseBodies = (ann: Partial<W3CAnnotation>): W3CBody[] =>
  toArray(ann.body as W3CBody | W3CBody[]);

/** Concatenate two single-or-array fields, collapsing single-element results */
const concatFields = <T>(
  a: T | T[] | undefined,
  b: T | T[] | undefined,
): T | T[] | undefined => {
  const merged = [...toArray(a as T | T[]), ...toArray(b as T | T[])];
  return merged.length === 0
    ? undefined
    : merged.length === 1
      ? merged[0]
      : merged;
};

/** Like concatFields but deduplicates primitive (string) values */
const concatUniqueFields = <T extends string>(
  a: T | T[] | undefined,
  b: T | T[] | undefined,
): T | T[] | undefined => {
  const merged = [
    ...new Set([...toArray(a as T | T[]), ...toArray(b as T | T[])]),
  ];
  return merged.length === 0
    ? undefined
    : merged.length === 1
      ? merged[0]
      : merged;
};
/** Replace or add a selector on a SpecificResource */
const upsertSelector = (
  resource: W3CSpecificResource,
  selector: W3CSelector,
): W3CSpecificResource => {
  const type = (selector as { type?: string }).type;
  const existing = toArray(resource.selector as W3CSelector | W3CSelector[]);
  const filtered = existing.filter(
    (s) => (s as { type?: string }).type !== type,
  );
  const next = [...filtered, selector];
  return { ...resource, selector: next.length === 1 ? next[0] : next };
};

/** Remove a selector by type from a SpecificResource */
const removeSelector = (
  resource: W3CSpecificResource,
  selectorType: string,
): W3CSpecificResource => {
  const existing = toArray(resource.selector as W3CSelector | W3CSelector[]);
  const next = existing.filter(
    (s) => (s as { type?: string }).type !== selectorType,
  );
  return {
    ...resource,
    selector:
      next.length === 0 ? undefined : next.length === 1 ? next[0] : next,
  };
};

// ---------------------------------------------------------------------------
// Builder class
// ---------------------------------------------------------------------------

export class W3CAnnotationBuilder {
  private state: Partial<W3CAnnotation>;

  constructor(existing?: W3CAnnotation) {
    // Deep-clone so we never mutate the original
    this.state = existing
      ? deepClone(existing)
      : { '@context': 'http://www.w3.org/ns/anno.jsonld', type: 'Annotation' };
  }

  // -------------------------------------------------------------------------
  // Clone
  // -------------------------------------------------------------------------

  /** Return a deep copy of this builder */
  clone(): W3CAnnotationBuilder {
    return new W3CAnnotationBuilder(deepClone(this.state) as W3CAnnotation);
  }

  // -------------------------------------------------------------------------
  // Identity
  // -------------------------------------------------------------------------

  setId(id: string): this {
    this.state.id = id;
    return this;
  }

  setContext(ctx: 'http://www.w3.org/ns/anno.jsonld' | string[]): this {
    this.state['@context'] = ctx;
    return this;
  }

  /** Add a context entry, converting to array if needed (deduplicates) */
  addContext(ctx: 'http://www.w3.org/ns/anno.jsonld' | string): this {
    const current = this.state['@context'];
    const arr: string[] = current === undefined
      ? []
      : Array.isArray(current)
        ? [...current]
        : [current];
    if (!arr.includes(ctx)) arr.push(ctx);
    this.state['@context'] =
      arr.length === 1
        ? (arr[0] as 'http://www.w3.org/ns/anno.jsonld')
        : arr;
    return this;
  }

  // -------------------------------------------------------------------------
  // Motivation
  // -------------------------------------------------------------------------

  setMotivation(motivation: W3CMotivation | W3CMotivation[]): this {
    this.state.motivation = motivation;
    return this;
  }

  addMotivation(motivation: W3CMotivation): this {
    const current = toArray(
      this.state.motivation as W3CMotivation | W3CMotivation[],
    );
    const deduped = [...new Set([...current, motivation])];
    this.state.motivation = deduped.length === 1 ? deduped[0] : deduped;
    return this;
  }

  removeMotivation(motivation: W3CMotivation): this {
    const current = toArray(
      this.state.motivation as W3CMotivation | W3CMotivation[],
    );
    const next = current.filter((m) => m !== motivation);
    this.state.motivation =
      next.length === 0 ? undefined : next.length === 1 ? next[0] : next;
    return this;
  }

  // -------------------------------------------------------------------------
  // Target
  // -------------------------------------------------------------------------

  setTarget(target: W3CTarget | W3CTarget[]): this {
    this.state.target = target;
    return this;
  }

  addTarget(target: W3CTarget): this {
    const current = normaliseTargets(this.state);
    this.state.target = [...current, target];
    return this;
  }

  /** Replace the target whose source / IRI matches `sourceUri` */
  replaceTarget(sourceUri: string, target: W3CTarget): this {
    const current = normaliseTargets(this.state);
    const replaced = current.map((t) => {
      if (typeof t === 'string') return t === sourceUri ? target : t;
      if (isW3CSpecificResource(t)) return t.source === sourceUri ? target : t;
      return t;
    });
    this.state.target = replaced.length === 1 ? replaced[0] : replaced;
    return this;
  }

  removeTarget(sourceUri: string): this {
    const next = normaliseTargets(this.state).filter((t) => {
      if (typeof t === 'string') return t !== sourceUri;
      if (isW3CSpecificResource(t)) return t.source !== sourceUri;
      return true;
    });
    this.state.target = next.length === 1 ? next[0] : next;
    return this;
  }

  // -------------------------------------------------------------------------
  // Selector helpers  (operate on the first / matching SpecificResource target)
  // -------------------------------------------------------------------------

  /**
   * Upsert a TextQuoteSelector on the SpecificResource target matching
   * `sourceUri` (or the first SpecificResource target if omitted).
   */
  updateTextQuoteSelector(
    selector: Omit<TextQuoteSelector, 'type'>,
    sourceUri?: string,
  ): this {
    return this._upsertSelectorOnTarget(
      { type: 'TextQuoteSelector', ...selector },
      sourceUri,
    );
  }

  updateTextPositionSelector(
    selector: Omit<TextPositionSelector, 'type'>,
    sourceUri?: string,
  ): this {
    return this._upsertSelectorOnTarget(
      { type: 'TextPositionSelector', ...selector },
      sourceUri,
    );
  }

  updateFragmentSelector(
    selector: Omit<FragmentSelector, 'type'>,
    sourceUri?: string,
  ): this {
    return this._upsertSelectorOnTarget(
      { type: 'FragmentSelector', ...selector },
      sourceUri,
    );
  }

  updateSvgSelector(
    selector: Omit<SvgSelector, 'type'>,
    sourceUri?: string,
  ): this {
    return this._upsertSelectorOnTarget(
      { type: 'SvgSelector', ...selector },
      sourceUri,
    );
  }

  removeTextQuoteSelector(sourceUri?: string): this {
    return this._removeSelectorFromTarget('TextQuoteSelector', sourceUri);
  }

  removeTextPositionSelector(sourceUri?: string): this {
    return this._removeSelectorFromTarget('TextPositionSelector', sourceUri);
  }

  removeFragmentSelector(sourceUri?: string): this {
    return this._removeSelectorFromTarget('FragmentSelector', sourceUri);
  }

  // -------------------------------------------------------------------------
  // Body
  // -------------------------------------------------------------------------

  setBody(body: W3CBody | W3CBody[]): this {
    this.state.body = body;
    return this;
  }

  addBody(body: W3CBody): this {
    const current = normaliseBodies(this.state);
    this.state.body = [...current, body];
    return this;
  }

  /** Add or replace a TextualBody with the given purpose */
  updateTextualBody(
    value: string,
    purpose?: W3CMotivation,
    extras?: Partial<Omit<W3CTextualBody, 'type' | 'value' | 'purpose'>>,
  ): this {
    const body: W3CTextualBody = {
      type: 'TextualBody',
      value,
      ...(purpose ? { purpose } : {}),
      ...extras,
    };

    const current = normaliseBodies(this.state);

    if (!purpose) {
      // No purpose filter — just prepend/replace first TextualBody
      const idx = current.findIndex(isW3CTextualBody);
      const next =
        idx === -1
          ? [...current, body]
          : current.map((b, i) => (i === idx ? body : b));
      this.state.body = next.length === 1 ? next[0] : next;
      return this;
    }

    // Replace the TextualBody with the same purpose
    const idx = current.findIndex(
      (b) =>
        isW3CTextualBody(b) &&
        toArray((b as W3CTextualBody).purpose).includes(purpose),
    );
    const next =
      idx === -1
        ? [...current, body]
        : current.map((b, i) => (i === idx ? body : b));
    this.state.body = next.length === 1 ? next[0] : next;

    return this;
  }

  removeTextualBody(purpose?: W3CMotivation): this {
    const current = normaliseBodies(this.state);
    const next = current.filter((b) => {
      if (!isW3CTextualBody(b)) return true;
      if (!purpose) return false; // remove all TextualBodies
      return !toArray((b as W3CTextualBody).purpose).includes(purpose);
    });
    this.state.body =
      next.length === 0 ? undefined : next.length === 1 ? next[0] : next;
    return this;
  }

  // -------------------------------------------------------------------------
  // Provenance
  // -------------------------------------------------------------------------

  setCreator(creator: W3CAgent | W3CAgent[]): this {
    this.state.creator = creator;
    return this;
  }

  setGenerator(generator: W3CAgent | W3CAgent[]): this {
    this.state.generator = generator;
    return this;
  }

  setCreated(date: string | Date): this {
    this.state.created = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  setModified(date: string | Date): this {
    this.state.modified = date instanceof Date ? date.toISOString() : date;
    return this;
  }

  /** Stamp `modified` with the current timestamp */
  touch(): this {
    this.state.modified = new Date().toISOString();
    return this;
  }

  // -------------------------------------------------------------------------
  // Styling
  // -------------------------------------------------------------------------

  setStylesheet(stylesheet: W3CCssStylesheet | string): this {
    this.state.stylesheet = stylesheet;
    return this;
  }

  // -------------------------------------------------------------------------
  // Merge
  // -------------------------------------------------------------------------

  /**
   * Merge a partial W3C annotation into the current state.
   *
   * - Scalar fields (`id`, `created`, `modified`, ...) are overwritten by the incoming value.
   * - Array-like fields (`target`, `body`, `creator`, ...) are concatenated.
   * - String array fields (`motivation`, `rights`, `via`) are concatenated and deduplicated.
   */
  merge(partial: Partial<W3CAnnotation>): this {
    const source = deepClone(partial);

    // Scalar fields — incoming overwrites
    if (source['@context'] !== undefined)
      this.state['@context'] = source['@context'];
    if (source.id !== undefined) this.state.id = source.id;
    if (source.type !== undefined) this.state.type = source.type;
    if (source.created !== undefined) this.state.created = source.created;
    if (source.modified !== undefined) this.state.modified = source.modified;
    if (source.generated !== undefined) this.state.generated = source.generated;
    if (source.canonical !== undefined) this.state.canonical = source.canonical;
    if (source.stylesheet !== undefined)
      this.state.stylesheet = source.stylesheet;

    // String array fields — concat & deduplicate
    if (source.motivation !== undefined) {
      this.state.motivation = concatUniqueFields(
        this.state.motivation as W3CMotivation | W3CMotivation[],
        source.motivation as W3CMotivation | W3CMotivation[],
      );
    }
    if (source.rights !== undefined) {
      this.state.rights = concatUniqueFields(
        this.state.rights as string | string[],
        source.rights as string | string[],
      );
    }
    if (source.via !== undefined) {
      this.state.via = concatUniqueFields(
        this.state.via as string | string[],
        source.via as string | string[],
      );
    }

    // Object array fields — concat
    if (source.target !== undefined) {
      this.state.target = concatFields(
        this.state.target as W3CTarget | W3CTarget[],
        source.target as W3CTarget | W3CTarget[],
      ) as W3CTarget | W3CTarget[];
    }
    if (source.body !== undefined) {
      this.state.body = concatFields(
        this.state.body as W3CBody | W3CBody[],
        source.body as W3CBody | W3CBody[],
      ) as W3CBody | W3CBody[] | undefined;
    }
    if (source.creator !== undefined) {
      this.state.creator = concatFields(
        this.state.creator as W3CAgent | W3CAgent[],
        source.creator as W3CAgent | W3CAgent[],
      ) as W3CAgent | W3CAgent[] | undefined;
    }
    if (source.generator !== undefined) {
      this.state.generator = concatFields(
        this.state.generator as W3CAgent | W3CAgent[],
        source.generator as W3CAgent | W3CAgent[],
      ) as W3CAgent | W3CAgent[] | undefined;
    }
    if (source.audience !== undefined) {
      this.state.audience = concatFields(
        this.state.audience as W3CAudience | W3CAudience[],
        source.audience as W3CAudience | W3CAudience[],
      ) as W3CAudience | W3CAudience[] | undefined;
    }

    return this;
  }

  // -------------------------------------------------------------------------
  // Read / inspect (non-mutating)  w3cAnnotation(existing).getTextQuoteSelector(sourceUri)
  // -------------------------------------------------------------------------

  /**
   * Return all TextQuoteSelectors from the annotation,
   * optionally scoped to a specific target source URI.
   */
  getTextQuoteSelector(sourceUri?: string): TextQuoteSelector[] {
    const ann = this.state as W3CAnnotation;
    if (!sourceUri) return getTextQuoteSelectors(ann) as TextQuoteSelector[];

    const targets = normaliseTargets(this.state).filter(
      (t): t is W3CSpecificResource =>
        isW3CSpecificResource(t) &&
        (t as W3CSpecificResource).source === sourceUri,
    );
    return targets.flatMap((t) =>
      toArray(t.selector as W3CSelector | W3CSelector[]).filter(
        (s): s is TextQuoteSelector =>
          (s as { type?: string }).type === 'TextQuoteSelector',
      ),
    );
  }

  getTextPositionSelector(sourceUri?: string): TextPositionSelector[] {
    const ann = this.state as W3CAnnotation;
    if (!sourceUri)
      return getTextPositionSelectors(ann) as TextPositionSelector[];

    const targets = normaliseTargets(this.state).filter(
      (t): t is W3CSpecificResource =>
        isW3CSpecificResource(t) &&
        (t as W3CSpecificResource).source === sourceUri,
    );
    return targets.flatMap((t) =>
      toArray(t.selector as W3CSelector | W3CSelector[]).filter(
        (s): s is TextPositionSelector =>
          (s as { type?: string }).type === 'TextPositionSelector',
      ),
    );
  }

  getFragmentSelector(sourceUri?: string): FragmentSelector[] {
    const targets = normaliseTargets(this.state).filter(
      (t): t is W3CSpecificResource =>
        isW3CSpecificResource(t) &&
        (!sourceUri || (t as W3CSpecificResource).source === sourceUri),
    );
    return targets.flatMap((t) =>
      toArray(t.selector as W3CSelector | W3CSelector[]).filter(
        (s): s is FragmentSelector =>
          (s as { type?: string }).type === 'FragmentSelector',
      ),
    );
  }

  /**
   * Return all bodies that have a matching `purpose`.
   * When no purpose is provided, returns all bodies that have any purpose set.
   */
  getBodiesByPurpose(purpose?: W3CMotivation): W3CBody[] {
    return normaliseBodies(this.state).filter((b) => {
      if (typeof b === 'string') return false;
      const p = (b as { purpose?: W3CMotivation | W3CMotivation[] }).purpose;
      if (p === undefined) return false;
      if (!purpose) return true;
      return toArray(p).includes(purpose);
    });
  }

  /**
   * Return all SpecificResource targets, optionally filtered by source URI.
   */
  getSpecificResourceTargets(sourceUri?: string): W3CSpecificResource[] {
    return normaliseTargets(this.state).filter(
      (t): t is W3CSpecificResource =>
        isW3CSpecificResource(t) &&
        (!sourceUri || (t as W3CSpecificResource).source === sourceUri),
    );
  }

  /**
   * Return the source URI of the first SpecificResource target,
   * or `undefined` if none exists.
   */
  getSourceUri(): string | undefined {
    return this.getSpecificResourceTargets()[0]?.source;
  }

  /** Return a snapshot of the current (potentially unvalidated) state */
  peek(): Readonly<Partial<W3CAnnotation>> {
    return deepClone(this.state);
  }

  // -------------------------------------------------------------------------
  // Build / validate
  // -------------------------------------------------------------------------

  /**
   * Validate and return the annotation.
   * Throws a descriptive error if validation fails.
   */
  build(): W3CAnnotation {
    const result = W3CAnnotationSchema.safeParse(this.state);
    if (!result.success) {
      const messages = result.error.issues
        .map((i: z.ZodIssue) => `  • ${i.path.join('.')} — ${i.message}`)
        .join('\n');
      throw new Error(`Invalid W3C Annotation:\n${messages}`);
    }
    return result.data;
  }

  /**
   * Like build() but returns a result object instead of throwing.
   */
  safeBuild(): BuildResult {
    const result = W3CAnnotationSchema.safeParse(this.state);
    if (result.success) return { success: true, data: result.data };
    return { success: false, errors: result.error.issues };
  }

  /**
   * Validate the current state without producing the final object.
   * Returns an array of issues (empty = valid).
   */
  validate(): z.ZodIssue[] {
    const result = W3CAnnotationSchema.safeParse(this.state);
    return result.success ? [] : result.error.issues;
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private _findOrCreateSpecificResource(
    sourceUri?: string,
  ): W3CSpecificResource | null {
    const targets = normaliseTargets(this.state);

    const match = targets.find((t): t is W3CSpecificResource => {
      if (!isW3CSpecificResource(t)) return false;
      return sourceUri ? t.source === sourceUri : true;
    }) as W3CSpecificResource | undefined;

    if (match) return match;

    // If a sourceUri was given and there is no matching target, create one
    if (sourceUri) {
      const newResource: W3CSpecificResource = {
        type: 'SpecificResource',
        source: sourceUri,
      };
      this.state.target = [...targets, newResource];
      return newResource;
    }

    return null;
  }

  private _upsertSelectorOnTarget(
    selector: W3CSelector,
    sourceUri?: string,
  ): this {
    const resource = this._findOrCreateSpecificResource(sourceUri);
    if (!resource) {
      throw new Error(
        sourceUri
          ? `No SpecificResource target found with source "${sourceUri}"`
          : 'No SpecificResource target found. Provide a sourceUri to create one.',
      );
    }

    const updated = upsertSelector(resource, selector);
    const targets = normaliseTargets(this.state).map((t) =>
      t === resource ? updated : t,
    );
    this.state.target = targets.length === 1 ? targets[0] : targets;
    return this;
  }

  private _removeSelectorFromTarget(
    selectorType: string,
    sourceUri?: string,
  ): this {
    const targets = normaliseTargets(this.state).map((t) => {
      if (!isW3CSpecificResource(t)) return t;
      if (sourceUri && (t as W3CSpecificResource).source !== sourceUri)
        return t;
      return removeSelector(t as W3CSpecificResource, selectorType);
    });
    this.state.target = targets.length === 1 ? targets[0] : targets;
    return this;
  }
}

// ---------------------------------------------------------------------------
// Public factory  — the entry point
// ---------------------------------------------------------------------------

/**
 * Create a new annotation builder, optionally seeded with an existing annotation.
 *
 * @example
 * // Create from scratch
 * const ann = w3cAnnotation()
 *   .setId('https://example.org/anno/1')
 *   .setMotivation('oa:commenting')
 *   .addTarget({ type: 'SpecificResource', source: 'https://example.org/doc' })
 *   .updateTextQuoteSelector({ exact: 'Hello world', prefix: 'Say ', suffix: '!' })
 *   .updateTextualBody('Great quote!', 'oa:commenting')
 *   .touch()
 *   .build();
 *
 * @example
 * // Update an existing annotation
 * const updated = w3cAnnotation(existing)
 *   .updateTextQuoteSelector({ exact: 'New selection' }, 'https://example.org/doc')
 *   .updatePurpose('oa:tagging')
 *   .touch()
 *   .build();
 *
 * @example
 * // Read without mutating
 * const quotes = w3cAnnotation(existing)
 *   .getTextQuoteSelector('https://example.org/doc');
 */
export const w3cAnnotation = (existing?: W3CAnnotation): W3CAnnotationBuilder =>
  new W3CAnnotationBuilder(existing);
