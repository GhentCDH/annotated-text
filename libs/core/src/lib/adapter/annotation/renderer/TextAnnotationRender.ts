import { v4 as uuidv4 } from "uuid";
import { TextAnnotation } from "@ghentcdh/annotated-text";
import { cloneDeep } from "lodash-es";
import {
  AnnotationRender,
  AnnotationRenderParams,
  DefaultTextAnnotationStyle,
  TextAnnotationStyle,
} from "./annotation-render";
import { AnnotationDimension, AnnotationDraw } from "../../../model";
import {
  createAnnotationPath,
  createAnnotationPathFn,
} from "../../../compute/utils/create-path";
import { getColors, GetColorsFn } from "../../../compute/compute/colors";
import { getX, getY } from "../../../compute/compute/helpers";
import { getRanges } from "../../../compute/utils/ranges/get-range";

export const createTextAnnotationRender = (
  params: AnnotationRenderParams,
  style: TextAnnotationStyle,
  parentDimensions: { x: number; y: number },
  annotation: TextAnnotation,
  pathFn: createAnnotationPathFn,
  getColorsFn: GetColorsFn,
) => {
  const radius = style.borderRadius;

  const draws: AnnotationDraw[] = [];
  const padding = style.padding * annotation._render.weight!;
  const height = style.lineHeight + padding * 2;
  let startPosition: AnnotationDimension;
  const color = getColorsFn(style, annotation, true);

  const lines = annotation._render.lines ?? [];
  lines.forEach((line, index: number) => {
    const rects = getRanges(annotation, line);

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
      if (params.textDirection === "rtl") {
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

  return { draws, dimensions: startPosition!, color };
};

export const DefaultTextAnnotationRenderStyle = {
  ...cloneDeep(DefaultTextAnnotationStyle),
};
export type TextAnnotationRenderStyle = typeof DefaultTextAnnotationRenderStyle;

export class HighlightAnnotationRender extends AnnotationRender<TextAnnotationRenderStyle> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = false;
  static instance = "highlight";
  readonly name = HighlightAnnotationRender.instance;

  constructor() {
    super(DefaultTextAnnotationRenderStyle);
  }

  createDraws(
    params: AnnotationRenderParams,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    return createTextAnnotationRender(
      params,
      this.style,
      parentDimensions,
      annotation,
      createAnnotationPath,
      getColors,
    );
  }
}
