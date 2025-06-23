import { Annotation } from "@ghentcdh/vue-component-annotated-text";
import { W3CAnnotation } from "./model";
import { findTextPositionSelector } from "./utils";
import { createTextSelectionAnnotation } from "./utils/text-selection-annotation";
import { TextAnnotationParserConfig } from "../model/parser";

const parseAnnotation = (sourceUri?: string) => {
  return (annotation: W3CAnnotation): Annotation => {
    const selector = findTextPositionSelector(sourceUri)(annotation)?.selector;

    if (!selector) return null;

    return {
      id: annotation.id,
      start: selector.start,
      end: selector.end,
    } as Annotation;
  };
};

const formatAnnotation = (sourceUri?: string, language?: string) => {
  return (
    annotation: Annotation,
    selectedText: string,
    isNew: boolean,
  ): W3CAnnotation => {
    // TODO we should also handle the source annotation
    return createTextSelectionAnnotation(
      sourceUri,
      language,
      selectedText,
      annotation,
    );
  };
};

export const AnnotationW3CParser = (
  sourceId?: string,
): TextAnnotationParserConfig<W3CAnnotation> => {
  return {
    parse: parseAnnotation(sourceId),
    format: formatAnnotation(sourceId),
  };
};
