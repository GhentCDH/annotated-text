import type { MouseEventPayload } from "./MouseEventPayload";
import type { AnnotatedGutter, AnnotationStyle } from "../AnnotatedText";

export interface AnnotatedGutterProps {
  gutter: AnnotatedGutter | null;
  annotationStyle: AnnotationStyle;

  mouseDownHandler: (e: MouseEvent, payload?: MouseEventPayload) => void;
}
