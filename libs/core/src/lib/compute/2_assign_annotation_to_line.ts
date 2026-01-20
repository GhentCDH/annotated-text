import { isIntersection } from './utils/intersect';
import { getLinesForAnnotation } from './utils/line.utils';
import type { Annotation, BaseAnnotation, TextAnnotation } from '../model';
import { type TextAdapter } from '../adapter/text';
import { type AnnotationAdapter } from '../adapter/annotation';

import { Debugger } from '../utils/debugger';
import { type EventListener } from '../events/event.listener';

const assignAnnotationToLines = <ANNOTATION extends BaseAnnotation>(
  textAdapter: TextAdapter,
  eventListener: EventListener<ANNOTATION>,
  _annotation: Annotation,
) => {
  const annotation = _annotation as TextAnnotation;

  if (annotation.start >= annotation.end) {
    eventListener.sendError(
      'INVALID_ANNOTATION',
      `start (${annotation.start}) must be less than end (${annotation.end})`,
      annotation,
    );
  }
  if (textAdapter.textLength < annotation.start) {
    eventListener.sendError(
      'INVALID_ANNOTATION',
      `Invalid annotation: start (${annotation.start}) must be less than text length (${textAdapter.textLength})`,
      annotation,
    );
    return;
  }
  if (textAdapter.textLength < annotation.end) {
    eventListener.sendError(
      'INVALID_ANNOTATION',
      `Invalid annotation: end (${annotation.end}) must be less than text length (${textAdapter.textLength})`,
      annotation,
    );

    // Maybe update the annotation end so it ends somewhere?
  }

  const lines = getLinesForAnnotation(textAdapter.lines, annotation);

  if (!lines?.length) {
    Debugger.warn(
      'Invalid annotation: no lines found for annotation',
      annotation,
    );
    return;
  }

  annotation._render.lines = lines;

  return;
};

export const assignAnnotationsToLines = <ANNOTATION extends BaseAnnotation>(
  annotationAdapter: AnnotationAdapter<ANNOTATION>,
  textAdapter: TextAdapter,
  annotations: ANNOTATION[],
  eventListener: EventListener<ANNOTATION>,
) => {
  textAdapter.clear();
  annotationAdapter.clear();

  const limit = textAdapter.getLimit();

  annotations?.forEach((annotation) => {
    const clonedAnnotation = annotationAdapter.parse(annotation);
    if (!clonedAnnotation) return;

    if (limit && !isIntersection(clonedAnnotation, limit)) {
      return;
    }

    assignAnnotationToLines(textAdapter, eventListener, clonedAnnotation);
  });

  annotationAdapter.calculateWeights(textAdapter.lines);
};
