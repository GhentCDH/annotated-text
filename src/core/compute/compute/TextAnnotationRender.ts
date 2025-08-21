import { v4 as uuidv4 } from "uuid";
import {
  AnnotationAdapter,
  TextAdapter,
  TextAnnotation,
  TextLine,
} from "@ghentcdh/vue-component-annotated-text";
import { getColors } from "./colors";
import { getX, getY } from "./helpers";
import { TextAnnotationModel } from "../annotation.model";
import { createAnnotationPath } from "../utils/create-path";
import { AnnotationRender } from "../../adapter/annotation/DefaultAnnotationRender";

export const TextAnnotationRender: AnnotationRender = (
  lines: TextLine[],
  parentDimensions: { x: number; y: number },
  model: TextAnnotationModel,
  annotation: TextAnnotation,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const { config } = annotationAdapter;
  const radius = config.text.borderRadius;

  const draws = [];
  const padding = config.text.padding * annotation.weight;
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
        height: { x, y, height },
        color: getColors(annotationAdapter, annotation),
      });
    });
  });

  return { draws, isGutter: false };
};
