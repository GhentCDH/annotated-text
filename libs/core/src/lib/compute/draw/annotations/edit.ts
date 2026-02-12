import { drag } from 'd3';
import { EditAnnotation } from './edit.annotations';
import { EventAnnotations } from './EventAnnotation';
import { SVG_ID, SvgModel } from '../../model/svg.types';
import {
  type AnnotationDraw,
  type Dimensions,
  type TextAnnotation,
} from '../../../model';
import { type Position } from '../types';
import { DrawText } from '../text/DrawText';
import { type AnnotationModule } from '../../../di/annotation.module';

export const drawAnnotationHandles = (
  annotation: TextAnnotation,
  draw: AnnotationDraw,
  annotationModule: AnnotationModule,
) => {
  if (!draw.draggable) return;

  if (draw.draggable.start) {
    drawHandle(annotationModule, annotation, draw.draggable.start, 'start');
  }

  if (draw.draggable.end) {
    drawHandle(annotationModule, annotation, draw.draggable.end, 'end');
  }
};

const drawHandle = (
  annotationModule: AnnotationModule,
  annotation: TextAnnotation,
  dimensions: Dimensions,
  target: 'start' | 'end',
) => {
  const annotationAdapter = annotationModule.getAnnotationAdapter();
  const config = annotationAdapter.config!;
  const handleRadius = config.text.handleRadius;
  const drawText = annotationModule.inject(DrawText);
  const svgModel = annotationModule.inject(SvgModel);

  const editAnnotation = new EditAnnotation(
    annotation,
    annotationModule,
    ({ x, y }: Position) => drawText.getCharacterFromTextNodesAtPoint(x, y),
  );
  const onEditDragEnd = (event: MouseEvent) => {
    editAnnotation.end(event);
  };

  const getPosition = (event: any) => {
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    return { x, y };
  };

  const onEditDrag = (event: any) => {
    editAnnotation.move(getPosition(event), target, event);
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
        .on('drag', onEditDrag)
        .on('start', onEditDragStart)
        .on('end', onEditDragEnd) as any,
    ) as any;

  const eventAnnotations = annotationModule.inject(EventAnnotations);

  eventAnnotations.addToAnnotation(annotation, handle);

  handle
    // .on('mouseover', hoverAnnotation(annotation, svgModel))
    // .on('mouseleave', leaveAnnotation(annotation, svgModel))
    .on('mouseenter', () => {
      handle.attr('class', annotationAdapter.edit ? 'handle' : '');
    });
  return handle;
};
