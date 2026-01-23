import { v4 as uuidv4 } from 'uuid';
import { AnnotationRender } from './annotation-render';
import { type TextAnnotationRenderStyle } from './TextAnnotationRender';
import { type PathParams } from './_utils/path';
import { getColors } from '../../../compute/compute/colors';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type AnnotationDrawColors,
  type AnnotationDrawPath,
  type TextAnnotation,
} from '../../../model';
import { getRanges } from '../../../compute/utils/ranges/get-range';

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
  createDraws(annotation: TextAnnotation) {
    const parentDimensions = this.svgModel.getTextElementDimensions();
    const params = {
      textDirection: this.textAdapter.textDirection,
      maxGutterWeight: this.annotationAdapter.gutter.maxWeight,
    };
    const textStyle = this.textAdapter.style;

    const radius = this.style.borderRadius;

    const draws: AnnotationDraw[] = [];
    const lineOffset = textStyle.lineOffset / 2;
    const padding = textStyle.padding * annotation._render.weight!;
    const height = textStyle.lineHeight + padding * 2;
    let startPosition: AnnotationDimension;

    const color = this.getColors(annotation);

    const lines = annotation._render.lines ?? [];
    lines.forEach((line, index: number) => {
      const rects = getRanges(parentDimensions, annotation, line);

      const prevEnd = lines[index - 1]?.end;
      const isFirstLine = !prevEnd || prevEnd <= annotation.start;

      const nextLine = lines[index + 1]?.start;
      const isLastLine = !nextLine || annotation.end < nextLine;

      rects?.forEach((rect, rectIdx) => {
        const dimensions = rect.dimensions;
        const x = dimensions.x;
        const y = dimensions.y - padding - lineOffset;
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
            width: dimensions.width,
            height: height,
            r: radius,
            leftBorder: leftBorder,
            rightBorder: rightBorder,
          }),
          draggable: {
            start: leftBorder ? { x, y, height } : undefined,
            end: rightBorder
              ? { x: x + dimensions.width, y, height }
              : undefined,
          },
          height: { x, y, height },
        });
      });
    });

    return { draws, dimensions: startPosition!, color };
  }
}
