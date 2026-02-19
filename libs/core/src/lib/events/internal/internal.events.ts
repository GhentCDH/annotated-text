import type { Annotation, AnnotationId, TextAnnotation } from '../../model';
import type { AnnotationEventType } from '../events';

export type InternalEventData = {
  'send-event--annotation': {
    event: AnnotationEventType<Annotation>;
    mouseEvent?: MouseEvent;
    annotationUuid: AnnotationId;
    additionalData?: any;
  };
  'annotation--add': {
    annotation: TextAnnotation;
  };
  'annotation--update': {
    annotation: TextAnnotation;
  };
  'redraw-svg': void;
};

export type InternalEvent = keyof InternalEventData;
