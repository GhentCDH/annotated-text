import { getUnscaledRect } from './position/unscaled';
import type { TextAnnotation, TextLine } from '../model';
import { type AnnotationAdapter } from '../adapter/annotation';
import { type RenderInstances } from '../adapter/annotation/renderer/render-instances';

export const findTextLine = (textElement: HTMLElement, line: TextLine) => {
  return textElement.querySelector(
    `[data-line-uid="${line.uuid}"]`,
  ) as HTMLDivElement;
};

export const createAndAssignDrawAnnotation = (
  textElement: HTMLElement,
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  renderInstances: RenderInstances<any>,
) => {
  // This should be recalculated when drawing, if there was a scroll or something similar then the position changed
  const parentDimensions = getUnscaledRect(textElement);

  const rendered = renderInstances.createDraws(parentDimensions, annotation);

  annotationAdapter.addDrawAnnotations(
    annotation.id,
    rendered.draws,
    rendered.dimensions,
    rendered.color,
  );

  return;
};
