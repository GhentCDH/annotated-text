import { v4 as uuidv4 } from "uuid";
import {
  AnnotationAdapter,
  TextAdapter,
  TextAnnotation,
  TextLine,
} from "@ghentcdh/annotated-text";
import { AnnotationRender, AnnotationStyle } from "./annotation-render";
import { getMinMaxBy } from "../../../compute/draw/utils/min-max.by";
import {
  AnnotationDimension,
  AnnotationDraw,
  TextAnnotationModel,
} from "../../../compute/annotation.model";
import { getY } from "../../../compute/compute/helpers";
import { getColors } from "../../../compute/compute/colors";
import { createGutterPath } from "../../../compute/utils/create-path";

export const GutterAnnotationRender = (
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
  const color = getColors(annotationAdapter, annotation, false);

  const draws: AnnotationDraw[] = [
    {
      weight: annotation.weight!,
      uuid: uuidv4(),
      annotationUuid: annotation.id,
      lineNumber: firstLine.lineNumber,
      path: createGutterPath(x, y, gutterWidth, height),
      draggable: {},
      height: { x, y, height },
    },
  ];

  return { draws, isGutter: true, startPosition, color };
};

export type GutterAnnotationStyle = AnnotationStyle & {};
export const DefaultGutterAnnotationStyle: GutterAnnotationStyle = {};

export class _GutterAnnotationRender extends AnnotationRender<GutterAnnotationStyle> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = true;
  readonly name = "gutter";

  constructor() {
    super(DefaultGutterAnnotationStyle);
  }

  render = GutterAnnotationRender;
}
