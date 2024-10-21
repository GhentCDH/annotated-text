import type { MouseEventEmitPayload } from "./MouseEventPayload";
import type { AnnotatedLine, RenderType, WordPart } from "../AnnotatedText";
import type { AnnotationInternal } from "../Annotation";

export interface AnnotatedLineProps {
  line: AnnotatedLine;
  wordPartClasses?: (wordPart: WordPart) => any[];
  render?: RenderType;
  annotationClasses?: (
    annotation: AnnotationInternal,
    start: number,
    end: number,
    allowCreate: boolean
  ) => string[];
  annotationStyle?: (annotation: AnnotationInternal) => string[];

  allowEdit?: boolean;
  allowCreate?: boolean;
}

export type AnnotatedLineEmits = {
  "annotation-click": MouseEventEmitPayload;
  "annotation-double-click": MouseEventEmitPayload;
  "annotation-mouse-move": MouseEventEmitPayload;
};
