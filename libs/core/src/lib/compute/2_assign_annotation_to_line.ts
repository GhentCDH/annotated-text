import memoize from 'memoizee';
import { type TextAnnotationModel } from './annotation.model';
import { isIntersection } from './utils/intersect';
import { type TextAdapter } from '../adapter/text';
import type { Annotation, TextAnnotation, TextLine } from '../model';
import { type AnnotationAdapter } from '../adapter/annotation';

import { Debugger } from '../utils/debugger';
import { type EventListener } from '../events/event.listener';

export const assignAnnotationToLines = (
  model: TextAnnotationModel,
  eventListener: EventListener,
  _annotation: Annotation,
  calculateWeights = true,
) => {
  const annotation = _annotation as TextAnnotation;

  if (annotation.start >= annotation.end) {
    eventListener.sendError(
      "INVALID_ANNOTATION",
      `start (${annotation.start}) must be less than end (${annotation.end})`,
      annotation,
    );
  }
  if (model.textLength < annotation.start) {
    eventListener.sendError(
      "INVALID_ANNOTATION",
      `Invalid annotation: start (${annotation.start}) must be less than text length (${model.textLength})`,
      annotation,
    );
    return model;
  }
  if (model.textLength < annotation.end) {
    eventListener.sendError(
      "INVALID_ANNOTATION",
      `Invalid annotation: end (${annotation.end}) must be less than text length (${model.textLength})`,
      annotation,
    );

    // Maybe update the annotation end so it ends somewhere?
  }

  const lines = getLinesForAnnotation(model.lines, annotation);

  if (!lines?.length) {
    Debugger.warn(
      "Invalid annotation: no lines found for annotation",
      annotation,
    );
    return model;
  }

  annotation._render.lines = lines;

  model.setAnnotation(annotation, calculateWeights);

  return model;
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

  annotations?.forEach((annotation) => {
    const clonedAnnotation = annotationAdapter.parse(annotation);
    if (!clonedAnnotation) return;

    if (
      textAdapter.limit &&
      !isIntersection(clonedAnnotation, textAdapter.limit)
    ) {
      return;
    }

    assignAnnotationToLines(
      model,
      eventListener,
      clonedAnnotation,
      calculateWeights,
    );
  });

  return model;
};
