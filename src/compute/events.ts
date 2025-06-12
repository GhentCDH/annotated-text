import { Annotation } from "../types/Annotation";

export type AnnotationEventType =
  | "mouse-enter"
  | "mouse-leave"
  | "click"
  | "double-click"
  | "annotation-edit--start"
  | "annotation-edit--end"
  | "annotation-edit--move"
  | "annotation-create--start"
  | "annotation-create--end"
  | "annotation-create--move";

export type AnnotationEventData = {
  annotation: Annotation;
};

export type AnnotationEvent<DATA extends AnnotationEventData> = {
  event: AnnotationEventType;
  mouseEvent?: MouseEvent;
  data: DATA;
};

export type AnnotationErrorEvent = {
  code: string;
  error: string;
  message: any;
};
