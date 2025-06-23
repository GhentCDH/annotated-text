import { W3CAnnotation } from "./model";
import { findTextPositionSelector } from "./utils";
import { TextAnnotation } from "../compute/annotation.model";

const parseAnnotation = (
  annotation: W3CAnnotation,
  sourceUri?: string,
): TextAnnotation => {
  const selector = findTextPositionSelector(sourceUri)(annotation)?.selector;

  if (!selector) return null;

  return {
    id: annotation.id,
    start: selector.start,
    end: selector.end,
  } as TextAnnotation;
};

export const W3C = {
  parseAnnotations: (annotations: W3CAnnotation[], sourceUri?: string) => {
    return annotations?.map((annotation) =>
      parseAnnotation(annotation, sourceUri),
    );
  },
};
