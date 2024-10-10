import type { MouseEventPayload } from "./MouseEventPayload";
import type { Annotation } from "../Annotation";

export interface RecursiveAnnotatedTokenPartTextProps {
  text: string;
  start: number;
  end: number;
  annotations?: Annotation[];
  annotationClassHandler?: (
    annotation: Annotation,
    start: number,
    end: number,
    allowCreate: boolean
  ) => string[];
  annotationStyleHandler?: (annotation: Annotation) => string[];
  wordPartStart: number; // for correct handle position
  allowEdit?: boolean;
  allowCreate?: boolean;

  mouseDownHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
  mouseMoveHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
}
