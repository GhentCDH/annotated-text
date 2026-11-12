import { BaseAnnotationDi } from '../../../di/BaseAnnotationDi';
import { type AnnotationId, type TextAnnotation } from '../../../model';
import { SvgModel } from '../../model/svg.types';
import { drawTagSvg, shouldDrawTag } from './draw';

export class Tag extends BaseAnnotationDi {
  readonly svgModel = super.inject(SvgModel);

  drawAll() {
    // Draw all tags
    this.annotationAdapter.annotations().forEach((a) => this.drawTag(a));
  }

  drawTag(annotation: TextAnnotation) {
    const tagSvg = this.svgModel.tagSvg;

    if (!shouldDrawTag(annotation)) return false;

    this.removeTag(annotation.id);
    drawTagSvg(tagSvg, annotation);

    return true;
  }

  removeTag(annotationUuid: AnnotationId) {
    this.svgModel?.findTags(annotationUuid)?.remove();
  }
}
