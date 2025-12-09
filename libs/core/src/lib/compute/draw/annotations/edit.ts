import { drag } from 'd3';
import { SVG_ID, SvgModel } from '../../model/svg.types';
import { AnnotationDraw, Dimensions, TextAnnotation } from '../../../model';
import { AnnotationEventType } from '../../../events/events';
import { EditAnnotation } from '../annotations/edit.annotations';
import { getCharacterFromTextNodesAtPoint } from '../../position';
import { Position } from '../types';
import { hoverAnnotation, leaveAnnotation } from '../events/hover';

export const drawAnnotationHandles = (
  annotation: TextAnnotation,
  draw: AnnotationDraw,
  svgModel: SvgModel,
) => {
  if (draw.path.border) {
    // TODO add condition to check if annotation is draggable

    if (draw.draggable.start) {
      drawHandle(svgModel, annotation, draw.draggable.start, 'start');
    }

    if (draw.draggable.end) {
      drawHandle(svgModel, annotation, draw.draggable.end, 'end');
    }
  }
};

export const drawHandle = (
  svgModel: SvgModel,
  annotation: TextAnnotation,
  dimensions: Dimensions,
  target: 'start' | 'end',
) => {
  const config = svgModel.annotationAdapter.config!;
  const handleRadius = config.text.handleRadius;

  const editAnnotation = new EditAnnotation(
    annotation,
    svgModel.internalEventListener,
    svgModel.annotationAdapter,
    ({ x, y }: Position) => getCharacterFromTextNodesAtPoint(x, y, svgModel),
  );
  const onEditDragEnd = (event: MouseEvent) => {
    editAnnotation.onEnd(event);
  };
  const getPosition = (event: any) => {
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    return { x, y };
  };

  const onEditDrag = (eventType: AnnotationEventType) => (event: any) => {
    editAnnotation.onDrag(eventType, getPosition(event), target, event);
  };

  const onEditDragStart = (event: any) => {
    editAnnotation.start(getPosition(event), target, event);
  };

  const width = handleRadius;
  const handle = svgModel.handles
    .append('rect')
    .attr(SVG_ID.ANNOTATION_UID, annotation.id)
    .attr(SVG_ID.ANNOTATION_ROLE, 'handle')
    .attr('width', width)
    .attr('height', dimensions.height)
    .attr('fill', 'gray')
    .attr('opacity', 0)
    .attr('x', dimensions.x - width / 2)
    .attr('y', dimensions.y)
    .call(
      drag()
        .on('drag', onEditDrag('annotation-edit--move'))
        .on('start', onEditDragStart)
        .on('end', onEditDragEnd) as any,
    );
  handle
    .on('mouseover', hoverAnnotation(annotation, svgModel))
    .on('mouseleave', leaveAnnotation(annotation, svgModel))
    .on('mouseenter', () => {
      handle.attr('class', svgModel.annotationAdapter.edit ? 'handle' : '');
    });
  return handle;
};
