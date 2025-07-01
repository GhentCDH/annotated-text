import { pick } from "lodash-es";

import { v4 as uuidv4 } from "uuid";
import { AnnotationDrawColor, TextAnnotationModel } from "./annotation.model";
import { createAnnotationPath, createGutterPath } from "./utils/create-path";
import { getMinMaxBy } from "./draw/utils/min-max.by";
import type { TextAnnotation, TextLine } from "../model";
import { AnnotationAdapter } from "../adapter/annotation";
import { TextAdapter } from "../adapter/line";

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

const getX = <E extends { x: number }>(parentElement: E, element: E) => {
  return element.x - parentElement.x;
};

const getY = <E extends { y: number }>(parentElement: E, element: E) => {
  return element.y - parentElement.y;
};

const createGutter = (
  model: TextAnnotationModel,
  parentDimensions: { x: number; y: number },
  gutter: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const config = annotationAdapter.config;
  const gutterWidth = config.gutter.width;
  const gutterGap = config.gutter.gap;

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
  const weight = model.maxGutterWeight - gutter.weight;
  const x = (gutterWidth + gutterGap) * weight;
  const height = y1 - y + lastLineHeight;

  model.addDrawAnnotation({
    weight: gutter.weight,
    uuid: uuidv4(),
    annotationUuid: gutter.id,
    lineNumber: firstLine.lineNumber,
    path: createGutterPath(x, y, gutterWidth, height),
    color: getColors(annotationAdapter, gutter, false),
    draggable: {},
  });
};

const getColors = (
  adapter: AnnotationAdapter<any>,
  annotation: TextAnnotation,
  borders = true,
) => {
  const hoverColor = adapter.config.hover.color;
  const color = adapter.color(annotation);

  return {
    default: {
      fill: color.background,
      border: borders ? color.border : undefined,
    } as AnnotationDrawColor,
    hover: hoverColor,
    active: {
      fill: color.backgroundActive,
      border: borders ? color.borderActive : undefined,
    } as AnnotationDrawColor,
  };
};

export const createTextAnnotation = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  lineAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const { config } = annotationAdapter;
  const radius = config.text.borderRadius;

  const draws = [];
  const padding = config.text.padding * annotation.weight;
  const height = config.text.lineHeight + padding * 2;
  lines.forEach((line, index: number) => {
    const rects = lineAdapter.getRanges(annotation, line);

    const prevEnd = lines[index - 1]?.end;
    const isFirstLine = !prevEnd || prevEnd <= annotation.start;

    const nextLine = lines[index + 1]?.start;
    const isLastLine = !nextLine || annotation.end < nextLine;

    rects?.forEach((rect, rectIdx) => {
      const x = getX(parentDimensions, rect);
      const y = getY(parentDimensions, rect) - padding;
      let leftBorder = isFirstLine && rectIdx === 0;
      const lastRect = rectIdx === rects.length - 1;
      let rightBorder = lastRect && isLastLine;
      if (model.textDirection === "rtl") {
        const r = rightBorder;
        rightBorder = leftBorder;
        leftBorder = r;
      }

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
        color: getColors(annotationAdapter, annotation),
      });
    });
  });

  return draws;
};

export const createAndAssignDrawAnnotation = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
  annotation: TextAnnotation,
  annotationAdapter: AnnotationAdapter<any>,
  lineAdapter: TextAdapter,
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
    lineAdapter,
    annotationAdapter,
  ).forEach((a) => model.addDrawAnnotation(a));

  return model;
};

export const computeAnnotations = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
  annotationAdapter: AnnotationAdapter<any>,
  lineAdapter: TextAdapter,
) => {
  // Compute positions of gutters

  model.annotations.forEach((annotation) => {
    if (annotation.isGutter) {
      createGutter(
        model,
        textElement.getBoundingClientRect(),
        annotation,
        annotationAdapter,
      );
    } else {
      createAndAssignDrawAnnotation(
        model,
        textElement,
        annotation,
        annotationAdapter,
        lineAdapter,
      );
    }
  });

  return model;
};

export const computePositions = (
  model: TextAnnotationModel,
  textElement: HTMLElement,
  annotationAdapter: AnnotationAdapter<any>,
  lineAdapter: TextAdapter,
) => {
  model.clearDrawAnnotation();
  computeAnnotations(model, textElement, annotationAdapter, lineAdapter);

  return model;
};
