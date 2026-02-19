import { type Selection } from 'd3-selection';
import { addDraggableAnnotation } from './annotations/drag-annotation';
import { drawAnnotationHandles } from './annotations/edit';
import { EventAnnotations } from './annotations/EventAnnotation';
import {
  type AnnotationSvg,
  SVG_ID,
  SVG_ROLE,
  SvgModel,
} from '../model/svg.types';
import {
  type AnnotationDraw,
  type AnnotationStyle,
  type TextAnnotation,
} from '../../model';
import { type AnnotationModule } from '../../di/annotation.module';

export const colorAnnotationContent = (
  style: AnnotationStyle,
  styleKey: keyof AnnotationStyle,
  borderElement: Selection<any, any, any, any> | null,
  fillElement: Selection<any, any, any, any> | null,
) => {
  const color = style[styleKey];
  fillElement
    ?.attr('fill', color.backgroundColor ?? 'none')
    .attr('border', 'none')
    .attr('stroke', 'none');

  borderElement
    ?.attr('fill', 'none')
    .attr('stroke', color.borderColor ?? 'none')
    .attr('stroke-width', color.borderWidth ?? 0);
};

export const drawAnnotationContent = (
  draw: AnnotationDraw,
  svgModel: SvgModel,
  style: AnnotationStyle,
  styleKey: keyof AnnotationStyle = 'default',
) => {
  let border = null;
  const annotationGroup = svgModel.annotations
    .append('g')
    .attr('data-annotation-uid', draw.annotationUuid);

  let rect = null;
  if (draw.path.fill) {
    rect = annotationGroup
      .append('path')
      .attr(SVG_ID.ANNOTATION_UID, draw.annotationUuid)
      .attr('data-annotation-start', draw.lineNumber)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.FILL)
      .attr('d', draw.path.fill);
  }
  if (draw.path.border) {
    border = annotationGroup
      .append('path')
      .attr(SVG_ID.ANNOTATION_UID, draw.annotationUuid)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.BORDER)
      .attr('d', draw.path.border)
      .attr('fill', 'none');
  }

  colorAnnotationContent(style, styleKey, border, rect);

  return { rect, border };
};

export const drawAnnotation = (
  annotationModule: AnnotationModule,
  annotation: TextAnnotation,
) => {
  const svgModel = annotationModule.inject(SvgModel);

  annotation._drawMetadata.draws.forEach((draw) => {
    const { rect, border } = drawAnnotationContent(
      draw,
      svgModel,
      annotation._style,
    );

    drawAnnotationHandles(annotation, draw, annotationModule);

    const eventAnnotations = annotationModule.inject(EventAnnotations);
    eventAnnotations.addToAnnotation(
      annotation,
      rect as unknown as AnnotationSvg,
    );

    rect?.call(addDraggableAnnotation(annotationModule, annotation));

    border?.call(addDraggableAnnotation(annotationModule, annotation));
  });
};
