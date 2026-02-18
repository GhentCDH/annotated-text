import { v4 as uuidv4 } from 'uuid';
import {
  AnnotationRender,
  type AnnotationRenderParams,
} from './annotation-render';
import { Debugger } from '../../../utils/debugger';
import { getMinMaxBy } from '../../../compute/draw/utils/min-max.by';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type BaseAnnotation,
  type TextAnnotation,
} from '../../../model';
import {
  type DimensionsWithScale,
  getDimensions,
  getScaledDimensions,
} from '../../../compute/position/unscaled';
import { type CustomAnnotationStyle } from '../style';

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
) => {
  const gutterWidth = annotation._style.default.width;
  const gutterGap = annotation._style.default.gap;

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

  return { draws, dimensions: startPosition };
};

export class GutterAnnotationRender extends AnnotationRender<BaseAnnotation> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = true;
  readonly renderTag = false;

  constructor(name: string, style: CustomAnnotationStyle = {}) {
    super(name, {}, style);
  }

  createDraws(annotation: TextAnnotation) {
    const parentDimensions = this.svgModel.getTextElementDimensions();
    const params = {
      textDirection: this.textAdapter.textDirection,
      maxGutterWeight: this.annotationAdapter.gutter.maxWeight,
    };

    return createGutterAnnotations(params, parentDimensions, annotation) as {
      draws: AnnotationDraw[];
      dimensions: AnnotationDimension;
    };
  }
}
