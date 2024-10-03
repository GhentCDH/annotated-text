import type { ActionType } from "../AnnotatedText";
import type { Annotation } from "../Annotation";

export interface MouseEventPayload {
  startOffset: number;
  annotation?: Annotation;
  action?: ActionType;
}
