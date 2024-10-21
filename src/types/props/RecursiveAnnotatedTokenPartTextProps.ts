import type { MouseEventPayload } from "./MouseEventPayload";
import type { AnnotationInternal } from "../Annotation";

export interface RecursiveAnnotatedTokenPartTextProps {
  text: string;
  start: number;
  end: number;
  annotations?: AnnotationInternal[];
  annotationClassHandler?: (
    annotation: AnnotationInternal,
    start: number,
    end: number,
    allowCreate: boolean
  ) => string[];
  annotationStyleHandler?: (annotation: AnnotationInternal) => string[];
  wordPartStart: number; // for correct handle position
  allowEdit?: boolean;
  allowCreate?: boolean;

  mouseDownHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
  mouseMoveHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
}
