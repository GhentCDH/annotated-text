import { Tag } from './tag/tag';
import { createNewBlock } from './annotations/create';
import { DrawAnnotation } from './annotations/DrawAnnotation';
import { DrawText } from './text/DrawText';
import { BaseAnnotationDi } from '../../di/BaseAnnotationDi';
import { Debugger } from '../../utils/debugger';
import { AnnotationColors } from '../model/annotation.colors';
import type { AnnotationId } from '../../model';
import { type AnnotationModule } from '../../di/annotation.module';

/**
 * This is a dispatcher class for all actions made on visual drawing of the annotations
 */
export class Draw extends BaseAnnotationDi {
  private readonly annotationColors = this.inject(AnnotationColors);
  readonly annotation = this.inject(DrawAnnotation);
  readonly text = this.inject(DrawText);
  readonly tag = this.inject(Tag);

  constructor(mod: AnnotationModule) {
    super(mod);
  }

  initialDraw() {
    this.text.createTree();
    createNewBlock(this.annotationModule);
    this.tag.drawAll();

    return this;
  }

  annotations() {
    const now = Date.now();

    this.annotationAdapter.annotations
      .sortBy('weight')
      .forEach((annotation) => this.annotation.draw(annotation));

    Debugger.time(now, '--- drawComputedAnnotations ');

    return this;
  }

  color() {
    this.annotationColors.color();
  }

  highlightAnnotations(ids: AnnotationId[]) {
    this.annotationColors.highlightAnnotations(ids);
  }

  selectAnnotations(ids: AnnotationId[]) {
    this.annotationColors.selectAnnotations(ids);
  }
}
