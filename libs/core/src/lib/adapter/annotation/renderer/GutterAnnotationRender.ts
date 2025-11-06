import { v4 as uuidv4 } from "uuid";
import { Debugger, TextAnnotation } from "@ghentcdh/annotated-text";
import { cloneDeep } from "lodash-es";
import {
  AnnotationRender,
  AnnotationRenderParams,
  AnnotationStyle,
  DefaultAnnotationStyle,
} from "./annotation-render";
import { getMinMaxBy } from "../../../compute/draw/utils/min-max.by";
import { AnnotationDimension, AnnotationDraw } from "../../../model";
import { getY } from "../../../compute/compute/helpers";
import { getColors } from "../../../compute/compute/colors";
import { createGutterPath } from "../../../compute/utils/create-path";

const _GutterAnnotationRender = (
  params: AnnotationRenderParams,
  parentDimensions: { x: number; y: number },
  annotation: TextAnnotation,
  style: GutterAnnotationStyle,
) => {
  const gutterWidth = style.width;
  const gutterGap = style.gap;

  if (!annotation._render.lines || annotation._render.lines.length === 0) {
    Debugger.warn("no lines to render for annotation", annotation);
    return { draws: [], isGutter: true, startPosition: undefined, color: null };
  }

  const { min: firstLine, max: lastLine } = getMinMaxBy(
    annotation._render.lines,
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
  const weight = params.maxGutterWeight - annotation._render.weight!;
  const x = (gutterWidth + gutterGap) * weight;
  const height = y1 - y + lastLineHeight;
  const color = getColors(style, annotation, false);

  const draws: AnnotationDraw[] = [
    {
      weight: annotation._render.weight!,
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

export const DefaultGutterAnnotationStyle = {
  ...cloneDeep(DefaultAnnotationStyle),
  width: 3,
  gap: 6,
};
export type GutterAnnotationStyle = AnnotationStyle &
  typeof DefaultGutterAnnotationStyle;

export class GutterAnnotationRender extends AnnotationRender<GutterAnnotationStyle> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = true;
  static instance = "gutter";
  readonly name = GutterAnnotationRender.instance;

  constructor() {
    super(DefaultGutterAnnotationStyle);
  }

  render(
    params: AnnotationRenderParams,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    return _GutterAnnotationRender(
      params,
      parentDimensions,
      annotation,
      this.style,
    );
  }
}
