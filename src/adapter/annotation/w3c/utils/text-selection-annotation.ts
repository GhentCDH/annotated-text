import { getTarget } from "./target.utils";
import { getBody } from "./body.utils";
import type { W3CAnnotation } from "../model";
import {
  TextTargetSchema,
  TextualBodySchema,
  W3CAnnotationSchema,
} from "../model";
import { type TextAnnotation } from "../../../../model/";

type AnnotationUpdate = Pick<TextAnnotation, "start" | "end"> & { id?: string };

export const createTextualBody = (
  textValue: string,
  sourceUri: string,
  language: string,
) => {
  return TextualBodySchema.parse({
    language: language,
    value: textValue,
    source: sourceUri,
  });
};

export const createTextPositionSelector = (
  sourceUri: string,
  language: string,
  annotation: AnnotationUpdate,
) => {
  return TextTargetSchema.parse({
    source: sourceUri,
    textDirection: "ltr",
    type: "Text",
    processingLanguage: language,
    selector: {
      type: "TextPositionSelector",
      start: annotation.start,
      end: annotation.end,
    },
  });
};

export const createTextSelectionAnnotation = (
  sourceUri: string,
  language: string,
  selectedText: string,
  annotation: AnnotationUpdate,
): W3CAnnotation => {
  return W3CAnnotationSchema.parse({
    // The W3C Annotation model
    id: annotation.id,
    "@context": "http://www.w3.org/ns/anno.jsonld",
    body: [createTextualBody(selectedText, sourceUri, language)],
    target: [createTextPositionSelector(sourceUri, language, annotation)],
  });
};

export const updateTextSelectionAnnotation = (
  originalAnnotation: W3CAnnotation,
  sourceUri: string,
  language: string,
  selectedText: string,
  annotation: AnnotationUpdate,
): W3CAnnotation => {
  const textualBody = createTextualBody(selectedText, sourceUri, language);
  const textPositionSelector = createTextPositionSelector(
    sourceUri,
    language,
    annotation,
  );

  return W3CAnnotationSchema.parse({
    // The W3C Annotation model
    ...originalAnnotation,
    body: getBody(originalAnnotation).map((b) =>
      b.type === textualBody.type ? textualBody : b,
    ),
    target: getTarget(originalAnnotation).map((t) =>
      t.type === textPositionSelector.type ? textPositionSelector : t,
    ),
  });
};
