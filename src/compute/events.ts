import { Annotation } from "@ghentcdh/vue-component-annotated-text";

export type AnnotationEventType =
  | "mouse-enter"
  | "mouse-leave"
  | "click"
  | "double-click";

export type AnnotationEventData = {
  annotation: Annotation;
};

export type AnnotationEvent = {
  event: AnnotationEventType;
  mouseEvent?: MouseEvent;
  data: AnnotationEventData;
};
