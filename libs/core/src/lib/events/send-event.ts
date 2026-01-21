import { merge } from 'lodash-es';
import {
  type AnnotationEventType,
  CHANGED_EVENTS,
  type EventData,
  NEW_EVENTS,
} from './events';
import { BaseAnnotationDi } from '../di/BaseAnnotationDi';
import { type AnnotationId, type TextAnnotation } from '../model';

export class ExternalEventSender<ANNOTATION> extends BaseAnnotationDi {
  sendEvent<EVENT extends AnnotationEventType<ANNOTATION>>(
    {
      event,
      mouseEvent,
      annotationUuid,
    }: {
      event: EVENT;
      mouseEvent?: MouseEvent;
      annotationUuid: AnnotationId;
    },
    additionalData: Partial<EventData<ANNOTATION>[EVENT]> = {},
  ) {
    const fullAnnotation = this.annotationAdapter.getAnnotation(annotationUuid);

    const isNew = NEW_EVENTS.includes(event);
    const hasChanged = CHANGED_EVENTS.includes(event);

    const annotation = this.annotationAdapter.format(
      merge(
        fullAnnotation,
        (additionalData as any).annotation,
      ) as TextAnnotation,
      isNew,
      hasChanged,
    );

    const annotationData = {
      annotation,
      annotationUuid,
    } as EventData<ANNOTATION>[EVENT];

    this.eventListener.sendEvent(
      event,
      annotationData as unknown as any,
      mouseEvent,
    );

    return fullAnnotation;
  }
}
