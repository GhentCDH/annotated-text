import type { MouseEventPayload } from "./MouseEventPayload";
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

  mouseDownHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
  mouseMoveHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
}
