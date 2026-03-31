import type {
  W3CAgent,
  W3CAnnotation,
  W3CBody,
  W3CBodyChoice,
  W3CCustomBody,
  W3CExternalResource,
  W3CMotivation,
  W3CSelector,
  W3CSpecificResource,
  W3CState,
  W3CTarget,
  W3CTextualBody,
} from './annotation.schema';
import {
  W3CBodyChoice as W3CBodyChoiceSchema,
  W3CCssSelector as W3CCssSelectorSchema,
  W3CDataPositionSelector as W3CDataPositionSelectorSchema,
  W3CExternalResource as W3CExternalResourceSchema,
  W3CFragmentSelector as W3CFragmentSelectorSchema,
  W3CHttpRequestState as W3CHttpRequestStateSchema,
  W3CRangeSelector as W3CRangeSelectorSchema,
  W3CSpecificResource as W3CSpecificResourceSchema,
  W3CSvgSelector as W3CSvgSelectorSchema,
  W3CTextPositionSelector as W3CTextPositionSelectorSchema,
  W3CTextQuoteSelector as W3CTextQuoteSelectorSchema,
  W3CTextualBody as W3CTextualBodySchema,
  W3CTimeState as W3CTimeStateSchema,
  W3CXPathSelector as W3CXPathSelectorSchema,
} from './annotation.schema';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Normalise any possibly-array field to an array */
const toArray = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

const isString = (v: unknown): v is string => typeof v === 'string';

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

export const isW3CTextualBody = (b: W3CBody): b is W3CTextualBody =>
  W3CTextualBodySchema.safeParse(b).success;

export const isW3CSpecificResource = (
  v: W3CBody | W3CTarget,
): v is W3CSpecificResource =>
  !isString(v) && W3CSpecificResourceSchema.safeParse(v).success;

export const isW3CExternalResource = (
  v: W3CBody | W3CTarget,
): v is W3CExternalResource =>
  !isString(v) && W3CExternalResourceSchema.safeParse(v).success;

export const isW3CBodyChoice = (b: W3CBody): b is W3CBodyChoice =>
  !isString(b) && W3CBodyChoiceSchema.safeParse(b).success;

export const isW3CIriTarget = (t: W3CTarget): t is string => isString(t);
export const isW3CIriBody = (b: W3CBody): b is string => isString(b);

/** True when the body is a plain object that does not match any known body type */
export const isW3CCustomBody = (b: W3CBody): b is W3CCustomBody =>
  !isString(b) &&
  !isW3CTextualBody(b) &&
  !isW3CSpecificResource(b) &&
  !isW3CExternalResource(b) &&
  !isW3CBodyChoice(b);

// Selector guards
export const isW3CTextQuoteSelector = (s: W3CSelector) =>
  W3CTextQuoteSelectorSchema.safeParse(s).success;
export const isW3CTextPositionSelector = (s: W3CSelector) =>
  W3CTextPositionSelectorSchema.safeParse(s).success;
export const isW3CFragmentSelector = (s: W3CSelector) =>
  W3CFragmentSelectorSchema.safeParse(s).success;
export const isW3CCssSelector = (s: W3CSelector) =>
  W3CCssSelectorSchema.safeParse(s).success;
export const isW3CXPathSelector = (s: W3CSelector) =>
  W3CXPathSelectorSchema.safeParse(s).success;
export const isW3CSvgSelector = (s: W3CSelector) =>
  W3CSvgSelectorSchema.safeParse(s).success;
export const isW3CRangeSelector = (s: W3CSelector) =>
  W3CRangeSelectorSchema.safeParse(s).success;
export const isW3CDataPositionSelector = (s: W3CSelector) =>
  W3CDataPositionSelectorSchema.safeParse(s).success;

// State guards
export const isW3CTimeState = (s: W3CState) =>
  W3CTimeStateSchema.safeParse(s).success;
export const isW3CHttpRequestState = (s: W3CState) =>
  W3CHttpRequestStateSchema.safeParse(s).success;

// ---------------------------------------------------------------------------
// Normalise body / target to arrays
// ---------------------------------------------------------------------------

/** Returns all bodies as a flat array (expands Choice.items too) */
export const getBodies = (ann: W3CAnnotation): W3CBody[] => {
  const raw = toArray(ann.body);
  return raw.flatMap((b) => (isW3CBodyChoice(b) ? b.items : [b]));
};

/** Returns all targets as a flat array */
export const getTargets = (ann: W3CAnnotation): W3CTarget[] =>
  toArray(ann.target);

// ---------------------------------------------------------------------------
// Curried body accessors  getBody(type)(annotation)
// ---------------------------------------------------------------------------

/** Get all TextualBody items, optionally filtered by purpose motivation */
export const getTextualBodies =
  (purpose?: string) =>
  (ann: W3CAnnotation): W3CTextualBody[] => {
    const bodies = getBodies(ann).filter(isW3CTextualBody);
    if (!purpose) return bodies;
    return bodies.filter((b) => toArray(b.purpose).includes(purpose));
  };

/** Get all SpecificResource bodies, optionally filtered by purpose */
export const getSpecificResourceBodies =
  (purpose?: string) =>
  (ann: W3CAnnotation): W3CSpecificResource[] => {
    const bodies = getBodies(ann).filter(isW3CSpecificResource);
    if (!purpose) return bodies;
    return bodies.filter((b) => toArray(b.purpose).includes(purpose));
  };

/** Get all ExternalResource bodies */
export const getExternalResourceBodies =
  () =>
  (ann: W3CAnnotation): W3CExternalResource[] =>
    getBodies(ann).filter(isW3CExternalResource);

/** Get plain IRI bodies */
export const getIriBodies =
  () =>
  (ann: W3CAnnotation): string[] =>
    getBodies(ann).filter(isW3CIriBody);

/** Get custom (application-specific) bodies */
export const getCustomBodies =
  () =>
  (ann: W3CAnnotation): W3CCustomBody[] =>
    getBodies(ann).filter(isW3CCustomBody);

// ---------------------------------------------------------------------------
// Curried target accessors  getTarget(type)(annotation)
// ---------------------------------------------------------------------------

/** Get all SpecificResource targets */
export const getSpecificResourceTargets =
  () =>
  (ann: W3CAnnotation): W3CSpecificResource[] =>
    getTargets(ann).filter(isW3CSpecificResource);

/** Get all ExternalResource targets */
export const getExternalResourceTargets =
  () =>
  (ann: W3CAnnotation): W3CExternalResource[] =>
    getTargets(ann).filter(isW3CExternalResource);

/** Get plain IRI targets */
export const getIriTargets =
  () =>
  (ann: W3CAnnotation): string[] =>
    getTargets(ann).filter(isW3CIriTarget);

// ---------------------------------------------------------------------------
// Generic curried accessor — getTarget(type)(annotation)
// ---------------------------------------------------------------------------

type TargetType = 'SpecificResource' | 'ExternalResource' | 'Iri';
type BodyType =
  | 'TextualBody'
  | 'SpecificResource'
  | 'ExternalResource'
  | 'Choice'
  | 'Custom'
  | 'Iri';

/** Curried generic target accessor by type string */
export const getTarget =
  (type: TargetType) =>
  (ann: W3CAnnotation): W3CTarget[] => {
    const targets = getTargets(ann);
    switch (type) {
      case 'SpecificResource':
        return targets.filter(isW3CSpecificResource);
      case 'ExternalResource':
        return targets.filter(isW3CExternalResource);
      case 'Iri':
        return targets.filter(isW3CIriTarget);
    }
  };

/** Curried generic body accessor by type string */
export const getBody =
  (type: BodyType) =>
  (ann: W3CAnnotation): W3CBody[] => {
    const bodies = getBodies(ann);
    switch (type) {
      case 'TextualBody':
        return bodies.filter(isW3CTextualBody);
      case 'SpecificResource':
        return bodies.filter(isW3CSpecificResource);
      case 'ExternalResource':
        return bodies.filter(isW3CExternalResource);
      case 'Choice':
        // re-inspect raw bodies (before Choice expansion)
        return toArray(ann.body).filter(isW3CBodyChoice);
      case 'Custom':
        return bodies.filter(isW3CCustomBody);
      case 'Iri':
        return bodies.filter(isW3CIriBody);
    }
  };

// ---------------------------------------------------------------------------
// Selector accessors
// ---------------------------------------------------------------------------

/** Get all selectors from all SpecificResource targets as a flat array */
export const getSelectors = (ann: W3CAnnotation): W3CSelector[] =>
  getTargets(ann)
    .filter(isW3CSpecificResource)
    .flatMap((t) => toArray(t.selector as W3CSelector | W3CSelector[]));

/** Curried — get selectors of a specific type from all targets */
export const getSelector =
  (type: string) =>
  (ann: W3CAnnotation): W3CSelector[] =>
    getSelectors(ann).filter(
      (s): s is W3CSelector =>
        !isString(s) && (s as { type: unknown }).type === type,
    );

/** Shorthand helpers for the most common selector types */
export const getTextQuoteSelectors = getSelector('TextQuoteSelector');
export const getTextPositionSelectors = getSelector('TextPositionSelector');
export const getFragmentSelectors = getSelector('FragmentSelector');
export const getSvgSelectors = getSelector('SvgSelector');

// ---------------------------------------------------------------------------
// Motivation helpers
// ---------------------------------------------------------------------------

export const getMotivations = (ann: W3CAnnotation): string[] =>
  toArray(ann.motivation);

export const hasMotivation =
  (motivation: W3CMotivation) =>
  (ann: W3CAnnotation): boolean =>
    getMotivations(ann).includes(motivation as string);

export const isTagging = hasMotivation('oa:tagging');
export const isCommenting = hasMotivation('oa:commenting');
export const isHighlighting = hasMotivation('oa:highlighting');
export const isDescribing = hasMotivation('oa:describing');
export const isClassifying = hasMotivation('oa:classifying');
export const isLinking = hasMotivation('oa:linking');

// ---------------------------------------------------------------------------
// State accessors
// ---------------------------------------------------------------------------

/** Get all states from all SpecificResource targets */
export const getStates = (ann: W3CAnnotation): W3CState[] =>
  getTargets(ann)
    .filter(isW3CSpecificResource)
    .flatMap((t) => toArray(t.state as W3CState | W3CState[]));

export const getTimeStates = (ann: W3CAnnotation) =>
  getStates(ann).filter(isW3CTimeState);

export const getHttpRequestStates = (ann: W3CAnnotation) =>
  getStates(ann).filter(isW3CHttpRequestState);

// ---------------------------------------------------------------------------
// Creator / generator helpers
// ---------------------------------------------------------------------------

export const getCreators = (ann: W3CAnnotation): W3CAgent[] =>
  toArray(ann.creator);

export const getGenerators = (ann: W3CAnnotation): W3CAgent[] =>
  toArray(ann.generator);

export const createdBy =
  (agentId: string) =>
  (ann: W3CAnnotation): boolean =>
    getCreators(ann).some((c) => c.id === agentId);

// ---------------------------------------------------------------------------
// Convenience one-liners — first item shortcuts
// ---------------------------------------------------------------------------

export const firstTarget = (ann: W3CAnnotation): W3CTarget | undefined =>
  getTargets(ann)[0];

export const firstBody = (ann: W3CAnnotation): W3CBody | undefined =>
  getBodies(ann)[0];

export const firstTextualBody = (
  ann: W3CAnnotation,
): W3CTextualBody | undefined => getTextualBodies()(ann)[0];

export const firstSpecificResourceTarget = (
  ann: W3CAnnotation,
): W3CSpecificResource | undefined => getSpecificResourceTargets()(ann)[0];

/** Returns the plain text value of the first TextualBody, if any */
export const getBodyValue = (ann: W3CAnnotation): string | undefined =>
  firstTextualBody(ann)?.value;

/** Returns the source IRI of the first SpecificResource target, if any */
export const getTargetSource = (ann: W3CAnnotation): string | undefined =>
  firstSpecificResourceTarget(ann)?.source;

/** Returns the exact quote from the first TextQuoteSelector, if any */
export const getExactQuote = (ann: W3CAnnotation): string | undefined => {
  const selectors = getTextQuoteSelectors(ann);
  if (!selectors.length) return undefined;
  const s = selectors[0];
  return W3CTextQuoteSelectorSchema.safeParse(s).success
    ? (s as { exact: string }).exact
    : undefined;
};
