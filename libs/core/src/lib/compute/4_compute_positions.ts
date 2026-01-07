import { type TextAnnotationModel } from './annotation.model';
import { getUnscaledRect } from './position/unscaled';
import type { TextAnnotation, TextLine } from '../model';
import { type AnnotationAdapter } from '../adapter/annotation';
import { type TextAdapter } from '../adapter/text';

import { Debugger } from '../utils/debugger';

const findTextLine = (textElement: HTMLElement, line: TextLine) => {
  return textElement.querySelector(
    `[data-line-uid="${line.uuid}"]`,
  ) as HTMLDivElement;
};

export const computeLinePositions = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
) => {
  model.lines.forEach((line) => {
    const textLine = findTextLine(textElement, line);
    if (!textLine) {
      Debugger.debug(
        'computeLinePositions',
        `Text line with UUID ${line.uuid} not found in the text element.`,
      );
      return;
    }
    line.element = textLine;
  });

  return model;
};

export const createAndAssignDrawAnnotation = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  textAdapter: TextAdapter,
) => {
  // This should be recalculated when drawing, if there was a scroll or something similar then the position changed
  const parentDimensions = getUnscaledRect(textElement);

  const rendered = annotationAdapter.renderInstance.createDraws(
    model.renderParams,
    textAdapter.style,
    parentDimensions,
    annotation,
  );

  model.addDrawAnnotations(
    annotation.id,
    rendered.draws,
    rendered.dimensions,
    rendered.color,
  );

  return model;
};

export const computeAnnotations = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
  annotationAdapter: AnnotationAdapter<any>,
  textAdapter: TextAdapter,
) => {
  // Compute positions of gutters

  model.annotations.forEach((annotation) => {
    createAndAssignDrawAnnotation(
      model,
      textElement,
      annotation,
      annotationAdapter,
      textAdapter,
    );
  });

  return model;
};

export const computePositions = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
  annotationAdapter: AnnotationAdapter<any>,
  textAdapter: TextAdapter,
) => {
  model.clearDrawAnnotation();
  computeAnnotations(model, textElement, annotationAdapter, textAdapter);

  return model;
};
