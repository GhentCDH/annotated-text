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
  type AnnotationDrawColor,
  type AnnotationDrawColors,
  type TextAnnotation,
} from '../../model';
import { type AnnotationModule } from '../../di/annotation.module';

export const drawAnnotationContent = (
  draw: AnnotationDraw,
  svgModel: SvgModel,
  color: AnnotationDrawColor,
) => {
  let border = null;
  const annotationGroup = svgModel.annotations
    .append('g')
    .attr('data-annotation-uid', draw.annotationUuid);

  let rect;
  if (draw.path.fill) {
    rect = annotationGroup
      .append('path')
      .attr(SVG_ID.ANNOTATION_UID, draw.annotationUuid)
      .attr('data-annotation-start', draw.lineNumber)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.FILL)
      .attr('d', draw.path.fill!)
      .attr('border', 'none')
      .attr('fill', color.fill!);
  }
  if (draw.path.border) {
    border = annotationGroup
      .append('path')
      .attr(SVG_ID.ANNOTATION_UID, draw.annotationUuid)
      .attr(SVG_ID.ANNOTATION_ROLE, SVG_ROLE.BORDER)
      .attr('stroke-width', color.borderWidth)
      .attr('d', draw.path.border)
      .attr('fill', 'none')
      .attr('stroke', color.border!);
  }

  return { rect, border };
};

export const drawAnnotation = (
  annotationModule: AnnotationModule,
  annotation: TextAnnotation,
) => {
  const color = annotation._drawMetadata.color as AnnotationDrawColors;
  const svgModel = annotationModule.inject(SvgModel);

  annotation._drawMetadata.draws.forEach((draw) => {
    const { rect, border } = drawAnnotationContent(
      draw,
      svgModel,
      color.default,
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
