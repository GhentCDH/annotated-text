import { type TextAnnotationModel } from './annotation.model';
import { isIntersection } from './utils/intersect';
import { getLinesForAnnotation } from './utils/line.utils';
import { type TextAdapter } from '../adapter/text';
import type { Annotation, TextAnnotation } from '../model';
import { type AnnotationAdapter } from '../adapter/annotation';

import { Debugger } from '../utils/debugger';
import { type EventListener } from '../events/event.listener';

const assignAnnotationToLines = (
  textAdapter: TextAdapter,
  model: TextAnnotationModel,
  eventListener: EventListener,
  _annotation: Annotation,
  calculateWeights = true,
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
    return model;
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
    return model;
  }

  annotation._render.lines = lines;

  model.setAnnotation(annotation, calculateWeights);
};

export const assignAnnotationsToLines = <ANNOTATION>(
  model: TextAnnotationModel,
  annotationAdapter: AnnotationAdapter<ANNOTATION>,
  textAdapter: TextAdapter,
  annotations: ANNOTATION[],
  eventListener: EventListener,
  calculateWeights = false,
): TextAnnotationModel => {
  model.resetAnnotations();

  textAdapter.clear();

  const limit = textAdapter.getLimit();

  annotations?.forEach((annotation) => {
    const clonedAnnotation = annotationAdapter.parse(annotation);
    if (!clonedAnnotation) return;

    if (limit && !isIntersection(clonedAnnotation, limit)) {
      return;
    }

    assignAnnotationToLines(
      textAdapter,
      model,
      eventListener,
      clonedAnnotation,
      calculateWeights,
    );
  });

  model.calculateAllWeights();

  return model;
};
