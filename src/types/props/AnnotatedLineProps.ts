import type { MouseEventPayload } from "./MouseEventPayload";
import type { AnnotatedLine, WordPart, RenderType } from "../AnnotatedText";
import type { Annotation } from "../Annotation";

export interface AnnotatedLineProps {
  line: AnnotatedLine;
  wordPartClasses?: (wordPart: WordPart) => any[];
  render?: RenderType;
  annotationClasses?: (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean
  ) => string[];
  allowEdit?: boolean;
  allowCreate?: boolean;

  mouseDownHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
  mouseMoveHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
}
