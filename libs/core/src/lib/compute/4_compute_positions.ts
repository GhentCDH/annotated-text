import { pick } from "lodash-es";
import { TextAnnotationModel } from "./annotation.model";
import type { TextAnnotation, TextLine } from "../model";
import { AnnotationAdapter } from "../adapter/annotation";
import { TextAdapter } from "../adapter/text";

import { Debugger } from "../utils/debugger";

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
) => {
  const parentDimensions = pick(
    textElement.getBoundingClientRect(),
    "width",
    "height",
    "x",
    "y",
  );
  const rendered = annotationAdapter.renderInstance.createDraws(
    model.renderParams,
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
) => {
  // Compute positions of gutters

  model.annotations.forEach((annotation) => {
    createAndAssignDrawAnnotation(
      model,
      textElement,
      annotation,
      annotationAdapter,
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
  computeAnnotations(model, textElement, annotationAdapter);

  return model;
};
