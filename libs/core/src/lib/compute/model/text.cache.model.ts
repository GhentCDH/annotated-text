import { TextAnnotation, TextLine } from "@ghentcdh/annotated-text";
import { calculateAnnotationWeights } from "../utils/weights";

export class TextCacheModel {
  constructor() {}

  updateAnnotations(
    lines: TextLine[],
    lineAnnotationMap: Map<number, TextAnnotation[]>,
  ) {
    calculateAnnotationWeights(lines, lineAnnotationMap);
  }

  clear() {}
}
