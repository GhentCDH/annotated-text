import { drag } from 'd3';
import { DragAnnotation } from './drag.annotations';
import { type TextAnnotation } from '../../../model';
import { type Position } from '../types';
import { DrawText } from '../text/DrawText';
import { type AnnotationModule } from '../../../di/annotation.module';

export const addDraggableAnnotation = (
  annotationModule: AnnotationModule,
  annotation: TextAnnotation,
) => {
  const drawText = annotationModule.inject(DrawText);
  const annotationAdapter = annotationModule.getAnnotationAdapter();
  const dragAnnotation = new DragAnnotation(
    annotationAdapter.position.minStartPosition,
    annotation,
    annotationModule,
    ({ x, y }: Position) => drawText.getCharacterFromTextNodesAtPoint(x, y),
  );

  const onDragStart = () => (event: any) => {
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;

    dragAnnotation.start({ x, y }, 'start', event);
  };

  const onDragMove = () => (event: any) => {
    const x = event.sourceEvent.clientX;
    const y = event.sourceEvent.clientY;
    dragAnnotation.move({ x, y }, 'start', event);
  };

  const onDragEnd = () => (event: any) => {
    dragAnnotation.end(event);
  };

  return drag()
    .on('drag', onDragMove())
    .on('start', onDragStart())
    .on('end', onDragEnd()) as any;
};
