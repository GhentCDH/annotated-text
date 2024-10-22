import type { MouseEventEmitPayload } from "./MouseEventPayload";
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
  wordPartStart: number; // for correct handle position
  allowEdit?: boolean;
  allowCreate?: boolean;
}

export type RecursiveAnnotatedTokenPartTextEmits = {
  "annotation-click": MouseEventEmitPayload;
  "annotation-double-click": MouseEventEmitPayload;
  "annotation-mouse-move": MouseEventEmitPayload;
};
