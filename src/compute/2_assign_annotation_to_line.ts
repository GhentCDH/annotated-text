import memoize from "memoizee";
import {
  TextAnnotation,
  TextAnnotationColor,
  TextAnnotationModel,
  TextLine,
} from "./annotation.model";
import { Annotation, createAnnotationColor } from "../index";

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

export const assignAnnotationToLines = (
  model: TextAnnotationModel,
  _annotation: Annotation,
  calculateWeights = true,
) => {
  const lines: TextLine[] = [];

  const annotation = {
    ..._annotation,
    color: getAnnotationColor(_annotation),
  } as TextAnnotation;

  let startLineIndex = model.lines.findIndex((line) =>
    isStartLine(line.start, line.end, annotation.start),
  );
  if (startLineIndex < 0) startLineIndex = 0;

  for (let i = startLineIndex; i < model.lines.length; i++) {
    const line = model.lines[i];
    if (line.start > annotation.end) {
      i = model.lines.length;
      break;
    }

    lines.push(line);

    if (annotation.end <= line.end) {
      i = model.lines.length;
      break;
    }
  }

  model.setAnnotation(annotation, lines, calculateWeights);

  return model;
};

export const reAssignAnnotationToLine = (
  model: TextAnnotationModel,
  annotation: Annotation,
): TextAnnotationModel => {
  model.removeAnnotation(annotation, false);

  return assignAnnotationToLines(model, annotation);
};

export const assignAnnotationsToLines = (
  model: TextAnnotationModel,
  annotations: Annotation[],
): TextAnnotationModel => {
  annotations.forEach((annotation) => {
    assignAnnotationToLines(model, annotation, false);
  });

  return model;
};
