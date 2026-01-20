import { hoverAnnotation, leaveAnnotation } from './events/hover';
import { clickAnnotation, doubleClickAnnotation } from './events/click';
import { addDraggableAnnotation } from './annotations/drag-annotation';
import { drawAnnotationHandles } from './annotations/edit';
import { SVG_ID, SVG_ROLE, type SvgModel } from '../model/svg.types';
import {
  type AnnotationDraw,
  type AnnotationDrawColor,
  type AnnotationDrawColors,
  type TextAnnotation,
} from '../../model';
import { type AnnotationRenderStyle } from '../../adapter/annotation/renderer';

export const drawAnnotationContent = (
  draw: AnnotationDraw,
  svgModel: SvgModel<any>,
  style: AnnotationRenderStyle,
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
  svgModel: SvgModel<any>,
  annotation: TextAnnotation,
) => {
  const color = annotation._drawMetadata.color as AnnotationDrawColors;
  const style = annotation._render.style.renderStyle as AnnotationRenderStyle;

  annotation._drawMetadata.draws.forEach((draw) => {
    const { rect, border } = drawAnnotationContent(
      draw,
      svgModel,
      style,
      color.default,
    );

    drawAnnotationHandles(annotation, draw, svgModel);

    rect
      ?.on('mouseover', hoverAnnotation(annotation, svgModel))
      .on('mouseleave', leaveAnnotation(annotation, svgModel))
      // TODO check double click also fires click event
      .on('dblclick', doubleClickAnnotation(annotation, svgModel))
      .on('click', clickAnnotation(annotation, svgModel))
      .call(addDraggableAnnotation(svgModel, annotation));

    border?.call(addDraggableAnnotation(svgModel, annotation));
  });
};
