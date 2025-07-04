import type { Annotation } from "../model";

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
  params?: any[];
};

export type EventCallback<
  DATA extends AnnotationEventData = AnnotationEventData,
> = (data: AnnotationEvent<DATA>) => void;

export type ErrorEventCallback = (data: AnnotationErrorEvent) => void;

export const NEW_EVENTS: AnnotationEventType[] = [
  "annotation-create--move",
  "annotation-create--start",
  "annotation-create--end",
] as const;

export const CHANGED_EVENTS: AnnotationEventType[] = [
  ...NEW_EVENTS,
  "annotation-edit--move",
  "annotation-edit--start",
  "annotation-edit--end",
] as const;
