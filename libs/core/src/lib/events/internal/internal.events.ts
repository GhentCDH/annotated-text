import type {
  Annotation,
  AnnotationDrawColor,
  AnnotationId,
  TextAnnotation,
} from '../../model';
import type { AnnotationEventType } from '../events';

export type InternalEventData = {
  'annotation--draw-dummy': {
    dummyAnnotation: TextAnnotation;
    color: AnnotationDrawColor;
  };
  'send-event--annotation': {
    event: AnnotationEventType<Annotation>;
    mouseEvent?: MouseEvent;
    annotationUuid: AnnotationId;
    additionalData?: any;
  };
  'annotation--set-class': {
    annotationUuid: AnnotationId;
    cssClass: string;
  };
  'annotation--remove-tag': {
    annotationUuid: AnnotationId;
  };
  'annotation--remove': {
    annotationUuid: AnnotationId;
    selector?: string;
  };
  'annotation--add': {
    annotation: TextAnnotation;
  };
  'annotation--update': {
    annotation: TextAnnotation;
  };
};

export type InternalEvent = keyof InternalEventData;
