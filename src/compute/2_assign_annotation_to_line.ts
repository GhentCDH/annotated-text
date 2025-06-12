import memoize from "memoizee";
import {
  TextAnnotation,
  TextAnnotationColor,
  TextAnnotationModel,
  TextLine,
} from "./annotation.model";
import { isIntersection } from "./utils/intersect";
import { Annotation } from "../types/Annotation";
import { Debugger } from "../utils/debugger";
import { createAnnotationColor } from "../utils/createAnnotationColor";

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

  const startLineIndex = allLines.findIndex((line, idx) => {
    const start = isStartLine(line.start, line.end, annotation.start);
    if (start) return true;
    const nextLine = allLines[idx + 1];

    return nextLine && annotation.start < nextLine.start;
  });

  if (startLineIndex < 0) {
    return;
  }
  for (let i = startLineIndex; i < allLines.length; i++) {
    const line = allLines[i];

    if (annotation.end < line.start) {
      // console.log("----");
      // console.log(annotation.start, annotation.end, line.start);
      // console.warn("eat the annotation", annotation, "on line", line);
      // console.log(lines);
      // i = allLines.length;
      // break;
    }

    if (isIntersection(line, annotation)) {
      lines.push(line);
    }

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
  if (model.textLength < annotation.start) {
    Debugger.warn(
      `Invalid annotation: start (${annotation.start}) must be less than text length (${model.textLength})`,
      annotation,
    );
    return model;
  }
  if (model.textLength < model.textLength) {
    Debugger.warn(
      `Invalid annotation: end (${annotation.start}) must be less than text length (${model.textLength})`,
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
    return;
  }

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
