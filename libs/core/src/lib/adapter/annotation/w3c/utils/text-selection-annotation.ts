import { getTarget } from "./target.utils";
import { getBody } from "./body.utils";
import type { W3CAnnotation } from "../model";
import {
  TextTargetSchema,
  TextualBodySchema,
  W3CAnnotationSchema,
} from "../model";
import { AnnotationId, type TextAnnotation } from "../../../../model/";
import { cloneDeep, merge } from "lodash-es";

type AnnotationUpdate = Pick<TextAnnotation, "start" | "end"> & {
  id?: AnnotationId;
};

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
  originalAnnotation: Partial<W3CAnnotation> = {},
): W3CAnnotation => {
  const parsedAnnotation = W3CAnnotationSchema.safeParse(
    merge(cloneDeep(originalAnnotation), {
      // The W3C Annotation model
      id: annotation.id,
      "@context": "http://www.w3.org/ns/anno.jsonld",
      body: [
        originalAnnotation.body ?? [],
        createTextualBody(selectedText, sourceUri, language),
      ].flat(),
      target: [
        originalAnnotation.target ?? [],
        createTextPositionSelector(sourceUri, language, annotation),
      ].flat(),
    }),
  );
  if (parsedAnnotation.error) {
    console.error(parsedAnnotation.error);
    throw new Error("Invalid W3C Annotation format");
  }
  return parsedAnnotation.data;
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

  const parsedAnnotation = W3CAnnotationSchema.safeParse(
    // The W3C Annotation model
    merge(cloneDeep(originalAnnotation), {
      body: getBody(originalAnnotation).map((b) =>
        b.type === textualBody.type ? textualBody : b,
      ),
      target: getTarget(originalAnnotation).map((t) =>
        t.type === textPositionSelector.type ? textPositionSelector : t,
      ),
    }),
  );

  if (parsedAnnotation.error) {
    console.error(parsedAnnotation.error);
    throw new Error("Invalid W3C Annotation format");
  }
  return parsedAnnotation.data;
};
