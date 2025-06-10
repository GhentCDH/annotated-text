import { pick } from "lodash-es";

import { v4 as uuidv4 } from "uuid";
import { Annotation } from "@ghentcdh/vue-component-annotated-text";
import {
  AnnotatedGutter,
  AnnotationDrawColor,
  TextAnnotation,
  TextAnnotationModel,
  TextLine,
} from "./annotation.model";
import { createAnnotationPath, createGutterPath } from "./utils/create-path";
import { getMinMaxBy } from "./draw/utils/min-max.by";

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
      y: lineDimensions.y, //- parentDimensions.y,
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

const createGutter = (
  model: TextAnnotationModel,
  parentDimensions: { x: number; y: number },
  gutter: AnnotatedGutter,
) => {
  const gutterWidth = model.config.gutter.width;
  const gutterGap = model.config.gutter.gap;

  const lines = model.getLinesForAnnotation(gutter.id);

  const { min: firstLine, max: lastLine } = getMinMaxBy(
    lines,
    (line) => line.lineNumber,
  );

  const y = getY(parentDimensions, firstLine.element.getBoundingClientRect());
  const y1 = getY(parentDimensions, lastLine.element.getBoundingClientRect());
  const lastLineHeight = lastLine.element.getBoundingClientRect().height;

  // Add the gutterwidth as padding
  // We want to have the most gutters closest to the text
  const weight = model.maxGutterWeight - gutter.weight ?? 0;
  const x = (gutterWidth + gutterGap) * weight;
  const height = y1 - y + lastLineHeight;

  model.addDrawAnnotation({
    weight: gutter.weight,
    uuid: uuidv4(),
    annotationUuid: gutter.id,
    lineNumber: firstLine.lineNumber,
    path: createGutterPath(x, y, gutterWidth, height),
    color: getColors(model.config.hover.color, gutter, false),
    draggable: {},
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

const getColors = (
  hoverColor: AnnotationDrawColor,
  annotation: TextAnnotation,
  borders = true,
) => {
  return {
    default: {
      fill: annotation.color.background,
      border: borders ? annotation.color.border : undefined,
    } as AnnotationDrawColor,
    hover: hoverColor,
    active: {
      fill: annotation.color.backgroundActive,
      border: borders ? annotation.color.borderActive : undefined,
    } as AnnotationDrawColor,
  };
};

export const createTextAnnotation = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
) => {
  const radius = model.config.text.borderRadius;

  const draws = [];

  lines.forEach((line, index: number) => {
    const rects = getRanges(annotation, line);

    const padding = model.config.text.padding * annotation.weight;
    const height = model.config.text.lineHeight + padding * 2;
    const prevEnd = lines[index - 1]?.end;
    const isFirstLine = !prevEnd || prevEnd <= annotation.start;
    const nextLine = lines[index + 1]?.start;
    const isLastLine = !nextLine || annotation.end <= nextLine;

    rects.forEach((rect, index) => {
      const x = getX(parentDimensions, rect);
      const y = getY(parentDimensions, rect) - padding;
      const leftBorder = isFirstLine && index === 0;
      const rightBorder = isLastLine && index === rects.length - 1;

      draws.push({
        weight: annotation.weight,
        uuid: uuidv4(),
        annotationUuid: annotation.id,
        lineNumber: line.lineNumber,
        path: createAnnotationPath({
          x: x,
          y: y,
          width: rect.width,
          height: height,
          r: radius,
          leftBorder: leftBorder,
          rightBorder: rightBorder,
        }),
        draggable: {
          start: leftBorder ? { x, y, height } : undefined,
          end: rightBorder ? { x: x + rect.width, y, height } : undefined,
        },
        color: getColors(model.config.hover.color, annotation),
      });
    });
  });

  return draws;
};

export const createAndAssignDrawAnnotation = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
  annotation: TextAnnotation,
) => {
  const parentDimensions = pick(
    textElement.getBoundingClientRect(),
    "width",
    "height",
    "x",
    "y",
  );
  createTextAnnotation(
    model.getLinesForAnnotation(annotation.id),
    parentDimensions,
    model,
    annotation,
  ).forEach((a) => model.addDrawAnnotation(a));

  return model;
};

export const computeAnnotations = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
) => {
  // Compute positions of gutters

  model.annotations.forEach((annotation) => {
    if (annotation.isGutter) {
      createGutter(
        model,
        textElement.getBoundingClientRect(),
        annotation as AnnotatedGutter,
      );
    } else {
      createAndAssignDrawAnnotation(model, textElement, annotation);
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
