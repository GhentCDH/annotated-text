import { drawTag } from './draw';
import { type TextAnnotation } from '../../../model';
import { SvgModel } from '../../model/svg.types';
import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';

export class Tag extends BaseAnnotationDi {
  readonly svgModel = super.inject(SvgModel);

  drawAll() {
    if (!this.annotationAdapter.tagConfig.enabled) return;
    if (this.annotationAdapter.tagConfig.enabledOnHover) return;

    // Draw all tags
    this.annotationAdapter.annotations().forEach((a) => this.drawTag(a));
  }

  drawTag(annotation: TextAnnotation) {
    const tagSvg = this.svgModel.tagSvg;
    drawTag(
      this.internalEventListener,
      this.annotationAdapter,
      tagSvg,
      annotation,
    );
  }
}
