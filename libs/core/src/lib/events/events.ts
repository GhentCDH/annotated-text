import type { Annotation } from '../model';

export type _AnnotationEventType =
  | 'mouse-enter'
  | 'mouse-leave'
  | 'click'
  | 'double-click'
  | 'annotation-edit--start'
  | 'annotation-edit--end'
  | 'annotation-edit--move'
  | 'annotation-create--start'
  | 'annotation-create--end'
  | 'annotation-create--move'
  | 'destroy';

type EditAnnotationEventData = {
  annotation: Annotation;
  annotationUuid: number;
};
type MouseEvent = {
  annotation: Annotation;
};
export type ErrorAnnotationEventData = {
  annotation: Annotation;
};

export type EventData = {
  'mouse-enter': MouseEvent;
  'mouse-leave': MouseEvent;
  click: MouseEvent;
  'double-click': MouseEvent;
  'annotation-edit--start': EditAnnotationEventData;
  'annotation-edit--end': EditAnnotationEventData;
  'annotation-edit--move': EditAnnotationEventData;
  'annotation-create--start': EditAnnotationEventData;
  'annotation-create--end': EditAnnotationEventData;
  'annotation-create--move': EditAnnotationEventData;
  destroy: null;
  all: unknown;
};
export type AnnotationEventType = keyof EventData;

export type AnnotationEventData<EVENT extends AnnotationEventType> = {
  event: EVENT;
  mouseEvent?: MouseEvent | undefined | null;
  data: EventData[EVENT];
};

export type AnnotationErrorEvent = {
  code: string;
  error: string;
  message: any;
  params?: any[];
};

export type EventCallback<EVENT extends AnnotationEventType> = (
  event: AnnotationEventData<EVENT>,
) => void;

export type ErrorEventCallback = (event: AnnotationErrorEvent) => void;

export const NEW_EVENTS: AnnotationEventType[] = [
  'annotation-create--move',
  'annotation-create--start',
  'annotation-create--end',
] as const;

export const CHANGED_EVENTS: AnnotationEventType[] = [
  ...NEW_EVENTS,
  'annotation-edit--move',
  'annotation-edit--start',
  'annotation-edit--end',
] as const;
