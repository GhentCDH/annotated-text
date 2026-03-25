import { z } from 'zod';

// ---------------------------------------------------------------------------
// Primitives & shared literals
// ---------------------------------------------------------------------------

/** IRI / URL string */
export const W3CIri = z.string(); //.url();

/** xsd:dateTime — accepts ISO 8601 strings, Date objects, date-like values (coerced), empty strings, or null */
export const W3CDateTime = z.union([
  z.string().datetime({ offset: true }),
  z.coerce.date().transform((d) => d.toISOString()),
  z.literal(''),
  z.null(),
]);

/** RDF language tag, e.g. "en", "nl-BE" */
export const W3CLanguageTag = z
  .string()
  .regex(/^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*$/);

/** RDF text direction */
export const W3CTextDirection = z.enum(['ltr', 'rtl', 'auto']);

// ---------------------------------------------------------------------------
// Motivation (§3.3)
// ---------------------------------------------------------------------------

export const W3CMotivation = z.union([
  z.literal('oa:assessing'),
  z.literal('oa:bookmarking'),
  z.literal('oa:classifying'),
  z.literal('oa:commenting'),
  z.literal('oa:describing'),
  z.literal('oa:editing'),
  z.literal('oa:highlighting'),
  z.literal('oa:identifying'),
  z.literal('oa:linking'),
  z.literal('oa:moderating'),
  z.literal('oa:questioning'),
  z.literal('oa:replying'),
  z.literal('oa:tagging'),
  z.string(), // open for extension
]);

export type W3CMotivation = z.infer<typeof W3CMotivation>;

// ---------------------------------------------------------------------------
// Selectors (§4)
// ---------------------------------------------------------------------------

export const W3CFragmentSelector = z.object({
  type: z.literal('FragmentSelector'),
  value: z.string(),
  conformsTo: W3CIri.optional(),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CCssSelector = z.object({
  type: z.literal('CssSelector'),
  value: z.string(),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CXPathSelector = z.object({
  type: z.literal('XPathSelector'),
  value: z.string(),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CTextQuoteSelector = z.object({
  type: z.literal('TextQuoteSelector'),
  exact: z.string(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CTextPositionSelector = z.object({
  type: z.literal('TextPositionSelector'),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CDataPositionSelector = z.object({
  type: z.literal('DataPositionSelector'),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CSvgSelector = z.object({
  type: z.literal('SvgSelector'),
  /** Inline SVG string or IRI pointing to an SVG resource */
  value: z.string().optional(),
  id: W3CIri.optional(),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CRangeSelector = z.object({
  type: z.literal('RangeSelector'),
  startSelector: z.lazy(() => W3CSelectorSchema),
  endSelector: z.lazy(() => W3CSelectorSchema),
  refinedBy: z.lazy(() => W3CSelectorSchema).optional(),
});

export const W3CSelectorSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    W3CFragmentSelector,
    W3CCssSelector,
    W3CXPathSelector,
    W3CTextQuoteSelector,
    W3CTextPositionSelector,
    W3CDataPositionSelector,
    W3CSvgSelector,
    W3CRangeSelector,
  ]),
);

export type W3CSelector = z.infer<typeof W3CSelectorSchema>;

// ---------------------------------------------------------------------------
// State (§4.4)
// ---------------------------------------------------------------------------

export const W3CTimeState = z.object({
  type: z.literal('TimeState'),
  sourceDate: z.union([W3CDateTime, z.array(W3CDateTime)]).optional(),
  sourceDateStart: W3CDateTime.optional(),
  sourceDateEnd: W3CDateTime.optional(),
  cachedSource: W3CIri.optional(),
});

export const W3CHttpRequestState = z.object({
  type: z.literal('HttpRequestState'),
  value: z.string(),
});

export const W3CState = z.union([W3CTimeState, W3CHttpRequestState]);
export type W3CState = z.infer<typeof W3CState>;

// ---------------------------------------------------------------------------
// Style sheet (§4.5)
// ---------------------------------------------------------------------------

export const W3CCssStylesheet = z.object({
  type: z.literal('CssStylesheet'),
  id: W3CIri.optional(),
  value: z.string().optional(),
});

export type W3CCssStylesheet = z.infer<typeof W3CCssStylesheet>;

// ---------------------------------------------------------------------------
// Agent (§3.2.7 — creator / generator)
// ---------------------------------------------------------------------------

export const W3CAgentType = z.enum(['Person', 'Organization', 'Software']);

export const W3CAgent = z.object({
  id: W3CIri.optional(),
  type: z.union([W3CAgentType, z.array(W3CAgentType)]).optional(),
  name: z.union([z.string(), z.array(z.string())]).optional(),
  nickname: z.string().optional(),
  email: z.union([z.string(), z.array(z.string())]).optional(),
  email_sha1: z.union([z.string(), z.array(z.string())]).optional(),
  homepage: z.union([W3CIri, z.array(W3CIri)]).optional(),
});

export type W3CAgent = z.infer<typeof W3CAgent>;

// ---------------------------------------------------------------------------
// Audience (§3.2.8)
// ---------------------------------------------------------------------------

export const W3CAudience = z.object({
  id: W3CIri.optional(),
  type: z.string().optional(),
});

export type W3CAudience = z.infer<typeof W3CAudience>;

// ---------------------------------------------------------------------------
// Resource (shared properties used by bodies & targets)
// ---------------------------------------------------------------------------

/** Common descriptive properties shared by Body and Target resources */
export const W3CResourceProperties = z.object({
  id: W3CIri.optional(),
  format: z.union([z.string(), z.array(z.string())]).optional(),
  language: z.union([W3CLanguageTag, z.array(W3CLanguageTag)]).optional(),
  processingLanguage: W3CLanguageTag.optional(),
  textDirection: W3CTextDirection.optional(),
  accessibility: z.union([z.string(), z.array(z.string())]).optional(),
  rights: z.union([W3CIri, z.array(W3CIri)]).optional(),
  canonical: W3CIri.optional(),
  via: z.union([W3CIri, z.array(W3CIri)]).optional(),
  creator: z.union([W3CAgent, z.array(W3CAgent)]).optional(),
  created: W3CDateTime.optional(),
  modified: W3CDateTime.optional(),
  audience: z.union([W3CAudience, z.array(W3CAudience)]).optional(),
  scope: W3CIri.optional(),
});

// ---------------------------------------------------------------------------
// Textual Body (§3.2.4)
// ---------------------------------------------------------------------------

export const W3CTextualBody = W3CResourceProperties.extend({
  type: z.literal('TextualBody'),
  value: z.string(),
  purpose: z.union([W3CMotivation, z.array(W3CMotivation)]).optional(),
});

export type W3CTextualBody = z.infer<typeof W3CTextualBody>;

// ---------------------------------------------------------------------------
// Specific Resource (§4.1) — wraps another resource with selector/state/style
// ---------------------------------------------------------------------------

export const W3CSpecificResource = W3CResourceProperties.extend({
  type: z.literal('SpecificResource').optional(),
  source: W3CIri,
  selector: z.union([W3CSelectorSchema, z.array(W3CSelectorSchema)]).optional(),
  state: z.union([W3CState, z.array(W3CState)]).optional(),
  styleClass: z.string().optional(),
  renderedVia: z.union([W3CAgent, z.array(W3CAgent)]).optional(),
  purpose: z.union([W3CMotivation, z.array(W3CMotivation)]).optional(),
});

export type W3CSpecificResource = z.infer<typeof W3CSpecificResource>;

// ---------------------------------------------------------------------------
// External Web Resource (§3.2.1)
// ---------------------------------------------------------------------------

export const W3CExternalResource = W3CResourceProperties.extend({
  id: W3CIri,
  type: z.union([z.string(), z.array(z.string())]).optional(),
  purpose: z.union([W3CMotivation, z.array(W3CMotivation)]).optional(),
});

export type W3CExternalResource = z.infer<typeof W3CExternalResource>;

// ---------------------------------------------------------------------------
// Choice (§3.2.6)
// ---------------------------------------------------------------------------

export const W3CBodyChoice = z.object({
  type: z.literal('Choice'),
  items: z.array(
    z.union([W3CTextualBody, W3CSpecificResource, W3CExternalResource]),
  ),
});

export type W3CBodyChoice = z.infer<typeof W3CBodyChoice>;

// ---------------------------------------------------------------------------
// Body (§3.2)
// ---------------------------------------------------------------------------

/** A body is either a TextualBody, SpecificResource, ExternalResource, or a Choice */
export const W3CBody = z.union([
  W3CTextualBody,
  W3CSpecificResource,
  W3CExternalResource,
  W3CBodyChoice,
  /** Simple IRI body */
  W3CIri,
]);

export type W3CBody = z.infer<typeof W3CBody>;

// ---------------------------------------------------------------------------
// Target (§3.3)
// ---------------------------------------------------------------------------

/** A target is a SpecificResource, ExternalResource, or a plain IRI */
export const W3CTarget = z.union([
  W3CSpecificResource,
  W3CExternalResource,
  W3CIri,
]);

export type W3CTarget = z.infer<typeof W3CTarget>;

// ---------------------------------------------------------------------------
// Annotation (§3)
// ---------------------------------------------------------------------------

export const W3CAnnotation = z.object({
  '@context': z
    .union([z.literal('http://www.w3.org/ns/anno.jsonld'), z.array(z.string())])
    .optional(),
  id: W3CIri,
  type: z.literal('Annotation'),

  // Body — optional: annotation may have no body
  body: z.union([W3CBody, z.array(W3CBody)]).optional(),

  // Target — required
  target: z.union([W3CTarget, z.array(W3CTarget)]),

  // Motivation
  motivation: z.union([W3CMotivation, z.array(W3CMotivation)]).optional(),

  // Provenance
  creator: z.union([W3CAgent, z.array(W3CAgent)]).optional(),
  created: W3CDateTime.optional(),
  modified: W3CDateTime.optional(),
  generator: z.union([W3CAgent, z.array(W3CAgent)]).optional(),
  generated: W3CDateTime.optional(),

  // Attribution
  audience: z.union([W3CAudience, z.array(W3CAudience)]).optional(),
  rights: z.union([W3CIri, z.array(W3CIri)]).optional(),
  canonical: W3CIri.optional(),
  via: z.union([W3CIri, z.array(W3CIri)]).optional(),

  // Styling
  stylesheet: z.union([W3CCssStylesheet, W3CIri]).optional(),
});

export type W3CAnnotation = z.infer<typeof W3CAnnotation>;

// ---------------------------------------------------------------------------
// Annotation Collection (§5)
// ---------------------------------------------------------------------------

export const W3CAnnotationPage = z.object({
  id: W3CIri,
  type: z.literal('AnnotationPage'),
  partOf: W3CIri.optional(),
  startIndex: z.number().int().nonnegative().optional(),
  next: W3CIri.optional(),
  prev: W3CIri.optional(),
  items: z.array(W3CAnnotation).optional(),
});

export type W3CAnnotationPage = z.infer<typeof W3CAnnotationPage>;

export const W3CAnnotationCollection = z.object({
  '@context': z
    .union([z.literal('http://www.w3.org/ns/anno.jsonld'), z.array(z.string())])
    .optional(),
  id: W3CIri,
  type: z.literal('AnnotationCollection'),
  label: z.string().optional(),
  total: z.number().int().nonnegative().optional(),
  first: z.union([W3CAnnotationPage, W3CIri]).optional(),
  last: W3CIri.optional(),
});

export type W3CAnnotationCollection = z.infer<typeof W3CAnnotationCollection>;
