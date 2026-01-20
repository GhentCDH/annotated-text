import { type SvgModel } from '../../model/svg.types';
import { type BaseAnnotation, type TextAnnotation } from '../../../model';

export const clickAnnotation =
  (annotation: TextAnnotation, svgModel: SvgModel<BaseAnnotation>) =>
  (mouseEvent: MouseEvent) => {
    if (svgModel.internalEventListener.isBlocking) return;
    svgModel.sendEvent({
      event: 'click',
      mouseEvent,
      annotationUuid: annotation?.id || '',
    });
  };

export const doubleClickAnnotation =
  (annotation: TextAnnotation, svgModel: SvgModel<BaseAnnotation>) =>
  (mouseEvent: MouseEvent) => {
    if (svgModel.internalEventListener.isBlocking) return;

    mouseEvent.preventDefault();

    svgModel.sendEvent({
      event: 'double-click',
      mouseEvent,
      annotationUuid: annotation?.id || '',
    });
  };
