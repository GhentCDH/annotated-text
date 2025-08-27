import { v4 as uuidv4 } from "uuid";
import { TextAnnotation, TextLine } from "../../model";
import { TextAdapter } from "../../adapter/text";
import { AnnotationAdapter } from "../../adapter/annotation";
import { getColors, GetColorsFn } from "./colors";
import { getX, getY } from "./helpers";
import { AnnotationDraw, TextAnnotationModel } from "../annotation.model";
import {
  createAnnotationPath,
  createAnnotationPathFn,
} from "../utils/create-path";
import { AnnotationRender } from "../../adapter/annotation/DefaultAnnotationRender";

export const createTextAnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
  pathFn: createAnnotationPathFn,
  getColorsFn: GetColorsFn,
): AnnotationDraw[] => {
  const config = annotationAdapter.config!;
  const radius = config.text.borderRadius;

  const draws: AnnotationDraw[] = [];
  const padding = config.text.padding * annotation.weight!;
  const height = config.text.lineHeight + padding * 2;

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

      draws.push({
        weight: annotation.weight!,
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
        color: getColorsFn(annotationAdapter, annotation, true),
      });
    });
  });

  return draws;
};

export const TextAnnotationRender: AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const draws = createTextAnnotationRender(
    lines,
    parentDimensions,
    model,
    annotation,
    textAdapter,
    annotationAdapter,
    createAnnotationPath,
    getColors,
  );

  return { draws, isGutter: false };
};
