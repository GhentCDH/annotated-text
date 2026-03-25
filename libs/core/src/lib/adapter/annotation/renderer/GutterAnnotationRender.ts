import { v4 as uuidv4 } from 'uuid';
import { AnnotationRender, type AnnotationRenderParams } from './annotation-render';
import { Debugger } from '../../../utils/debugger';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type BaseAnnotation,
  type TextAnnotation
} from '../../../model';
import { type DimensionsWithScale } from '../../../compute/position/unscaled';
import { type CustomAnnotationStyle } from '../style';
import { _DefaultAnnotationStyle, type DefaultAnnotationStyle } from '../style/annotation.style.default';
import { getRanges } from '../../../compute/utils/ranges/get-range';

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
): {
  draws: AnnotationDraw[];
  dimensions: AnnotationDimension;
} => {
  const gutterWidth = annotation._style.default.gutterWidth;
  const gutterGap = annotation._style.default.gutterGap;

  if (!annotation._render.lines || annotation._render.lines.length === 0) {
    Debugger.warn('no lines to render for annotation', annotation);
    return { draws: [], dimensions: undefined };
  }

  // Add the gutterwidth as padding
  // We want to have the most gutters closest to the text
  const weight = params.maxGutterWeight - annotation._render.weight!;
  const dimensions = {
    x: (gutterWidth + gutterGap) * weight,
    y: -1,
    height: 0,
  };

  const lines = annotation._render.lines ?? [];
  lines.forEach((line) => {
    const rects = getRanges(parentDimensions, annotation, line);
    if (rects?.length < 0) {
      return;
    }
    const first = rects[0];
    const last = rects[rects?.length - 1];
    if (dimensions.x < 0) {
      dimensions.x = first.dimensions.x;
    }
    if (dimensions.y < 0) {
      dimensions.y = first.dimensions.y;
    }
    dimensions.height = last.dimensions.y + last.dimensions.height;
  });
  const draws: AnnotationDraw[] = [
    {
      weight: annotation._render.weight!,
      uuid: uuidv4(),
      annotationUuid: annotation.id,
      lineNumber: 0,
      path: createGutterPath(
        dimensions.x,
        dimensions.y,
        gutterWidth,
        dimensions.height,
      ),
      draggable: {},
      height: dimensions,
    },
  ];
  return { draws, dimensions: dimensions };
};

export const createGutterStyle = (
  color: string,
  style: Partial<DefaultAnnotationStyle> = {},
): Partial<DefaultAnnotationStyle> => ({
  borderColor: 'transparent',
  backgroundColor: color,
  tagBorderColor: color,
  borderOpacity: 0,
  borderRadius: 0,
  ...style,
});

const DefaultGutterStyle = {
  default: createGutterStyle(_DefaultAnnotationStyle.backgroundColor),
};

export class GutterAnnotationRender extends AnnotationRender<BaseAnnotation> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = true;
  readonly renderTag = false;

  constructor(name: string, style: CustomAnnotationStyle = {}) {
    super(name, DefaultGutterStyle, style);
  }

  createDraws(annotation: TextAnnotation) {
    const parentDimensions = this.svgModel.getTextElementDimensions();
    const params = {
      textDirection: this.textAdapter.textDirection,
      maxGutterWeight: this.annotationAdapter.gutter.maxWeight,
    };

    return createGutterAnnotations(params, parentDimensions, annotation);
  }
}
