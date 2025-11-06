import { v4 as uuidv4 } from "uuid";
import {
  AnnotationAdapter,
  TextAdapter,
  TextAnnotation,
  TextLine,
} from "@ghentcdh/annotated-text";
import { AnnotationRender as _AnnotationRender } from "./DefaultAnnotationRender";
import { AnnotationRender, AnnotationStyle } from "./annotation-render";
import {
  AnnotationDimension,
  AnnotationDraw,
  TextAnnotationModel,
} from "../../../compute/annotation.model";
import {
  createAnnotationPath,
  createAnnotationPathFn,
} from "../../../compute/utils/create-path";
import { getColors, GetColorsFn } from "../../../compute/compute/colors";
import { getX, getY } from "../../../compute/compute/helpers";

export const createTextAnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
  pathFn: createAnnotationPathFn,
  getColorsFn: GetColorsFn,
) => {
  const config = annotationAdapter.config!;
  const radius = config.text.borderRadius;

  const draws: AnnotationDraw[] = [];
  const padding = config.text.padding * annotation._render.weight!;
  const height = config.text.lineHeight + padding * 2;
  let startPosition: AnnotationDimension;
  const color = getColorsFn(annotationAdapter, annotation, true);

  lines.forEach((line, index: number) => {
    const rects = textAdapter.getRanges(annotation, line);

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

      if (!startPosition) {
        startPosition = {
          x,
          y1: y,
          y2: y + height,
        };
      }

      draws.push({
        weight: annotation._render.weight!,
        uuid: uuidv4(),
        annotationUuid: annotation.id,
        lineNumber: line.lineNumber,
        path: pathFn({
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
        height: { x, y, height },
      });
    });
  });

  return { draws, startPosition: startPosition!, color };
};

export const TextAnnotationRender: _AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const { draws, startPosition, color } = createTextAnnotationRender(
    lines,
    parentDimensions,
    model,
    annotation,
    textAdapter,
    annotationAdapter,
    createAnnotationPath,
    getColors,
  );

  return { draws, isGutter: false, startPosition, color };
};

export type TextAnnotationStyle = AnnotationStyle & {};
export const DefaultTextAnnotationStyle: TextAnnotationStyle = {};

export class HighlightAnnotationRender extends AnnotationRender<TextAnnotationStyle> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = false;
  static instance = "highlight";
  readonly name = HighlightAnnotationRender.instance;

  constructor() {
    super(DefaultTextAnnotationStyle);
  }

  render = TextAnnotationRender;
}
