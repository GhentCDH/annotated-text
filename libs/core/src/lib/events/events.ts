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

type EditAnnotationEventData<ANNOTATION> = {
  annotation: ANNOTATION;
  annotationUuid: number;
};
type EditAnnotationEventMoveData<ANNOTATION> = {
  moveId: number;
} & EditAnnotationEventData<ANNOTATION>;

type AnnotationMouseEvent<ANNOTATION> = {
  annotation: ANNOTATION;
};
export type ErrorAnnotationEventData<ANNOTATION> = {
  annotation: ANNOTATION;
};

export type EventData<ANNOTATION> = {
  'mouse-enter': AnnotationMouseEvent<ANNOTATION>;
  'mouse-leave': AnnotationMouseEvent<ANNOTATION>;
  click: AnnotationMouseEvent<ANNOTATION>;
  'double-click': AnnotationMouseEvent<ANNOTATION>;
  'annotation-edit--start': EditAnnotationEventData<ANNOTATION>;
  'annotation-edit--end': EditAnnotationEventData<ANNOTATION>;
  'annotation-edit--move': EditAnnotationEventMoveData<ANNOTATION>;
  'annotation-create--start': EditAnnotationEventData<ANNOTATION>;
  'annotation-create--end': EditAnnotationEventData<ANNOTATION>;
  'annotation-create--move': EditAnnotationEventMoveData<ANNOTATION>;
  destroy: null;
  all: unknown;
};
export type AnnotationEventType<ANNOTATION> = keyof EventData<ANNOTATION>;

export type AnnotationEventData<
  EVENT extends AnnotationEventType<ANNOTATION>,
  ANNOTATION,
> = {
  event: EVENT;
  mouseEvent?: MouseEvent | undefined | null;
  data: EventData<ANNOTATION>[EVENT];
};

export type AnnotationErrorEvent = {
  code: string;
  error: string;
  message: any;
  params?: any[];
};

export type EventCallback<
  EVENT extends AnnotationEventType<ANNOTATION>,
  ANNOTATION,
> = (event: AnnotationEventData<EVENT, ANNOTATION>) => void;

export type ErrorEventCallback = (event: AnnotationErrorEvent) => void;

export const NEW_EVENTS: AnnotationEventType<unknown>[] = [
  'annotation-create--move',
  'annotation-create--start',
  'annotation-create--end',
] as const;

export const CHANGED_EVENTS: AnnotationEventType<unknown>[] = [
  ...NEW_EVENTS,
  'annotation-edit--move',
  'annotation-edit--start',
  'annotation-edit--end',
] as const;
