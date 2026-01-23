import type { Annotation, BaseAnnotation } from '../../model';
import { type EventListener } from '../../events/event.listener';

export const validateAnnotation = <ANNOTATION extends BaseAnnotation>(
  annotation: Annotation,
  textLength: number,
  eventListener: EventListener<ANNOTATION>,
) => {
  if (annotation.start >= annotation.end) {
    eventListener.sendError(
      'INVALID_ANNOTATION',
      `start (${annotation.start}) must be less than end (${annotation.end})`,
      annotation,
    );
  }
  if (textLength < annotation.start) {
    eventListener.sendError(
      'INVALID_ANNOTATION',
      `Invalid annotation: start (${annotation.start}) must be less than text length (${textLength})`,
      annotation,
    );
    return;
  }
  if (textLength < annotation.end) {
    eventListener.sendError(
      'INVALID_ANNOTATION',
      `Invalid annotation: end (${annotation.end}) must be less than text length (${textLength})`,
      annotation,
    );

    // Maybe update the annotation end so it ends somewhere?
  }
};
