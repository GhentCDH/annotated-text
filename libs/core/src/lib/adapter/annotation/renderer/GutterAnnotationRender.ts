import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash-es';
import {
  AnnotationRender,
  type AnnotationRenderParams,
  DefaultAnnotationRenderStyle,
} from './annotation-render';
import { Debugger } from '../../../utils/debugger';
import { getMinMaxBy } from '../../../compute/draw/utils/min-max.by';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type AnnotationDrawColors,
  type TextAnnotation,
} from '../../../model';
import { getColors } from '../../../compute/compute/colors';
import { type TextAdapterStyle } from '../../text';
import {
  type DimensionsWithScale,
  getDimensions,
  getScaledDimensions,
} from '../../../compute/position/unscaled';

export const createGutterPath = (
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  return {
    fill: `M${x},${y} 
          H${x + width} 
          V${y + height} 
          H${x} 
          Z`,
  };
};

const createGutterAnnotations = (
  params: AnnotationRenderParams,
  parentDimensions: DimensionsWithScale,
  annotation: TextAnnotation,
  style: GutterAnnotationRenderStyle,
) => {
  const gutterWidth = style.width;
  const gutterGap = style.gap;

  if (!annotation._render.lines || annotation._render.lines.length === 0) {
    Debugger.warn('no lines to render for annotation', annotation);
    return { draws: [], dimensions: undefined, color: null };
  }

  const { min: firstLine, max: lastLine } = getMinMaxBy(
    annotation._render.lines,
    (line) => line.lineNumber,
  );

  const firstLineDimensions = getScaledDimensions(
    parentDimensions,
    getDimensions(firstLine.element),
  );
  const lastLineDimensions = getScaledDimensions(
    parentDimensions,
    getDimensions(lastLine.element),
  );

  const y = firstLineDimensions.y;

  const y1 = lastLineDimensions.y;
  const startPosition: AnnotationDimension = {
    x: 0,
    y1: y,
    y2: y1,
  };

  // Add the gutterwidth as padding
  // We want to have the most gutters closest to the text
  const weight = params.maxGutterWeight - annotation._render.weight!;
  const x = (gutterWidth + gutterGap) * weight;
  const height = y1 - y + lastLineDimensions.height;
  const color: AnnotationDrawColors = getColors(style, annotation, false, true);

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

  return { draws, dimensions: startPosition, color };
};

export const DefaultGutterAnnotationRenderStyle = {
  ...cloneDeep(DefaultAnnotationRenderStyle),
  width: 3,
  gap: 6,
};
export type GutterAnnotationRenderStyle =
  typeof DefaultGutterAnnotationRenderStyle;

export class GutterAnnotationRender extends AnnotationRender<GutterAnnotationRenderStyle> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = true;

  constructor(name: string, style: Partial<GutterAnnotationRenderStyle> = {}) {
    super(name, style, DefaultGutterAnnotationRenderStyle);
  }

  createDraws(
    params: AnnotationRenderParams,
    textStyle: TextAdapterStyle,
    parentDimensions: DimensionsWithScale,
    annotation: TextAnnotation,
  ) {
    return createGutterAnnotations(
      params,
      parentDimensions,
      annotation,
      this.style,
    ) as {
      draws: AnnotationDraw[];
      dimensions: AnnotationDimension;
      color: AnnotationDrawColors;
    };
  }
}
