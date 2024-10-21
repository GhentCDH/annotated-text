import type { MouseEventEmitPayload } from "./MouseEventPayload";
import type { AnnotatedGutter, AnnotationStyle } from "../AnnotatedText";

export interface AnnotatedGutterProps {
  gutter: AnnotatedGutter | null;
  annotationStyle: AnnotationStyle;
}

export type AnnotatedGutterEmits = {
  "annotation-click": MouseEventEmitPayload;
  "annotation-double-click": MouseEventEmitPayload;
};
