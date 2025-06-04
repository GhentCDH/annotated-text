import { Annotation } from "@ghentcdh/vue-component-annotated-text";

export type AnnotationEventType =
  | "mouse-enter"
  | "mouse-leave"
  | "click"
  | "double-click"
  | "annotation-edit--start"
  | "annotation-edit--end"
  | "annotation-edit--move";

export type AnnotationEventData = {
  annotation: Annotation;
};

export type AnnotationEventDrag = AnnotationEventData & {
  start: number;
  end: number;
};

export type AnnotationEvent<DATA extends AnnotationEventData> = {
  event: AnnotationEventType;
  mouseEvent?: MouseEvent;
  data: DATA;
};
