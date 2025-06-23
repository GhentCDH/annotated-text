export type AnnotationTypeBody = {
  type: "AnnotationType";
  textType: string;
};

export type TextualBodyType = "TextualBody";
export type TextualBody = {
  type: TextualBodyType;
  format: "text";
  language: string;
  value: string;
  source?: string;
};

export type TextualBodyClassifyingPurpose = "tagging" | "classifying";
export type TextualBodyClassifying = {
  type: TextualBodyType;
  purpose: "tagging";
  value?: string;
};

export type SpecificResourceType = "SpecificResource";
export type SpecificResource = {
  id?: string;
  type: SpecificResourceType;
  purpose: "describing";
  source?: string;
};

export type W3CAnnotationBody =
  | TextualBody
  | TextualBodyClassifying
  | SpecificResource;
export type W3CAnnotationBodyType = W3CAnnotationBody["type"];

export type TextPositionSelectorType = "TextPositionSelector";
export type TextPositionSelector = {
  type: TextPositionSelectorType;
  start: number;
  end: number;
};

export type TextDirection = "ltr" | "rtl";

export type TextTargetType = "Text";
export type TextTarget = {
  source: string;
  textDirection: TextDirection;
  type: TextTargetType;
  processingLanguage?: string;
  selector?: TextPositionSelector;
};

export type W3CAnnotationTarget = TextTarget;
export type W3CAnnotationTargetType = W3CAnnotationTarget["type"];

export type AnnotationContext = "http://www.w3.org/ns/anno.jsonld";

export type W3CAnnotationMotivation = "classifying" | "tagging";
export type W3CAnnotation = {
  id: string;
  "@context": AnnotationContext;
  motivation: W3CAnnotationMotivation;
  body: Array<W3CAnnotationBody> | W3CAnnotationBody;
  target: Array<W3CAnnotationTarget> | W3CAnnotationTarget;
};
