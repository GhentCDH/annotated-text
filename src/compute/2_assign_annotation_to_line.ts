import memoize from "memoizee";
import {
  TextAnnotation,
  TextAnnotationColor,
  TextAnnotationModel,
  TextLine,
} from "./annotation.model";
import { Annotation, createAnnotationColor, Debugger } from "../index";

const isStartLine = memoize(
  (lineStart: number, lineEnd: number, start: number) => {
    return start >= lineStart && start < lineEnd;
  },
);

const getAnnotationColor = (annotation: Annotation): TextAnnotationColor => {
  let color = {} as TextAnnotationColor;
  if (annotation.color)
    if (typeof annotation.color === "string") {
      color = createAnnotationColor(annotation.color);
    } else {
      color = { ...annotation.color };
    }

  return color;
};

export const getLinesForAnnotation = (
  allLines: TextLine[],
  annotation: Annotation,
) => {
  const lines: TextLine[] = [];

  let startLineIndex = allLines.findIndex((line) =>
    isStartLine(line.start, line.end, annotation.start),
  );
  if (startLineIndex < 0) startLineIndex = 0;

  for (let i = startLineIndex; i < allLines.length; i++) {
    const line = allLines[i];
    if (line.start > annotation.end) {
      i = allLines.length;
      break;
    }

    lines.push(line);

    if (annotation.end <= line.end) {
      i = allLines.length;
      break;
    }
  }

  return lines;
};

export const assignAnnotationToLines = (
  model: TextAnnotationModel,
  _annotation: Annotation,
  calculateWeights = true,
) => {
  const annotation = {
    ..._annotation,
    color: getAnnotationColor(_annotation),
  } as TextAnnotation;
  if (annotation.start >= annotation.end) {
    Debugger.warn(
      `Invalid annotation: start (${annotation.start}) must be less than end (${annotation.end})`,
    );
  }

  const lines = getLinesForAnnotation(model.lines, annotation);

  model.setAnnotation(annotation, lines, calculateWeights);

  return model;
};

export const reAssignAnnotationToLine = (
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  calculateWeights = false,
): TextAnnotationModel => {
  model.removeAnnotation(annotation, calculateWeights);

  return assignAnnotationToLines(model, annotation);
};

export const assignAnnotationsToLines = (
  model: TextAnnotationModel,
  annotations: Annotation[],
  calculateWeights = false,
): TextAnnotationModel => {
  model.resetAnnotations();
  annotations.forEach((annotation) => {
    assignAnnotationToLines(model, annotation, calculateWeights);
  });

  return model;
};
