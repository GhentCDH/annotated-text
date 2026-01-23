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
  lines: TextLine[],
  textElement: HTMLElement,
) => {
  lines.forEach((line) => {
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
};

export const createAndAssignDrawAnnotation = (
  textElement: HTMLElement,
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  textAdapter: TextAdapter,
) => {
  // This should be recalculated when drawing, if there was a scroll or something similar then the position changed
  const parentDimensions = getUnscaledRect(textElement);

  const rendered = annotationAdapter.renderInstance.createDraws(
    {
      textDirection: textAdapter.textDirection,
      maxGutterWeight: annotationAdapter.gutter.maxWeight,
    },
    textAdapter.style,
    parentDimensions,
    annotation,
  );

  annotationAdapter.addDrawAnnotations(
    annotation.id,
    rendered.draws,
    rendered.dimensions,
    rendered.color,
  );

  return;
};

export const computeAnnotations = (
  textElement: HTMLElement,
  annotationAdapter: AnnotationAdapter<any>,
  textAdapter: TextAdapter,
) => {
  // Compute positions of gutters

  annotationAdapter.annotations().forEach((annotation) => {
    createAndAssignDrawAnnotation(
      textElement,
      annotation,
      annotationAdapter,
      textAdapter,
    );
  });

  return;
};
