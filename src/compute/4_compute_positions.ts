import { pick } from "lodash-es";

import { v4 as uuidv4 } from "uuid";
import { Annotation } from "@ghentcdh/vue-component-annotated-text";
import {
  AnnotatedGutter,
  TextAnnotation,
  TextAnnotationModel,
  TextLine,
} from "./annotation.model";

const findTextLine = (textElement: HTMLElement, line: TextLine) => {
  return textElement.querySelector(
    `[data-line-uid="${line.uuid}"]`,
  ) as HTMLDivElement;
};

export const computeLinePositions = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
) => {
  const parentDimensions = pick(
    textElement.getBoundingClientRect(),
    "width",
    "height",
    "x",
    "y",
  );

  model.lines.forEach((line) => {
    const textLine = findTextLine(textElement, line);

    const bbox = textLine.getBoundingClientRect();
    const lineDimensions = pick(bbox, "width", "height", "x", "y");
    line.element = textLine;
    line.dimensions = {
      x: lineDimensions.x - parentDimensions.x,
      y: lineDimensions.y - parentDimensions.y,
      height: lineDimensions.height,
      width: lineDimensions.width,
    };
  });

  return model;
};

const getX = <E extends { x: number }>(parentElement: E, element: E) => {
  return element.x - parentElement.x;
};

const getY = <E extends { y: number }>(parentElement: E, element: E) => {
  return element.y - parentElement.y;
};

const createGutter = (model: TextAnnotationModel, gutter: AnnotatedGutter) => {
  const gutterWidth = model.config.gutter.width;
  const gutterGap = model.config.gutter.gap;
  const firstLine = model.lines[gutter.firstLine];
  const lastLine = model.lines[gutter.firstLine + gutter.totalLines - 1];
  const y = firstLine.dimensions.y;

  // Add the gutterwidth as padding
  const x = (gutterWidth + gutterGap) * (gutter.weight ?? 0);
  model.addDrawAnnotation({
    weight: gutter.weight,
    uuid: uuidv4(),
    annotationUuid: gutter.id,
    lineNumber: gutter.firstLine,
    dimensions: {
      x,
      y,
      width: gutterWidth,
      height: lastLine.dimensions.y + lastLine.dimensions.height - y - 5,
    },
    color: {
      fill: gutter.color.gutterColor,
    },
  });
};

const getTextRange = (annotation: Annotation, line: TextLine) => {
  const lineElement = line.element;
  let start = annotation.start - line.start;
  let end = annotation.end - line.start + 1;

  const textNode = lineElement.firstChild;
  const textLength = textNode.textContent.length;

  if (start < 0) {
    start = 0;
  } else if (start > textLength) {
    start = textLength;
  }
  if (end > textLength) {
    end = textNode.textContent.length;
  }

  return { start, end };
};

const getRanges = (annotation: Annotation, line: TextLine) => {
  const lineElement = line.element;
  const textNode = lineElement.firstChild;

  const { start, end } = getTextRange(annotation, line);
  const range = document.createRange();
  range.setStart(textNode, start); // start at 5th character
  range.setEnd(textNode, end); // end); // end at 10th character

  const rects = range.getClientRects();

  return Array.from(rects);
};

const createTextAnnotation = (
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
) => {
  const lines = model.getLinesForAnnotation(annotation.id);

  lines.forEach((line) => {
    const rects = getRanges(annotation, line);

    const padding = model.config.text.padding * annotation.weight;
    const height = model.config.text.lineHeight + padding * 2;

    rects.forEach((rect) => {
      model.addDrawAnnotation({
        weight: annotation.weight,
        uuid: uuidv4(),
        annotationUuid: annotation.id,
        lineNumber: line.lineNumber,
        dimensions: {
          x: getX(parentDimensions, rect),
          y: getY(parentDimensions, rect) - padding,
          width: rect.width,
          height: height,
        },
        color: {
          fill: annotation.color.background,
          border: annotation.color.border,
        },
      });
    });
  });
};

export const computeAnnotations = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
) => {
  const parentDimensions = pick(
    textElement.getBoundingClientRect(),
    "width",
    "height",
    "x",
    "y",
  );

  // Compute positions of gutters

  model.annotations
    .sort((a1, a2) => (a2.start < a1.start ? -1 : 1))
    .forEach((annotation) => {
      if (annotation.isGutter) {
        createGutter(model, annotation as AnnotatedGutter);
      } else {
        createTextAnnotation(parentDimensions, model, annotation);
      }
    });

  return model;
};

export const computePositions = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
) => {
  model.clearDrawAnnotation();
  computeAnnotations(model, textElement);

  return model;
};
