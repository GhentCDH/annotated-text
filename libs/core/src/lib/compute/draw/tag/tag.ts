import { drawTagSvg, shouldDrawTag } from './draw';
import { type TextAnnotation } from '../../../model';
import { SvgModel } from '../../model/svg.types';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';

export class Tag extends BaseAnnotationDi {
  readonly svgModel = super.inject(SvgModel);

  drawAll() {
    // Draw all tags
    this.annotationAdapter.annotations().forEach((a) => this.drawTag(a));
  }

  drawTag(annotation: TextAnnotation) {
    const tagSvg = this.svgModel.tagSvg;

    if (!shouldDrawTag(annotation)) return false;

    this.internalEventListener.sendEvent('annotation--remove-tag', {
      annotationUuid: annotation.id,
    });
    drawTagSvg(tagSvg, annotation);

    return true;
  }
}
