import { v4 as uuidv4 } from "uuid";
import { getColors } from "./colors";
import { getY } from "./helpers";
import { AnnotationRender } from "../../adapter/annotation/DefaultAnnotationRender";
import {
  AnnotationDimension,
  AnnotationDraw,
  TextAnnotationModel,
} from "../annotation.model";
import { getMinMaxBy } from "../draw/utils/min-max.by";
import { createGutterPath } from "../utils/create-path";
import { TextAnnotation, TextLine } from "../../model";
import { TextAdapter } from "../../adapter/text";
import { AnnotationAdapter } from "../../adapter/annotation";

export const GutterAnnotationRender: AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const config = annotationAdapter.config!;
  const gutterWidth = config.gutter.width;
  const gutterGap = config.gutter.gap;

  const { min: firstLine, max: lastLine } = getMinMaxBy(
    lines,
    (line) => line.lineNumber,
  );

  const y = getY(parentDimensions, firstLine.element!.getBoundingClientRect());
  const y1 = getY(parentDimensions, lastLine.element!.getBoundingClientRect());
  const lastLineHeight = lastLine.element!.getBoundingClientRect().height;
  const startPosition: AnnotationDimension = {
    x: 0,
    y1: y,
    y2: y1,
  };

  // Add the gutterwidth as padding
  // We want to have the most gutters closest to the text
  const weight = model.maxGutterWeight - annotation.weight!;
  const x = (gutterWidth + gutterGap) * weight;
  const height = y1 - y + lastLineHeight;

  const draws: AnnotationDraw[] = [
    {
      weight: annotation.weight!,
      uuid: uuidv4(),
      annotationUuid: annotation.id,
      lineNumber: firstLine.lineNumber,
      path: createGutterPath(x, y, gutterWidth, height),
      color: getColors(annotationAdapter, annotation, false),
      draggable: {},
      height: { x, y, height },
    },
  ];

  return { draws, isGutter: true, startPosition };
};
