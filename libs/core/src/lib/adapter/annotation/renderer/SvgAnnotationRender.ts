import { v4 as uuidv4 } from 'uuid';
import {
  AnnotationRender,
  type AnnotationRenderParams,
} from './annotation-render';
import { type TextAnnotationRenderStyle } from './TextAnnotationRender';
import { getColors } from '../../../compute/compute/colors';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type AnnotationDrawColors,
  type AnnotationDrawPath,
  type TextAnnotation,
} from '../../../model';

import { type TextAdapterStyle } from '../../text';
import { getRanges } from '../../../compute/utils/ranges/get-range';
import { getX, getY } from '../../../compute/compute/helpers';

export abstract class SvgAnnotationRender<
  STYLE extends TextAnnotationRenderStyle,
> extends AnnotationRender<STYLE> {
  protected borders = true;
  protected fillBg = true;

  protected constructor(
    name: string,
    style: Partial<STYLE>,
    defaultStyle: STYLE,
  ) {
    super(name, style, defaultStyle);
  }

  // Only this method is required to implement
  abstract createPath(params: PathParams): AnnotationDrawPath;

  // Implemented by default, can be overridden
  getColors(annotation: TextAnnotation): AnnotationDrawColors {
    return getColors(this.style, annotation, this.borders, this.fillBg);
  }

  // Implemented by default
  createDraws(
    params: AnnotationRenderParams,
    textStyle: TextAdapterStyle,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    const radius = this.style.borderRadius;

    const draws: AnnotationDraw[] = [];
    const lineOffset = textStyle.lineOffset / 2;
    const padding = textStyle.padding * annotation._render.weight!;
    const height = textStyle.lineHeight + padding * 2;
    let startPosition: AnnotationDimension;

    const color = this.getColors(annotation);

    const lines = annotation._render.lines ?? [];
    lines.forEach((line, index: number) => {
      const rects = getRanges(annotation, line);

      const prevEnd = lines[index - 1]?.end;
      const isFirstLine = !prevEnd || prevEnd <= annotation.start;

      const nextLine = lines[index + 1]?.start;
      const isLastLine = !nextLine || annotation.end < nextLine;

      rects?.forEach((rect, rectIdx) => {
        const x = getX(parentDimensions, rect);
        const y = getY(parentDimensions, rect) - padding - lineOffset;
        let leftBorder = isFirstLine && rectIdx === 0;
        const lastRect = rectIdx === rects.length - 1;
        let rightBorder = lastRect && isLastLine;
        if (params.textDirection === 'rtl') {
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
          path: this.createPath({
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
  }
}
