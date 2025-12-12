import type {
  AnnotationEventType,
  ErrorAnnotationEventData,
} from '@ghentcdh/annotated-text';

export type AnnotatedTextV2Emits = {
  /**
   * Emitted when an event when occurs in the annotation viewer
   */
  event: [
    mouseEvent: MouseEvent,
    type: AnnotationEventType,
    data: ErrorAnnotationEventData,
  ];
  /**
   * Emitted when an error occurs during rendering
   */
  error: [error: string, message: any];
};
