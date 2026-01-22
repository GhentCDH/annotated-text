import type {
  Annotation,
  AnnotationEventType,
  ErrorAnnotationEventData,
} from '@ghentcdh/annotated-text';

export type AnnotatedTextV2Emits = {
  /**
   * Emitted when an event when occurs in the annotation viewer
   */
  event: [
    mouseEvent: MouseEvent,
    type: AnnotationEventType<Annotation>,
    data: ErrorAnnotationEventData<Annotation>,
  ];
  /**
   * Emitted when an error occurs during rendering
   */
  error: [error: string, message: any];
};
